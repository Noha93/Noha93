"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

interface BranchOption {
  id: string;
  name: string;
  city: string;
}

export default function OrderClient({ branches }: { branches: BranchOption[] }) {
  const { lines, setQuantity, remove, total, clear } = useCartStore();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("السلة فاضية، ضيفي صنف الأول");
      return;
    }
    if (!branchId) {
      setError("اختاري الفرع");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          notes,
          branchId,
          lines: lines.map((l) => ({ menuItemId: l.menuItemId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.formErrors?.join(", ") ?? data.error ?? "حصل خطأ، حاولي تاني");
        return;
      }
      clear();
      window.location.href = data.whatsappUrl;
    } finally {
      setSubmitting(false);
    }
  }

  if (branches.length === 0) {
    return <p className="text-brand-dark/60">مفيش فروع متاحة للطلب حالياً، حاولي تاني بعدين.</p>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h2 className="text-xl font-bold mb-4">سلة الطلبات</h2>
        {lines.length === 0 ? (
          <p className="text-brand-dark/60">
            السلة فاضية. <Link href="/menu" className="text-brand underline">شوف المنيو</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {lines.map((l) => (
              <div key={l.menuItemId} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                <div>
                  <p className="font-bold">{l.name}</p>
                  <p className="text-sm text-brand-dark/60">{l.price} ج.م</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(l.menuItemId, l.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-brand text-brand"
                  >
                    −
                  </button>
                  <span>{l.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(l.menuItemId, l.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-brand text-brand"
                  >
                    +
                  </button>
                  <button type="button" onClick={() => remove(l.menuItemId)} className="text-xs text-red-600 ml-2">
                    حذف
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-3 border-t border-brand/10">
              <span>الإجمالي</span>
              <span>{total()} ج.م</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={submitOrder} className="space-y-4">
        <h2 className="text-xl font-bold mb-2">بيانات الطلب</h2>
        <div>
          <label className="block text-sm mb-1">الاسم</label>
          <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-lg border border-brand/20 p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">رقم التليفون</label>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-brand/20 p-2" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm mb-1">الفرع</label>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)}
            className="w-full rounded-lg border border-brand/20 p-2">
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name} — {b.city}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">العنوان (للتوصيل)</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-brand/20 p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">ملاحظات</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-brand/20 p-2" rows={2} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand text-white font-bold py-3 hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "جارِ الإرسال..." : "إرسال الطلب عبر واتساب"}
        </button>
        <p className="text-xs text-brand-dark/50">
          هيتم حفظ طلبك وتحويلك لواتساب الفرع لتأكيد الطلب والدفع عند الاستلام.
        </p>
      </form>
    </div>
  );
}
