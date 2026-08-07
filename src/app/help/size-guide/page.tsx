// ============================================================================
// src/app/help/size-guide/page.tsx
//
// Generic size table for general merchandise. Marketplace-grade, not fashion.
// Static Server Component.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Size Guide",
  description:
    "A general merchandise size guide — how to measure, and how to compare against the dimensions listed on each product page.",
};

export default function SizeGuidePage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">Size Guide</h1>
      <p className="mt-2 text-sm text-text-muted">
        How to measure, and how to compare against the dimensions listed on
        each product page.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          Because we host a wide range of general merchandise — from home goods
          to electronics to accessories — we don't use a single sizing chart.
          Instead, each product page lists its own key dimensions in the
          product detail tab. The table below is a generic reference you can
          use as a starting point for the most common categories.
        </p>
        <p>
          When in doubt, measure what you already own that you like the fit
          of, and compare against the dimensions on the product page.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        How to measure
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          A soft tape measure gives the most accurate results. Keep it
          parallel to the ground for length measurements, snug (not tight)
          against the body for body measurements, and don't pull — let it
          rest where it naturally sits.
        </p>
        <ul className="ml-6 list-disc space-y-2 text-base text-fg">
          <li>
            <span className="font-semibold text-fg">Length.</span> Top to
            bottom, on a flat surface. For clothing, measure along the seam
            from the highest point of the shoulder to the hem.
          </li>
          <li>
            <span className="font-semibold text-fg">Width.</span> Edge to
            edge at the widest point. For clothing, lay the item flat and
            measure from one underarm seam to the other.
          </li>
          <li>
            <span className="font-semibold text-fg">Height.</span> For
            standing items (lamps, shelving, appliances), measure from the
            floor to the highest point of the item.
          </li>
          <li>
            <span className="font-semibold text-fg">Diameter.</span> Across
            the widest circular point.
          </li>
          <li>
            <span className="font-semibold text-fg">Weight capacity.</span>{" "}
            For bags, chairs, and storage items, always check the listed
            maximum — overloading is the most common cause of damage and
            voids the return policy.
          </li>
        </ul>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        General merchandise reference table
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-bg">
        <table className="w-full text-left text-sm text-fg">
          <thead className="bg-surface text-fg">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Category
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Small
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Medium
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Large
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Extra-large
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 font-medium text-fg">
                Tote / shoulder bag
              </td>
              <td className="px-4 py-3">30 × 24 × 10 cm</td>
              <td className="px-4 py-3">36 × 30 × 12 cm</td>
              <td className="px-4 py-3">42 × 36 × 14 cm</td>
              <td className="px-4 py-3">50 × 42 × 18 cm</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">Backpack</td>
              <td className="px-4 py-3">15 L</td>
              <td className="px-4 py-3">22 L</td>
              <td className="px-4 py-3">30 L</td>
              <td className="px-4 py-3">40+ L</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">
                Throw blanket
              </td>
              <td className="px-4 py-3">100 × 130 cm</td>
              <td className="px-4 py-3">130 × 170 cm</td>
              <td className="px-4 py-3">150 × 200 cm</td>
              <td className="px-4 py-3">180 × 220 cm</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">Bath towel</td>
              <td className="px-4 py-3">50 × 80 cm</td>
              <td className="px-4 py-3">70 × 130 cm</td>
              <td className="px-4 py-3">80 × 150 cm</td>
              <td className="px-4 py-3">100 × 180 cm</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">
                Desk lamp shade
              </td>
              <td className="px-4 py-3">Ø 18 cm</td>
              <td className="px-4 py-3">Ø 25 cm</td>
              <td className="px-4 py-3">Ø 32 cm</td>
              <td className="px-4 py-3">Ø 40 cm</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">
                Storage bin
              </td>
              <td className="px-4 py-3">20 × 15 × 12 cm</td>
              <td className="px-4 py-3">30 × 22 × 18 cm</td>
              <td className="px-4 py-3">45 × 32 × 25 cm</td>
              <td className="px-4 py-3">60 × 42 × 35 cm</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">
                Yoga / exercise mat
              </td>
              <td className="px-4 py-3">173 × 60 cm</td>
              <td className="px-4 py-3">183 × 65 cm</td>
              <td className="px-4 py-3">183 × 80 cm</td>
              <td className="px-4 py-3">200 × 90 cm</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-fg">
                Umbrella (canopy)
              </td>
              <td className="px-4 py-3">Ø 90 cm</td>
              <td className="px-4 py-3">Ø 105 cm</td>
              <td className="px-4 py-3">Ø 120 cm</td>
              <td className="px-4 py-3">Ø 135 cm</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Dimensions are approximate. Always cross-check with the specific
        measurements listed on the product page before ordering.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Apparel &amp; footwear
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Fashion items vary widely between brands, so we publish a per-item
          measurement table on every apparel listing. Open the "Size &amp;
          fit" tab on the product page to compare your measurements against
          the item. If you're between sizes, we generally recommend sizing up
          for relaxed-fit styles and sticking to your usual size for
          tailored-fit styles.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">
        Still unsure?
      </h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Send your measurements and a link to the product you're considering
          to{" "}
          <a
            href="mailto:help@market.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            help@market.example
          </a>{" "}
          and a member of our team will recommend the best size for you.
        </p>
      </div>

      <p className="mt-10 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}