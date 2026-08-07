// src/app/account/orders/[id]/page.tsx
// Single order detail page. Reads order via admin client, lists line items.
//
// Async Server Component. v16: params is a Promise — must await.

import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  email: string;
  status: string;
  subtotal_cents: number | null;
  shipping_cents: number;
  total_cents: number | null;
  shipping_address: Record<string, unknown> | null;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  product_id: string | null;
  product_title: string;
  unit_price_cents: number;
  quantity: number;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: OrderRow | null = null;
  let items: OrderItemRow[] = [];

  try {
    const supabase = createAdminClient();

    const [{ data: orderData, error: orderErr }, { data: itemsData, error: itemsErr }] =
      await Promise.all([
        supabase
          .from("orders")
          .select(
            "id, email, status, subtotal_cents, shipping_cents, total_cents, shipping_address, created_at"
          )
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("order_items")
          .select("id, product_id, product_title, unit_price_cents, quantity")
          .eq("order_id", id),
      ]);

    if (orderErr) {
      console.error("OrderDetailPage order fetch:", orderErr.message);
    } else {
      order = (orderData as OrderRow | null) ?? null;
    }
    if (itemsErr) {
      console.error("OrderDetailPage items fetch:", itemsErr.message);
    } else {
      items = (itemsData ?? []) as OrderItemRow[];
    }
  } catch (err) {
    console.error("OrderDetailPage data fetch failed:", err);
  }

  if (!order) notFound();

  const addr = (order.shipping_address ?? {}) as {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };

  return (
    <main className="container-x py-10 sm:py-14">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        ← Back to orders
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-fg sm:text-3xl">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-text-muted">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            order.status === "paid"
              ? "bg-green-100 text-green-700"
              : order.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Line items */}
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-fg">
            Items
          </h2>
          <ul className="divide-y divide-border rounded-lg border border-border bg-bg">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-fg">
                    {it.product_title}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatPriceCents(it.unit_price_cents)} × {it.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-fg">
                  {formatPriceCents(it.unit_price_cents * it.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Summary */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-bg p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-fg">
              Summary
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Subtotal</dt>
                <dd>{formatPriceCents(order.subtotal_cents ?? 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Shipping</dt>
                <dd>
                  {order.shipping_cents === 0
                    ? "Free"
                    : formatPriceCents(order.shipping_cents)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                <dt>Total</dt>
                <dd>{formatPriceCents(order.total_cents ?? 0)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-bg p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-fg">
              Ship to
            </h2>
            <address className="text-sm not-italic text-text-muted">
              {addr.name && <p className="font-medium text-fg">{addr.name}</p>}
              {addr.line1 && <p>{addr.line1}</p>}
              {addr.line2 && <p>{addr.line2}</p>}
              {(addr.city || addr.state || addr.postal_code) && (
                <p>
                  {[addr.city, addr.state, addr.postal_code]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {addr.country && <p>{addr.country}</p>}
            </address>
          </div>

          <div className="rounded-lg border border-border bg-bg p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-fg">
              Contact
            </h2>
            <p className="text-sm text-text-muted">{order.email}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
