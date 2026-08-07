// src/components/CategoryLanding.tsx
// Reusable template for the 6 standalone category landing pages.
// Renders: hero with category image, intro, "Featured" section (real
// products when Supabase is connected, otherwise a curated seed list),
// USP tiles, and a "Browse all" CTA.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, type ProductCardProps } from "@/components/ProductCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerOnScroll } from "@/components/animations/StaggerOnScroll";
import type { ProductWithImages, Category } from "@/types/database";

interface UspTile {
  title: string;
  body: string;
  icon?: string;
}

interface CategoryLandingProps {
  category: Pick<Category, "id" | "slug" | "name" | "image_url">;
  intro: string;
  heroImage?: string;
  usps: UspTile[];
  /** Pre-fetched products (featured picks in this category). */
  featured: ProductWithImages[];
}

// ---------------------------------------------------------------------------
// Mapper
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
// Component
// ---------------------------------------------------------------------------

export function CategoryLanding({
  category,
  intro,
  heroImage,
  usps,
  featured,
}: CategoryLandingProps) {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-bg to-surface">
        <div className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Category
            </span>
            <h1 className="mt-2 text-4xl font-black leading-tight text-fg sm:text-5xl lg:text-6xl">
              {category.name}
            </h1>
            <p className="mt-4 max-w-xl text-base text-text-muted sm:text-lg">
              {intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/category/${category.slug}?sort=newest`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Browse all {category.name.toLowerCase()}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-fg"
              >
                Search
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface lg:aspect-[5/4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage ?? category.image_url ?? "https://picsum.photos/1200/900"}
              alt={category.name}
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* USP tiles */}
      {usps.length > 0 && (
        <section className="border-y border-border bg-bg">
          <div className="container-x grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {usps.map((u) => (
              <div key={u.title}>
                <h3 className="mb-1 text-sm font-bold text-fg">{u.title}</h3>
                <p className="text-sm text-text-muted">{u.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="container-x py-12 sm:py-16">
        <ScrollReveal>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-fg sm:text-3xl">
                Featured in {category.name}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Hand-picked favorites our customers love right now.
              </p>
            </div>
            <Link
              href={`/category/${category.slug}`}
              className="text-sm font-medium text-accent hover:underline"
            >
              See all →
            </Link>
          </div>
        </ScrollReveal>
        {featured.length > 0 ? (
          <StaggerOnScroll className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={toCardProduct(p)} />
            ))}
          </StaggerOnScroll>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-text-muted">
            Featured products will appear here once Supabase is connected.
          </div>
        )}
      </section>

      {/* Browse all CTA */}
      <section className="bg-accent text-white">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              Ready to explore the full {category.name.toLowerCase()} catalog?
            </h2>
            <p className="mt-1 text-white/90">
              Filters, sort, and wholesale tier pricing on every product.
            </p>
          </div>
          <Link
            href={`/category/${category.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-accent transition-colors hover:bg-white/90"
          >
            Browse all
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
