import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryTileProps {
  /** Display name */
  name: string;
  /** Image URL */
  image: string;
  /** Target href, defaults to /categories/[slug] */
  href?: string;
  /** Optional accent color override, e.g. "bg-accent" */
  accent?: string;
  className?: string;
}

/**
 * Square category tile used in the homepage category row.
 * Server Component (no interactivity) — receives data via props.
 */
export function CategoryTile({
  name,
  image,
  href,
  accent = "bg-surface",
  className,
}: CategoryTileProps) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const target = href ?? `/categories/${slug}`;
  return (
    <Link
      href={target}
      className={cn(
        "group flex flex-col items-center gap-2 text-fg transition-transform hover:-translate-y-0.5",
        className
      )}
    >
      <div
        className={cn(
          "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full border border-border",
          accent
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-3/5 w-3/5 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span className="text-xs font-medium sm:text-sm">{name}</span>
    </Link>
  );
}