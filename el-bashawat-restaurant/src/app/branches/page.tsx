import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "الفروع",
  description: "كل فروع مطاعم البشوات مع العنوان، مواعيد العمل، والموقع على الخريطة.",
};

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const branches = await db.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">فروعنا</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {branches.map((branch) => (
          <div key={branch.id} className="rounded-2xl border border-brand/10 shadow-sm bg-white overflow-hidden">
            <iframe
              title={`خريطة ${branch.name}`}
              className="w-full h-48 border-0"
              loading="lazy"
              src={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}&z=15&output=embed`}
            />
            <div className="p-5">
              <h2 className="text-xl font-bold mb-1">{branch.name}</h2>
              <p className="text-brand-dark/70">{branch.address}, {branch.city}</p>
              <p className="text-sm text-brand-dark/60 mt-2">
                مواعيد العمل: {branch.openingTime} — {branch.closingTime}
              </p>
              <div className="flex gap-4 mt-3 text-sm">
                <a href={`tel:${branch.phone}`} className="text-brand font-bold">اتصل بالفرع</a>
                <a href={`https://wa.me/${branch.whatsapp.replace(/[^\d]/g, "")}`} className="text-brand font-bold">
                  واتساب
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {branches.length === 0 && <p className="text-brand-dark/60">هنضيف الفروع قريباً.</p>}
    </div>
  );
}
