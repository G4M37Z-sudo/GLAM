// ============================================================================
// database.ts — TypeScript shapes that mirror supabase/schema.sql exactly.
//
// Conventions (matching Postgres → JS):
//   uuid        → string
//   numeric     → number
//   timestamptz → string  (ISO-8601)
//   jsonb       → Record<string, unknown>
//   text/int    → string / number
//   boolean     → boolean
// ============================================================================

// ----------------------------------------------------------------------------
// Enums / literal unions
// ----------------------------------------------------------------------------

export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

// ----------------------------------------------------------------------------
// Row types — match each public.* table 1:1
// ----------------------------------------------------------------------------

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Product {
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
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  display_order: number;
  is_cover: boolean;
}

export interface PriceTier {
  id: string;
  product_id: string;
  min_qty: number;
  unit_price_cents: number;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal_cents: number | null;
  shipping_cents: number;
  total_cents: number | null;
  stripe_session_id: string | null;
  shipping_address: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title: string;
  unit_price_cents: number;
  quantity: number;
}

export interface Inquiry {
  id: string;
  product_id: string | null;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// Composite / query result types
// ----------------------------------------------------------------------------

/** A product joined with its images, price tiers, and parent category. */
export type ProductWithImages = Product & {
  images: ProductImage[];
  tiers: PriceTier[];
  category: Category | null;
};
