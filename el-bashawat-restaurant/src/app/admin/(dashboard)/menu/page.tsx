"use client";

import { useEffect, useState } from "react";

interface Category { id: string; name: string; }
interface Item {
  id: string; name: string; price: string; imageUrl: string | null;
  isAvailable: boolean; category: Category;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", description: "", imageUrl: "" });
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [itemsRes, catsRes] = await Promise.all([
      fetch("/api/admin/menu").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]);
    setItems(itemsRes);
    setCategories(catsRes);
  }

  useEffect(() => { load(); }, []);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });
    setNewCategory("");
    load();
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl: form.imageUrl || undefined }),
    });
    if (!res.ok) {
      setError("راجعي البيانات المدخلة");
      return;
    }
    setForm({ name: "", price: "", categoryId: "", description: "", imageUrl: "" });
    load();
  }

  async function toggleAvailability(item: Item) {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
    load();
  }

  async function deleteItem(id: string) {
    if (!confirm("تأكيد الحذف؟")) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة المنيو</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <table className="w-full bg-white rounded-xl overflow-hidden text-sm">
            <thead className="bg-brand text-white">
              <tr>
                <th className="p-2 text-right">الصنف</th>
                <th className="p-2 text-right">القسم</th>
                <th className="p-2 text-right">السعر</th>
                <th className="p-2 text-right">متاح؟</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-brand/10">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category?.name}</td>
                  <td className="p-2">{item.price} ج.م</td>
                  <td className="p-2">
                    <button onClick={() => toggleAvailability(item)}
                      className={item.isAvailable ? "text-green-600" : "text-red-600"}>
                      {item.isAvailable ? "متاح" : "غير متاح"}
                    </button>
                  </td>
                  <td className="p-2">
                    <button onClick={() => deleteItem(item.id)} className="text-red-600 text-xs">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <form onSubmit={addCategory} className="bg-white rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm">إضافة قسم جديد</h3>
            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
              placeholder="اسم القسم" className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
            <button className="w-full rounded-lg bg-brand text-white text-sm py-2">إضافة القسم</button>
          </form>

          <form onSubmit={addItem} className="bg-white rounded-xl p-4 space-y-2">
            <h3 className="font-bold text-sm">إضافة صنف جديد</h3>
            <input required placeholder="اسم الصنف" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
            <input required type="number" step="0.01" placeholder="السعر" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-lg border border-brand/20 p-2 text-sm">
              <option value="">اختر القسم</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <textarea placeholder="وصف (اختياري)" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-brand/20 p-2 text-sm" />
            <input placeholder="رابط الصورة (اختياري)" value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full rounded-lg border border-brand/20 p-2 text-sm" dir="ltr" />
            {error && <p className="text-red-600 text-xs">{error}</p>}
            <button className="w-full rounded-lg bg-brand text-white text-sm py-2">إضافة الصنف</button>
          </form>
        </div>
      </div>
    </div>
  );
}
