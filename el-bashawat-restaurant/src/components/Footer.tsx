import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold text-brand-gold mb-2">مطاعم البشوات</h3>
          <p className="text-sm text-brand-cream/80">مشويات وأكلات شرقية أصيلة، بنفس الطعم من أول ما بدأنا.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-brand-gold">روابط سريعة</h4>
          <ul className="space-y-1 text-sm text-brand-cream/80">
            <li><Link href="/menu">المنيو</Link></li>
            <li><Link href="/offers">العروض</Link></li>
            <li><Link href="/branches">الفروع</Link></li>
            <li><Link href="/faq">الأسئلة الشائعة</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-brand-gold">تواصل معنا</h4>
          <p className="text-sm text-brand-cream/80">للشكاوى والاقتراحات: <Link href="/contact">صفحة التواصل</Link></p>
        </div>
      </div>
      <div className="border-t border-brand-cream/10 py-4 text-center text-xs text-brand-cream/60">
        © {new Date().getFullYear()} مطاعم البشوات. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
