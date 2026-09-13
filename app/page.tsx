"use client";

import {
  FiCpu,
  FiCheckSquare,
  FiDollarSign,
  FiTrendingUp,
  FiTool,
  FiBookOpen,
  FiBarChart2,
  FiMessageCircle,
  FiCheck,
  FiX,
  FiShield,
  FiGitBranch,
  FiEye,
} from "react-icons/fi";
import ChatWidget from "@/components/ChatWidget";
import ThemeToggle from "@/components/ThemeToggle";
import { useChatStore } from "@/lib/store/chatStore";
import Link from "next/link";

const bots = [
  {
    icon: FiCpu,
    title: "Diagnose a problem",
    body: "Guided questions until you reach a fix, or know it's time for a technician.",
    examples: ["RAM not detected", "Blue screen after upgrade", "PC won't boot"],
  },
  {
    icon: FiCheckSquare,
    title: "Check compatibility",
    body: "Will these two parts actually work together?",
    examples: ["Is this RAM compatible with my board?", "Can I use DDR5 on a DDR4 board?"],
  },
  {
    icon: FiDollarSign,
    title: "Plan a budget build",
    body: "Tell it your budget and use case, get a reasoned component list.",
    examples: ["Best PC under ₹50,000 for coding", "Budget build for DSA practice"],
  },
  {
    icon: FiTrendingUp,
    title: "Decide what to upgrade",
    body: "Find the single bottleneck worth fixing first.",
    examples: ["Should I upgrade my CPU or GPU first?", "Is my RAM holding back my build?"],
  },
  {
    icon: FiTool,
    title: "General maintenance",
    body: "Simple care questions, answered plainly.",
    examples: ["How often should I clean my PC?", "When should I replace thermal paste?"],
  },
];

const pillars = [
  {
    icon: FiBookOpen,
    title: "Learn what you own",
    body: "Every product page explains specs in plain English, what it's suited for, and issues people actually run into.",
    href: "/products",
    cta: "Browse the catalog",
  },
  {
    icon: FiBarChart2,
    title: "Compare parts side by side",
    body: "Pick 2-3 products in the same category and see a real spec diff — no clutter, no sponsored noise.",
    href: "/compare",
    cta: "Compare products",
  },
];

const comparisonRows = [
  {
    feature: "Troubleshoots hardware that's already broken",
    hub: true,
    compareSites: false,
    forums: true,
    genericAi: true,
  },
  {
    feature: "Follows a fixed, verified decision path — not a guess",
    hub: true,
    compareSites: false,
    forums: false,
    genericAi: false,
  },
  {
    feature: "Answer traces back to an authored rule, not a hallucination",
    hub: true,
    compareSites: false,
    forums: false,
    genericAi: false,
  },
  {
    feature: "One structured answer, not 40 scattered replies to sift",
    hub: true,
    compareSites: true,
    forums: false,
    genericAi: true,
  },
  {
    feature: "Built for existing parts, not just new-build compatibility",
    hub: true,
    compareSites: false,
    forums: true,
    genericAi: true,
  },
];

function Mark({ value }: { value: boolean }) {
  return value ? (
    <FiCheck className="mx-auto text-emerald-500" size={16} />
  ) : (
    <FiX className="mx-auto text-slate-300 dark:text-slate-700" size={16} />
  );
}

