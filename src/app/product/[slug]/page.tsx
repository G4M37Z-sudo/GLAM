// ============================================================================
// src/app/product/[slug]/page.tsx
// Product Detail Page — the Alibaba hybrid (B2B tiered price table +
// B2C Add to Cart + RFQ Contact Supplier form).
//
// v16 facts honoured:
//   • `params` is a Promise<{slug}> — awaited inside the async page fn.
//   • Uses the global PageProps<'/product/[slug]'> helper (no import).
//   • Server Component by default; interactive pieces live in client sub-files.
//   • `dynamic = 'force-dynamic'` because Supabase server client reads cookies().
// ============================================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";

import {
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
} from "@/lib/queries";
import type { ProductWithImages } from "@/types/database";
import { Badge } from "@/components/Badge";
import { ProductCard, type ProductCardProps } from "@/components/ProductCard";
import { formatPriceCents } from "@/lib/utils";

import { Gallery } from "./Gallery";
import { ProductTabs } from "./ProductTabs";
import { InquiryForm } from "./InquiryForm";
import { PurchasePanel } from "./PurchasePanel";

export const dynamic = "force-dynamic";

// ----------------------------------------------------------------------------
// Static helpers
// ----------------------------------------------------------------------------

const PLACEHOLDER_IMG = "https://picsum.com/600/800";

function coverImage(p: ProductWithImages): string {
  const cover = p.images.find((i) => i.is_cover);
  if (cover) return cover.url;
  if (p.images[0]) return p.images[0].url;
  return PLACEHOLDER_IMG;
}

function lowestTierPriceCents(p: ProductWithImages): number {
  if (p.tiers.length > 0) {
    return Math.min(...p.tiers.map((t) => t.unit_price_cents));
  }
  return p.retail_price_cents ?? p.base_price_cents;
}

function toCardProduct(p: ProductWithImages): ProductCardProps["product"] {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    image: coverImage(p),
    priceFromCents: lowestTierPriceCents(p),
    moq: p.moq,
    badge: p.is_featured ? "hot" : p.moq <= 1 ? "low-moq" : undefined,
  };
}

