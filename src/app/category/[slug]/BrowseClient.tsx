"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard, type ProductCardProps } from "@/components/ProductCard";
import type { BadgeVariant } from "@/components/Badge";
import type { ProductWithImages } from "@/types/database";

import {
  MobileFilters,
  queryToFilters,
} from "./FilterSidebar";
import {
  SortDropdown,
  DEFAULT_SORT,
  isSortKey,
  type SortKey,
} from "./SortDropdown";

// ----------------------------------------------------------------------------
// BrowseClient — orchestrator for the right-hand column.
//
// Filters + sort are applied locally to the server-fetched page slice, so the
// right column is a Client Component. URL search params are the source of
// truth (driven by FilterSidebar / SortDropdown), and `useSearchParams()`
// re-renders this component when they change.
//
// Pagination stays server-side: Previous / Next are real <Link>s that swap
// the URL `?page=N`, triggering a fresh server render of page.tsx.
// ----------------------------------------------------------------------------

interface BrowseClientProps {
  /** Server-fetched products for the current page (filtered by category + active). */
  products: ProductWithImages[];
  /** Total number of products in this category (across all pages). */
  total: number;
  /** Current 1-indexed page. */
  page: number;
  /** Page size — fixed for now. */
  pageSize: number;
}

// ----------------------------------------------------------------------------
// Mappers (mirror src/app/page.tsx — kept local so we don't reach into app code)
// ----------------------------------------------------------------------------

const PLACEHOLDER_IMG = "https://picsum.com/600/800";

function coverImage(p: ProductWithImages): string {
  const cover = p.images.find((i) => i.is_cover);
  if (cover) return cover.url;
  if (p.images[0]) return p.images[0].url;
  return PLACEHOLDER_IMG;
}

function hoverImage(p: ProductWithImages): string | undefined {
  const nonCover = p.images.find((i) => !i.is_cover);
  return nonCover?.url;
}

function priceFromCents(p: ProductWithImages): number {
  if (p.tiers.length > 0) {
    return Math.min(...p.tiers.map((t) => t.unit_price_cents));
  }
  return p.retail_price_cents ?? p.base_price_cents;
}

function deriveBadge(p: ProductWithImages): BadgeVariant | undefined {
  if (p.is_featured) return "hot";
  if (p.moq <= 1) return "low-moq";
  const ageMs = Date.now() - new Date(p.created_at).getTime();
  if (ageMs < 14 * 24 * 60 * 60 * 1000) return "new";
  return undefined;
}

function toCardProduct(p: ProductWithImages): ProductCardProps["product"] {
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

// ----------------------------------------------------------------------------
// Sort + filter predicates (pure, easy to test if we add a spec later)
// ----------------------------------------------------------------------------

function applyFilters(
  products: ProductWithImages[],
  f: ReturnType<typeof queryToFilters>
): ProductWithImages[] {
  return products.filter((p) => {
    const price = priceFromCents(p);
    if (f.priceMinCents != null && price < f.priceMinCents) return false;
    if (f.priceMaxCents != null && price > f.priceMaxCents) return false;
    if (f.moqMin != null && p.moq < f.moqMin) return false;
    if (f.moqMax != null && p.moq > f.moqMax) return false;
    return true;
  });
}

function applySort(
  products: ProductWithImages[],
  sort: SortKey
): ProductWithImages[] {
  const arr = [...products];
  switch (sort) {
    case "price-asc":
      arr.sort((a, b) => priceFromCents(a) - priceFromCents(b));
      break;
    case "price-desc":
      arr.sort((a, b) => priceFromCents(b) - priceFromCents(a));
      break;
    case "popular":
      arr.sort((a, b) => {
        if (b.rating_count !== a.rating_count)
          return b.rating_count - a.rating_count;
        // Tiebreak by created_at desc.
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      break;
    case "newest":
    default:
      arr.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }
  return arr;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function BrowseClient({
  products,
  total,
  page,
  pageSize,
}: BrowseClientProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL is the source of truth — useSearchParams() drives a re-render here
  // whenever the sidebar / sort dropdown replace history state.
  const sortRaw = searchParams.get("sort");
  const sort: SortKey = isSortKey(sortRaw) ? sortRaw : DEFAULT_SORT;

  const filters = useMemo(
    () => queryToFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const visible = useMemo(() => {
    const filtered = applyFilters(products, filters);
    return applySort(filtered, sort);
  }, [products, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // Build pagination hrefs preserving current filters + sort, dropping `page`
  // when going back to page 1 so URLs stay tidy.
  const buildPageHref = (targetPage: number): string => {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage <= 1) params.delete("page");
    else params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="space-y-6">
      {/* Mobile filter sheet — desktop sees the sticky sidebar in page.tsx */}
      <MobileFilters />

      {/* Sort + result count row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-bg px-4 py-3">
        <div className="text-xs font-medium text-text-muted">
          {total === 0 ? (
            <>No results</>
          ) : (
            <>
              Showing <span className="font-semibold text-fg">{start}</span>–
              <span className="font-semibold text-fg">{end}</span> of{" "}
              <span className="font-semibold text-fg">{total}</span>
            </>
          )}
        </div>
        <SortDropdown
          value={sort}
          onChange={() => {
            /* noop: SortDropdown writes URL directly */
          }}
        />
      </div>

      {/* Grid or empty state */}
      {visible.length === 0 ? (
        <EmptyState
          title="No products in this category yet."
          hint={
            total === 0
              ? "Check back soon — new drops land every week."
              : "Try adjusting or clearing your filters."
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={toCardProduct(p)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between gap-3 pt-2"
        >
          <PageLink
            disabled={!hasPrev}
            href={buildPageHref(Math.max(1, page - 1))}
            direction="prev"
          />
          <span className="text-xs font-medium text-text-muted">
            Page {page} of {totalPages}
          </span>
          <PageLink
            disabled={!hasNext}
            href={buildPageHref(Math.min(totalPages, page + 1))}
            direction="next"
          />
        </nav>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-bg px-4 py-16 text-center">
      <p className="text-base font-semibold text-fg">{title}</p>
      {hint && <p className="mt-1 text-sm text-text-muted">{hint}</p>}
    </div>
  );
}

function PageLink({
  disabled,
  href,
  direction,
}: {
  disabled: boolean;
  href: string;
  direction: "prev" | "next";
}) {
  const label = direction === "prev" ? "Previous" : "Next";
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const base =
    "inline-flex h-10 items-center gap-1 rounded-md border px-4 text-sm font-medium transition-colors";
  if (disabled) {
    return (
      <span
        aria-disabled
        className={`${base} cursor-not-allowed border-border bg-surface text-text-muted opacity-60`}
      >
        {direction === "prev" && <Icon size={16} />}
        {label}
        {direction === "next" && <Icon size={16} />}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} border-border bg-bg text-fg hover:border-fg hover:bg-surface`}
    >
      {direction === "prev" && <Icon size={16} />}
      {label}
      {direction === "next" && <Icon size={16} />}
    </Link>
  );
}