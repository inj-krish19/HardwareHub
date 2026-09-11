"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCpu, FiLock } from "react-icons/fi";
import { setAdminCreds } from "@/lib/adminAuth";
import { verifyAdminCreds } from "@/lib/adminApi";
import { inputClass } from "@/components/admin/Field";

export default function AdminLoginPage() {
    const router = useRouter();
    const [id, setId] = useState("");
    const [secret, setSecret] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const ok = await verifyAdminCreds(id, secret);
            if (!ok) {
                setError("Invalid admin ID or secret.");
                return;
            }
            setAdminCreds({ id, secret });
            router.push("/admin");
        } catch {
            setError("Couldn't reach the server — check the API is running.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 dark:bg-slate-950">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(2,132,199,0.08),transparent_60%)]" />
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                    <FiCpu size={18} />
                </div>
                <h1 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                    Admin access
                </h1>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Internal only — credentials shared between the two of you.
                </p>

                <div className="mt-6 space-y-4">
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                            Admin ID
                        </span>
                        <input value={id} onChange={(e) => setId(e.target.value)} className={inputClass} />
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
                            Admin Secret
                        </span>
                        <input
                            type="password"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            className={inputClass}
                        />
                    </label>
                </div>

                {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading || !id || !secret}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 disabled:opacity-50"
                >
                    <FiLock size={14} />
                    {loading ? "Checking…" : "Log in"}
                </button>
            </form>
        </div>
    );
}   