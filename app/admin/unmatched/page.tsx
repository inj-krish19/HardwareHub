"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiDownload, FiHelpCircle, FiPlus, FiRotateCcw, FiX } from "react-icons/fi";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { inputClass } from "@/components/admin/Field";
import {
    addUnmatchedKeyword,
    exportUnmatched,
    fetchSymptoms,
    fetchUnmatched,
    setUnmatchedStatus,
    type AdminSymptom,
    type UnmatchedQuery,
    type UnmatchedStatus,
} from "@/lib/adminApi";

const TABS: { value: UnmatchedStatus; label: string }[] = [
    { value: "open", label: "To review" },
    { value: "fixed", label: "Fixed" },
    { value: "dismissed", label: "Dismissed" },
];

export default function AdminUnmatchedPage() {
    const [status, setStatus] = useState<UnmatchedStatus>("open");
    const [rows, setRows] = useState<UnmatchedQuery[]>([]);
    const [guides, setGuides] = useState<AdminSymptom[]>([]);
    const [phrase, setPhrase] = useState<Record<string, string>>({});
    const [guideId, setGuideId] = useState<Record<string, string>>({});
    const [notice, setNotice] = useState<Record<string, string>>({});
    const [banner, setBanner] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (which: UnmatchedStatus) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUnmatched(which);
            setRows(data);
            setPhrase((p) => ({ ...Object.fromEntries(data.map((r) => [r.id, r.text])), ...p }));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(status);
    }, [status, load]);

    useEffect(() => {
        fetchSymptoms()
            .then((list) => setGuides([...list].sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))))
            .catch((err) => setError((err as Error).message));
    }, []);

    const guidesByCategory = useMemo(() => {
        const map = new Map<string, AdminSymptom[]>();
        for (const g of guides) map.set(g.category, [...(map.get(g.category) ?? []), g]);
        return [...map.entries()];
    }, [guides]);

    async function addKeyword(row: UnmatchedQuery) {
        const symptomId = guideId[row.id];
        if (!symptomId) return;
        setBusyId(row.id);
        setError(null);
        setBanner(null);
        try {
            const result = await addUnmatchedKeyword(row.id, symptomId, phrase[row.id] ?? row.text);
            if (result.now_matches) {
                // A phrase that works moves to Fixed, so the confirmation goes in a banner
                // (a message inside the row would disappear with the row).
                setBanner(`Added "${phrase[row.id] ?? row.text}" to "${result.guide}". That message now finds the guide.`);
                setRows((current) => current.filter((r) => r.id !== row.id));
            } else {
                // A phrase that still misses stays in the list so it can be edited and tried again.
                setNotice((n) => ({
                    ...n,
                    [row.id]: `Added to "${result.guide}", but this message still does not find it. Try a shorter phrase.`,
                }));
            }
        } catch (err) {
            setError(parseError(err));
        } finally {
            setBusyId(null);
        }
    }

    async function changeStatus(row: UnmatchedQuery, next: "open" | "dismissed") {
        setBusyId(row.id);
        setError(null);
        setBanner(null);
        try {
            await setUnmatchedStatus(row.id, next);
            setRows((current) => current.filter((r) => r.id !== row.id));
        } catch (err) {
            setError(parseError(err));
        } finally {
            setBusyId(null);
        }
    }

    async function download() {
        setError(null);
        try {
            const data = await exportUnmatched();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "unmatched_queries.json";
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(parseError(err));
        }
    }

    return (
        <div>
            <AdminPageHeader
                icon={FiHelpCircle}
                title="Missed queries"
                subtitle="Messages people typed that matched no guide, most repeated first. Only the text is kept: no names, no accounts. Add a phrase to the right guide, or dismiss junk."
            />

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setBanner(null);
                                setStatus(tab.value);
                            }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${status === tab.value
                                ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={download}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-sky-300 dark:border-slate-700 dark:text-slate-300"
                >
                    <FiDownload size={13} /> Download as evaluation set
                </button>
            </div>
            <p className="mb-4 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
                The download lists every message that is not dismissed, in the format of match_eval_queries.json. Rows
                that say TODO still need a guide title. For a fair score, measure on messages from before you added
                their keywords, because a keyword makes its own message match.
            </p>

            {error && <p className="mb-3 text-xs text-red-500">{error}</p>}
            {banner && (
                <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                    {banner}
                </p>
            )}
            {loading && <p className="text-xs text-slate-400">Loading…</p>}
            {!loading && rows.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500">
                    {status === "open" ? "Nothing to review right now." : "Nothing here."}
                </p>
            )}

            <div className="space-y-3">
                {rows.map((row) => (
                    <AdminCard key={row.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{row.text}</p>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                {row.times_seen}× · last {row.last_seen ? new Date(row.last_seen).toLocaleDateString() : "unknown"}
                            </span>
                        </div>

                        {row.status === "open" ? (
                            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
                                <input
                                    value={phrase[row.id] ?? row.text}
                                    onChange={(e) => setPhrase((p) => ({ ...p, [row.id]: e.target.value }))}
                                    aria-label="Keyword phrase"
                                    className={inputClass + " text-xs"}
                                />
                                <select
                                    value={guideId[row.id] ?? ""}
                                    onChange={(e) => setGuideId((g) => ({ ...g, [row.id]: e.target.value }))}
                                    aria-label="Guide"
                                    className={inputClass + " text-xs"}
                                >
                                    <option value="">Choose a guide…</option>
                                    {guidesByCategory.map(([category, items]) => (
                                        <optgroup key={category} label={category}>
                                            {items.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    {g.title}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <button
                                    onClick={() => addKeyword(row)}
                                    disabled={busyId === row.id || !guideId[row.id]}
                                    className="flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-50"
                                >
                                    <FiPlus size={13} /> Add keyword
                                </button>
                                <button
                                    onClick={() => changeStatus(row, "dismissed")}
                                    disabled={busyId === row.id}
                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:border-red-300 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                                >
                                    <FiX size={13} /> Dismiss
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 flex items-center justify-between gap-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {row.status === "fixed"
                                        ? row.resolved_guide
                                            ? `Added as a keyword of "${row.resolved_guide}".`
                                            : "Added as a keyword (that guide no longer exists)."
                                        : "Dismissed as junk or off-topic."}
                                </p>
                                <button
                                    onClick={() => changeStatus(row, "open")}
                                    disabled={busyId === row.id}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-sky-300 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                                >
                                    <FiRotateCcw size={13} /> Reopen
                                </button>
                            </div>
                        )}

                        {notice[row.id] && (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{notice[row.id]}</p>
                        )}
                    </AdminCard>
                ))}
            </div>
        </div>
    );
}

// The API answers errors as JSON text ({"detail": ...}); show just the message.
function parseError(err: unknown): string {
    const raw = (err as Error).message;
    try {
        const detail = JSON.parse(raw).detail;
        if (typeof detail === "string") return detail;
        if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
    } catch {
        /* not JSON: use the text as it is */
    }
    return raw;
}