// ----------------------------------------------------------------------------
// Metadata
// ----------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product not found" };
    return {
      title: product.title,
      description: product.description.slice(0, 160),
    };
  } catch {
    return { title: "Product" };
  }
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  // v16: params is a Promise — must be awaited.
  const { slug } = await params;

  let product: ProductWithImages | null = null;
  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error("getProductBySlug failed:", err);
  }

  if (!product) {
    notFound();
  }

  // "You may also like" — prefer same category, fall back to featured.
  let related: ProductWithImages[] = [];
  try {
    if (product.category) {
      const result = await getProductsByCategory(product.category.slug, {
        limit: 8,
        offset: 0,
      });
      // Exclude the current product.
      related = result.items.filter((p) => p.id !== product!.id);
    }
    if (related.length < 4) {
      const featured = await getFeaturedProducts(8);
      const seen = new Set(related.map((p) => p.id));
      for (const f of featured) {
        if (related.length >= 4) break;
        if (f.id === product.id) continue;
        if (seen.has(f.id)) continue;
        seen.add(f.id);
        related.push(f);
      }
    }
    related = related.slice(0, 4);
  } catch (err) {
    console.error("Failed to load related products:", err);
  }

  // --------------------------------------------------------------------------
  // Derived product facts
  // --------------------------------------------------------------------------

  const priceFromCents = lowestTierPriceCents(product);
  const retailCents = product.retail_price_cents;
  // "Strikethrough" price: the higher of retail vs base, if it differs from
  // the lowest-tier price. Otherwise hide.
  const compareCents =
    retailCents && retailCents > priceFromCents ? retailCents : null;

  // MOQ badge: low-MOQ callout when <= 5 units.
  const isLowMoq = product.moq <= 5;

  return (
    <div className="bg-bg pb-24 md:pb-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="container-x py-4 text-xs text-text-muted"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-fg">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight size={12} className="mx-1 inline" />
          </li>
          {product.category && (
            <>
              <li>
                <Link
                  href={`/category/${product.category.slug}`}
                  className="hover:text-fg"
                >
                  {product.category.name}
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight size={12} className="mx-1 inline" />
              </li>
            </>
          )}
          <li className="truncate font-medium text-fg" title={product.title}>
            {product.title}
          </li>
        </ol>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────
       * Two-column hero: gallery + product info
       * ───────────────────────────────────────────────────────────────── */}
      <div className="container-x grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery (client) */}
        <Gallery images={product.images} title={product.title} />

        {/* Product info */}
        <div className="flex flex-col gap-5">
          {/* Title */}
          <h1 className="text-2xl font-bold text-fg sm:text-3xl">
            {product.title}
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-2 text-sm">
            {product.rating_count > 0 ? (
              <>
                <div className="flex items-center gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="currentColor"
                      className={
                        i < Math.round(product.rating_avg)
                          ? "text-warning"
                          : "text-border"
                      }
                    />
                  ))}
                </div>
                <span className="font-semibold text-fg">
                  {product.rating_avg.toFixed(1)}
                </span>
                <span className="text-text-muted">
                  ({product.rating_count} reviews)
                </span>
              </>
            ) : (
              <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-fg">
                New product
              </span>
            )}
          </div>

          {/* Price block */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-accent">
              From {formatPriceCents(priceFromCents, product.currency)}
            </span>
            {compareCents && (
              <span className="text-base text-text-muted line-through">
                {formatPriceCents(compareCents, product.currency)}
              </span>
            )}
          </div>

          {/* MOQ + stock badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isLowMoq ? "low-moq" : "default"}>
              Min order: {product.moq} units
            </Badge>
            <Badge variant={product.stock > 0 ? "default" : "sale"}>
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </Badge>
            {product.is_featured && <Badge variant="hot">Featured</Badge>}
          </div>

          {/* Bulk pricing + qty-aware purchase panel — both live in the same
              client component so the tier highlight tracks the qty selector. */}
          {product.tiers.length > 0 && (
            <div className="mt-1">
              <h2 className="mb-2 text-sm font-semibold text-fg">
                Bulk pricing
              </h2>
            </div>
          )}

          <PurchasePanel
            tiers={product.tiers.map((t) => ({
              minQty: t.min_qty,
              unitPriceCents: t.unit_price_cents,
            }))}
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              image: coverImage(product),
              priceFromCents,
              retailPriceCents: retailCents,
              currency: product.currency,
              moq: product.moq,
              stock: product.stock,
            }}
          />

          {/* Trust signals */}
          <ul className="mt-2 grid grid-cols-1 gap-2 text-xs text-text-muted sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Verified supplier
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Trade Assurance protection
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Worldwide shipping
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Sample orders welcome
            </li>
          </ul>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
       * Tabs: Description / Specifications / Reviews
       * ───────────────────────────────────────────────────────────────── */}
      <div className="container-x mt-12">
        <ProductTabs
          description={product.description}
          specifications={
            (product.specifications as Record<string, unknown>) ?? {}
          }
          ratingAvg={product.rating_avg}
          ratingCount={product.rating_count}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────
       * Related products
       * ───────────────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="container-x mt-16"
        >
          <h2
            id="related-heading"
            className="mb-6 text-xl font-bold text-fg sm:text-2xl"
          >
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={toCardProduct(p)} />
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────
       * Contact Supplier / RFQ form
       * ───────────────────────────────────────────────────────────────── */}
      <section
        id="inquiry"
        aria-labelledby="inquiry-heading"
        className="container-x mt-16 scroll-mt-24"
      >
        <div className="mb-6 flex flex-col gap-2">
          <h2
            id="inquiry-heading"
            className="text-xl font-bold text-fg sm:text-2xl"
          >
            Contact Supplier
          </h2>
          <p className="text-sm text-text-muted">
            Need a custom quote, bulk pricing, or sample? Send a message and the
            supplier will get back to you, usually within 24 hours.
          </p>
        </div>
        <InquiryForm productId={product.id} productTitle={product.title} />
      </section>
    </div>
  );
}
