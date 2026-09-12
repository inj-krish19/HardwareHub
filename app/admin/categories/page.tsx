"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiTag } from "react-icons/fi";
import { createCategory, fetchCategories, type Category } from "@/lib/adminApi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import Field, { inputClass } from "@/components/admin/Field";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function load() {
        try {
            setCategories(await fetchCategories());
        } catch (err) {
            setError((err as Error).message);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createCategory({ name, description: description || undefined });
            setName("");
            setDescription("");
            await load();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <AdminPageHeader icon={FiTag} title="Categories" subtitle="Top-level product groupings." />

            <AdminCard>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Name">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. RAM"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Description (optional)">
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
                    >
                        <FiPlus size={15} />
                        {loading ? "Adding…" : "Add category"}
                    </button>
                </form>
            </AdminCard>

            <div className="mt-6 space-y-2">
                {categories.length === 0 && (
                    <p className="text-sm text-slate-400 dark:text-slate-600">No categories yet.</p>
                )}
                {categories.map((c) => (
                    <div
                        key={c.id}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/40"
                    >
                        <span className="font-medium text-slate-900 dark:text-slate-100">{c.name}</span>
                        {c.description && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {c.description}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}