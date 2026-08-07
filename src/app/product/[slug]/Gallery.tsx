"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  url: string;
  is_cover?: boolean;
}

interface GalleryProps {
  images: GalleryImage[];
  title: string;
}

/**
 * Image gallery for the product detail page.
 * Server Component wraps this to pass serialisable image props.
 * Default = cover image (or first); clicking a thumbnail swaps the main image.
 */
export function Gallery({ images, title }: GalleryProps) {
  const safeImages = images.length > 0
    ? images
    : [{ id: "placeholder", url: "https://picsum.com/600/800", is_cover: true }];

  const initialIdx = Math.max(
    0,
    safeImages.findIndex((i) => i.is_cover)
  );

  const [activeIdx, setActiveIdx] = useState(initialIdx === -1 ? 0 : initialIdx);
  const active = safeImages[activeIdx];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={active.id}
          src={active.url}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div
          role="tablist"
          aria-label="Product image thumbnails"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {safeImages.map((img, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={img.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`View image ${idx + 1}`}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-surface transition-colors",
                  isActive
                    ? "border-accent"
                    : "border-border hover:border-fg"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
