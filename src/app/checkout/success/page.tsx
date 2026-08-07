// ============================================================================
// src/app/checkout/success/page.tsx
//
// "Thanks for your order" page. Stripe redirects the buyer here with
//   ?session_id=cs_xxx&order_id=<uuid>
// in the URL (see /api/checkout's success_url). We look up the order via the
// admin client and render a confirmation summary.
//
// Notes:
// - `searchParams` is a Promise in Next.js 16 — must be awaited.
// - We use the admin (service_role) client because the buyer is most likely
//   a guest without an auth session, and the regular client would be denied
//   by RLS.
// - We don't gate on `session_id` being valid — Stripe always sends one,
//   but the DB lookup is the source of truth.
// ============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/Button";
import { formatPriceCents } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order placed",
};

// DB shape we expect back from orders. Matches supabase/schema.sql.
interface OrderRow {
  id: string;
  email: string;
  status: string;
  subtotal_cents: number | null;
  shipping_cents: number;
  total_cents: number | null;
  created_at: string;
}

interface PageProps {
  // Next.js 16: searchParams is a Promise on the server.
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = typeof params.order_id === "string" ? params.order_id : null;

  let order: OrderRow | null = null;
  let orderItems: { product_title: string; quantity: number; unit_price_cents: number }[] = [];

  if (orderId) {
    try {
      const supabase = createAdminClient();
      const [{ data: orderData}, { data: itemsData }] = await Promise.all([
        supabase
          .from("orders")
          .select(
            "id, email, status, subtotal_cents, shipping_cents, total_cents, created_at"
          )
          .eq("id", orderId)
          .maybeSingle<OrderRow>(),
        supabase
          .from("order_items")
          .select("product_title, quantity, unit_price_cents")
          .eq("order_id", orderId),
      ]);
      order = orderData ?? null;
      orderItems = (itemsData ?? []) as typeof orderItems;
    } catch (err) {
      // Don't crash the page on a DB blip — fall through to the generic
      // confirmation below.
      console.error("/checkout/success: order fetch failed", err);
    }
  }

  // Short order number for display: last 8 chars of the uuid, uppercased.
  const orderNumber = order?.id
    ? order.id.slice(-8).toUpperCase()
    : orderId
    ? orderId.slice(-8).toUpperCase()
    : null;

  return (
    <div className="container-x py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-3xl font-bold text-fg sm:text-4xl">
            Order placed!
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Thanks for your purchase — we&apos;ve emailed a receipt to{" "}
            <span className="font-medium text-fg">
              {order?.email ?? "your email"}
            </span>
            .
          </p>
        </div>

        {order && (
          <section className="mt-10 rounded-lg border border-border bg-bg p-6">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">
                  Order number
                </p>
                <p className="font-mono text-base font-bold text-fg">
                  {orderNumber}
                </p>
              </div>
              <span
                className={
                  "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide " +
                  (order.status === "paid"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning")
                }
              >
                {order.status}
              </span>
            </header>

            {orderItems.length > 0 && (
              <ul className="divide-y divide-border border-y border-border">
                {orderItems.map((it, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="line-clamp-1 pr-4 text-fg">
                      {it.product_title}{" "}
                      <span className="text-text-muted">× {it.quantity}</span>
                    </span>
                    <span className="font-medium text-fg">
                      {formatPriceCents(
                        it.unit_price_cents * it.quantity
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <dl className="mt-4 space-y-2 text-sm">
              <Row
                label="Subtotal"
                value={formatPriceCents(order.subtotal_cents ?? 0)}
              />
              <Row
                label="Shipping"
                value={
                  order.shipping_cents === 0
                    ? "Free"
                    : formatPriceCents(order.shipping_cents)
                }
              />
              <div className="border-t border-border pt-3" />
              <Row
                label="Total"
                value={formatPriceCents(order.total_cents ?? 0)}
                bold
              />
            </dl>
          </section>
        )}

        {/* If the order lookup failed we still show actionable links so the
            buyer isn't stranded on a dead-end page. */}
        {!order && (
          <p className="mt-8 rounded-md border border-dashed border-border bg-surface/40 px-4 py-6 text-center text-sm text-text-muted">
            We couldn&apos;t load your order details right now. Please check
            your email for a confirmation, or visit your orders page.
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-center">
          {order && (
            <Link href={`/account/orders/${order.id}`}>
              <Button variant="outline" size="md">
                View order
              </Button>
            </Link>
          )}
          <Link href="/">
            <Button variant="primary" size="md">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-text-muted">{label}</dt>
      <dd
        className={
          bold
            ? "text-lg font-bold text-fg"
            : "font-medium text-fg"
        }
      >
        {value}
      </dd>
    </div>
  );
}