// ============================================================================
// src/app/press/page.tsx
//
// Press / media kit placeholder page.
// Static Server Component; no data fetching.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Press",
  description:
    "Press and media resources for GLAM — logos, brand guidelines, executive bios, and recent coverage.",
};

export default function PressPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">
        Press &amp; media
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Resources, recent coverage, and how to reach our communications team.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          Welcome — thanks for covering GLAM. This page collects the assets
          and information journalists, creators, and analysts need most often.
          If you can't find what you're looking for, drop our communications
          team a note and we'll get back to you within one business day.
        </p>
        <p>
          For product reviews, brand partnerships, or executive interviews,
          please email{" "}
          <a
            href="mailto:press@glam.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            press@glam.example
          </a>
          .
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Media kit</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          A downloadable media kit — including logos in light and dark
          variants, brand colors, typography, executive headshots, and a
          one-page company fact sheet — will be linked here.
        </p>
        <p className="text-text-muted">
          <em>
            Media kit download link will appear here once assets are published.
          </em>
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Recent coverage</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Selected press mentions and features will be listed below with
          publication, headline, and a link to the full piece.
        </p>
        <p className="text-text-muted">
          <em>
            Coverage list will appear here once articles are published.
          </em>
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Company facts</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          <span className="font-semibold text-fg">Founded:</span> 2024
          <br />
          <span className="font-semibold text-fg">Headquarters:</span> San
          Francisco, California
          <br />
          <span className="font-semibold text-fg">Category:</span> Online
          marketplace — apparel, home, electronics, beauty, sports
          <br />
          <span className="font-semibold text-fg">Customers served:</span>{" "}
          60+ countries
        </p>
        <p className="text-text-muted">
          For the latest numbers, please request a current fact sheet via{" "}
          <a
            href="mailto:press@glam.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            press@glam.example
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