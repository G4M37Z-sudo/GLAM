import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard, type ProductCardProps } from "@/components/ProductCard";
import { CategoryTile } from "@/components/CategoryTile";
import type { BadgeVariant } from "@/components/Badge";

import { getFeaturedProducts, getAllCategories } from "@/lib/queries";
import type { ProductWithImages, Category } from "@/types/database";

// The Supabase server client reads cookies(), which forces dynamic rendering.
// Make it explicit so Next.js doesn't waste a prerender attempt (and so we
// don't see a misleading "Route / couldn't be rendered statically" log in
// the build output).
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Mappers: Supabase row shape → component prop shape.
//
// The DB doesn't carry a "sale price" (it has `base_price_cents` for wholesale
// tiers and `retail_price_cents` for B2C). The "from" price on the card is
// the lowest unit price across the product's price tiers (i.e. the bulk
// discount price) — that is the Alibaba-style "as low as" hook.
// ---------------------------------------------------------------------------

const PLACEHOLDER_IMG = "https://picsum.com/600/800";

function coverImage(p: ProductWithImages): string {
  const cover = p.images.find((i) => i.is_cover);
  if (cover) return cover.url;
  if (p.images[0]) return p.images[0].url;
  return PLACEHOLDER_IMG;
}

function hoverImage(p: ProductWithImages): string | undefined {
  // Pick the second image, if any, for a hover-swap effect.
  const nonCover = p.images.find((i) => !i.is_cover);
  return nonCover?.url;
}

function priceFromCents(p: ProductWithImages): number {
  // Lowest tier price wins; fall back to retail then base.
  if (p.tiers.length > 0) {
    return Math.min(...p.tiers.map((t) => t.unit_price_cents));
  }
  return p.retail_price_cents ?? p.base_price_cents;
}

function deriveBadge(p: ProductWithImages): BadgeVariant | undefined {
  if (p.is_featured) return "hot";
  if (p.moq <= 1) return "low-moq";
  // Newer products get "new" — anything created in the last 14 days
  const ageMs = Date.now() - new Date(p.created_at).getTime();
  if (ageMs < 14 * 24 * 60 * 60 * 1000) return "new";
  return undefined;
}

function toCardProduct(
  p: ProductWithImages
): ProductCardProps["product"] {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    image: coverImage(p),
    hoverImage: hoverImage(p),
    priceFromCents: priceFromCents(p),
    moq: p.moq,
    badge: deriveBadge(p),
  };
}

function toCategoryTile(c: Category) {
  return {
    name: c.name,
    image: c.image_url ?? PLACEHOLDER_IMG,
    href: `/category/${c.slug}`,
  };
}

// ---------------------------------------------------------------------------
// Page (Server Component). All data fetches are wrapped in try/catch so the
// build still passes before Supabase env vars are wired in `.env.local`.
// ---------------------------------------------------------------------------

export default async function HomePage() {
  // Defaults that render an honest "empty state" before Supabase is configured.
  let featured: ProductWithImages[] = [];
  let trending: ProductWithImages[] = [];
  let categories: Category[] = [];

  try {
    const [all, cats] = await Promise.all([
      // 16 total = 8 featured + 8 trending
      getFeaturedProducts(16),
      getAllCategories(),
    ]);
    featured = all.slice(0, 8);
    trending = all.slice(8, 16);
    categories = cats;
  } catch (err) {
    // Surface to server logs but don't crash the page.
    console.error("HomePage data fetch failed:", err);
  }

  return (
    <>
      <HeroBanner />

      {/* Featured */}
      <section
        aria-labelledby="featured-heading"
        className="container-x py-12 sm:py-16"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2
              id="featured-heading"
              className="text-2xl font-bold text-fg sm:text-3xl"
            >
              Featured Today
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Hand-picked drops from our top sellers.
            </p>
          </div>
          <a
            href="/featured"
            className="text-sm font-medium text-accent hover:underline"
          >
            See all →
          </a>
        </div>
        {featured.length === 0 ? (
          <EmptyState message="No featured products yet — wire up Supabase and run the seed to populate the catalog." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={toCardProduct(p)} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section
        aria-labelledby="categories-heading"
        className="bg-surface py-12 sm:py-16"
      >
        <div className="container-x">
          <h2
            id="categories-heading"
            className="mb-6 text-2xl font-bold text-fg sm:text-3xl"
          >
            Shop by Category
          </h2>
          {categories.length === 0 ? (
            <EmptyState message="No categories yet — Supabase not connected or seed not run." />
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-6">
              {categories.map((c) => (
                <CategoryTile key={c.id} {...toCategoryTile(c)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending */}
      <section
        aria-labelledby="trending-heading"
        className="container-x py-12 sm:py-16"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2
              id="trending-heading"
              className="text-2xl font-bold text-fg sm:text-3xl"
            >
              Trending Now
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              What everyone&apos;s adding to cart this week.
            </p>
          </div>
          <a
            href="/trending"
            className="text-sm font-medium text-accent hover:underline"
          >
            See all →
          </a>
        </div>
        {trending.length === 0 ? (
          <EmptyState message="More products will appear here once the catalog grows." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {trending.map((p) => (
              <ProductCard key={p.id} product={toCardProduct(p)} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// Inline empty-state — small, unstyled so it blends with any section bg.
function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-bg/50 px-4 py-10 text-center text-sm text-text-muted">
      {message}
    </div>
  );
}
