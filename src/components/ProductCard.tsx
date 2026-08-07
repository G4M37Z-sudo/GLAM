"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Badge, type BadgeVariant } from "@/components/Badge";
import { Button } from "@/components/Button";
import { cn, formatPriceCents } from "@/lib/utils";

export interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    image: string;
    /** Lowest unit price in cents (tier-1 price) */
    priceFromCents: number;
    /** Optional sale price in cents */
    salePriceCents?: number;
    /** Minimum order quantity */
    moq?: number;
    /** Visual badge variant */
    badge?: BadgeVariant;
    /** Optional secondary image for hover effect */
    hoverImage?: string;
  };
  className?: string;
}

/**
 * Grid card for a product. Add to Cart button reads/writes
 * the global Zustand cart store.
 */
export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const onSale =
    typeof product.salePriceCents === "number" &&
    product.salePriceCents < product.priceFromCents;
  const displayCents = onSale ? product.salePriceCents! : product.priceFromCents;
  const moq = product.moq ?? 1;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-bg transition-shadow hover:shadow-md",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-surface"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        {product.hoverImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.hoverImage}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <div className="absolute left-2 top-2">
            <Badge variant={product.badge}>{product.badge}</Badge>
          </div>
        )}
        <button
          type="button"
          aria-label={`Add ${product.title} to wishlist`}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-fg shadow-sm transition-colors hover:bg-white hover:text-accent"
          onClick={(e) => {
            e.preventDefault();
            // Wishlist not in scope; reserve the slot.
          }}
        >
          <Heart size={16} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-fg hover:text-accent"
        >
          {product.title}
        </Link>

        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-base font-bold",
              onSale ? "text-accent" : "text-fg"
            )}
          >
            {formatPriceCents(displayCents)}
          </span>
          {onSale && (
            <span className="text-xs text-text-muted line-through">
              {formatPriceCents(product.priceFromCents)}
            </span>
          )}
        </div>
        <div className="text-xs text-text-muted">
          {onSale ? "Sale" : "From"} · MOQ {moq}
        </div>

        <Button
          size="sm"
          variant="primary"
          fullWidth
          className="mt-2"
          onClick={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              title: product.title,
              image: product.image,
              unitPriceCents: displayCents,
            })
          }
        >
          Add to Cart
        </Button>
      </div>
    </article>
  );
}