import { FiDatabase, FiTag, FiBox, FiFileText, FiGrid } from "react-icons/fi";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const cards = [
    { href: "/admin/seed", icon: FiDatabase, title: "Seed diagnostics", body: "Paste a generated symptom JSON array to bulk-load diagnostic trees." },
    { href: "/admin/categories", icon: FiTag, title: "Categories", body: "Create product categories (RAM, Storage, PSU, ...)." },
    { href: "/admin/products", icon: FiBox, title: "Products", body: "Add a product with specs and use-case tags." },
    { href: "/admin/blog", icon: FiFileText, title: "Blog", body: "Write a blog post for a product page." },
];

export default function AdminDashboard() {
    return (
        <div>
            <AdminPageHeader icon={FiGrid} title="Dashboard" subtitle="Content management for Hardware Hub." />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {cards.map((c) => (
                    <a
                        key={c.href}
                        href={c.href}
                        className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-sky-600"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                            <c.icon size={17} />
                        </div>
                        <h2 className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-50">
                            {c.title}
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {c.body}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
}