"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/Button";
import { formatPriceCents } from "@/lib/utils";

/**
 * Slide-in cart drawer. Mounted once at the root layout so it
 * works on every page. Controlled via the `open`/`closeCart`
 * pair on the Zustand cart store.
 */
export function CartDrawer() {
  const open = useCartStore((s) =>s.open);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotalCents = useCartStore((s) => s.getSubtotalCents());

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bg shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-fg">
            Your Cart{" "}
            <span className="text-sm font-medium text-text-muted">
              ({items.length})
            </span>
          </h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-md text-fg hover:bg-surface"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-surface">
                <Trash2 size={24} className="text-text-muted" />
              </div>
              <p className="text-sm text-text-muted">Your cart is empty.</p>
              <Button
                variant="primary"
                size="md"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 px-5 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 shrink-0 rounded-md object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-medium text-fg hover:text-accent"
                    >
                      {item.title}
                    </Link>
                    <div className="text-sm font-bold text-fg">
                      {formatPriceCents(item.unitPriceCents)}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQty(item.productId, item.quantity - 1)
                          }
                          className="grid h-8 w-8 place-items-center text-fg hover:bg-surface"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQty(item.productId, item.quantity + 1)
                          }
                          className="grid h-8 w-8 place-items-center text-fg hover:bg-surface"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeItem(item.productId)}
                        className="grid h-8 w-8 place-items-center rounded-full text-text-muted hover:bg-surface hover:text-accent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-border bg-bg px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-lg font-bold text-fg">
                {formatPriceCents(subtotalCents)}
              </span>
            </div>
            <p className="mb-3 text-xs text-text-muted">
              Shipping and taxes calculated at checkout.
            </p>
            <Button variant="primary" size="lg" fullWidth>
              Checkout
            </Button>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 block w-full text-center text-sm font-medium text-text-muted hover:text-fg"
            >
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}