"use client";

// src/components/HeroBanner.tsx
// Full-bleed hero banner for the home page. GSAP fade-up on mount.

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, getGsap } from "@/lib/gsap";
import { Button } from "@/components/Button";

export function HeroBanner() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = [
      el.querySelector("[data-anim=eyebrow]"),
      el.querySelector("[data-anim=headline]"),
      el.querySelector("[data-anim=sub]"),
      el.querySelector("[data-anim=ctas]"),
      el.querySelector("[data-anim=trust]"),
      el.querySelector("[data-anim=visual]"),
    ].filter((n): n is HTMLElement => Boolean(n));

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    getGsap(); // ensure plugin is registered
    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
    return () => {
      tween.kill();
    };
  }, []);

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

      <div
        ref={root}
        className="container-x relative grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28"
      >
        <div>
          <span
            data-anim="eyebrow"
            className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider"
          >
            New Season · Up to 80% Off
          </span>
          <h1
            data-anim="headline"
            className="mt-5 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Discover.
            <br />
            Connect.
            <br />
            Trade.
          </h1>
          <p
            data-anim="sub"
            className="mt-5 max-w-lg text-base text-white/90 sm:text-lg"
          >
            Millions of styles, fresh drops daily, and unbeatable wholesale
            prices. From the runway to your wardrobe — without the markup.
          </p>
          <div data-anim="ctas" className="mt-8 flex flex-wrap gap-3">
            <Link href="/category/electronics">
              <Button
                variant="primary"
                size="lg"
                className="bg-white !text-accent hover:bg-white/90"
              >
                Shop New In
              </Button>
            </Link>
            <Link href="/category/gadgets">
              <Button
                variant="ghost"
                size="lg"
                className="!text-white border border-white/40 hover:bg-white/10"
              >
                View Sale →
              </Button>
            </Link>
          </div>

          <ul
            data-anim="trust"
            className="mt-8 grid grid-cols-3 gap-4 text-xs sm:max-w-md sm:text-sm"
          >
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
        <div data-anim="visual" className="relative hidden lg:block">
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
