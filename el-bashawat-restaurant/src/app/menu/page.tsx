import type { Metadata } from "next";
import { db } from "@/lib/db";
import MenuItemCard from "@/components/MenuItemCard";

export const metadata: Metadata = {
  title: "المنيو",
  description: "تصفح قائمة الطعام الكاملة في مطاعم البشوات — مشويات، مقبلات، ومشروبات مع الأسعار.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const categories = await db.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { where: { isAvailable: true }, orderBy: { name: "asc" } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">المنيو</h1>

      {categories.length === 0 && <p className="text-brand-dark/60">المنيو هيتم إضافته قريباً.</p>}

      {categories.map((category) => (
        <section key={category.id} id={category.slug} className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-brand-gold pb-2">{category.name}</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {category.items.map((item) => (
              <MenuItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={Number(item.price)}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
