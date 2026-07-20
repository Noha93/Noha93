"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-sm text-brand-cream/70 hover:text-brand-gold self-start md:self-auto"
    >
      تسجيل الخروج
    </button>
  );
}
