"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------------
// Sort dropdown. Reads the current `sort` value from URL search params and
// writes back via router.replace (no scroll jump, no history pollution).
// ----------------------------------------------------------------------------

export type SortKey = "newest" | "price-asc" | "price-desc" | "popular";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Popular" },
];

export const DEFAULT_SORT: SortKey = "newest";

export function isSortKey(v: string | null | undefined): v is SortKey {
  return v === "newest" || v === "price-asc" || v === "price-desc" || v === "popular";
}

interface SortDropdownProps {
  value: SortKey;
  /** No-op shim so the parent can render <SortDropdown value sort onChange noop />. */
  onChange?: (next: SortKey) => void;
  className?: string;
}

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    if (!isSortKey(next)) return;
    onChange?.(next);

    // Push to URL — preserves other params (filters, page).
    const params = new URLSearchParams(searchParams.toString());
    if (next === DEFAULT_SORT) params.delete("sort");
    else params.set("sort", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <label className={cn("flex items-center gap-2", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
        Sort by
      </span>
      <select
        value={value}
        onChange={handleChange}
        className="cursor-pointer rounded-md border border-border bg-bg px-2 py-1.5 text-sm font-medium text-fg focus:border-accent focus:outline-none"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}