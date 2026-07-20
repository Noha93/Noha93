"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطأ في تسجيل الدخول");
        return;
      }
      router.push(searchParams.get("next") ?? "/admin/menu");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-lg">
      <h1 className="text-xl font-bold text-brand-dark text-center">لوحة تحكم البشوات</h1>
      <div>
        <label className="block text-sm mb-1">البريد الإلكتروني</label>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-brand/20 p-2" dir="ltr" />
      </div>
      <div>
        <label className="block text-sm mb-1">كلمة المرور</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-brand/20 p-2" dir="ltr" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full rounded-full bg-brand text-white font-bold py-2.5 disabled:opacity-50">
        {loading ? "..." : "دخول"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
