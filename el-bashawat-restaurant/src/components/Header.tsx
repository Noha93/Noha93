import Link from "next/link";
import CartButton from "./CartButton";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "من نحن" },
  { href: "/menu", label: "المنيو" },
  { href: "/offers", label: "العروض" },
  { href: "/branches", label: "الفروع" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/faq", label: "الأسئلة الشائعة" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand text-brand-cream shadow-md">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-brand-gold">
          البشوات
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-gold transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/order"
            className="rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-brand-dark hover:opacity-90 transition-opacity"
          >
            اطلب أونلاين
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
