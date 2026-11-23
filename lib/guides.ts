// Server-side data helpers for the public guide pages (/guides and /guides/[slug]).
// Guides change rarely, so pages are cached for 5 minutes instead of fetched on every visit.

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface GuideSummary {
    slug: string;
    title: string;
    category: string;
    bot_type: string;
}

export type TreeNode =
    | { type: "conclusion" | "escalate"; text: string }
    | { id?: string; question: string; options: { answer: string; next: TreeNode }[] };

export interface GuideDetail extends GuideSummary {
    keywords: string[];
    question_tree: TreeNode;
    related: { slug: string; title: string }[];
}

async function get<T>(path: string): Promise<T | null> {
    if (!API_BASE) throw new Error("NEXT_PUBLIC_API_URL is not set — add it to frontend/.env.local");
    try {
        const res = await fetch(`${API_BASE}/api/v1${path}`, { next: { revalidate: 300 } });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

export async function getGuides(): Promise<GuideSummary[]> {
    return (await get<GuideSummary[]>("/guides")) ?? [];
}

export async function getGuide(slug: string): Promise<GuideDetail | null> {
    return get<GuideDetail>(`/guides/${encodeURIComponent(slug)}`);
}

export function isFinal(node: TreeNode): node is { type: "conclusion" | "escalate"; text: string } {
    return "type" in node;
}

/** First question of a guide, used for the page's search-result description. */
export function firstQuestion(tree: TreeNode): string | null {
    return isFinal(tree) ? null : tree.question;
}

// Same order and wording as the five bots in the chat.
export const BOT_LABELS: Record<string, string> = {
    diagnostic: "Fix a problem",
    compatibility: "Check compatibility",
    budget: "Plan a budget build",
    upgrade: "Decide what to upgrade",
    maintenance: "Care and cleaning",
};
export const BOT_ORDER = ["diagnostic", "compatibility", "budget", "upgrade", "maintenance"];