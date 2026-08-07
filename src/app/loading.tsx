// src/app/loading.tsx
// Shown while route segments are loading (e.g. Supabase query in flight).
// Skeletons match the Shein color tokens so the page feels native.

export default function Loading() {
  return (
    <main className="container-x py-12 sm:py-16">
      {/* Hero skeleton */}
      <div className="mb-12 h-64 w-full animate-pulse rounded-2xl bg-surface sm:h-80" />

      {/* Section heading skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-7 w-48 animate-pulse rounded bg-surface" />
        <div className="h-4 w-72 animate-pulse rounded bg-surface" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-surface" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
          </div>
        ))}
      </div>
    </main>
  );
}
