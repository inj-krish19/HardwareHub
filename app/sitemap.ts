import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { getGuides } from "@/lib/guides";
import { siteUrl } from "@/lib/site";

// Built when requested, not at build time, so a deploy never fails because the API is asleep.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = siteUrl();
    if (!base) return []; // absolute URLs are required; set NEXT_PUBLIC_SITE_URL

    const [guides, products] = await Promise.all([getGuides(), getProducts()]);
    return [
        { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
        { url: `${base}/guides`, changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/products`, changeFrequency: "weekly", priority: 0.7 },
        { url: `${base}/compare`, changeFrequency: "monthly", priority: 0.5 },
        ...guides.map((g) => ({ url: `${base}/guides/${g.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
        ...products.map((p) => ({ url: `${base}/products/${p.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ];
}