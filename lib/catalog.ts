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
}

export interface BlogPost {
    id: string;
    content: string;
    do_you_know: string | null;
    buy_links: string | null;
}

export interface ProductDetail extends CatalogProduct {
    blog_posts: BlogPost[];
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