export default function HomePage() {
  const { open, sendQuery } = useChatStore();

  function askExample(query: string) {
    open();
    sendQuery(query);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <Link href='/' className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 hover:scale-105 transition">
          <FiCpu className="text-sky-600 dark:text-sky-400" size={18} />
          Hardware Hub
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 sm:gap-6">
          <Link
            href="/products"
            className="hidden items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 sm:flex"
          >
            <FiBookOpen size={14} /> Catalog
          </Link>
          <Link
            href="/compare"
            className="hidden items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 sm:flex"
          >
            <FiBarChart2 size={14} /> Compare
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-visible bg-grid">
        <div className="relative z-10 mx-auto max-w-3xl px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-20 sm:pb-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-900 dark:bg-sky-500/10 dark:text-sky-400">
            <FiGitBranch size={12} />
            Rule-based diagnostics, not AI guesswork
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Your PC is broken. Let&apos;s find out why.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-5">
            A guided troubleshooting engine for the hardware you already own — every answer
            follows a fixed, verified decision path. No hallucinated fixes, no scrolling through
            forty forum replies.
          </p>
          <button
            onClick={open}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-sky-600/20 transition hover:bg-sky-500"
          >
            <FiMessageCircle size={16} />
            Start diagnosing — free
          </button>
        </div>
      </section>

      {/* What you can ask */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-center text-sm font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          One bot, five kinds of help
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-slate-200 p-5 transition hover:border-sky-300 dark:border-slate-800 dark:hover:border-sky-700"
            >
              <b.icon className="text-sky-600 dark:text-sky-400" size={20} />
              <h3 className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-50">
                {b.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {b.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {b.examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => askExample(ex)}
                    className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-sky-500 dark:hover:text-sky-400"
                  >
                    &quot;{ex}&quot;
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Hardware Hub — real positioning, not just feature bullets */}
      <section className="mx-auto mt-20 max-w-4xl px-4 sm:mt-24 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Why not just search or ask an AI?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Comparison sites are built for buying new parts. General AI chatbots can sound
            confident and still be wrong. Forums have the answer somewhere — buried in reply
            #34. Hardware Hub is built for one specific job.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                  &nbsp;
                </th>
                <th className="px-3 py-3 text-center font-medium text-sky-600 dark:text-sky-400">
                  Hardware Hub
                </th>
                <th className="px-3 py-3 text-center font-medium text-slate-500 dark:text-slate-400">
                  Comparison sites
                </th>
                <th className="px-3 py-3 text-center font-medium text-slate-500 dark:text-slate-400">
                  Forums
                </th>
                <th className="px-3 py-3 text-center font-medium text-slate-500 dark:text-slate-400">
                  Generic AI chat
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-slate-100 last:border-0 dark:border-slate-900">
                  <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">
                    {row.feature}
                  </td>
                  <td className="px-3 py-3">
                    <Mark value={row.hub} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark value={row.compareSites} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark value={row.forums} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark value={row.genericAi} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reliability — how the engine actually works, honestly */}
      <section className="mx-auto mt-20 max-w-4xl px-4 sm:mt-24 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <FiShield className="text-sky-600 dark:text-sky-400" size={20} />
            <h3 className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-50">
              No hallucinated fixes
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Every answer is a pre-authored, human-reviewed diagnostic tree — not a model
              improvising a plausible-sounding fix.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <FiEye className="text-sky-600 dark:text-sky-400" size={20} />
            <h3 className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-50">
              Explainable, not a black box
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              You can trace exactly which questions led to which conclusion — the same logic a
              technician would actually walk through.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <FiGitBranch className="text-sky-600 dark:text-sky-400" size={20} />
            <h3 className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-50">
              Knows when to stop
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              When a problem is beyond a safe DIY fix, it says so directly instead of guessing
              further — and tells you what to check with a professional.
            </p>
          </div>
        </div>
      </section>

      {/* Beyond chat */}
      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 sm:mt-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pillars.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group rounded-xl border border-slate-200 p-6 transition hover:border-sky-400 dark:border-slate-800 dark:hover:border-sky-500"
            >
              <p.icon className="text-sky-600 dark:text-sky-400" size={22} />
              <h3 className="mt-3 text-base font-medium text-slate-900 dark:text-slate-50">
                {p.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {p.body}
              </p>
              <span className="mt-3 inline-block text-xs font-medium text-sky-600 group-hover:underline dark:text-sky-400">
                {p.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-16 max-w-5xl px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-500 sm:px-6">
        8 free diagnostic questions a day, no account needed.
      </footer>

      <ChatWidget />
    </main>
  );
}