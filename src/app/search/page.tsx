// src/app/search/page.tsx
// Search results page. Reads ?q=... from the URL, calls a Supabase
// query that filters products by title/description, and renders the
// results using the same ProductCard as the rest of the site.
//
// Async Server Component. v16: searchParams is a Promise — must await.

import Link from "next/link";
import { ProductCard, type ProductCardProps } from "@/components/ProductCard";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithImages } from "@/types/database";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Mapper — ProductWithImages → ProductCardProps['product']
// (Duplicated from src/app/page.tsx to avoid creating a barrel file just for
// this. If you add a third user, lift it into src/lib/product-card.ts.)
// ---------------------------------------------------------------------------

const PLACEHOLDER_IMG = "https://picsum.com/600/800";

function coverImage(p: ProductWithImages): string {
  const cover = p.images.find((i) => i.is_cover);
  if (cover) return cover.url;
  if (p.images[0]) return p.images[0].url;
  return PLACEHOLDER_IMG;
}

function priceFromCents(p: ProductWithImages): number {
  if (p.tiers.length > 0) {
    return Math.min(...p.tiers.map((t) => t.unit_price_cents));
  }
  return p.retail_price_cents ?? p.base_price_cents;
}

function toCardProduct(
  p: ProductWithImages
): ProductCardProps["product"] {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    image: coverImage(p),
    priceFromCents: priceFromCents(p),
    moq: p.moq,
  };
}

// ---------------------------------------------------------------------------
// Query — ILIKE on title and description. No full-text index yet; for v1
// this is fine. If the catalog grows beyond ~10k products, switch to a
// generated tsvector column with a GIN index.
// ---------------------------------------------------------------------------

async function searchProducts(
  q: string
): Promise<ProductWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, category:categories(*), images:product_images(*), tiers:price_tiers(*)"
    )
    .eq("is_active", true)
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .limit(48);

  if (error) {
    console.error("searchProducts failed:", error.message);
    return [];
  }
  return (data ?? []).map((row: {
    id: string;
    slug: string;
    title: string;
    description: string;
    specifications: Record<string, unknown>;
    category_id: string | null;
    base_price_cents: number;
    retail_price_cents: number;
    currency: string;
    moq: number;
    stock: number;
    rating_avg: number;
    rating_count: number;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    images?: { id: string; url: string; is_cover: boolean }[];
    tiers?: { min_qty: number; unit_price_cents: number }[];
    category?: { slug: string; name: string } | null;
  }) => ({
    ...row,
    images: Array.isArray(row.images) ? row.images : [],
    tiers: Array.isArray(row.tiers) ? row.tiers : [],
    category: row.category ?? null,
  })) as ProductWithImages[];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let results: ProductWithImages[] = [];
  if (query.length >= 2) {
    try {
      results = await searchProducts(query);
    } catch (err) {
      console.error("Search query failed:", err);
    }
  }

  return (
    <main className="container-x py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-fg sm:text-3xl">
          Search results
        </h1>
        {query ? (
          <p className="text-sm text-text-muted">
            {results.length === 0
              ? `No products match “${query}”.`
              : `${results.length} ${
                  results.length === 1 ? "result" : "results"
                } for “${query}”.`}
          </p>
        ) : (
          <p className="text-sm text-text-muted">
            Type a search term in the header to find products.
          </p>
        )}
      </div>

      {/* Results grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={toCardProduct(p)} />
          ))}
        </div>
      ) : query.length >= 2 ? (
        <EmptyState query={query} />
      ) : (
        <EmptyState query="" />
      )}
    </main>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-bg">
        <Search size={24} className="text-text-muted" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-fg">
        {query ? `Nothing found for “${query}”` : "Start a search"}
      </h2>
      <p className="mb-6 text-sm text-text-muted">
        {query
          ? "Try a different term, or browse our categories below."
          : "Use the search bar in the header above to find products by name or description."}
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        {[
          { label: "Electronics", href: "/category/electronics" },
          { label: "Home & Garden", href: "/category/home-garden" },
          { label: "Fashion", href: "/category/fashion-accessories" },
          { label: "Beauty", href: "/category/beauty-personal-care" },
          { label: "Sports", href: "/category/sports-outdoors" },
          { label: "Gadgets", href: "/category/gadgets" },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-full border border-border bg-bg px-4 py-2 font-medium text-fg transition-colors hover:border-accent hover:text-accent"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
