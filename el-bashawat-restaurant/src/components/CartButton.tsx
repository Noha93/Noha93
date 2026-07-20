"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function CartButton() {
  const count = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));

  return (
    <Link href="/order" className="relative rounded-full border border-brand-gold p-2 text-brand-gold">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
