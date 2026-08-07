// ============================================================================
// src/app/cart/page.tsx
//
// Server Component shell for the /cart page. The interactive content (cart
// items from localStorage, quantity steppers, checkout modal) lives in
// `CartClient.tsx` because the cart is read from a Zustand store persisted to
// the browser.
//
// This page does NOT need to read cookies — the cart is client-side state —
// but we mark it dynamic because the rendered content varies per user.
// ============================================================================

import type { Metadata } from "next";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "Your Cart",
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  return <CartClient />;
}