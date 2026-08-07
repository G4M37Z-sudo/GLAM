// ============================================================================
// src/app/category/[slug]/page.tsx
//
// Browse page for one category — Alibaba / Shein-style listing. Two columns on
// `lg+`: sticky filter sidebar on the left, sort + grid + pagination on the
// right. Filters and sort are CLIENT-side (applied to the in-memory list); the
// server only re-fetches when pagination changes `?page=N`.
//
// Async Server Component. `params` and `searchParams` are both Promises in
// Next.js 16.3 — we `await` both before reading. The global `PageProps<...>`
// helper provides the inferred prop shape (no imports needed).
// ============================================================================

import { notFound } from "next/navigation";

import { getAllCategories, getProductsByCategory } from "@/lib/queries";
import type { Category, ProductWithImages } from "@/types/database";

import { BrowseClient } from "./BrowseClient";
import { FilterSidebar } from "./FilterSidebar";

// ----------------------------------------------------------------------------
// Dynamic rendering — Supabase server client reads cookies() and we read
// searchParams, both of which force dynamic anyway. Make it explicit so the
// build output doesn't show a misleading "couldn't be rendered statically"
// log for this route.
// ----------------------------------------------------------------------------

export const dynamic = "force-dynamic";

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

const PAGE_SIZE = 24;
const PLACEHOLDER_IMG = "https://picsum.com/600/800";

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

export default async function CategoryPage(
  props: PageProps<"/category/[slug]">
) {
  const { slug } = await props.params;
  const sp = await props.searchParams;

  const page = parsePageParam(sp.page);

  // Defaults that render an honest empty state if Supabase isn't configured
  // yet (mirrors src/app/page.tsx — keeps the page from 500-ing before env
  // vars are wired in `.env.local`). A real `notFound()` only fires once
  // we've actually confirmed the slug isn't in the database.
  let categories: Category[] = [];
  let productsResult: { items: ProductWithImages[]; total: number } = {
    items: [],
    total: 0,
  };

  try {
    const [cats, prods] = await Promise.all([
      getAllCategories(),
      getProductsByCategory(slug, {
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      }),
    ]);
    categories = cats;
    productsResult = prods;
  } catch (err) {
    // Supabase env vars missing, or transient network error. Render a clean
    // empty-state instead of 500-ing the user. We still log so the dev sees
    // the underlying issue in the server console.
    console.error("CategoryPage data fetch failed:", err);
  }

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    // Slug really doesn't exist (or Supabase was unreachable so we have no
    // category list to search). 404 either way — better UX than 500.
    notFound();
  }

  return (
    <>
      <CategoryHero category={category} total={productsResult.total} />

      <div className="container-x py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
          {/* Sticky filter sidebar — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <FilterSidebar />
            </div>
          </div>

          {/* Right column: sort + grid + pagination */}
          <BrowseClient
            products={productsResult.items}
            total={productsResult.total}
            page={page}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

/**
 * Parse `?page=N` into a positive 1-indexed integer. Garbage values fall back
 * to page 1 so a typo in the URL never produces an empty page.
 */
function parsePageParam(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return 1;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

// ----------------------------------------------------------------------------
// CategoryHero — full-width band with the category image as a soft background
// accent and the name + product count overlaid. Uses bg-surface (Shein token).
// ----------------------------------------------------------------------------

function CategoryHero({
  category,
  total,
}: {
  category: Category;
  total: number;
}) {
  const img = category.image_url ?? PLACEHOLDER_IMG;
  return (
    <section
      aria-label={`${category.name} category`}
      className="relative overflow-hidden bg-surface"
    >
      {/* Background image — soft, blurred, very low contrast. The grid of
          products below is the hero; this band is just orientation. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt=""
        aria-hidden
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-surface/40" />

      <div className="container-x relative flex items-center gap-6 py-10 sm:py-14">
        {/* Accent thumbnail */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt=""
          aria-hidden
          loading="eager"
          className="hidden h-20 w-20 shrink-0 rounded-lg border border-border bg-bg object-cover sm:block"
        />
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
            Category
          </p>
          <h1 className="mt-1 truncate text-3xl font-bold text-fg sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {total} {total === 1 ? "product" : "products"}
          </p>
        </div>
      </div>
    </section>
  );
}