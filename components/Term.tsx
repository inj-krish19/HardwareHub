"use client";

import { useState } from "react";

// A jargon term with a plain-English explanation. Works on hover, keyboard
// focus, and tap (mobile), so it never relies on hover alone.
export default function Term({ children, definition }: { children: React.ReactNode; definition: string }) {
    const [open, setOpen] = useState(false);
    return (
        <span className="group relative inline-block">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                onBlur={() => setOpen(false)}
                className="cursor-help border-b border-dotted border-sky-500 text-inherit focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
                aria-expanded={open}
            >
                {children}
            </button>
            <span
                role="tooltip"
                className={`absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-left text-xs font-normal leading-snug text-slate-100 shadow-lg dark:bg-slate-700 ${open ? "block" : "hidden group-hover:block"
                    }`}
            >
                {definition}
            </span>
        </span>
    );
}