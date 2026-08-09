import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (product_id: string) => void;
  setQty: (product_id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id);
          return {
            isOpen: true,
            items: existing
              ? state.items.map((i) =>
                  i.product_id === item.product_id ? { ...i, qty: i.qty + qty } : i,
                )
              : [...state.items, { ...item, qty }],
          };
        }),
      remove: (product_id) =>
        set((state) => ({ items: state.items.filter((i) => i.product_id !== product_id) })),
      setQty: (product_id, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.product_id === product_id ? { ...i, qty: Math.max(0, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "om-nutrition-cart", partialize: (state) => ({ items: state.items }) },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
export const cartTotal = (items: CartItem[]) => items.reduce((n, i) => n + i.qty * i.price, 0);
