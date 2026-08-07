// ============================================================================
// src/app/sustainability/page.tsx
//
// Sustainability — eco initiatives, ethical sourcing, ongoing commitments.
// Static Server Component; no data fetching.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sustainability",
  description:
    "Our environmental and ethical commitments — packaging, sourcing, carbon reporting, and what's next.",
};

export default function SustainabilityPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        Sustainability
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        What we're doing today, what's next, and where we're falling short.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          Commerce at our scale has a footprint — and we believe being honest
          about it is the only way to make it smaller. This page tracks what
          we're doing: what we've shipped, what we're testing, and where we
          still have work to do.
        </p>
        <p>
          We're not going to claim we're a climate-neutral company. What we
          will do is publish the initiatives we run, the partners we work
          with, and the progress we're making against the targets we've set.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Packaging &amp; waste
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          All outbound packaging is made from FSC-certified recycled paper or
          plant-based films. We eliminated plastic air pillows from our
          domestic fulfillment network in early 2025 and have rolled the same
          standard to international hubs over the past year. Damaged-item
          returns are routed to refurbishment partners rather than landfill
          whenever the category allows.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Ethical sourcing
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We vet every brand on the platform against a published supplier code
          of conduct covering labor conditions, material traceability, and
          restricted-substance lists. High-risk categories (apparel,
          electronics, beauty) are audited annually by an independent third
          party; lower-risk categories are covered by a self-attestation
          program that we re-verify every 24 months.
        </p>
        <p>
          Where we find issues, we work with the partner on a remediation
          plan. We won't host brands that refuse to engage with the process.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Carbon reporting
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We publish a yearly Scope 1, 2, and 3 emissions report covering our
          own operations and the estimated footprint of last-mile delivery for
          orders we fulfilled. The report also breaks down per-order carbon
          intensity by shipping lane and category.
        </p>
        <p>
          For every order, customers see the estimated carbon impact at
          checkout alongside the option to offset it through a verified
          reforestation partner.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">What's next</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Three initiatives we have on the roadmap for the coming year:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>
            Rolling out consolidated shipping on multi-item carts in our top
            ten metro areas — fewer boxes, fewer trips, lower per-order
            emissions.
          </li>
          <li>
            Expanding our refurbishment partner network into electronics and
            small appliances so returned items have a second life whenever
            possible.
          </li>
          <li>
            Publishing a product-level materials transparency label on every
            apparel listing — fiber origin, country of final assembly, and
            recycled content percentage.
          </li>
        </ul>
        <p>
          Questions or ideas? Reach out at{" "}
          <a
            href="mailto:sustainability@glam.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            sustainability@glam.example
          </a>
          .
        </p>
      </div>

      <p className="mt-10 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}