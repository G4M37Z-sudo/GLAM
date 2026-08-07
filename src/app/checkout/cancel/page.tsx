// ============================================================================
// src/app/checkout/cancel/page.tsx
//
// Stripe redirects the buyer here when they hit "Back" or close the Stripe
// Checkout window mid-flow. We don't cancel anything on the server — the
// pending order is left as-is (it'll age out / be cleaned up by a future
// cron) — we just reassure the buyer and send them back to the cart.
// ============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Checkout cancelled",
};

export default function CheckoutCancelPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-surface text-text-muted">
          <XCircle size={36} />
        </div>
        <h1 className="text-3xl font-bold text-fg sm:text-4xl">
          Checkout cancelled
        </h1>
        <p className="mt-3 text-base text-text-muted">
          No charge was made. Your cart is still waiting for you whenever
          you&apos;re ready to come back.
        </p>

        <div className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="outline" size="md">
              Continue shopping
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="primary" size="md">
              Back to cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}