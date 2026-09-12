"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiFileText } from "react-icons/fi";
import { createBlogPost, fetchProducts, type Product } from "@/lib/adminApi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import Field, { inputClass, textareaClass } from "@/components/admin/Field";

export default function AdminBlogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productId, setProductId] = useState("");
    const [content, setContent] = useState("");
    const [doYouKnow, setDoYouKnow] = useState("");
    const [buyLinks, setBuyLinks] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts()
            .then((p) => {
                setProducts(p);
                if (p.length) setProductId(p[0].id);
            })
            .catch((err) => setError((err as Error).message));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setStatus(null);
        setLoading(true);
        try {
            await createBlogPost({
                product_id: productId,
                content,
                do_you_know: doYouKnow || undefined,
                buy_links: buyLinks || undefined,
            });
            setStatus("Blog post published.");
            setContent("");
            setDoYouKnow("");
            setBuyLinks("");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <AdminPageHeader icon={FiFileText} title="Blog" subtitle="Write-ups attached to a product page." />

            {products.length === 0 ? (
                <AdminCard>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Add a product first — blog posts need one to attach to.
                    </p>
                </AdminCard>
            ) : (
                <AdminCard>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field label="Product">
                            <select
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className={inputClass}
                            >
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Content">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={8}
                                className={textareaClass.replace("font-mono text-xs", "text-sm") + " p-3"}
                            />
                        </Field>
                        <Field label='"Do You Know?" trivia (optional)'>
                            <textarea
                                value={doYouKnow}
                                onChange={(e) => setDoYouKnow(e.target.value)}
                                rows={2}
                                className={textareaClass.replace("font-mono text-xs", "text-sm") + " p-3"}
                            />
                        </Field>
                        <Field label="Buy links, comma separated (optional)">
                            <input
                                value={buyLinks}
                                onChange={(e) => setBuyLinks(e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        {status && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">{status}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading || !content.trim()}
                            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
                        >
                            <FiPlus size={15} />
                            {loading ? "Publishing…" : "Publish post"}
                        </button>
                    </form>
                </AdminCard>
            )}
        </div>
    );
}