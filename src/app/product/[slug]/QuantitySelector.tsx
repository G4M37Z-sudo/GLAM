"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  /** Initial quantity (e.g. product.moq). */
  initial?: number;
  /** Hard lower bound (e.g. product.moq). */
  min: number;
  /** Hard upper bound (e.g. product.stock). */
  max: number;
  /** Called on every change so parent can update derived UI. */
  onChange?: (qty: number) => void;
  /** Optional className passthrough. */
  className?: string;
}

/**
 * +/- quantity selector. Defaults to `initial`, clamped to [min, max].
 * Pure controlled-via-callback — parent owns the canonical qty state.
 */
export function QuantitySelector({
  initial,
  min,
  max,
  onChange,
  className,
}: QuantitySelectorProps) {
  // Clamp initial to the valid range so we never start below MOQ.
  const safeInitial = (() => {
    if (typeof initial !== "number" || Number.isNaN(initial)) return min;
    if (initial < min) return min;
    if (initial > max) return max;
    return initial;
  })();
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const set = (n: number) => {
    const next = clamp(n);
    onChange?.(next);
  };

  return (
    <div className={cn("inline-flex items-center", className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => set(safeInitial - 1)}
        className="grid h-9 w-9 place-items-center rounded-l-md border border-border bg-bg text-fg transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
        disabled={safeInitial <= min}
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={safeInitial}
        min={min}
        max={max}
        onChange={(e) => {
          const parsed = parseInt(e.target.value, 10);
          if (Number.isNaN(parsed)) return;
          set(parsed);
        }}
        aria-label="Quantity"
        className="h-9 w-16 border-y border-border bg-bg text-center text-sm font-semibold text-fg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => set(safeInitial + 1)}
        className="grid h-9 w-9 place-items-center rounded-r-md border border-border bg-bg text-fg transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
        disabled={safeInitial >= max}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
