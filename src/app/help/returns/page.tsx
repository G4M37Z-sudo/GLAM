// ============================================================================
// src/app/help/returns/page.tsx
//
// Return policy. Static Server Component.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Returns & Refunds",
  description:
    "How to start a return, what's eligible, and when refunds hit your account.",
};

export default function ReturnsPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        Returns &amp; Refunds
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        How to start a return, what's eligible, and when refunds land.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          We want you to be happy with every order. If something isn't right,
          you can return most items within 30 days of delivery for a full
          refund — no restocking fee, no fine print. This page walks you
          through the process.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        What's eligible
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Most items in their original, unworn / unused condition with all
          original packaging and tags attached are returnable within 30 days
          of delivery. The following categories are not eligible for return
          unless the item arrived damaged or defective:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>Final-sale items (flagged on the product page).</li>
          <li>
            Personalized, monogrammed, or otherwise custom-made items.
          </li>
          <li>
            Undergarments, swimwear, and other hygiene-sensitive apparel
            categories.
          </li>
          <li>
            Perishable goods, including beauty and personal-care items with a
            broken seal.
          </li>
          <li>Digital downloads and gift cards.</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        How to start a return
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <ol className="ml-6 list-decimal space-y-2 text-base text-fg">
          <li>
            Sign in and go to{" "}
            <span className="font-semibold text-fg">Account → Orders</span>.
          </li>
          <li>
            Select the order that contains the item(s) you want to return.
          </li>
          <li>
            Choose the item(s) and a reason — the reason helps us improve
            product descriptions and quality.
          </li>
          <li>
            Print the prepaid return label we email you (domestic orders
            only). For international orders, the label fee is deducted from
            your refund.
          </li>
          <li>
            Drop the package at any carrier location within 14 days of
            starting the return.
          </li>
        </ol>
        <p>
          If you checked out as a guest, email{" "}
          <a
            href="mailto:returns@glam.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            returns@glam.example
          </a>{" "}
          with your order number and we'll get you set up.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Refund timing
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Once your return is scanned by the carrier, here's what to expect:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>
            <span className="font-semibold text-fg">1–3 business days:</span>{" "}
            package arrives at the warehouse.
          </li>
          <li>
            <span className="font-semibold text-fg">2–4 business days:</span>{" "}
            inspection and refund approved.
          </li>
          <li>
            <span className="font-semibold text-fg">5–10 business days:</span>{" "}
            refund appears on your original payment method. Banks and card
            issuers vary — if you don't see it after 10 days, check with your
            bank before reaching out.
          </li>
        </ul>
        <p>
          You'll get an email at every step: return received, refund approved,
          and refund issued.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Exchanges</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          The fastest way to exchange is to start a return for the item you
          have and place a new order for the size or color you want. We don't
          charge additional shipping on the replacement order within the US.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Damaged or defective items
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          If your order arrives damaged or defective, please email a photo to{" "}
          <a
            href="mailto:returns@glam.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            returns@glam.example
          </a>{" "}
          within 14 days of delivery. We'll send a free return label and ship
          a replacement as soon as possible, or issue a full refund if the
          item is out of stock.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Wholesale orders</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Wholesale / B2B orders follow the return terms spelled out in the
          quote or master agreement. Reach out to your account manager or
          email{" "}
          <a
            href="mailto:wholesale@glam.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            wholesale@glam.example
          </a>{" "}
          to start a wholesale return.
        </p>
      </div>

      <p className="mt-10 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}