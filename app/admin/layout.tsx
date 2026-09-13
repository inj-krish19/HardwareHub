"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiCpu, FiGrid, FiDatabase, FiTag, FiBox, FiFileText, FiSearch } from "react-icons/fi";
import { getAdminCreds, clearAdminCreds } from "@/lib/adminAuth";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: FiGrid },
    { href: "/admin/seed", label: "Seed", icon: FiDatabase },
    { href: "/admin/symptoms", label: "Keywords", icon: FiSearch },
    { href: "/admin/categories", label: "Categories", icon: FiTag },
    { href: "/admin/products", label: "Products", icon: FiBox },
    { href: "/admin/blog", label: "Blog", icon: FiFileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (pathname === "/admin/login") {
            setChecked(true);
            return;
        }
        if (!getAdminCreds()) {
            router.replace("/admin/login");
            return;
        }
        setChecked(true);
    }, [pathname, router]);

    if (pathname === "/admin/login") return <>{children}</>;
    if (!checked) return null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        <Link href="/" className="flex items-center gap-2">
                            <FiCpu className="text-sky-600 dark:text-sky-400" size={16} />
                            Hardware Hub
                        </Link>
                        <Link href="/admin" className="text-slate-400 dark:text-slate-600">
                            / Admin
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={() => {
                                clearAdminCreds();
                                router.push("/admin/login");
                            }}
                            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        >
                            <FiLogOut size={13} /> Log out
                        </button>
                    </div>
                </div>
                <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2.5 text-sm sm:px-6">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition ${active
                                    ? "bg-sky-600 text-white"
                                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                                    }`}
                            >
                                <item.icon size={13} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </header>
            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
        </div>
    );
}