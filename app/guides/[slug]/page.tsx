import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import ChatWidget from "@/components/ChatWidget";
import GuideChatButton from "@/components/GuideChatButton";
import GuideTree from "@/components/GuideTree";
import SiteHeader from "@/components/SiteHeader";
import { BOT_LABELS, firstQuestion, getGuide } from "@/lib/guides";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const guide = await getGuide(slug);
    if (!guide) return { title: "Guide not found — Hardware Hub" };
    const question = firstQuestion(guide.question_tree);
    const description =
        `Step-by-step ${guide.category} guide: ${guide.title}.` + (question ? ` Starts with: ${question}` : "");
    return {
        title: `${guide.title} — Hardware Hub`,
        // Search results cut descriptions off at roughly 155 characters.
        description: description.length > 155 ? `${description.slice(0, 152).trimEnd()}...` : description,
        alternates: { canonical: `/guides/${guide.slug}` },
    };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const guide = await getGuide(slug);
    if (!guide) notFound();

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <SiteHeader />
            <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
                <Link
                    href="/guides"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 dark:text-slate-400"
                >
                    <FiArrowLeft size={13} /> All guides
                </Link>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                        {guide.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                        {BOT_LABELS[guide.bot_type] ?? guide.bot_type}
                    </span>
                </div>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {guide.title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Every step below was written and checked by people, not generated. Follow the answers that match
                    your situation, or let the troubleshooter ask the questions one at a time.
                </p>
                <div className="mt-4">
                    <GuideChatButton title={guide.title} />
                </div>

                <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                    Safety first: switch off and unplug your PC before opening the case, and never open a power supply
                    unit.
                </p>

                <section className="mt-8" aria-label="Decision guide">
                    <GuideTree tree={guide.question_tree} />
                </section>

                {guide.related.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            More {guide.category} guides
                        </h2>
                        <ul className="mt-3 space-y-1.5">
                            {guide.related.map((r) => (
                                <li key={r.slug}>
                                    <Link
                                        href={`/guides/${r.slug}`}
                                        className="text-sm text-sky-700 hover:underline dark:text-sky-300"
                                    >
                                        {r.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </article>
            <ChatWidget />
        </main>
    );
}