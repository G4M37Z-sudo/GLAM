"use client";

/**
 * Client island for the cart page. Reads from the Zustand cart store (which
 * is hydrated from localStorage), handles the small checkout form (email +
 * shipping address), POSTs to /api/checkout, and redirects the browser to
 * the returned Stripe URL.
 *
 * The Server Component shell (`src/app/cart/page.tsx`) renders this with
 * the Shein-style layout; the heavy lifting is here because it needs
 * `useState` / `useEffect` / `useRouter`.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingBag, Loader2 } from "lucide-react";

import { useCartStore, type CartItem } from "@/lib/cart-store";
import { Button } from "@/components/Button";
import { cn, formatPriceCents } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Pricing constants — kept in sync with /api/checkout.
// ---------------------------------------------------------------------------
const FREE_SHIPPING_THRESHOLD_CENTS = 5000; // free over $50
const SHIPPING_FLAT_CENTS = 999; // $9.99 otherwise

// Form state for the checkout details modal. We keep this local to the
// component; nothing here is server-side until POST.
interface CheckoutForm {
  email: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const EMPTY_FORM: CheckoutForm = {
  email: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "US",
};

export function CartClient() {
  const router = useRouter();

  // Zustand selectors — keep each subscription narrow so unrelated state
  // changes don't re-render this whole tree.
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  // Cart store reads localStorage, which doesn't exist on the server. The
  // store has its own hydration but we still want to render a stable shell
  // on the first paint. `hydrated` flips true after mount.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Compute totals on the client (could be done in the store but the cart
  // page is the only consumer that needs shipping, so keep it local).
  const { subtotalCents, shippingCents, totalCents } = useMemo(() => {
    const sub = items.reduce(
      (sum, i) => sum + i.unitPriceCents * i.quantity,
      0
    );
    const ship = sub >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
    return {
      subtotalCents: sub,
      shippingCents: ship,
      totalCents: sub + ship,
    };
  }, [items]);

  // -------------------------------------------------------------------------
  // Checkout form state
  // -------------------------------------------------------------------------
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submitCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (
      !form.name ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.postal_code
    ) {
      setError("Please complete all required address fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            image: i.image,
            unitPriceCents: i.unitPriceCents,
            quantity: i.quantity,
          })),
          email: form.email,
          shippingAddress: {
            name: form.name,
            line1: form.line1,
            line2: form.line2 || undefined,
            city: form.city,
            state: form.state,
            postal_code: form.postal_code,
            country: form.country,
          },
        }),
      });

      const data = (await res.json()) as
        | { url: string; orderId: string }
        | { error: string };

      if (!res.ok || !("url" in data)) {
        setError(("error" in data && data.error) || "Checkout failed.");
        return;
      }

      // Wipe the cart and bounce to Stripe. The webhook will mark the
      // order 'paid' after the customer pays.
      clear();
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Network error. Please retry."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------------
  // Render: empty state
  // -------------------------------------------------------------------------
  if (hydrated && items.length === 0) {
    return (
      <div className="container-x py-12 sm:py-16">
        <h1 className="mb-8 text-3xl font-bold text-fg sm:text-4xl">Your Cart</h1>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/40 px-6 py-20 text-center">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-surface">
            <ShoppingBag size={28} className="text-text-muted" />
          </div>
          <p className="text-base text-text-muted">
            Your cart is empty — start shopping
          </p>
          <Link href="/" className="mt-6">
            <Button variant="primary" size="md">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: line items + summary
  // -------------------------------------------------------------------------
  return (
    <div className="container-x py-8 sm:py-12">
      <h1 className="mb-6 text-3xl font-bold text-fg sm:text-4xl">Your Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Line items */}
        <ul className="divide-y divide-border rounded-lg border border-border bg-bg lg:col-span-2">
          {!hydrated ? (
            // Skeleton-ish placeholder while we wait for hydration.
            <li className="px-5 py-10 text-center text-sm text-text-muted">
              Loading cart…
            </li>
          ) : (
            items.map((item) => (
              <CartLine
                key={item.productId}
                item={item}
                onDecrease={() => updateQty(item.productId, item.quantity - 1)}
                onIncrease={() => updateQty(item.productId, item.quantity + 1)}
                onRemove={() => removeItem(item.productId)}
              />
            ))
          )}
        </ul>

        {/* Summary — sticky on desktop */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-bg p-5">
            <h2 className="mb-4 text-lg font-bold text-fg">Order Summary</h2>

            <SummaryRow
              label="Subtotal"
              value={formatPriceCents(subtotalCents)}
            />
            <SummaryRow
              label={
                shippingCents === 0
                  ? "Shipping (free over $50)"
                  : "Shipping"
              }
              value={
                shippingCents === 0 ? "Free" : formatPriceCents(shippingCents)
              }
              valueClass={shippingCents === 0 ? "text-success" : undefined}
            />

            <div className="my-4 border-t border-border" />

            <SummaryRow
              label="Total"
              value={formatPriceCents(totalCents)}
              labelClass="text-base font-bold text-fg"
              valueClass="text-lg font-bold text-fg"
            />

            <p className="mt-2 text-xs text-text-muted">
              Taxes calculated at checkout.
            </p>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mt-5"
              disabled={!hydrated || items.length === 0 || submitting}
              onClick={() => setShowForm(true)}
            >
              Proceed to Checkout
            </Button>

            <Link
              href="/"
              className="mt-3 block text-center text-sm font-medium text-text-muted hover:text-fg"
            >
              or continue shopping
            </Link>
          </div>
        </aside>
      </div>

      {/* Checkout details modal — kept inline rather than portal'd because
          the layout is simple enough that an absolute overlay is fine. */}
      {showForm && (
        <CheckoutFormModal
          form={form}
          setField={setField}
          submitting={submitting}
          error={error}
          onCancel={() => {
            if (!submitting) setShowForm(false);
          }}
          onSubmit={submitCheckout}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function CartLine({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  const lineTotal = item.unitPriceCents * item.quantity;
  return (
    <li className="flex gap-4 px-5 py-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.title}
        className="h-24 w-24 shrink-0 rounded-md object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${item.slug}`}
            className="line-clamp-2 text-sm font-medium text-fg hover:text-accent"
          >
            {item.title}
          </Link>
          <button
            type="button"
            aria-label={`Remove ${item.title}`}
            onClick={onRemove}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-muted hover:bg-surface hover:text-accent"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-fg">
            {formatPriceCents(item.unitPriceCents)}
          </span>
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={onDecrease}
              className="grid h-8 w-8 place-items-center text-fg hover:bg-surface"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={onIncrease}
              className="grid h-8 w-8 place-items-center text-fg hover:bg-surface"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-sm font-bold text-fg">
            {formatPriceCents(lineTotal)}
          </span>
        </div>
      </div>
    </li>
  );
}

function SummaryRow({
  label,
  value,
  labelClass,
  valueClass,
}: {
  label: string;
  value: string;
  labelClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between text-sm">
      <span className={cn("text-text-muted", labelClass)}>{label}</span>
      <span className={cn("font-medium text-fg", valueClass)}>{value}</span>
    </div>
  );
}

function CheckoutFormModal({
  form,
  setField,
  submitting,
  error,
  onCancel,
  onSubmit,
}: {
  form: CheckoutForm;
  setField: <K extends keyof CheckoutForm>(
    key: K,
    value: CheckoutForm[K]
  ) => void;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  // Lock body scroll while modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const inputClass =
    "h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
  const labelClass = "mb-1 block text-xs font-medium text-fg";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Checkout details"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-bg shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-fg">Checkout details</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onCancel}
            disabled={submitting}
            className="grid h-9 w-9 place-items-center rounded-md text-fg hover:bg-surface disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="max-h-[80vh] overflow-y-auto p-5">
          {error && (
            <div className="mb-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
              {error}
            </div>
          )}

          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">
            Contact
          </h3>
          <label className={labelClass} htmlFor="ck-email">
            Email
          </label>
          <input
            id="ck-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            autoComplete="email"
          />

          <h3 className="mt-5 mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">
            Shipping address
          </h3>
          <label className={labelClass} htmlFor="ck-name">
            Full name
          </label>
          <input
            id="ck-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={inputClass}
            autoComplete="name"
          />

          <label className={cn(labelClass, "mt-3")} htmlFor="ck-line1">
            Address line 1
          </label>
          <input
            id="ck-line1"
            type="text"
            required
            value={form.line1}
            onChange={(e) => setField("line1", e.target.value)}
            className={inputClass}
            autoComplete="address-line1"
          />

          <label className={cn(labelClass, "mt-3")} htmlFor="ck-line2">
            Address line 2 <span className="text-text-muted">(optional)</span>
          </label>
          <input
            id="ck-line2"
            type="text"
            value={form.line2}
            onChange={(e) => setField("line2", e.target.value)}
            className={inputClass}
            autoComplete="address-line2"
          />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="ck-city">
                City
              </label>
              <input
                id="ck-city"
                type="text"
                required
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className={inputClass}
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="ck-state">
                State / Region
              </label>
              <input
                id="ck-state"
                type="text"
                required
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
                className={inputClass}
                autoComplete="address-level1"
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="ck-postal">
                Postal code
              </label>
              <input
                id="ck-postal"
                type="text"
                required
                value={form.postal_code}
                onChange={(e) => setField("postal_code", e.target.value)}
                className={inputClass}
                autoComplete="postal-code"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="ck-country">
                Country
              </label>
              <input
                id="ck-country"
                type="text"
                required
                value={form.country}
                onChange={(e) => setField("country", e.target.value.toUpperCase())}
                className={inputClass}
                autoComplete="country"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="min-w-[160px]"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting…
                </>
              ) : (
                "Continue to payment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}