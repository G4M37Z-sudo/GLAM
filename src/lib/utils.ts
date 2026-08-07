import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely (clsx + tailwind-merge).
 * Use this anywhere you'd put `className="…"` so later utilities
 * win over earlier ones.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format an integer amount of cents as a localized currency string.
 * Default currency is USD; falls back gracefully if the runtime
 * does not support Intl currency formatting.
 */
export function formatPriceCents(
  cents: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  if (!Number.isFinite(cents)) return "";
  const dollars = cents / 100;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);
  } catch {
    // Hard fallback if Intl currency throws (unknown currency code).
    const fixed = dollars.toFixed(2);
    return currency === "USD" ? `$${fixed}` : `${fixed} ${currency}`;
  }
}