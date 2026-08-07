// ============================================================================
// src/app/help/shipping/page.tsx
//
// Shipping options, delivery times, costs. Static Server Component.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shipping & Delivery",
  description:
    "Shipping options, delivery times, costs, and tracking for MARKET orders.",
};

export default function ShippingPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        Shipping &amp; Delivery
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Options, delivery windows, costs, and how to track your order.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          We ship to 60+ countries from a mix of domestic and regional
          warehouses. Rates and delivery windows shown at checkout are tailored
          to your address and the items in your cart — the table below gives
          a general overview of the options you'll see most often.
        </p>
        <p>
          All orders include end-to-end tracking and a carbon-impact estimate
          at checkout.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Shipping options</h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-bg">
        <table className="w-full text-left text-sm text-fg">
          <thead className="bg-surface text-fg">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Option
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Delivery window
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Cost
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 font-medium text-fg">Standard</td>
              <td className="px-4 py-3">5–8 business days</td>
              <td className="px-4 py-3">Free over $50, otherwise $4.99</td>
              <td className="px-4 py-3 text-text-muted">
                Default option. Tracked.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">Expedited</td>
              <td className="px-4 py-3">2–4 business days</td>
              <td className="px-4 py-3">$9.99 flat</td>
              <td className="px-4 py-3 text-text-muted">
                Available in domestic network.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">Express</td>
              <td className="px-4 py-3">1–2 business days</td>
              <td className="px-4 py-3">$19.99 flat</td>
              <td className="px-4 py-3 text-text-muted">
                Order by 1 PM local for next-day.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">International</td>
              <td className="px-4 py-3">7–14 business days</td>
              <td className="px-4 py-3">From $12.99</td>
              <td className="px-4 py-3 text-text-muted">
                Duties and taxes shown at checkout for most destinations.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">Free pickup</td>
              <td className="px-4 py-3">Ready in 2 hours</td>
              <td className="px-4 py-3">Free</td>
              <td className="px-4 py-3 text-text-muted">
                Available at partner pickup points in select cities.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        When we ship
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Orders placed before 1 PM local time on a business day typically
          start the fulfillment process the same day. Orders placed after
          that cutoff, or on weekends and holidays, begin processing on the
          next business day.
        </p>
        <p>
          You'll receive an order confirmation email immediately, and a
          shipping confirmation with a tracking link as soon as the carrier
          scans your package.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Tracking
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Every order includes tracking. You can find the latest status from
          your account → Orders, or by following the link in your shipping
          confirmation email. Tracking events typically appear within 12 hours
          of the carrier receiving the package.
        </p>
        <p>
          If your tracking hasn't updated in more than 72 hours, please reach
          out via the{" "}
          <a
            href="/contact"
            className="text-accent underline-offset-2 hover:underline"
          >
            contact page
          </a>{" "}
          and we'll work with the carrier to locate the package.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        International orders
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          For most destinations, duties and taxes are calculated at checkout
          so there are no surprise fees on delivery. A few destinations
          require payment on arrival; we'll flag this clearly before you
          complete checkout.
        </p>
        <p>
          We can't mark international orders as "gift" or under-declare value
          — both are illegal in most jurisdictions and against our shipping
          policy.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Lost or damaged
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          If your order arrives damaged or doesn't arrive at all, we'll make
          it right. Start a claim from your account → Orders, or email
          support within 14 days of the expected delivery date and we'll send
          a replacement or issue a full refund.
        </p>
      </div>

      <p className="mt-10 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}