// src/app/category/home-garden/page.tsx
import { CategoryLanding } from "@/components/CategoryLanding";
import { getAllCategories, getProductsByCategory } from "@/lib/queries";

export const dynamic = "force-dynamic";

const SLUG = "home-garden";

export default async function HomeGardenPage() {
  return <CategoryLandingPage slug={SLUG} />;
}

async function CategoryLandingPage({ slug }: { slug: string }) {
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  try {
    categories = await getAllCategories();
  } catch {
    categories = [];
  }
  const category = categories.find((c) => c.slug === slug) ?? {
    id: `seed-${slug}`,
    slug,
    name: "Home & Garden",
    image_url: null,
  };

  let featured: Awaited<ReturnType<typeof getProductsByCategory>>["items"] = [];
  try {
    const res = await getProductsByCategory(slug, { limit: 8, offset: 0 });
    featured = res.items;
  } catch (err) {
    console.error("home-garden featured fetch failed:", err);
  }

  return (
    <CategoryLanding
      category={category}
      intro="Make your space yours. Kitchen, decor, and a little greenery — pieces that turn a room into somewhere you actually want to be."
      heroImage="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop"
      usps={[
        { title: "Free shipping over $50", body: "On every home order, no exceptions." },
        { title: "Easy returns", body: "30 days, no questions, on unopened items." },
        { title: "Built to last", body: "Materials chosen for daily use, not display." },
        { title: "Sustainably sourced", body: "Where possible, FSC-certified wood and recycled materials." },
      ]}
      featured={featured}
    />
  );
}
