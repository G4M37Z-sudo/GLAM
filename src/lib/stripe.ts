// ============================================================================
// src/lib/stripe.ts
// Stripe SDK singleton. Server-side only — never import this into a
// Client Component (would leak STRIPE_SECRET_KEY to the browser bundle).
//
// We intentionally do NOT pin `apiVersion` here. The Stripe SDK ships
// with a default that matches your account's pinned version at runtime.
// Pinning a date in code can drift out of sync with the SDK release
// schedule and cause `TypeError`s in production.
//
// We also construct the client lazily so that module evaluation (which
// Next.js runs during build for route handlers) doesn't require
// STRIPE_SECRET_KEY to be present in the build environment.
// ============================================================================

import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Lazily-constructed Stripe client. Throws on first use if
 * STRIPE_SECRET_KEY is missing. Imported by /api/checkout and
 * /api/stripe-webhook — never from a Client Component.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY — set it in .env.local for dev and in " +
        "your hosting provider (e.g. Vercel project settings) for prod. " +
        "Test keys start with sk_test_, live keys with sk_live_."
    );
  }

  _stripe = new Stripe(key);
  return _stripe;
}

/**
 * Direct stripe singleton accessor. Builds the client on first property
 * access and caches it. Use `stripe.checkout.sessions.create(...)` etc.
 * exactly as you would with `new Stripe(key)`.
 *
 * Implementation note: this is a Proxy that materialises the underlying
 * client lazily. Module-level evaluation is therefore safe even when
 * STRIPE_SECRET_KEY is unset, which is important because Next.js's build
 * collects page data for every route handler.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
}) as Stripe;