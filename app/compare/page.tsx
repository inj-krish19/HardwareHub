import ChatWidget from "@/components/ChatWidget";
import CompareClient from "@/components/CompareClient";
import SiteHeader from "@/components/SiteHeader";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = {
    title: "Compare parts — Hardware Hub",
    description: "Put two or three PC parts side by side and see the real differences.",
};

export default async function ComparePage({
    searchParams,
}: {
    searchParams: Promise<{ ids?: string }>;
}) {
    const { ids } = await searchParams;
    const products = await getProducts();
    const initialIds = (ids ?? "").split(",").map((s) => s.trim()).filter(Boolean);

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <SiteHeader />
            <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Compare parts</h1>
                <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                    Put two or three parts side by side. No sponsored picks, just the specs.
                </p>
                <div className="mt-6">
                    {products.length === 0 ? (
                        <p className="text-sm text-slate-400 dark:text-slate-500">No products yet. Add some from the admin panel.</p>
                    ) : (
                        <CompareClient products={products} initialIds={initialIds} />
                    )}
                </div>
            </section>
            <ChatWidget />
        </main>
    );
}