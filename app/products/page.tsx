import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import SiteHeader from "@/components/SiteHeader";
import { getProducts, splitTags, type CatalogProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = {
    title: "Catalog — Hardware Hub",
    description: "Plain-English guides to PC parts: specs, what they're good for, and common problems.",
};

// A few headline specs per category so cards are scannable without opening them.
const HIGHLIGHTS: Record<string, string[]> = {
    CPU: ["Cores / Threads", "Socket", "Max boost clock"],
    RAM: ["Capacity", "Type", "Speed"],
    Storage: ["Capacity", "Interface", "Max read speed"],
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const products = await getProducts();
    const categories = Array.from(new Set(products.map((p) => p.category_name)));
    const visible = category ? products.filter((p) => p.category_name === category) : products;

    const grouped = new Map<string, CatalogProduct[]>();
    for (const p of visible) grouped.set(p.category_name, [...(grouped.get(p.category_name) ?? []), p]);

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <SiteHeader />
            <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Catalog</h1>
                <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                    PC parts explained in plain English: what the specs mean, what each part is good for, and the problems
                    people run into.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                    <Link
                        href="/products"
                        className={`rounded-full border px-3 py-1 text-xs ${!category
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-slate-200 text-slate-600 hover:border-sky-400 dark:border-slate-700 dark:text-slate-400"
                            }`}
                    >
                        All
                    </Link>
                    {categories.map((c) => (
                        <Link
                            key={c}
                            href={`/products?category=${encodeURIComponent(c)}`}
                            className={`rounded-full border px-3 py-1 text-xs ${category === c
                                ? "border-sky-600 bg-sky-600 text-white"
                                : "border-slate-200 text-slate-600 hover:border-sky-400 dark:border-slate-700 dark:text-slate-400"
                                }`}
                        >
                            {c}
                        </Link>
                    ))}
                </div>

                {products.length === 0 && (
                    <p className="mt-10 text-sm text-slate-400 dark:text-slate-500">
                        No products yet. Add some from the admin panel.
                    </p>
                )}

                {[...grouped.entries()].map(([name, items]) => (
                    <div key={name} className="mt-10">
                        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{name}</h2>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/products/${p.id}`}
                                    className="group rounded-xl border border-slate-200 p-5 transition hover:border-sky-400 dark:border-slate-800 dark:hover:border-sky-500"
                                >
                                    <h3 className="text-sm font-medium text-slate-900 group-hover:text-sky-600 dark:text-slate-50 dark:group-hover:text-sky-400">
                                        {p.name}
                                    </h3>
                                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{p.model_number}</p>
                                    <dl className="mt-3 space-y-1">
                                        {(HIGHLIGHTS[p.category_name] ?? Object.keys(p.specs).slice(0, 3)).map((k) =>
                                            p.specs[k] ? (
                                                <div key={k} className="flex justify-between gap-3 text-xs">
                                                    <dt className="text-slate-500 dark:text-slate-400">{k}</dt>
                                                    <dd className="text-right text-slate-800 dark:text-slate-200">{p.specs[k]}</dd>
                                                </div>
                                            ) : null
                                        )}
                                    </dl>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {splitTags(p.use_case_tags).slice(0, 3).map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
            <ChatWidget />
        </main>
    );
}