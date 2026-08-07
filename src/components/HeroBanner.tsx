import Link from "next/link";
import { Button } from "@/components/Button";

/**
 * Full-bleed hero banner for the home page.
 * Server Component — no interactivity (CTAs are <Link>s).
 */
export function HeroBanner() {
  return (
    <section
      aria-label="Discover. Connect. Trade."
      className="relative overflow-hidden bg-gradient-to-br from-accent via-[#ff2e63] to-[#ff6e8a] text-white"
    >
      {/* Soft decorative blob */}
      <div
        aria-hidden
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />

      <div className="container-x relative grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            New Season · Up to 80% Off
          </span>
          <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Discover.
            <br />
            Connect.
            <br />
            Trade.
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/90 sm:text-lg">
            Millions of styles, fresh drops daily, and unbeatable wholesale
            prices. From the runway to your wardrobe — without the markup.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/categories/new">
              <Button variant="primary" size="lg" className="bg-white !text-accent hover:bg-white/90">
                Shop New In
              </Button>
            </Link>
            <Link href="/sale">
              <Button variant="ghost" size="lg" className="!text-white border border-white/40 hover:bg-white/10">
                View Sale →
              </Button>
            </Link>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-4 text-xs sm:max-w-md sm:text-sm">
            <li className="rounded-md bg-white/10 px-3 py-3 backdrop-blur-sm">
              <div className="font-bold">$50+</div>
              <div className="text-white/80">Free Shipping</div>
            </li>
            <li className="rounded-md bg-white/10 px-3 py-3 backdrop-blur-sm">
              <div className="font-bold">30 Days</div>
              <div className="text-white/80">Easy Returns</div>
            </li>
            <li className="rounded-md bg-white/10 px-3 py-3 backdrop-blur-sm">
              <div className="font-bold">Secure</div>
              <div className="text-white/80">Stripe Checkout</div>
            </li>
          </ul>
        </div>

        {/* Visual */}
        <div className="relative hidden lg:block">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop"
                alt="Woman in a pink dress"
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-12 aspect-[3/4] overflow-hidden rounded-2xl bg-white/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop"
                alt="Man in a streetwear outfit"
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}