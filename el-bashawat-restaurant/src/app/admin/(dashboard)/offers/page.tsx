"use client";

import { useEffect, useState } from "react";

interface Offer {
  id: string; title: string; description: string | null; discountPct: number | null; isActive: boolean;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState({ title: "", description: "", discountPct: "" });

  async function load() {
    setOffers(await fetch("/api/admin/offers").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  async function addOffer(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description || undefined,
        discountPct: form.discountPct ? Number(form.discountPct) : undefined,
      }),
    });
    setForm({ title: "", description: "", discountPct: "" });
    load();
  }

  async function toggleActive(offer: Offer) {
    await fetch(`/api/admin/offers/${offer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !offer.isActive }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("تأكيد الحذف؟")) return;
    await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة العروض</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">{offer.title} {offer.discountPct ? `— خصم ${offer.discountPct}%` : ""}</p>
                <p className="text-sm text-brand-dark/60">{offer.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActive(offer)} className={offer.isActive ? "text-green-600" : "text-red-600"}>
                  {offer.isActive ? "مفعّل" : "متوقف"}
                </button>
                <button onClick={() => remove(offer.id)} className="text-red-600 text-xs">حذف</button>
              </div>
            </div>
          ))}
          {offers.length === 0 && <p className="text-brand-dark/60">مفيش عروض حالياً.</p>}
        </div>

        <form onSubmit={addOffer} className="bg-white rounded-xl p-4 space-y-2 h-fit">
          <h3 className="font-bold text-sm">إضافة عرض جديد</h3>
          <input required placeholder="عنوان العرض" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
          <input type="number" placeholder="نسبة الخصم %" value={form.discountPct}
            onChange={(e) => setForm({ ...form, discountPct: e.target.value })}
            className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
          <textarea placeholder="وصف العرض" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
          <button className="w-full rounded-lg bg-brand text-white text-sm py-2">إضافة العرض</button>
        </form>
      </div>
    </div>
  );
}
