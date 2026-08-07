"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Shape of one cart line. We intentionally keep only the fields
 * we need to render the cart and submit a Stripe order; full
 * product metadata is fetched server-side at checkout time.
 */
export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  /** Unit price in cents (matches Stripe expectations). */
  unitPriceCents: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  /** Whether the cart drawer is open. UI-only, never persisted. */
  open: boolean;
}

interface CartActions {
  /**
   * Add a product to the cart. If the same productId is already
   * present, the quantity is incremented instead of duplicating
   * the line.
   */
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

interface CartSelectors {
  /** Total number of items (sum of quantities). */
  getCount: () => number;
  /** Subtotal in cents. */
  getSubtotalCents: () => number;
}

export type CartStore = CartState & CartActions & CartSelectors;

/**
 * Global cart store backed by localStorage so the cart survives
 * refreshes. Use `useCartStore(selector)` to subscribe to a slice
 * and avoid re-rendering the whole tree on every change.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,

      addItem: (item, quantity = 1) => {
        const items = get().items;
        const idx = items.findIndex((i) => i.productId === item.productId);
        if (idx >= 0) {
          const next = items.slice();
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + quantity,
          };
          set({ items: next });
        } else {
          set({
            items: [...items, { ...item, quantity }],
          });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },

      clear: () => set({ items: [] }),
      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),

      getCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotalCents: () =>
        get().items.reduce(
          (sum, i) => sum + i.unitPriceCents * i.quantity,
          0
        ),
    }),
    {
      name: "market-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({ items: state.items }) as Partial<CartStore>,
    }
  )
);