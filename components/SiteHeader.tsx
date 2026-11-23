import Link from "next/link";
import { FiBarChart2, FiBookOpen, FiCpu } from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
    return (
        <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6">
            <Link
                href="/"
                className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            >
                <FiCpu className="text-sky-600 dark:text-sky-400" size={18} />
                Hardware Hub
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 sm:gap-6">
                {/* Icon-only on phones (aria-label keeps them readable to screen readers), icon + text from sm up. */}
                <Link
                    href="/products"
                    aria-label="Catalog"
                    className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100"
                >
                    <FiBookOpen size={16} /> <span className="hidden sm:inline">Catalog</span>
                </Link>
                <Link
                    href="/compare"
                    aria-label="Compare"
                    className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100"
                >
                    <FiBarChart2 size={16} /> <span className="hidden sm:inline">Compare</span>
                </Link>
                <ThemeToggle />
            </nav>
        </header>
    );
}