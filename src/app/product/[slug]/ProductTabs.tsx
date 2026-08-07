"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductTabsSpec {
  description: string;
  /** JSON object from the database — rendered as a key/value list. */
  specifications: Record<string, unknown>;
  ratingAvg: number;
  ratingCount: number;
}

type TabKey = "description" | "specifications" | "reviews";

const TABS: { key: TabKey; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "specifications", label: "Specifications" },
  { key: "reviews", label: "Reviews" },
];

/**
 * Spec row helper — coerces a value of unknown shape to a string.
 */
function renderSpecValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  if (Array.isArray(v)) return v.map((x) => String(x)).join(", ");
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

/**
 * Tabbed content for the product detail page.
 * Server Component wraps this to pass serialisable data.
 */
export function ProductTabs({
  description,
  specifications,
  ratingAvg,
  ratingCount,
}: ProductTabsSpec) {
  const [active, setActive] = useState<TabKey>("description");

  const specEntries = Object.entries(specifications ?? {});

  return (
    <section aria-label="Product details" className="mt-12">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Product information"
        className="flex border-b border-border"
      >
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${t.key}`}
              id={`tab-${t.key}`}
              onClick={() => setActive(t.key)}
              className={cn(
                "relative -mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-text-muted hover:text-fg"
              )}
            >
              {t.label}
              {t.key === "reviews" && ratingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-surface px-1.5 text-[10px] font-bold text-fg">
                  {ratingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div className="py-6">
        {active === "description" && (
          <div
            id="tabpanel-description"
            role="tabpanel"
            aria-labelledby="tab-description"
            className="prose prose-sm max-w-none text-fg"
          >
            <p className="whitespace-pre-line leading-relaxed text-fg">
              {description}
            </p>
          </div>
        )}

        {active === "specifications" && (
          <div
            id="tabpanel-specifications"
            role="tabpanel"
            aria-labelledby="tab-specifications"
          >
            {specEntries.length === 0 ? (
              <p className="text-sm text-text-muted">
                No specifications provided.
              </p>
            ) : (
              <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {specEntries.map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-1 gap-1 px-4 py-3 text-sm sm:grid-cols-3 sm:gap-4"
                  >
                    <dt className="font-semibold capitalize text-fg">
                      {k.replace(/_/g, " ")}
                    </dt>
                    <dd className="text-text-muted sm:col-span-2">
                      {renderSpecValue(v)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}

        {active === "reviews" && (
          <div
            id="tabpanel-reviews"
            role="tabpanel"
            aria-labelledby="tab-reviews"
          >
            {ratingCount > 0 ? (
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill="currentColor"
                        className={
                          i < Math.round(ratingAvg)
                            ? "text-warning"
                            : "text-border"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-fg">
                    {ratingAvg.toFixed(1)}
                  </span>
                  <span className="text-sm text-text-muted">
                    ({ratingCount} reviews)
                  </span>
                </div>
                <p className="text-sm text-text-muted">
                  Detailed reviews coming soon.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-surface/50 p-10 text-center">
                <p className="text-sm font-medium text-fg">No reviews yet</p>
                <p className="mt-1 text-xs text-text-muted">
                  Be the first to share your experience with this product.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
