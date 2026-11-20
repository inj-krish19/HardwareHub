// Server-side data helpers for the public catalog pages.
// no-store: the catalog changes whenever the admin adds content.

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface CatalogProduct {
    id: string;
    category_id: string;
    category_name: string;
    name: string;
    model_number: string;
    specs: Record<string, string>;
    use_case_tags: string | null;
    image_url: string | null;
    video_url: string | null;
}

export interface BlogPost {
    id: string;
    content: string;
    do_you_know: string | null;
    buy_links: string | null;
}

export interface BuyLink {
    position: number; // 0 is the primary "Check price" link
    store: string;
    url: string;
}

export interface ProductDetail extends CatalogProduct {
    blog_posts: BlogPost[];
    buy_links: BuyLink[]; // 0 to 3, ordered by position
}

export interface CatalogCategory {
    id: string;
    name: string;
    description: string | null;
}

async function get<T>(path: string): Promise<T | null> {
    if (!API_BASE) throw new Error("NEXT_PUBLIC_API_URL is not set — add it to frontend/.env.local");
    try {
        const res = await fetch(`${API_BASE}/api/v1${path}`, { cache: "no-store" });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

export async function getProducts(): Promise<CatalogProduct[]> {
    return (await get<CatalogProduct[]>("/products")) ?? [];
}

export async function getProduct(id: string): Promise<ProductDetail | null> {
    return get<ProductDetail>(`/products/${id}`);
}

export function splitTags(tags: string | null): string[] {
    return (tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}

// Plain-language questions per category, used by the "Having trouble?" buttons.
// They are phrased to match the diagnostic guides' keywords.
export const COMMON_ISSUES: Record<string, string[]> = {
    RAM: ["RAM not detected", "Blue screen after RAM upgrade", "PC won't boot after changing RAM"],
    CPU: [
        "Computer shuts down by itself because of heat",
        "PC won't start after installing a new processor",
        "CPU usage is always 100 percent",
    ],
    Storage: ["Storage drive not detected", "Storage is very slow", "Drive reported as dying"],
};

// ---- media + links helpers ----

/** Turns a YouTube watch/short/embed URL into an embeddable one, or null. */
export function youtubeEmbed(url: string | null): string | null {
    if (!url) return null;
    const m =
        url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

/** "https://www.amazon.in/..." -> "Amazon". Used as the button label. */
export function storeLabel(url: string): string {
    try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        const name = host.split(".")[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
        return "Store";
    }
}

export function parseLinks(raw: string | null): string[] {
    return (raw ?? "")
        .split(",")
        .map((l) => l.trim())
        .filter((l) => /^https?:\/\//.test(l));
}

// ---- similar products ----

const REASON_KEYS = ["Socket", "Type", "Interface", "Capacity"];

export interface SimilarProduct {
    product: CatalogProduct;
    reason: string;
}

/** Same-category products ranked by shared use-case tags and matching key specs. */
export function similarProducts(current: CatalogProduct, all: CatalogProduct[], limit = 3): SimilarProduct[] {
    const tags = new Set(splitTags(current.use_case_tags));
    return all
        .filter((p) => p.id !== current.id && p.category_name === current.category_name)
        .map((p) => {
            const shared = splitTags(p.use_case_tags).filter((t) => tags.has(t));
            let score = shared.length * 2;
            const reasons: string[] = [];
            for (const key of REASON_KEYS) {
                if (current.specs[key] && current.specs[key] === p.specs[key]) {
                    score += 2;
                    reasons.push(`Same ${key.toLowerCase()}: ${p.specs[key]}`);
                }
            }
            if (shared.length) reasons.push(`Also suited to ${shared.slice(0, 2).join(" and ")}`);
            return { product: p, score, reason: reasons[0] ?? "Same category" };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ product, reason }) => ({ product, reason }));
}