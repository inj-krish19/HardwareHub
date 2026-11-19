"use client";

import { useState } from "react";
import { FiCpu, FiHardDrive, FiLayers } from "react-icons/fi";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    CPU: FiCpu,
    RAM: FiLayers,
    Storage: FiHardDrive,
};

// Shows the product image if one is linked and loads; otherwise a clean
// placeholder, so a missing or broken image never leaves a hole in the page.
export default function ProductMedia({
    imageUrl,
    alt,
    category,
    className = "",
}: {
    imageUrl: string | null;
    alt: string;
    category: string;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);
    const Icon = ICONS[category] ?? FiCpu;

    if (imageUrl && !failed) {
        return (
            <div className={`flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-100 ${className}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={alt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setFailed(true)}
                    className="max-h-full max-w-full object-contain"
                />
            </div>
        );
    }
    return (
        <div
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-gradient-to-br from-sky-50 to-slate-100 text-sky-600 dark:border-slate-800 dark:from-sky-500/10 dark:to-slate-900 dark:text-sky-400 ${className}`}
        >
            <Icon size={40} />
            <span className="text-[11px] text-slate-400 dark:text-slate-500">No photo yet</span>
        </div>
    );
}