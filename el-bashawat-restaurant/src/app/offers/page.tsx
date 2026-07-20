import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "العروض والخصومات",
  description: "أحدث عروض وخصومات مطاعم البشوات — عروض محدودة على أشهى الأطباق.",
};

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const now = new Date();
  const offers = await db.offer.findMany({
    where: { isActive: true, OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">العروض والخصومات</h1>
      {offers.length === 0 && <p className="text-brand-dark/60">مفيش عروض حالياً، تابعنا قريباً.</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {offers.map((offer) => (
          <div key={offer.id} className="rounded-2xl overflow-hidden border border-brand/10 shadow-sm bg-white">
            {offer.imageUrl && (
              <div className="relative h-48 w-full">
                <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-5">
              <h2 className="text-xl font-bold mb-1">{offer.title}</h2>
              {offer.discountPct && <p className="text-brand font-bold mb-2">خصم {offer.discountPct}%</p>}
              <p className="text-brand-dark/70">{offer.description}</p>
              {offer.endsAt && (
                <p className="text-xs text-brand-dark/50 mt-2">
                  العرض ساري حتى {new Date(offer.endsAt).toLocaleDateString("ar-EG")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
