import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiBarChart2, FiExternalLink, FiZap } from "react-icons/fi";
import ChatWidget from "@/components/ChatWidget";
import CommonIssues from "@/components/CommonIssues";
import SiteHeader from "@/components/SiteHeader";
import { COMMON_ISSUES, getProduct, splitTags } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    return {
        title: product ? `${product.name} — Hardware Hub` : "Product — Hardware Hub",
        description: product ? `Specs, what it's good for, and common problems for the ${product.name}.` : undefined,
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) notFound();

    const post = product.blog_posts[0];
    const links = (post?.buy_links ?? "")
        .split(",")
        .map((l) => l.trim())
        .filter((l) => /^https?:\/\//.test(l));

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <SiteHeader />
            <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
                <Link
                    href={`/products?category=${encodeURIComponent(product.category_name)}`}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 dark:text-slate-400"
                >
                    <FiArrowLeft size={13} /> {product.category_name}
                </Link>

                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {product.name}
                </h1>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Model {product.model_number}</p>

                {splitTags(product.use_case_tags).length > 0 && (
                    <div className="mt-4">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Best suited for
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {splitTags(product.use_case_tags).map((t) => (
                                <span
                                    key={t}
                                    className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {post && (
                    <div className="mt-8 space-y-4 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {post.content}
                    </div>
                )}

                {post?.do_you_know && (
                    <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                        <FiZap className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" size={16} />
                        <div>
                            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">Do you know?</p>
                            <p className="mt-0.5 text-sm text-amber-900 dark:text-amber-100">{post.do_you_know}</p>
                        </div>
                    </div>
                )}

                <h2 className="mt-10 text-sm font-medium text-slate-900 dark:text-slate-50">Specifications</h2>
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm">
                        <tbody>
                            {Object.entries(product.specs).map(([k, v]) => (
                                <tr key={k} className="border-b border-slate-100 last:border-0 dark:border-slate-900">
                                    <th className="w-2/5 bg-slate-50 px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                                        {k}
                                    </th>
                                    <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200">{String(v)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                    Speeds are the maker&apos;s published maximums; real-world results vary.
                </p>

                <div className="mt-8">
                    <CommonIssues questions={COMMON_ISSUES[product.category_name] ?? []} />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href={`/compare?ids=${product.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-sky-400 dark:border-slate-700 dark:text-slate-300"
                    >
                        <FiBarChart2 size={14} /> Compare with similar parts
                    </Link>
                    {links.map((l) => (
                        <a
                            key={l}
                            href={l}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
                        >
                            <FiExternalLink size={14} /> Check price
                        </a>
                    ))}
                </div>
            </article>
            <ChatWidget />
        </main>
    );
}