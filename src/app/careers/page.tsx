// ============================================================================
// src/app/careers/page.tsx
//
// Careers page — open roles placeholder + how to apply.
// Static Server Component; no data fetching.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers",
  description:
    "Join the MARKET team. We're a small, fast-moving group building the storefront we always wanted to shop at.",
};

export default function CareersPage() {
  return (
    <main className="container-x py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">Careers</h1>
      <p className="mt-2 text-sm text-text-muted">
        We're a small, fast-moving team. Here's how to grow with us.
      </p>

      <div className="mt-6 space-y-4 text-base text-fg leading-relaxed">
        <p>
          MARKET is built by a team that treats commerce the way shoppers do —
          with healthy skepticism and a low tolerance for friction. We're
          looking for people who want to ship real improvements to a real
          storefront used by real customers every day.
        </p>
        <p>
          We hire across engineering, design, merchandising, customer
          experience, fulfillment, and brand partnerships. Most of our team
          works hybrid out of our San Francisco headquarters; some roles are
          fully remote within the US and EU.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">Open roles</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          We're growing — check back soon for the full list of open positions.
          In the meantime, we welcome general-interest applications from people
          who'd be a great fit even if a specific role isn't posted yet.
        </p>
        <p className="text-text-muted">
          <em>
            Listing of open roles will appear here once recruiting is live.
          </em>
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">How we hire</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Our hiring process is short — typically three to four steps over
          about two weeks:
        </p>
        <ol className="ml-6 list-decimal space-y-2 text-base text-fg">
          <li>
            <span className="font-semibold text-fg">Intro call.</span> A
            30-minute conversation with the hiring manager to align on scope,
            comp, and timing.
          </li>
          <li>
            <span className="font-semibold text-fg">Take-home or pairing.</span>{" "}
            For most roles we offer a short, paid take-home exercise relevant
            to the work you'll do. Engineering roles can opt for a live
            pairing session instead.
          </li>
          <li>
            <span className="font-semibold text-fg">On-site (virtual).</span>{" "}
            Three to four hours with cross-functional partners — a chance to
            meet the team and dig into past work.
          </li>
          <li>
            <span className="font-semibold text-fg">Decision.</span> We aim to
            move from final round to offer within 48 hours.
          </li>
        </ol>
        <p>
          We aim to move quickly, keep interviews focused on the work, and
          always give you a chance to ask the hiring manager anything.
        </p>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3 text-fg">How to apply</h2>
      <div className="space-y-4 text-base text-fg leading-relaxed">
        <p>
          Send a short note and your resume to{" "}
          <a
            href="mailto:careers@market.example"
            className="text-accent underline-offset-2 hover:underline"
          >
            careers@market.example
          </a>
          . Tell us which role you're applying for, what drew you to it, and
          one piece of work you're proud of (a link is fine). General-interest
          applications are welcome — mention what you'd want to work on and
          we'll match you to the team that needs it most.
        </p>
        <p>
          We review every application and reply to every candidate, even when
          the answer is no.
        </p>
      </div>

      <p className="mt-10 text-xs text-text-muted">
        Last updated: August 2026
      </p>
    </main>
  );
}