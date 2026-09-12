"use client";

import { useEffect, useState } from "react";
import { FiTag as FiTagIcon, FiSave } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import { inputClass } from "@/components/admin/Field";
import { getAdminCreds } from "@/lib/adminAuth";

interface Symptom {
    id: string;
    title: string;
    category: string;
    keywords: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function AdminSymptomsPage() {
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    const [savingId, setSavingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        const creds = getAdminCreds();
        if (!creds) return;
        try {
            const res = await fetch(`${API_BASE}/api/v1/admin/symptoms`, {
                headers: { "X-Admin-Id": creds.id, "X-Admin-Secret": creds.secret },
            });
            if (!res.ok) throw new Error("Failed to load symptoms.");
            const data: Symptom[] = await res.json();
            setSymptoms(data);
            setDrafts(Object.fromEntries(data.map((s) => [s.id, s.keywords])));
        } catch (err) {
            setError((err as Error).message);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function saveKeywords(id: string) {
        const creds = getAdminCreds();
        if (!creds) return;
        setSavingId(id);
        setError(null);
        try {
            const keywords = drafts[id]
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean);
            const res = await fetch(`${API_BASE}/api/v1/admin/symptoms/${id}/keywords`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-Admin-Id": creds.id,
                    "X-Admin-Secret": creds.secret,
                },
                body: JSON.stringify({ keywords }),
            });
            if (!res.ok) throw new Error("Failed to save keywords.");
            await load();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSavingId(null);
        }
    }

    return (
        <div>
            <AdminPageHeader
                icon={FiTagIcon}
                title="Symptom keywords"
                subtitle="Comma-separated synonyms so phrasing that doesn't match the title still gets caught. e.g. for 'RAM not detected / no display' add: ram not showing up, memory not detected, no ram found"
            />
            {error && <p className="mb-3 text-xs text-red-500">{error}</p>}
            <div className="space-y-3">
                {symptoms.map((s) => (
                    <AdminCard key={s.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {s.title}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                {s.category}
                            </span>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <input
                                value={drafts[s.id] ?? ""}
                                onChange={(e) => setDrafts((d) => ({ ...d, [s.id]: e.target.value }))}
                                placeholder="synonym one, synonym two, ..."
                                className={inputClass + " text-xs"}
                            />
                            <button
                                onClick={() => saveKeywords(s.id)}
                                disabled={savingId === s.id}
                                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-50"
                            >
                                <FiSave size={13} />
                                {savingId === s.id ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </AdminCard>
                ))}
            </div>
        </div>
    );
}