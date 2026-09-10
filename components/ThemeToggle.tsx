"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
    const { theme, toggle } = useTheme();
    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
            {theme === "light" ? <FiMoon size={14} /> : <FiSun size={14} />}
        </button>
    );
}