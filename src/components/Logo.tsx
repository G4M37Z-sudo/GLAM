// src/components/Logo.tsx
// GLAM brand mark — silhouette of a fashion-forward profile (face + hair
// flowing back) inside a rounded square, paired with the wordmark.
//
// Pure SVG so it scales without raster artefacts. Shein palette only.
// Used in the Header and as the basis for the favicon.

interface LogoProps {
  /** Show the wordmark beside the mark. Default true. */
  withWordmark?: boolean;
  /** Total height in px (mark scales to match). Default 32. */
  height?: number;
  /** Override wordmark colour (defaults to text-fg via currentColor). */
  wordmarkClassName?: string;
  /** Accessible label override. */
  ariaLabel?: string;
}

export function Logo({
  withWordmark = true,
  height = 32,
  wordmarkClassName = "text-fg",
  ariaLabel = "GLAM — home",
}: LogoProps) {
  // Mark is square; width === height.
  const markSize = height;

  return (
    <span
      className="inline-flex items-center gap-2"
      aria-label={ariaLabel}
      role="img"
    >
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Rounded square background — accent pink */}
        <rect
          x="0"
          y="0"
          width="64"
          height="64"
          rx="14"
          fill="#FF1744"
        />
        {/* Profile silhouette — feminine, fashion-forward, hair flowing back */}
        <path
          fill="#FFFFFF"
          d="
            M 24 18
            C 24 13, 28 10, 32 10
            C 36 10, 40 13, 40 18
            C 41 17, 43 17, 44 19
            C 45 21, 44 23, 42 24
            C 43 25, 43 27, 42 28
            C 43 28, 45 28, 46 30
            C 47 33, 46 36, 44 38
            C 45 39, 47 40, 48 42
            C 50 46, 50 50, 50 54
            L 50 58
            L 14 58
            L 14 54
            C 14 48, 16 43, 19 39
            C 21 36, 21 32, 22 28
            C 23 26, 22 22, 24 18
            Z
          "
        />
        {/* Subtle earring dot — accent-on-white accent */}
        <circle cx="42" cy="32" r="1.6" fill="#FF1744" />
      </svg>

      {withWordmark && (
        <span
          className={`font-sans text-2xl font-black tracking-tight sm:text-3xl ${wordmarkClassName}`}
          style={{ lineHeight: 1 }}
        >
          GLAM
        </span>
      )}
    </span>
  );
}
