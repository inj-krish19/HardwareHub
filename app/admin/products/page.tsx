"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiBox } from "react-icons/fi";
import { createProduct, fetchCategories, fetchProducts, type Category, type Product } from "@/lib/adminApi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import Field, { inputClass, textareaClass } from "@/components/admin/Field";

export default function AdminProductsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryId, setCategoryId] = useState("");
    const [name, setName] = useState("");
    const [modelNumber, setModelNumber] = useState("");
    const [specsRaw, setSpecsRaw] = useState("{}");
    const [tags, setTags] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function load() {
        try {
            const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
            setCategories(cats);
            setProducts(prods);
            if (!categoryId && cats.length) setCategoryId(cats[0].id);
        } catch (err) {
            setError((err as Error).message);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        let specs: Record<string, unknown>;
        try {
            specs = JSON.parse(specsRaw);
        } catch {
            setError('Specs must be valid JSON, e.g. {"capacity": "16GB"}');
            return;
        }
        setLoading(true);
        try {
            await createProduct({
                category_id: categoryId,
                name,
                model_number: modelNumber,
                specs,
                use_case_tags: tags || undefined,
            });
            setName("");
            setModelNumber("");
            setSpecsRaw("{}");
            setTags("");
            await load();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <AdminPageHeader icon={FiBox} title="Products" subtitle="Individual parts within a category." />

            {categories.length === 0 ? (
                <AdminCard>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Add a category first — products need one to belong to.
                    </p>
                </AdminCard>
            ) : (
                <AdminCard>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field label="Category">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className={inputClass}
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Product name">
                            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                        </Field>
                        <Field label="Model number">
                            <input
                                value={modelNumber}
                                onChange={(e) => setModelNumber(e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field label='Specs (JSON)'>
                            <textarea
                                value={specsRaw}
                                onChange={(e) => setSpecsRaw(e.target.value)}
                                rows={4}
                                placeholder='{"capacity": "16GB", "speed": "3200MHz"}'
                                className={textareaClass + " p-3"}
                            />
                        </Field>
                        <Field label="Use case tags (comma separated, optional)">
                            <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
                        </Field>
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading || !name.trim() || !modelNumber.trim()}
                            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
                        >
                            <FiPlus size={15} />
                            {loading ? "Adding…" : "Add product"}
                        </button>
                    </form>
                </AdminCard>
            )}

            <div className="mt-6 space-y-2">
                {products.length === 0 && (
                    <p className="text-sm text-slate-400 dark:text-slate-600">No products yet.</p>
                )}
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/40"
                    >
                        <span className="font-medium text-slate-900 dark:text-slate-100">{p.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{p.model_number}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}