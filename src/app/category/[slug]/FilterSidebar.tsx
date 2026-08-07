"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------------
// Filter state shape + defaults. Prices are stored in cents (raw integers);
// the form values are converted to/from display dollars in the input handler.
// ----------------------------------------------------------------------------

export interface FilterState {
  /** Min unit price in cents. null = no lower bound. */
  priceMinCents: number | null;
  /** Max unit price in cents. null = no upper bound. */
  priceMaxCents: number | null;
  /** Min MOQ. null = no lower bound. */
  moqMin: number | null;
  /** Max MOQ. null = no upper bound. */
  moqMax: number | null;
}

export const EMPTY_FILTERS: FilterState = {
  priceMinCents: null,
  priceMaxCents: null,
  moqMin: null,
  moqMax: null,
};

export function queryToFilters(
  sp: URLSearchParams | ReadonlyURLSearchParamsLike
): FilterState {
  const numOrNull = (k: string): number | null => {
    const v = sp.get(k);
    if (v == null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  return {
    priceMinCents: numOrNull("pmin"),
    priceMaxCents: numOrNull("pmax"),
    moqMin: numOrNull("mmin"),
    moqMax: numOrNull("mmax"),
  };
}

function filtersToQueryDict(f: FilterState): Record<string, string> {
  const out: Record<string, string> = {};
  if (f.priceMinCents != null && f.priceMinCents >= 0)
    out.pmin = String(f.priceMinCents);
  if (f.priceMaxCents != null && f.priceMaxCents >= 0)
    out.pmax = String(f.priceMaxCents);
  if (f.moqMin != null && f.moqMin >= 0) out.mmin = String(f.moqMin);
  if (f.moqMax != null && f.moqMax >= 0) out.mmax = String(f.moqMax);
  return out;
}

// `URLSearchParams` and the object returned by useSearchParams() share the
// `get(key)` shape we need; this alias keeps the helper decoupled.
type ReadonlyURLSearchParamsLike = { get(key: string): string | null };

// ----------------------------------------------------------------------------
// useFilterState — encapsulates URL ↔ FilterState sync. Reused by the
// desktop sidebar and the mobile collapsible so they stay in lockstep.
// ----------------------------------------------------------------------------

export function useFilterState(): [FilterState, (next: FilterState) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const current = queryToFilters(new URLSearchParams(searchParams.toString()));

  const setFilters = (next: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const k of ["pmin", "pmax", "mmin", "mmax"]) params.delete(k);
    for (const [k, v] of Object.entries(filtersToQueryDict(next)))
      params.set(k, v);
    // Filters reset to page 1 — a brand-new result set shouldn't be hidden
    // behind a stale `?page=3`.
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return [current, setFilters];
}

// ----------------------------------------------------------------------------
// FilterSidebar — sticky on desktop (rendered inside page.tsx).
// ----------------------------------------------------------------------------

export function FilterSidebar({ className }: { className?: string }) {
  const [filters, setFilters] = useFilterState();
  const hasAny =
    filters.priceMinCents != null ||
    filters.priceMaxCents != null ||
    filters.moqMin != null ||
    filters.moqMax != null;

  return (
    <aside className={cn("space-y-6", className)} aria-label="Filters">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-fg">
          Filters
        </h2>
        {hasAny && (
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="text-xs font-medium text-accent hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <NumberRangeGroup
        legend="Price (USD)"
        minValue={filters.priceMinCents}
        maxValue={filters.priceMaxCents}
        onMinChange={(v) => setFilters({ ...filters, priceMinCents: v })}
        onMaxChange={(v) => setFilters({ ...filters, priceMaxCents: v })}
        min={0}
        step={0.01}
        placeholder={{ min: "Min $", max: "Max $" }}
        toDisplay={(cents) =>
          cents == null ? "" : (cents / 100).toFixed(2)
        }
        fromInput={(s) => {
          if (s === "") return null;
          const n = Number(s);
          if (!Number.isFinite(n) || n < 0) return null;
          return Math.round(n * 100);
        }}
      />

      <NumberRangeGroup
        legend="Min Order Qty"
        minValue={filters.moqMin}
        maxValue={filters.moqMax}
        onMinChange={(v) => setFilters({ ...filters, moqMin: v })}
        onMaxChange={(v) => setFilters({ ...filters, moqMax: v })}
        min={1}
        step={1}
        placeholder={{ min: "Min", max: "Max" }}
        toDisplay={(n) => (n == null ? "" : String(n))}
        fromInput={(s) => {
          if (s === "") return null;
          const n = Number(s);
          if (!Number.isFinite(n) || n < 1) return null;
          return Math.floor(n);
        }}
      />
    </aside>
  );
}

// ----------------------------------------------------------------------------
// MobileFilters — collapsible panel triggered by a button. Renders on <lg.
// ----------------------------------------------------------------------------

export function MobileFilters() {
  const [filters] = useFilterState();
  const [open, setOpen] = useState(false);

  const hasAny =
    filters.priceMinCents != null ||
    filters.priceMaxCents != null ||
    filters.moqMin != null ||
    filters.moqMax != null;

  return (
    <div className="rounded-md border border-border bg-bg lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-fg"
      >
        <span className="flex items-center gap-2">
          Filters
          {hasAny && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
              •
            </span>
          )}
        </span>
        <span aria-hidden className="text-xs text-text-muted">
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open && (
        <div className="border-t border-border p-4">
          <FilterSidebar />
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Reusable numeric min/max input pair. Each input keeps a local string so
// users can type partial values (e.g. "12.") without losing focus; we commit
// to the parent on every change.
// ----------------------------------------------------------------------------

interface NumberRangeGroupProps {
  legend: string;
  minValue: number | null;
  maxValue: number | null;
  onMinChange: (v: number | null) => void;
  onMaxChange: (v: number | null) => void;
  min: number;
  step: number;
  placeholder: { min: string; max: string };
  toDisplay: (n: number | null) => string;
  fromInput: (s: string) => number | null;
}

function NumberRangeGroup({
  legend,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min,
  step,
  placeholder,
  toDisplay,
  fromInput,
}: NumberRangeGroupProps) {
  const [minStr, setMinStr] = useState(toDisplay(minValue));
  const [maxStr, setMaxStr] = useState(toDisplay(maxValue));

  // Re-sync the local string when the canonical value changes (e.g. URL
  // navigation or Clear). Without this the inputs would freeze on a stale
  // string after the user hits Clear.
  useEffect(() => setMinStr(toDisplay(minValue)), [minValue, toDisplay]);
  useEffect(() => setMaxStr(toDisplay(maxValue)), [maxValue, toDisplay]);

  const handleMin = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setMinStr(s);
    onMinChange(fromInput(s));
  };
  const handleMax = (e: ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setMaxStr(s);
    onMaxChange(fromInput(s));
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {legend}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="sr-only">Min {legend}</span>
          <input
            type="number"
            inputMode="decimal"
            min={min}
            step={step}
            value={minStr}
            placeholder={placeholder.min}
            onChange={handleMin}
            className="w-full rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="sr-only">Max {legend}</span>
          <input
            type="number"
            inputMode="decimal"
            min={min}
            step={step}
            value={maxStr}
            placeholder={placeholder.max}
            onChange={handleMax}
            className="w-full rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-fg placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </label>
      </div>
    </fieldset>
  );
}

