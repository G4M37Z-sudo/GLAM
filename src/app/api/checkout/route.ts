// ============================================================================
// src/app/api/checkout/route.ts
// POST /api/checkout
//
// Validates the client-submitted cart, re-fetches canonical prices via the
// Supabase admin client (never trust the client for prices!), creates a
// pending `orders` row + `order_items`, then opens a Stripe Checkout
// Session. Returns the Stripe URL so the client can redirect to it.
//
// On success the client is redirected to Stripe. Stripe later POSTs to
// /api/stripe-webhook with `checkout.session.completed` and we flip the
// order status to 'paid' there.
// ============================================================================

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

// Next.js 16: route handlers run on every request by default and can use the
// standard Web `Request`/`Response` types. Stripe needs Node APIs (crypto
// for webhook signing) so we stay on the Node runtime.
export const runtime = "nodejs";
// Never cache this endpoint — every call creates a real order + session.
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal shape we accept from the cart client. */
interface CheckoutItem {
  productId: string;
  title: string;
  image: string;
  unitPriceCents: number;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface CheckoutBody {
  items: CheckoutItem[];
  email: string;
  shippingAddress: ShippingAddress;
}

/** What we return on success. */
interface CheckoutSuccess {
  url: string;
  orderId: string;
}

interface CheckoutError {
  error: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SHIPPING_FLAT_CENTS = 999; // $9.99 flat-rate shipping
const FREE_SHIPPING_THRESHOLD_CENTS = 5000; // free over $50
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isUuid(s: unknown): s is string {
  return typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function siteUrl(req: NextRequest): string {
  // NEXT_PUBLIC_SITE_URL wins (set explicitly per environment) but we fall
  // back to the incoming request origin so dev "just works" without env
  // config. This is safe because the same server generated the URL.
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    new URL(req.url).origin
  );
}

function jsonError(message: string, status = 400, requestId?: string) {
  const body: CheckoutError = { error: message };
  if (requestId) {
    // `CheckoutError` doesn't have an index signature; widening via unknown
    // is the documented escape hatch for "I know this is safe".
    (body as unknown as Record<string, unknown>).requestId = requestId;
  }
  return Response.json(body, { status });
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<Response> {
  // -----------------------------------------------------------------------
  // 1. Parse + validate body
  // -----------------------------------------------------------------------
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return jsonError("Invalid JSON body.");
  }

  if (!body || typeof body !== "object") {
    return jsonError("Body must be a JSON object.");
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return jsonError("Cart is empty.");
  }
  for (const [i, item] of body.items.entries()) {
    if (!isUuid(item?.productId)) {
      return jsonError(`items[${i}].productId must be a uuid.`);
    }
    if (!Number.isInteger(item?.quantity) || item.quantity < 1) {
      return jsonError(`items[${i}].quantity must be an integer ≥ 1.`);
    }
    if (!Number.isInteger(item?.unitPriceCents) || item.unitPriceCents < 0) {
      return jsonError(`items[${i}].unitPriceCents must be a non-negative integer.`);
    }
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    return jsonError("A valid email is required.");
  }
  const a = body.shippingAddress;
  if (
    !a ||
    !a.name ||
    !a.line1 ||
    !a.city ||
    !a.state ||
    !a.postal_code ||
    !a.country
  ) {
    return jsonError("Complete shipping address is required.");
  }

  // -----------------------------------------------------------------------
  // 2. Re-fetch canonical prices via the admin client.
  //    Never trust the client's unitPriceCents — the user could tamper with
  //    localStorage and submit $0. We overwrite with the DB's retail price.
  // -----------------------------------------------------------------------
  const supabase = createAdminClient();
  const productIds = body.items.map((i) => i.productId);

  const { data: products, error: productsErr } = await supabase
    .from("products")
    .select("id, title, retail_price_cents")
    .in("id", productIds);

  if (productsErr) {
    console.error("/api/checkout: products fetch failed", productsErr);
    return jsonError("Could not verify product prices.", 500);
  }
  if (!products || products.length !== productIds.length) {
    return jsonError("One or more products are no longer available.", 422);
  }

  const priceMap = new Map(
    products.map((p) => [p.id as string, p.retail_price_cents as number])
  );
  const titleMap = new Map(
    products.map((p) => [p.id as string, p.title as string])
  );

  const subtotalCents = body.items.reduce(
    (sum, item) => sum + priceMap.get(item.productId)! * item.quantity,
    0
  );
  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
  const totalCents = subtotalCents + shippingCents;

  // -----------------------------------------------------------------------
  // 3. Insert pending order (status='pending') + order_items.
  //    Service role bypasses RLS so we can INSERT regardless of caller auth.
  // -----------------------------------------------------------------------
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: null, // guest checkout for now; auth-bound later
      email: body.email,
      status: "pending",
      subtotal_cents: subtotalCents,
      shipping_cents: shippingCents,
      total_cents: totalCents,
      shipping_address: body.shippingAddress as unknown,
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    console.error("/api/checkout: order insert failed", orderErr);
    return jsonError("Could not create order.", 500);
  }

  const orderItems = body.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    // Snapshot the title from the DB so historical orders survive even if
    // a product is later renamed or deleted.
    product_title: titleMap.get(item.productId) ?? item.title,
    unit_price_cents: priceMap.get(item.productId)!,
    quantity: item.quantity,
  }));

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsErr) {
    console.error("/api/checkout: order_items insert failed", itemsErr);
    // Best-effort cleanup: cancel the orphan order so it doesn't sit as a
    // stale pending row forever.
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);
    return jsonError("Could not create order items.", 500);
  }

  // -----------------------------------------------------------------------
  // 4. Create the Stripe Checkout Session.
  //    Prices here come from `priceMap` (the DB) — not the client body.
  // -----------------------------------------------------------------------
  const origin = siteUrl(request);
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.email,
      line_items: body.items.map((item) => {
        const price = priceMap.get(item.productId)!;
        const title = titleMap.get(item.productId) ?? item.title;
        // Only attach product images if they're absolute http(s) URLs —
        // Stripe rejects relative paths or data URIs.
        const image = item.image?.startsWith("http")
          ? [item.image]
          : undefined;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              ...(image ? { images: image } : {}),
            },
            unit_amount: price,
          },
          quantity: item.quantity,
        };
      }),
      // success_url: where Stripe sends the buyer after a successful payment.
      // We pass our order_id alongside Stripe's session_id so the success
      // page can show order details without an extra lookup.
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${origin}/checkout/cancel?order_id=${order.id}`,
      // metadata.order_id is the join key the webhook uses to flip status.
      metadata: { order_id: order.id },
    });
  } catch (err) {
    console.error("/api/checkout: stripe session failed", err);
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);
    const message = err instanceof Error ? err.message : "Stripe error";
    return jsonError(`Could not start checkout: ${message}`, 500);
  }

  if (!session.url) {
    console.error("/api/checkout: stripe session has no url", session.id);
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);
    return jsonError("Stripe did not return a checkout URL.", 500);
  }

  // -----------------------------------------------------------------------
  // 5. Persist stripe_session_id so the webhook can correlate.
  // -----------------------------------------------------------------------
  const { error: sessionIdErr } = await supabase
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id);

  if (sessionIdErr) {
    // Not fatal — the webhook matches on metadata.order_id — but log it.
    console.warn(
      "/api/checkout: failed to save stripe_session_id",
      sessionIdErr
    );
  }

  // -----------------------------------------------------------------------
  // 6. Respond.
  // -----------------------------------------------------------------------
  const successBody: CheckoutSuccess = { url: session.url, orderId: order.id };
  return Response.json(successBody);
}