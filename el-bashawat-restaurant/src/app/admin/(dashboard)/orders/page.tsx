"use client";

import { useEffect, useState } from "react";

interface OrderItem { id: string; quantity: number; unitPrice: string; menuItem: { name: string } }
interface Order {
  id: string; customerName: string; phone: string; total: string; status: string;
  createdAt: string; branch: { name: string }; items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الطلبات</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded-xl p-4">
            <div className="flex justify-between text-sm text-brand-dark/60 mb-2">
              <span>{o.branch.name}</span>
              <span>{new Date(o.createdAt).toLocaleString("ar-EG")}</span>
            </div>
            <p className="font-bold">{o.customerName} — {o.phone}</p>
            <ul className="text-sm text-brand-dark/70 mt-1">
              {o.items.map((i) => (
                <li key={i.id}>{i.menuItem.name} × {i.quantity}</li>
              ))}
            </ul>
            <p className="font-bold mt-2">الإجمالي: {o.total} ج.م — الحالة: {o.status}</p>
          </div>
        ))}
        {orders.length === 0 && <p className="text-brand-dark/60">مفيش طلبات لسه.</p>}
      </div>
    </div>
  );
}
