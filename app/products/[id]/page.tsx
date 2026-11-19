import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiBarChart2, FiExternalLink, FiPlayCircle, FiShoppingCart, FiZap } from "react-icons/fi";
import ChatWidget from "@/components/ChatWidget";
import CommonIssues from "@/components/CommonIssues";
import GlossaryText from "@/components/GlossaryText";
import ProductMedia from "@/components/ProductMedia";
import SiteHeader from "@/components/SiteHeader";
import Term from "@/components/Term";
import {
    COMMON_ISSUES,
    getProduct,
    getProducts,
    parseLinks,
    similarProducts,
    splitTags,
    storeLabel,
    youtubeEmbed,
} from "@/lib/catalog";
import { SPEC_GLOSSARY } from "@/lib/glossary";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    return {
        title: product ? `${product.name} — Hardware Hub` : "Product — Hardware Hub",
        description: product ? `Specs, what it's good for, and common problems for the ${product.name}.` : undefined,
    };
}

const HEADLINE: Record<string, string[]> = {
    CPU: ["Cores / Threads", "Socket", "Max boost clock"],
    RAM: ["Capacity", "Type", "Speed"],
    Storage: ["Capacity", "Interface", "Max read speed"],
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [product, all] = await Promise.all([getProduct(id), getProducts()]);
    if (!product) notFound();

    const post = product.blog_posts[0];
    const links = parseLinks(post?.buy_links ?? null);
    const embed = youtubeEmbed(product.video_url);
    const similar = similarProducts(product, all);
    const tags = splitTags(product.use_case_tags);
    const headline = (HEADLINE[product.category_name] ?? Object.keys(product.specs).slice(0, 3)).filter(
        (k) => product.specs[k]
    );

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <SiteHeader />
            <article className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
                <Link
                    href={`/products?category=${encodeURIComponent(product.category_name)}`}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 dark:text-slate-400"
                >
                    <FiArrowLeft size={13} /> {product.category_name}
                </Link>

                {/* Top: image + at-a-glance */}
                <div className="mt-4 grid gap-6 md:grid-cols-5">
                    <ProductMedia
                        imageUrl={product.image_url}
                        alt={product.name}
                        category={product.category_name}
                        className="h-56 md:col-span-2 md:h-64"
                    />
                    <div className="md:col-span-3">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            {product.name}
                        </h1>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Model {product.model_number}</p>

                        {headline.length > 0 && (
                            <dl className="mt-4 grid grid-cols-3 gap-2">
                                {headline.map((k) => (
                                    <div key={k} className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800">
                                        <dt className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{k}</dt>
                                        <dd className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {product.specs[k]}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {tags.length > 0 && (
                            <div className="mt-4">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Best suited for
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {tags.map((t) => (
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

                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href={`/compare?ids=${product.id}`}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-sky-400 dark:border-slate-700 dark:text-slate-300"
                            >
                                <FiBarChart2 size={14} /> Compare
                            </Link>
                            {links[0] && (
                                <a
                                    href={links[0]}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
                                >
                                    <FiShoppingCart size={14} /> Check price
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Write-up */}
                {post && (
                    <div className="mt-10 space-y-4 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        <GlossaryText text={post.content} />
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

                {/* Video */}
                {embed && (
                    <section className="mt-10">
                        <h2 className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-50">
                            <FiPlayCircle size={15} className="text-sky-600 dark:text-sky-400" /> Watch
                        </h2>
                        <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                            <iframe
                                src={embed}
                                title={`${product.name} video`}
                                loading="lazy"
                                allow="accelerometer; encrypted-media; picture-in-picture"
                                allowFullScreen
                                className="h-full w-full"
                            />
                        </div>
                    </section>
                )}

                {/* Specs with tooltips */}
                <section className="mt-10">
                    <h2 className="text-sm font-medium text-slate-900 dark:text-slate-50">Specifications</h2>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Hover or tap a dotted label for a plain-English explanation.
                    </p>
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-sm">
                            <tbody>
                                {Object.entries(product.specs).map(([k, v]) => (
                                    <tr key={k} className="border-b border-slate-100 last:border-0 dark:border-slate-900">
                                        <th className="w-2/5 bg-slate-50 px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                                            {SPEC_GLOSSARY[k] ? <Term definition={SPEC_GLOSSARY[k]}>{k}</Term> : k}
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
                </section>

                {/* Where to buy */}
                {links.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-sm font-medium text-slate-900 dark:text-slate-50">Where to buy</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {links.map((l) => (
                                <a
                                    key={l}
                                    href={l}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-sky-400"
                                >
                                    <FiExternalLink size={14} /> {storeLabel(l)}
                                </a>
                            ))}
                        </div>
                        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                            We only link to stores for reference. Prices change often, so check the current price there.
                        </p>
                    </section>
                )}

                {/* Common issues -> chatbot */}
                <div className="mt-10">
                    <CommonIssues questions={COMMON_ISSUES[product.category_name] ?? []} />
                </div>

                {/* Similar products */}
                {similar.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-sm font-medium text-slate-900 dark:text-slate-50">Similar and alternative parts</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            {similar.map(({ product: p, reason }) => (
                                <div key={p.id} className="flex flex-col rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                                    <Link href={`/products/${p.id}`} className="text-sm font-medium text-slate-900 hover:text-sky-600 dark:text-slate-50 dark:hover:text-sky-400">
                                        {p.name}
                                    </Link>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{reason}</p>
                                    <Link
                                        href={`/compare?ids=${product.id},${p.id}`}
                                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
                                    >
                                        <FiBarChart2 size={12} /> Compare with this one
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </article>
            <ChatWidget />
        </main>
    );
}