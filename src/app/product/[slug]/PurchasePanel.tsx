"use client";

import { useState } from "react";
import { ShoppingCart, MessageSquare } from "lucide-react";
import { Button } from "@/components/Button";
import { TieredPriceTable } from "@/components/TieredPriceTable";
import { useCartStore } from "@/lib/cart-store";
import { formatPriceCents } from "@/lib/utils";
import { QuantitySelector } from "./QuantitySelector";

interface PurchasePanelProps {
  product: {
    id: string;
    slug: string;
    title: string;
    /** Cover image URL — first item in the cart line. */
    image: string;
    /** Lowest unit price in cents (lowest tier). */
    priceFromCents: number;
    /** Optional retail price for the mobile "from" display. */
    retailPriceCents?: number;
    /** Currency code (default USD). */
    currency?: string;
    moq: number;
    stock: number;
  };
  /** Optional tier list — renders the live qty-aware bulk price table. */
  tiers?: { minQty: number; unitPriceCents: number }[];
  /** Anchor id used by Contact Supplier scroll-to. */
  inquiryAnchorId?: string;
}

/**
 * Owns the quantity state shared between the desktop purchase block,
 * the bulk pricing table, and the mobile sticky bottom bar.
 * Renders all three.
 *
 * "Contact Supplier" smooth-scrolls to the inquiry form on the same page.
 */
export function PurchasePanel({
  product,
  tiers,
  inquiryAnchorId = "inquiry",
}: PurchasePanelProps) {
  const safeMin = Math.max(1, product.moq);
  const safeMax = Math.max(safeMin, product.stock);
  const [qty, setQty] = useState<number>(safeMin);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const currency = product.currency ?? "USD";
  const inStock = product.stock > 0;

  function handleAddToCart() {
    if (!inStock) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        image: product.image,
        unitPriceCents: product.priceFromCents,
      },
      qty
    );
    openCart();
  }

  function scrollToInquiry() {
    if (typeof document === "undefined") return;
    const el = document.getElementById(inquiryAnchorId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Move focus for accessibility.
    const focusable = el.querySelector<HTMLElement>(
      "input, textarea, select, button"
    );
    focusable?.focus({ preventScroll: true });
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
       * Desktop / tablet block
       * ───────────────────────────────────────────────────────────── */}
      <div className="hidden flex-col gap-4 md:flex">
        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Quantity
          </span>
          <QuantitySelector
            initial={qty}
            min={safeMin}
            max={safeMax}
            onChange={setQty}
          />
          <p className="text-xs text-text-muted">
            Min order {safeMin} · {product.stock} in stock
          </p>
        </div>

        {/* Tiered price table — live highlight follows the qty above */}
        {tiers && tiers.length > 0 && (
          <TieredPriceTable tiers={tiers} currentQty={qty} />
        )}

        {/* CTAs */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart size={18} />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={scrollToInquiry}
        >
          <MessageSquare size={18} />
          Contact Supplier
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
       * Mobile sticky bottom bar (md:hidden)
       * ───────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
        role="region"
        aria-label="Quick purchase"
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs text-text-muted">
              From
            </div>
            <div className="truncate text-lg font-bold text-fg">
              {formatPriceCents(product.priceFromCents, currency)}
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="shrink-0"
          >
            <ShoppingCart size={16} />
            {inStock ? "Add to Cart" : "Sold Out"}
          </Button>
        </div>
      </div>
    </>
  );
}
