"use client";

import { useEffect, useState } from "react";

const OFFERS = [
  "FREE SHIPPING OVER $50",
  "NEW ARRIVALS DAILY",
  "30-DAY RETURNS",
  "EXTRA 10% OFF WITH CODE GLAM10",
  "FLASH DEALS EVERY 6 HOURS",
];

/**
 * Red promotional strip across the very top of the page.
 * Cycles through the offers every 3 seconds with a soft fade.
 */
export function PromoBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % OFFERS.length),
      3000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div
      role="region"
      aria-label="Promotional announcements"
      className="w-full bg-accent text-white"
    >
      <div className="container-x flex h-9 items-center justify-center text-center text-xs font-semibold tracking-wide sm:text-sm">
        <span
          key={idx}
          className="animate-[fade_300ms_ease-out]"
          aria-live="polite"
        >
          {OFFERS[idx]}
        </span>
      </div>
      <style>{`
        @keyframes fade { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}