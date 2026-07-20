import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@elbashawat.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "مدير الموقع",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  const grills = await db.menuCategory.upsert({
    where: { slug: "grills" },
    update: {},
    create: { name: "مشويات", slug: "grills", sortOrder: 1 },
  });
  const starters = await db.menuCategory.upsert({
    where: { slug: "starters" },
    update: {},
    create: { name: "مقبلات", slug: "starters", sortOrder: 0 },
  });

  await db.menuItem.upsert({
    where: { slug: "mixed-grill" },
    update: {},
    create: {
      name: "مشاوي مشكلة",
      slug: "mixed-grill",
      description: "تشكيلة من كباب وكفتة وريش ضاني",
      price: 320,
      categoryId: grills.id,
      isFeatured: true,
    },
  });
  await db.menuItem.upsert({
    where: { slug: "hummus" },
    update: {},
    create: {
      name: "حمص بالطحينة",
      slug: "hummus",
      description: "حمص طازة بزيت الزيتون",
      price: 45,
      categoryId: starters.id,
    },
  });

  await db.branch.upsert({
    where: { id: "seed-branch-maadi" },
    update: {},
    create: {
      id: "seed-branch-maadi",
      name: "فرع المعادي",
      address: "شارع 9، المعادي",
      city: "القاهرة",
      phone: "+20100000000",
      whatsapp: "+20100000000",
      latitude: 29.9603,
      longitude: 31.2568,
      openingTime: "12:00",
      closingTime: "01:00",
    },
  });

  await db.offer.upsert({
    where: { id: "seed-offer-launch" },
    update: {},
    create: {
      id: "seed-offer-launch",
      title: "عرض الافتتاح",
      description: "خصم على كل أطباق المشويات المشكلة",
      discountPct: 15,
    },
  });

  await db.faqItem.upsert({
    where: { id: "seed-faq-delivery" },
    update: {},
    create: {
      id: "seed-faq-delivery",
      question: "هل التوصيل متاح لكل المناطق؟",
      answer: "التوصيل متاح في نطاق كل فرع، وهيتم تأكيد التفاصيل معاكِ على واتساب بعد إرسال الطلب.",
      sortOrder: 0,
    },
  });

  console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword}`);
}

main().finally(() => db.$disconnect());
