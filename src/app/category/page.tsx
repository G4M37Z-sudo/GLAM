// src/app/category/page.tsx
// Categories index — a directory of all 6 categories with cover images,
// product counts (when DB is connected), and a short pitch per category.

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getAllCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

interface CategoryMeta {
  tagline: string;
  highlights: string[];
  hero: string;
}

const META: Record<string, CategoryMeta> = {
  electronics: {
    tagline: "Audio, smart home, and the gear that keeps you connected.",
    highlights: ["Wireless audio", "Smart home", "Cables & chargers", "Computer accessories"],
    hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop",
  },
  "home-garden": {
    tagline: "Make your space yours — kitchen, decor, and a little greenery.",
    highlights: ["Kitchen & dining", "Decor", "Plant care", "Storage & organization"],
    hero: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop",
  },
  "fashion-accessories": {
    tagline: "Everyday pieces, statement accents — built to mix and match.",
    highlights: ["Bags & wallets", "Sunglasses", "Hats & beanies", "Scarves"],
    hero: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop",
  },
  "beauty-personal-care": {
    tagline: "Skincare, makeup, and grooming essentials without the markup.",
    highlights: ["Skincare", "Makeup tools", "Hair care", "Manicure"],
    hero: "https://images.unsplash.com/photo-1522335789203-aaa2f1b1f0c4?w=1200&auto=format&fit=crop",
  },
  "sports-outdoors": {
    tagline: "Move more — at home, at the gym, and on the trail.",
    highlights: ["Yoga & mobility", "Strength training", "Cycling & running", "Outdoor"],
    hero: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&auto=format&fit=crop",
  },
  gadgets: {
    tagline: "Smart, fun, surprisingly useful — the desk drawer essentials.",
    highlights: ["Smart home", "Phone accessories", "Desk gear", "Mini projectors"],
    hero: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&auto=format&fit=crop",
  },
};

export default async function CategoriesIndex() {
  let categories: { id: string; slug: string; name: string; image_url: string | null }[] = [];
  try {
    categories = await getAllCategories();
  } catch (err) {
    console.error("CategoriesIndex data fetch failed:", err);
  }

  // Show seeded categories in canonical order even if DB is empty (so the
  // page is useful for design review and SEO before Supabase is wired in).
  const display = categories.length > 0
    ? categories
    : Object.keys(META).map((slug, i) => ({
        id: `seed-${slug}`,
        slug,
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        image_url: null,
      }));

  return (
    <main className="container-x py-10 sm:py-14">
      {/* Hero */}
      <header className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          <Sparkles size={12} />
          Shop by category
        </span>
        <h1 className="mt-3 text-3xl font-black text-fg sm:text-5xl">
          Six categories. Millions of possibilities.
        </h1>
        <p className="mt-3 text-base text-text-muted sm:text-lg">
          Browse GLAM&apos;s curated catalog — every item is hand-checked, every
          price is honest, and every order ships from a real warehouse.
        </p>
      </header>

      {/* Grid of category tiles */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((c) => {
          const meta = META[c.slug];
          return (
            <li key={c.id}>
              <Link
                href={`/category/${c.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-border bg-bg transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image_url ?? meta?.hero ?? "https://picsum.photos/800/500"}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <h2 className="absolute bottom-3 left-4 text-2xl font-black text-white">
                    {c.name}
                  </h2>
                </div>
                <div className="p-5">
                  <p className="mb-4 text-sm text-text-muted">
                    {meta?.tagline ?? "Discover our picks in this category."}
                  </p>
                  {meta?.highlights && (
                    <ul className="mb-5 flex flex-wrap gap-1.5">
                      {meta.highlights.map((h) => (
                        <li
                          key={h}
                          className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-fg"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors group-hover:text-accent-hover">
                    Shop {c.name}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
