// ============================================================================
// src/lib/queries.ts
// Typed query wrappers around the Supabase server client.
// These are designed to be called from Server Components — they read public
// catalog data using the anon key and pass plain serialisable shapes down to
// Client Components.
//
// Why the server client? `createBrowserClient` is gated to the browser bundle
// and throws if called from a Server Component. The server client in
// `src/lib/supabase/server.ts` uses `cookies()` to bind the request and works
// for both authed and anonymous reads. For purely public catalog data, the
// anon key is enough — no auth cookies are needed for these queries.
// ============================================================================

import { createClient } from "./supabase/server";
import type {
  Category,
  ProductImage,
  PriceTier,
  ProductWithImages,
} from "@/types/database";

// ----------------------------------------------------------------------------
// Shape of the joined select() — keep in sync with the .select() call below.
// ----------------------------------------------------------------------------

type JoinedProductRow = ProductWithImages;

// ----------------------------------------------------------------------------
// Internal: build a ProductWithImages from a raw joined row.
// Supabase returns images/tiers as nullable arrays when using inner joins on
// outer tables; we coerce to safe defaults so call sites can render directly.
// ----------------------------------------------------------------------------

function normaliseProduct(row: JoinedProductRow | null): ProductWithImages | null {
  if (!row) return null;
  return {
    ...row,
    images: Array.isArray(row.images) ? row.images : [],
    tiers: Array.isArray(row.tiers) ? row.tiers : [],
    category: row.category ?? null,
  };
}

// ----------------------------------------------------------------------------
// getFeaturedProducts
// Returns up to `limit` active, featured products with images + tiers + category.
// ----------------------------------------------------------------------------

export async function getFeaturedProducts(
  limit = 8
): Promise<ProductWithImages[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "*, category:categories(*), images:product_images(*), tiers:price_tiers(*)"
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProducts failed:", error.message);
    return [];
  }

  return (data ?? []).map((row: JoinedProductRow) => normaliseProduct(row)!) as ProductWithImages[];
}

// ----------------------------------------------------------------------------
// getProductsByCategory
// Paginated list of products in a category, with total count for pagination UI.
// ----------------------------------------------------------------------------

export interface ListProductsParams {
  limit?: number;
  offset?: number;
}

export interface ListProductsResult {
  items: ProductWithImages[];
  total: number;
}

export async function getProductsByCategory(
  categorySlug: string,
  { limit = 24, offset = 0 }: ListProductsParams = {}
): Promise<ListProductsResult> {
  const supabase = await createClient();

  // Resolve the category id first so we can hit the products.category_id index.
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (catErr || !cat) {
    if (catErr) console.error("getProductsByCategory cat lookup:", catErr.message);
    return { items: [], total: 0 };
  }

  const { data, error, count } = await supabase
    .from("products")
    .select(
      "*, category:categories(*), images:product_images(*), tiers:price_tiers(*)",
      { count: "exact" }
    )
    .eq("is_active", true)
    .eq("category_id", cat.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("getProductsByCategory query failed:", error.message);
    return { items: [], total: 0 };
  }

  return {
    items: (data ?? []).map((row: JoinedProductRow) => normaliseProduct(row)!) as ProductWithImages[],
    total: count ?? 0,
  };
}

// ----------------------------------------------------------------------------
// getProductBySlug
// Returns one product (with images, tiers, category) or null.
// ----------------------------------------------------------------------------

export async function getProductBySlug(
  slug: string
): Promise<ProductWithImages | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "*, category:categories(*), images:product_images(*), tiers:price_tiers(*)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug failed:", error.message);
    return null;
  }

  return normaliseProduct(data as JoinedProductRow | null);
}

// ----------------------------------------------------------------------------
// getAllCategories
// Ordered by display_order ascending, then name as a tiebreaker.
// ----------------------------------------------------------------------------

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("getAllCategories failed:", error.message);
    return [];
  }

  return (data ?? []) as Category[];
}

// ----------------------------------------------------------------------------
// Re-exports so callers can `import { ProductImage } from "@/lib/queries"`
// alongside the helpers if they prefer.
// ----------------------------------------------------------------------------

export type { ProductImage, PriceTier };
