"use client";

import { useEffect, useState } from "react";

interface Message { id: string; name: string; email: string; phone: string | null; message: string; createdAt: string; }

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch("/api/admin/messages").then((r) => r.json()).then(setMessages);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">رسائل التواصل</h1>
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="bg-white rounded-xl p-4">
            <div className="flex justify-between text-sm text-brand-dark/60 mb-1">
              <span>{m.name} — {m.email} {m.phone ? `— ${m.phone}` : ""}</span>
              <span>{new Date(m.createdAt).toLocaleString("ar-EG")}</span>
            </div>
            <p className="text-brand-dark/80">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-brand-dark/60">مفيش رسائل لسه.</p>}
      </div>
    </div>
  );
}
