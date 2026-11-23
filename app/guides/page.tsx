import type { Metadata } from "next";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import SiteHeader from "@/components/SiteHeader";
import { BOT_LABELS, BOT_ORDER, getGuides, type GuideSummary } from "@/lib/guides";

export const metadata: Metadata = {
    title: "All PC troubleshooting guides — Hardware Hub",
    description:
        "Every Hardware Hub guide in one place: fix a PC problem, check compatibility, plan a build, decide what to upgrade, and keep your PC healthy.",
    alternates: { canonical: "/guides" },
};

function groupByCategory(guides: GuideSummary[]): [string, GuideSummary[]][] {
    const map = new Map<string, GuideSummary[]>();
    for (const g of guides) map.set(g.category, [...(map.get(g.category) ?? []), g]);
    return [...map.entries()];
}

export default async function GuidesIndexPage() {
    const guides = await getGuides();
    const present = new Set(guides.map((g) => g.bot_type));
    // The five known bots in their usual order, then any other bot type that has guides.
    const bots = [...BOT_ORDER.filter((b) => present.has(b)), ...[...present].filter((b) => !BOT_ORDER.includes(b))];

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <SiteHeader />
            <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">All guides</h1>
                <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                    {guides.length} step-by-step guides, each one a fixed decision path written by people. Open any
                    guide to read the whole thing.
                </p>

                {guides.length === 0 && (
                    <p className="mt-8 text-sm text-slate-400 dark:text-slate-500">No guides to show right now.</p>
                )}

                {bots.map((bot) => (
                    <div key={bot} className="mt-10">
                        <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            {BOT_LABELS[bot] ?? bot}
                        </h2>
                        <div className="mt-4 grid gap-6 sm:grid-cols-2">
                            {groupByCategory(guides.filter((g) => g.bot_type === bot)).map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">{category}</h3>
                                    <ul className="mt-2 space-y-1.5">
                                        {items.map((g) => (
                                            <li key={g.slug}>
                                                <Link
                                                    href={`/guides/${g.slug}`}
                                                    className="text-sm text-sky-700 hover:underline dark:text-sky-300"
                                                >
                                                    {g.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
            <ChatWidget />
        </main>
    );
}