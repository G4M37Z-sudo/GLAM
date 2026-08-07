import { cn, formatPriceCents } from "@/lib/utils";

export interface PriceTier {
  /** Minimum quantity (inclusive) at which this tier applies. */
  minQty: number;
  /** Unit price in cents for this tier. */
  unitPriceCents: number;
}

interface TieredPriceTableProps {
  tiers: PriceTier[];
  /** Current quantity (e.g. selected qty) — its tier is highlighted. */
  currentQty?: number;
  className?: string;
}

/**
 * Alibaba-style tiered pricing table.
 * Server Component — pure rendering of price tiers.
 */
export function TieredPriceTable({
  tiers,
  currentQty,
  className,
}: TieredPriceTableProps) {
  if (!tiers.length) return null;

  // Determine the active tier (the highest minQty that currentQty
  // meets or exceeds).
  const activeTier = [...tiers]
    .sort((a, b) => a.minQty - b.minQty)
    .reduce<PriceTier | undefined>((acc, t) => {
      if (currentQty == null) return acc;
      if (currentQty >= t.minQty) return t;
      return acc;
    }, undefined);

  const sorted = [...tiers].sort((a, b) => a.minQty - b.minQty);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className
      )}
    >
      <table className="w-full text-sm">
        <thead className="bg-surface text-fg">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Min Qty</th>
            <th className="px-3 py-2 text-right font-semibold">Unit Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((tier) => {
            const isActive = activeTier?.minQty === tier.minQty;
            return (
              <tr
                key={tier.minQty}
                className={cn(
                  "transition-colors",
                  isActive && "bg-accent/5 font-semibold text-accent"
                )}
              >
                <td className="px-3 py-2">
                  {tier.minQty}+
                  {isActive && (
                    <span className="ml-2 inline-flex items-center rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      Your tier
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {formatPriceCents(tier.unitPriceCents)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}