"use client";

import { useState } from "react";
import { FiUploadCloud, FiDatabase } from "react-icons/fi";
import { uploadProductSeed, uploadSymptomSeed } from "@/lib/adminApi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import { textareaClass } from "@/components/admin/Field";

type Mode = "guides" | "products";

const MODES: Record<Mode, { label: string; hint: string; placeholder: string }> = {
    guides: {
        label: "Guides (all bots)",
        hint: "JSON array of guides: title, category, bot_type (optional, defaults to diagnostic), keywords, question_tree.",
        placeholder: '[ { "title": "...", "category": "...", "bot_type": "diagnostic", "keywords": [], "question_tree": { } } ]',
    },
    products: {
        label: "Products + blog",
        hint: "JSON array of products: category, name, model_number, specs, use_case_tags, blog. Categories are created if missing; re-pasting skips duplicates.",
        placeholder: '[ { "category": "RAM", "name": "...", "model_number": "...", "specs": { }, "blog": { "content": "..." } } ]',
    },
};

export default function AdminSeedPage() {
    const [mode, setMode] = useState<Mode>("guides");
    const [raw, setRaw] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setStatus(null);
        let parsed: unknown[];
        try {
            parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) throw new Error("Expected a JSON array at the top level.");
        } catch (err) {
            setError(`Invalid JSON: ${(err as Error).message}`);
            return;
        }
        setLoading(true);
        try {
            if (mode === "guides") {
                const result = await uploadSymptomSeed(parsed);
                setStatus(`Created ${result.created} guides.`);
            } else {
                const result = await uploadProductSeed(parsed);
                setStatus(`Created ${result.created} products, skipped ${result.skipped} duplicates.`);
            }
            setRaw("");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <AdminPageHeader
                icon={FiDatabase}
                title="Bulk import"
                subtitle="Paste generated JSON to add many records at once."
            />
            <AdminCard>
                <div className="mb-4 flex gap-2">
                    {(Object.keys(MODES) as Mode[]).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => {
                                setMode(m);
                                setStatus(null);
                                setError(null);
                            }}
                            className={`rounded-full border px-3 py-1 text-xs ${mode === m
                                ? "border-sky-600 bg-sky-600 text-white"
                                : "border-slate-200 text-slate-600 hover:border-sky-400 dark:border-slate-700 dark:text-slate-400"
                                }`}
                        >
                            {MODES[m].label}
                        </button>
                    ))}
                </div>
                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{MODES[mode].hint}</p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={raw}
                        onChange={(e) => setRaw(e.target.value)}
                        placeholder={MODES[mode].placeholder}
                        rows={16}
                        className={textareaClass + " p-3"}
                    />
                    {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                    {status && <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{status}</p>}
                    <button
                        type="submit"
                        disabled={loading || !raw.trim()}
                        className="mt-4 flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
                    >
                        <FiUploadCloud size={15} />
                        {loading ? "Uploading…" : "Upload"}
                    </button>
                </form>
            </AdminCard>
        </div>
    );
}