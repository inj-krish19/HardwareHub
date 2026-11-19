"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiAward, FiCheck, FiPlus, FiX } from "react-icons/fi";
import Term from "@/components/Term";
import { buildRows, winCounts } from "@/lib/compareUtils";
import { splitTags, type CatalogProduct } from "@/lib/catalog";
import { SPEC_GLOSSARY } from "@/lib/glossary";

const MAX = 3;

export default function CompareClient({
    products,
    initialIds,
}: {
    products: CatalogProduct[];
    initialIds: string[];
}) {
    const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category_name))), [products]);

    // Start from the URL's ids, keeping only products from the first one's category.
    const initial = useMemo(() => {
        const found = initialIds
            .map((id) => products.find((p) => p.id === id))
            .filter((p): p is CatalogProduct => Boolean(p));
        const cat = found[0]?.category_name ?? categories[0] ?? "";
        return {
            category: cat,
            ids: found.filter((p) => p.category_name === cat).map((p) => p.id).slice(0, MAX),
        };
    }, [products, initialIds, categories]);

    const [category, setCategory] = useState(initial.category);
    const [ids, setIds] = useState<string[]>(initial.ids);
    const [diffOnly, setDiffOnly] = useState(false);

    function sync(next: string[]) {
        setIds(next);
        const url = next.length ? `/compare?ids=${next.join(",")}` : "/compare";
        window.history.replaceState(null, "", url);
    }

    function toggle(id: string) {
        if (ids.includes(id)) sync(ids.filter((x) => x !== id));
        else if (ids.length < MAX) sync([...ids, id]);
    }

    const inCategory = products.filter((p) => p.category_name === category);
    const selected = ids.map((id) => products.find((p) => p.id === id)).filter((p): p is CatalogProduct => Boolean(p));
    const rows = buildRows(selected);
    const shownRows = diffOnly ? rows.filter((r) => r.differs) : rows;
    const wins = winCounts(rows, selected.length);
    const topWins = Math.max(0, ...wins);

    return (
        <div>
            {/* Category chips */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500">Category</span>
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => {
                            setCategory(c);
                            sync([]);
                        }}
                        className={`rounded-full border px-3 py-1 text-xs ${category === c
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-slate-200 text-slate-600 hover:border-sky-400 dark:border-slate-700 dark:text-slate-400"
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Picker */}
            <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                Pick 2 or {MAX} products to compare ({ids.length}/{MAX} selected). Only parts in the same category can be
                compared.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {inCategory.map((p) => {
                    const on = ids.includes(p.id);
                    const full = !on && ids.length >= MAX;
                    return (
                        <button
                            key={p.id}
                            onClick={() => toggle(p.id)}
                            disabled={full}
                            aria-pressed={on}
                            className={`flex items-start justify-between gap-2 rounded-xl border p-3 text-left text-sm transition disabled:opacity-40 ${on
                                ? "border-sky-500 bg-sky-50 dark:border-sky-500 dark:bg-sky-500/10"
                                : "border-slate-200 hover:border-sky-300 dark:border-slate-800 dark:hover:border-sky-700"
                                }`}
                        >
                            <span className="text-slate-900 dark:text-slate-100">{p.name}</span>
                            <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${on ? "bg-sky-600 text-white" : "border border-slate-300 text-slate-400 dark:border-slate-600"
                                    }`}
                            >
                                {on ? <FiCheck size={12} /> : <FiPlus size={12} />}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Result */}
            {selected.length < 2 ? (
                <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
                    Select at least two products to see them side by side.
                </div>
            ) : (
                <div className="mt-10">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-sm font-medium text-slate-900 dark:text-slate-50">Side by side</h2>
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <input
                                type="checkbox"
                                checked={diffOnly}
                                onChange={(e) => setDiffOnly(e.target.checked)}
                                className="accent-sky-600"
                            />
                            Show only differences
                        </label>
                    </div>

                    <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full min-w-[520px] border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                    <th className="sticky left-0 w-36 bg-slate-50 px-4 py-3 dark:bg-slate-900" />
                                    {selected.map((p, i) => (
                                        <th key={p.id} className="px-4 py-3 text-left align-top">
                                            <div className="flex items-start justify-between gap-2">
                                                <Link
                                                    href={`/products/${p.id}`}
                                                    className="text-sm font-medium text-slate-900 hover:text-sky-600 dark:text-slate-50 dark:hover:text-sky-400"
                                                >
                                                    {p.name}
                                                </Link>
                                                <button
                                                    onClick={() => toggle(p.id)}
                                                    aria-label={`Remove ${p.name}`}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                            {wins[i] === topWins && topWins > 0 && (
                                                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    <FiAward size={10} /> Best in {wins[i]} {wins[i] === 1 ? "row" : "rows"}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {shownRows.map((r) => (
                                    <tr key={r.label} className="border-b border-slate-100 last:border-0 dark:border-slate-900">
                                        <th className="sticky left-0 bg-white px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                            {SPEC_GLOSSARY[r.label] ? <Term definition={SPEC_GLOSSARY[r.label]}>{r.label}</Term> : r.label}
                                        </th>
                                        {r.values.map((v, i) => {
                                            const win = r.winners.includes(i);
                                            return (
                                                <td
                                                    key={i}
                                                    className={`px-4 py-2.5 ${win
                                                        ? "bg-emerald-50 font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300"
                                                        : "text-slate-800 dark:text-slate-200"
                                                        }`}
                                                >
                                                    <span className="inline-flex items-center gap-1.5">
                                                        {v ?? "—"}
                                                        {win && <FiCheck size={13} />}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                <tr className="border-t border-slate-200 dark:border-slate-800">
                                    <th className="sticky left-0 bg-white px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                                        Best suited for
                                    </th>
                                    {selected.map((p) => (
                                        <td key={p.id} className="px-4 py-2.5">
                                            <div className="flex flex-wrap gap-1">
                                                {splitTags(p.use_case_tags).map((t) => (
                                                    <span
                                                        key={t}
                                                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                        Green marks the better number in a row (higher is better, except CAS latency where lower is better). It
                        only compares numbers, so it can&apos;t tell you which part is right for you. Check &quot;Best suited
                        for&quot; and your own build before choosing.
                    </p>
                </div>
            )}
        </div>
    );
}