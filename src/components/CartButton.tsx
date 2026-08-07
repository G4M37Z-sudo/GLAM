"use client";

// src/components/CartButton.tsx
// Small client component for the cart icon + badge. Subscribes to the
// Zustand store and triggers openCart on click.

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function CartButton() {
  const count = useCartStore((s) => s.getCount());
  const openCart = useCartStore((s) => s.openCart);

  return (
    <button
      type="button"
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      onClick={openCart}
      className="relative grid h-10 w-10 place-items-center rounded-md text-fg hover:bg-surface"
    >
      <ShoppingBag size={22} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
