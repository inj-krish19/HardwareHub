"use client";

import { useEffect, useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import { fetchFeedbackSummary, type FeedbackSummary } from "@/lib/adminApi";

const pct = (h: number, t: number) => (t === 0 ? 0 : Math.round((h / t) * 100));

export default function AdminFeedbackPage() {
    const [data, setData] = useState<FeedbackSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFeedbackSummary()
            .then(setData)
            .catch((e) => setError((e as Error).message));
    }, []);

    return (
        <div>
            <AdminPageHeader
                icon={FiThumbsUp}
                title="Feedback"
                subtitle="Anonymous 'did this fix it?' votes. Use the weak answers to improve the guides."
            />
            {error && <p className="mb-3 text-xs text-red-500">{error}</p>}
            {!data && !error && <p className="text-sm text-slate-400">Loading…</p>}

            {data && data.total === 0 && (
                <AdminCard>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No votes yet. Run a guide to its final answer in the chat and tap a rating to see it appear here.
                    </p>
                </AdminCard>
            )}

            {data && data.total > 0 && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <AdminCard>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Answers rated helpful</p>
                            <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-50">
                                {pct(data.helpful, data.total)}%
                            </p>
                        </AdminCard>
                        <AdminCard>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total votes</p>
                            <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-50">{data.total}</p>
                        </AdminCard>
                    </div>

                    <h2 className="mt-8 text-sm font-medium text-slate-900 dark:text-slate-50">Guides, lowest rated first</h2>
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-sm">
                            <tbody>
                                {data.guides.map((g) => (
                                    <tr key={g.symptom_id} className="border-b border-slate-100 last:border-0 dark:border-slate-900">
                                        <td className="px-4 py-2.5">
                                            <span className="text-slate-900 dark:text-slate-100">{g.title}</span>
                                            <span className="ml-2 text-[11px] text-slate-400">{g.bot_type}</span>
                                        </td>
                                        <td className="px-4 py-2.5 text-right text-xs text-slate-500 dark:text-slate-400">
                                            {g.helpful}/{g.total} · <span className="font-medium">{pct(g.helpful, g.total)}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h2 className="mt-8 text-sm font-medium text-slate-900 dark:text-slate-50">Answers that are not helping</h2>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Final answers with at least 3 votes where under 60% said they helped. Fix the steps in these first.
                    </p>
                    {data.weak_outcomes.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-400">None yet.</p>
                    ) : (
                        <div className="mt-3 space-y-2">
                            {data.weak_outcomes.map((o, i) => (
                                <div key={i} className="rounded-lg border border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-slate-900 dark:text-slate-100">{o.title}</span>
                                        <span className="shrink-0 text-xs font-medium text-red-500">
                                            {o.helpful}/{o.total} · {pct(o.helpful, o.total)}%
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Reached by: {o.outcome_key}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}