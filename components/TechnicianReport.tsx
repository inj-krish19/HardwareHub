"use client";

import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheck, FiClipboard, FiCopy, FiDownload } from "react-icons/fi";
import { fetchReport } from "@/lib/api";
import { composeReport, MAX_DEVICE_LENGTH, MAX_NOTES_LENGTH, todayLabel } from "@/lib/reportText";
import type { TechnicianReport as Report } from "@/lib/validations/chat";

const fieldClass =
    "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

// Shown under a "needs a professional" answer. It builds a short summary of what was
// checked, for the person to copy and give to a technician. The summary comes from the
// server (the same guide, replayed with the person's answers); the two optional fields
// below are typed here and are never sent anywhere.
//
// Layout: the button sits in the chat footer; opening it covers the whole chat window with
// a sheet (header with "Back to chat", a scrolling body, and Copy / Save pinned at the
// bottom). It must NOT be rendered inside the footer itself: the chat window has a fixed
// height, so a tall panel there squeezes the conversation away and pushes Copy off screen.
export default function TechnicianReport({ symptomId, answerPath }: { symptomId: string; answerPath: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [device, setDevice] = useState("");
    const [notes, setNotes] = useState("");
    const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    async function openPanel() {
        setIsOpen(true);
        if (report || loading) return;
        setLoading(true);
        setError(null);
        try {
            setReport(await fetchReport(symptomId, answerPath));
        } catch {
            setError("Could not prepare the summary. Please try again in a moment.");
        } finally {
            setLoading(false);
        }
    }

    const text = report ? composeReport(report, { device, notes }, todayLabel()) : "";

    async function copy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopyState("copied");
        } catch {
            setCopyState("failed"); // blocked clipboard: the text above can still be selected by hand
        }
        setTimeout(() => setCopyState("idle"), 2500);
    }

    function download() {
        const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "pc-problem-summary.txt";
        link.click();
        URL.revokeObjectURL(url);
    }

    if (!isOpen) {
        return (
            <button
                onClick={openPanel}
                className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-left text-xs font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100 dark:hover:bg-amber-500/20 cursor-pointer"
            >
                <FiClipboard size={14} className="shrink-0" />
                Prepare a summary for a technician
            </button>
        );
    }

    return (
        <>
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Summary for a technician"
                className="absolute inset-0 z-20 flex flex-col bg-white dark:bg-slate-900"
            >
                <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Back to chat"
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        <FiArrowLeft size={14} /> Back to chat
                    </button>
                    <p className="ml-auto text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Summary for a technician
                    </p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        Copy this and give it to a repair shop or a friend who knows PCs, so they can see what you
                        already checked. What you type below stays in your browser and is not sent anywhere.
                    </p>

                    {loading && <p className="mt-4 text-xs text-slate-400">Preparing…</p>}
                    {error && <p className="mt-4 text-xs text-red-500">{error}</p>}

                    {report && (
                        <>
                            <div className="mt-4 space-y-2">
                                <input
                                    value={device}
                                    onChange={(e) => setDevice(e.target.value)}
                                    maxLength={MAX_DEVICE_LENGTH}
                                    placeholder="Your PC or part (make and model), optional"
                                    aria-label="Device"
                                    className={fieldClass}
                                />
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    maxLength={MAX_NOTES_LENGTH}
                                    rows={2}
                                    placeholder="Anything else you noticed, optional"
                                    aria-label="Other details"
                                    className={fieldClass + " resize-none"}
                                />
                            </div>

                            <pre
                                data-testid="report-preview"
                                className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700 dark:bg-slate-950 dark:text-slate-300"
                            >
                                {text}
                            </pre>
                        </>
                    )}
                </div>

                {report && (
                    <div className="shrink-0 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={copy}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-500 cursor-pointer"
                            >
                                {copyState === "copied" ? <FiCheck size={13} /> : <FiCopy size={13} />}
                                {copyState === "copied" ? "Copied" : "Copy summary"}
                            </button>
                            <button
                                onClick={download}
                                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                <FiDownload size={13} /> Save as a file
                            </button>
                        </div>
                        {copyState === "failed" && (
                            <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">
                                Copying was blocked. Select the text above and copy it by hand.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}