"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";

interface Props {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
}

export default function MenuItemCard({ id, name, description, price, imageUrl }: Props) {
  const add = useCartStore((s) => s.add);

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
      {imageUrl && (
        <div className="relative h-36 w-full">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold">{name}</h3>
        {description && <p className="text-sm text-brand-dark/60 mt-1 flex-1">{description}</p>}
        <div className="flex items-center justify-between mt-3">
          <span className="text-brand font-bold">{price} ج.م</span>
          <button
            onClick={() => add({ menuItemId: id, name, price })}
            className="rounded-full bg-brand text-white text-sm px-4 py-1.5 hover:bg-brand-dark transition-colors"
          >
            إضافة للسلة
          </button>
        </div>
      </div>
    </div>
  );
}
