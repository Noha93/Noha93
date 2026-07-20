"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="text-brand font-bold">تم إرسال رسالتك، هنتواصل معاكِ قريباً!</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm mb-1">الاسم</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-brand/20 p-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">البريد الإلكتروني</label>
        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-brand/20 p-2" dir="ltr" />
      </div>
      <div>
        <label className="block text-sm mb-1">رقم التليفون (اختياري)</label>
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg border border-brand/20 p-2" dir="ltr" />
      </div>
      <div>
        <label className="block text-sm mb-1">رسالتك</label>
        <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-brand/20 p-2" />
      </div>
      {status === "error" && <p className="text-red-600 text-sm">حصل خطأ، حاولي تاني.</p>}
      <button type="submit" disabled={status === "sending"}
        className="rounded-full bg-brand text-white font-bold px-6 py-2.5 hover:bg-brand-dark transition-colors disabled:opacity-50">
        {status === "sending" ? "جارِ الإرسال..." : "إرسال"}
      </button>
    </form>
  );
}
