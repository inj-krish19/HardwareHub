import type { CatalogProduct } from "@/lib/catalog";

// Which way is "better" for a numeric spec. Anything not listed is shown
// without a winner (for example Socket or Type, where bigger isn't better).
const HIGHER_IS_BETTER = new Set([
    "Cores / Threads",
    "Base clock",
    "Max boost clock",
    "Capacity",
    "Speed",
    "Max read speed",
    "Max write speed",
    "Endurance (TBW)",
    "Warranty",
]);
const LOWER_IS_BETTER = new Set(["CAS latency"]);

/** First number in a spec string: "3,500 MB/s" -> 3500, "6 / 12" -> 6, "CL16" -> 16. */
export function firstNumber(value: string | null | undefined): number | null {
    if (!value) return null;
    const m = value.replace(/,/g, "").match(/\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
}

export interface CompareRow {
    label: string;
    values: (string | null)[];
    differs: boolean;
    /** indexes of the product(s) that win this row, empty when there is no clear winner */
    winners: number[];
}

export function buildRows(products: CatalogProduct[]): CompareRow[] {
    const labels: string[] = [];
    for (const p of products) for (const k of Object.keys(p.specs)) if (!labels.includes(k)) labels.push(k);

    return labels.map((label) => {
        const values = products.map((p) => (p.specs[label] ?? null) as string | null);
        const present = values.filter((v): v is string => v !== null);
        const differs = new Set(present).size > 1 || present.length < values.length;

        let winners: number[] = [];
        const higher = HIGHER_IS_BETTER.has(label);
        const lower = LOWER_IS_BETTER.has(label);
        if ((higher || lower) && differs) {
            const nums = values.map(firstNumber);
            if (nums.every((n) => n !== null)) {
                const nn = nums as number[];
                const best = higher ? Math.max(...nn) : Math.min(...nn);
                if (new Set(nn).size > 1) winners = nn.map((n, i) => (n === best ? i : -1)).filter((i) => i >= 0);
            }
        }
        return { label, values, differs, winners };
    });
}

export function winCounts(rows: CompareRow[], productCount: number): number[] {
    const counts = new Array(productCount).fill(0) as number[];
    for (const r of rows) for (const i of r.winners) counts[i] += 1;
    return counts;
}