"use client";

import { useState } from "react";
import { FiUploadCloud, FiDatabase } from "react-icons/fi";
import { uploadSymptomSeed } from "@/lib/adminApi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import { textareaClass } from "@/components/admin/Field";

export default function AdminSeedPage() {
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
            const result = await uploadSymptomSeed(parsed);
            setStatus(`Created ${result.created} symptom + diagnosis rule pairs.`);
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
                title="Seed diagnostics"
                subtitle="Bulk-load symptom trees generated from the seed prompt template."
            />
            <AdminCard>
                <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                    Paste a JSON array matching the shape of{" "}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                        ram_symptoms.json
                    </code>
                    .
                </p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={raw}
                        onChange={(e) => setRaw(e.target.value)}
                        placeholder='[ { "title": "...", "category": "...", "question_tree": { ... } } ]'
                        rows={16}
                        className={textareaClass + " p-3"}
                    />
                    {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                    {status && (
                        <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{status}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading || !raw.trim()}
                        className="mt-4 flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
                    >
                        <FiUploadCloud size={15} />
                        {loading ? "Uploading…" : "Upload seed"}
                    </button>
                </form>
            </AdminCard>
        </div>
    );
}