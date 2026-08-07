// src/app/account/page.tsx
// Account dashboard — for v1, lists the user's most recent paid orders.
// Auth is not yet wired up (Supabase magic link is a follow-up), so for
// now the page reads orders by a `?email=` query param. When auth lands,
// swap to `auth.uid()` lookup.
//
// Async Server Component. v16: searchParams is a Promise — must await.

import Link from "next/link";
import { Package } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  email: string;
  status: string;
  total_cents: number | null;
  created_at: string;
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const normalized = email?.trim().toLowerCase();

  let orders: OrderRow[] = [];
  if (normalized && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("orders")
        .select("id, email, status, total_cents, created_at")
        .eq("email", normalized)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) {
        console.error("AccountPage orders fetch:", error.message);
      } else {
        orders = (data ?? []) as OrderRow[];
      }
    } catch (err) {
      console.error("AccountPage data fetch failed:", err);
    }
  }

  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="mb-2 text-2xl font-bold text-fg sm:text-3xl">My Account</h1>
      <p className="mb-8 text-sm text-text-muted">
        Track your orders and view your purchase history.
      </p>

      {!normalized ? (
        <LookupForm />
      ) : orders.length === 0 ? (
        <EmptyState email={normalized} />
      ) : (
        <OrdersList orders={orders} />
      )}

      <div className="mt-10 rounded-lg border border-border bg-surface p-6 text-sm text-text-muted">
        <p>
          <strong className="text-fg">Note:</strong> Supabase magic-link auth
          will replace the email lookup once it&apos;s wired up. For now, paste
          the email you used at checkout.
        </p>
      </div>
    </main>
  );
}

function LookupForm() {
  return (
    <form
      action="/account"
      method="get"
      className="rounded-lg border border-border bg-bg p-6"
    >
      <label
        htmlFor="email"
        className="mb-2 block text-sm font-medium text-fg"
      >
        Find your orders
      </label>
      <p className="mb-4 text-sm text-text-muted">
        Enter the email address you used at checkout.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-10 flex-1 rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="h-10 rounded-md bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          View orders
        </button>
      </div>
    </form>
  );
}

function EmptyState({ email }: { email: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-bg">
        <Package size={24} className="text-text-muted" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-fg">No orders yet</h2>
      <p className="mb-6 text-sm text-text-muted">
        We couldn&apos;t find any orders for <strong>{email}</strong>.
      </p>
      <Link
        href="/"
        className="inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Start shopping
      </Link>
    </div>
  );
}

function OrdersList({ orders }: { orders: OrderRow[] }) {
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link
            href={`/account/orders/${o.id}`}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bg p-4 transition-colors hover:border-accent"
          >
            <div>
              <p className="font-mono text-xs text-text-muted">
                #{o.id.slice(0, 8)}
              </p>
              <p className="text-sm font-medium text-fg">
                {new Date(o.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  o.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : o.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {o.status}
              </span>
              <p className="mt-1 text-sm font-bold text-fg">
                {formatPriceCents(o.total_cents ?? 0)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
