"use client";

import { useEffect, useState } from "react";

interface Branch {
  id: string; name: string; address: string; city: string; phone: string; whatsapp: string;
  latitude: number; longitude: number; openingTime: string; closingTime: string; isActive: boolean;
}

const emptyForm = {
  name: "", address: "", city: "", phone: "", whatsapp: "",
  latitude: "", longitude: "", openingTime: "12:00", closingTime: "01:00",
};

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setBranches(await fetch("/api/admin/branches").then((r) => r.json()));
  }
  useEffect(() => { load(); }, []);

  async function addBranch(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) }),
    });
    setForm(emptyForm);
    load();
  }

  async function toggleActive(branch: Branch) {
    await fetch(`/api/admin/branches/${branch.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !branch.isActive }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("تأكيد الحذف؟")) return;
    await fetch(`/api/admin/branches/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة الفروع</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {branches.map((b) => (
            <div key={b.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">{b.name} — {b.city}</p>
                <p className="text-sm text-brand-dark/60">{b.address}</p>
                <p className="text-xs text-brand-dark/50">{b.openingTime} — {b.closingTime}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActive(b)} className={b.isActive ? "text-green-600" : "text-red-600"}>
                  {b.isActive ? "مفعّل" : "متوقف"}
                </button>
                <button onClick={() => remove(b.id)} className="text-red-600 text-xs">حذف</button>
              </div>
            </div>
          ))}
          {branches.length === 0 && <p className="text-brand-dark/60">مفيش فروع مضافة بعد.</p>}
        </div>

        <form onSubmit={addBranch} className="bg-white rounded-xl p-4 space-y-2 h-fit">
          <h3 className="font-bold text-sm">إضافة فرع جديد</h3>
          <input required placeholder="اسم الفرع" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
          <input required placeholder="المدينة" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
          <input required placeholder="العنوان بالتفصيل" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
          <input required placeholder="تليفون الفرع" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-brand/20 p-2 text-sm" dir="ltr" />
          <input required placeholder="رقم واتساب (بالكود الدولي)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="w-full rounded-lg border border-brand/20 p-2 text-sm" dir="ltr" />
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="rounded-lg border border-brand/20 p-2 text-sm" dir="ltr" />
            <input required placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="rounded-lg border border-brand/20 p-2 text-sm" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder="ميعاد الفتح" value={form.openingTime} onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
              className="rounded-lg border border-brand/20 p-2 text-sm" dir="ltr" />
            <input required placeholder="ميعاد القفل" value={form.closingTime} onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
              className="rounded-lg border border-brand/20 p-2 text-sm" dir="ltr" />
          </div>
          <button className="w-full rounded-lg bg-brand text-white text-sm py-2">إضافة الفرع</button>
        </form>
      </div>
    </div>
  );
}
