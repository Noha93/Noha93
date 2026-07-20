import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredItems, activeOffers, branchCount] = await Promise.all([
    db.menuItem.findMany({ where: { isFeatured: true, isAvailable: true }, take: 6 }),
    db.offer.findMany({ where: { isActive: true }, take: 3, orderBy: { createdAt: "desc" } }),
    db.branch.count({ where: { isActive: true } }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "مطاعم البشوات",
    servesCuisine: "Middle Eastern",
    priceRange: "$$",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://elbashawat.com",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-gradient-to-b from-brand to-brand-dark text-brand-cream">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">مطاعم البشوات</h1>
          <p className="text-lg text-brand-cream/90 max-w-xl mx-auto mb-8">
            مشويات طازة وأكلات شرقية أصيلة، من أفضل اللحوم لأشهى الأطباق — دلوقتي تقدر تطلب أونلاين من أقرب فرع ليك.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/order" className="rounded-full bg-brand-gold px-6 py-3 font-bold text-brand-dark">
              اطلب أونلاين الآن
            </Link>
            <Link href="/menu" className="rounded-full border border-brand-gold px-6 py-3 font-bold">
              شوف المنيو
            </Link>
          </div>
        </div>
      </section>

      {activeOffers.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">أحدث العروض</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {activeOffers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-brand/10 overflow-hidden shadow-sm">
                {offer.imageUrl && (
                  <div className="relative h-40 w-full">
                    <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold mb-1">{offer.title}</h3>
                  {offer.discountPct && <p className="text-brand font-bold">خصم {offer.discountPct}%</p>}
                  <p className="text-sm text-brand-dark/70">{offer.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/offers" className="text-brand font-bold underline">شوف كل العروض</Link>
          </div>
        </section>
      )}

      {featuredItems.length > 0 && (
        <section className="bg-brand/5 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold mb-6">الأكثر طلباً</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {featuredItems.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white overflow-hidden shadow-sm">
                  {item.imageUrl && (
                    <div className="relative h-40 w-full">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4 flex items-center justify-between">
                    <h3 className="font-bold">{item.name}</h3>
                    <span className="text-brand font-bold">{Number(item.price)} ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-lg mb-2">متواجدين في {branchCount} فرع لخدمتك</p>
        <Link href="/branches" className="text-brand font-bold underline">شوف أقرب فرع ليك</Link>
      </section>
    </div>
  );
}
