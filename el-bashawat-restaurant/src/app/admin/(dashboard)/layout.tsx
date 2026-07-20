import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const LINKS = [
  { href: "/admin/menu", label: "المنيو" },
  { href: "/admin/offers", label: "العروض" },
  { href: "/admin/branches", label: "الفروع" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/messages", label: "الرسائل" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="bg-brand-dark text-brand-cream w-full md:w-56 p-4 flex md:flex-col justify-between">
        <div>
          <h2 className="font-bold text-brand-gold mb-4 hidden md:block">لوحة التحكم</h2>
          <nav className="flex md:flex-col gap-2 flex-wrap">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm px-3 py-2 rounded-lg hover:bg-white/10">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-6 bg-brand/5">{children}</main>
    </div>
  );
}
