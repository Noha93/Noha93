"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  add: (item: Omit<CartLine, "quantity">) => void;
  remove: (menuItemId: string) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (item) =>
        set((state) => {
          const existing = state.lines.find((l) => l.menuItemId === item.menuItemId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.menuItemId === item.menuItemId ? { ...l, quantity: l.quantity + 1 } : l
              ),
            };
          }
          return { lines: [...state.lines, { ...item, quantity: 1 }] };
        }),
      remove: (menuItemId) => set((state) => ({ lines: state.lines.filter((l) => l.menuItemId !== menuItemId) })),
      setQuantity: (menuItemId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.menuItemId !== menuItemId)
              : state.lines.map((l) => (l.menuItemId === menuItemId ? { ...l, quantity } : l)),
        })),
      clear: () => set({ lines: [] }),
      total: () => get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    }),
    { name: "el-bashawat-cart" }
  )
);
