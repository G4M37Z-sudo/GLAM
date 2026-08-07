// ============================================================================
// src/app/api/stripe-webhook/route.ts
// POST /api/stripe-webhook
//
// Receives Stripe events. On `checkout.session.completed` we look up the
// associated order (via the order_id we put in session.metadata when we
// created the session) and mark it 'paid' using the service_role client.
//
// IMPORTANT: Stripe signature verification needs the EXACT raw request body
// bytes, not a re-serialised JSON object. We read the body via
// `await request.text()` and pass the string straight to
// `stripe.webhooks.constructEvent`.
// ============================================================================

import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Node runtime — Stripe's webhook signature verification needs the Node
// crypto module, and we already need Node in /api/checkout so the project
// is set up for it.
export const runtime = "nodejs";
// Webhooks are inherently per-request; never cache.
export const dynamic = "force-dynamic";

interface AckResponse {
  received: true;
}

interface ErrResponse {
  error: string;
}

/**
 * Stripe's `constructEvent` throws if the signature doesn't match or the
 * body can't be parsed. We surface that as a 400 — Stripe will retry the
 * event automatically up to its configured retry budget, which is exactly
 * what we want for a transient bad-signature case.
 */
export async function POST(request: Request): Promise<Response> {
  // -----------------------------------------------------------------------
  // 1. Read raw body + signature header.
  //    Must come from the original request bytes; `request.text()` is the
  //    correct way to get them in Next.js Route Handlers.
  // -----------------------------------------------------------------------
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return Response.json(
      { error: "Missing stripe-signature header." } satisfies ErrResponse,
      { status: 400 }
    );
  }
  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not set — cannot verify webhook events."
    );
    return Response.json(
      { error: "Webhook secret not configured." } satisfies ErrResponse,
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  // -----------------------------------------------------------------------
  // 2. Verify the signature. Throws on failure → we surface 400.
  // -----------------------------------------------------------------------
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.warn("/api/stripe-webhook: signature verification failed", message);
    return Response.json(
      { error: `Webhook signature verification failed: ${message}` } satisfies ErrResponse,
      { status: 400 }
    );
  }

  // -----------------------------------------------------------------------
  // 3. Handle the events we care about.
  //    We intentionally acknowledge other event types with `{received:true}`
  //    so Stripe doesn't keep retrying unrelated events.
  // -----------------------------------------------------------------------
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error(
        "/api/stripe-webhook: checkout.session.completed has no order_id metadata",
        session.id
      );
      // Return 200 so Stripe doesn't retry — we can't recover from a
      // missing order_id without manual intervention.
      return Response.json({ received: true } satisfies AckResponse);
    }

    const supabase = createAdminClient();
    const { error: updateErr, data: updated } = await supabase
      .from("orders")
      .update({
        status: "paid",
        stripe_session_id: session.id,
      })
      .eq("id", orderId)
      .select("id");

    if (updateErr) {
      console.error(
        "/api/stripe-webhook: failed to mark order paid",
        orderId,
        updateErr
      );
      // Return 500 so Stripe retries — this is a transient DB failure.
      return Response.json(
        { error: "Database update failed." } satisfies ErrResponse,
        { status: 500 }
      );
    }

    if (!updated || updated.length === 0) {
      console.warn(
        "/api/stripe-webhook: no order matched order_id",
        orderId,
        "— order may have been created out-of-band."
      );
    } else {
      console.log(
        `/api/stripe-webhook: order ${orderId} marked paid (session ${session.id})`
      );
    }
  } else {
    // Unhandled events are still a successful delivery from our side.
    console.log(`/api/stripe-webhook: ignoring event type ${event.type}`);
  }

  return Response.json({ received: true } satisfies AckResponse);
}