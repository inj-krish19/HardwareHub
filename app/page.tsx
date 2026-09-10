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
} from "react-icons/fi";
import ChatWidget from "@/components/ChatWidget";
import ThemeToggle from "@/components/ThemeToggle";
import { useChatStore } from "@/lib/store/chatStore";

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

export default function HomePage() {
  const { open, sendQuery } = useChatStore();

  function askExample(query: string) {
    open();
    sendQuery(query);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          <FiCpu className="text-sky-600 dark:text-sky-400" size={18} />
          Hardware Hub
        </span>
        <nav className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 sm:gap-6">
          <a
            href="/products"
            className="hidden items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 sm:flex"
          >
            <FiBookOpen size={14} /> Catalog
          </a>
          <a
            href="/compare"
            className="hidden items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 sm:flex"
          >
            <FiBarChart2 size={14} /> Compare
          </a>
          <ThemeToggle />
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-12 pb-14 text-center sm:px-6 sm:pt-16 sm:pb-20">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
          Your PC is broken. Let&apos;s find out why.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-5">
          A guided troubleshooting engine for the hardware you already own — built from real
          diagnostic logic, not a search box full of guesses.
        </p>
        <button
          onClick={open}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-medium text-white hover:bg-sky-500"
        >
          <FiMessageCircle size={16} />
          Start diagnosing — free
        </button>
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
              className="rounded-xl border border-slate-200 p-5 dark:border-slate-800"
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

      {/* Beyond chat */}
      <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 sm:mt-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pillars.map((p) => (
            <a
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
            </a>
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