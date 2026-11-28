"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiCamera, FiRefreshCw, FiSend } from "react-icons/fi";
import { MAX_TEXT, readPhoto, validatePhoto, type OcrProgress } from "@/lib/ocr";

type Phase = "closed" | "reading" | "review" | "error";

const STAGE_TEXT: Record<OcrProgress["stage"], string> = {
    preparing: "Preparing the picture…",
    loading: "Getting the reader ready (only the first time)…",
    reading: "Reading the text…",
};

// A camera button for the chat. Pick or take a photo of an error screen (a blue screen, a boot message,
// a monitor's "no signal" message, a BIOS warning, a printed label). The text in it is read ON THIS DEVICE and
// shown to the person to check and fix before it is sent to the chat. The picture is never uploaded or kept.
//
// Layout: like the technician summary, the review step is a sheet that covers the whole chat window, so it
// cannot squeeze the conversation (the chat window has a fixed height).
export default function PhotoReader({ onUse, disabled }: { onUse: (text: string) => void; disabled?: boolean }) {
    const [phase, setPhase] = useState<Phase>("closed");
    const [progress, setProgress] = useState<OcrProgress>({ stage: "preparing", percent: 0 });
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);

    // Drop the thumbnail from memory whenever it changes or the component goes away.
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

    useEffect(() => {
        if (phase === "closed") return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    function close() {
        setPhase("closed");
        setPreview(null);
        setText("");
        setError(null);
        if (fileInput.current) fileInput.current.value = ""; // so choosing the same file again still fires
    }

    async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const problem = validatePhoto(file);
        setPreview(URL.createObjectURL(file));
        setError(problem);
        if (problem) {
            setPhase("error");
            return;
        }
        setPhase("reading");
        setProgress({ stage: "preparing", percent: 0 });
        try {
            setText(await readPhoto(file, setProgress));
            setPhase("review");
        } catch (err) {
            setError((err as Error).message);
            setPhase("error");
        }
    }

    function send() {
        const finalText = text.trim();
        if (!finalText) return;
        onUse(finalText);
        close();
    }

    return (
        <>
            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={onPick} className="hidden" aria-label="Choose a photo" />
            <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={disabled}
                aria-label="Read text from a photo"
                title="Read text from a photo of an error screen"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-sky-400 hover:text-sky-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 cursor-pointer"
            >
                <FiCamera size={16} />
            </button>

            {phase !== "closed" && (
                <div role="dialog" aria-modal="true" aria-label="Read text from a photo" className="absolute inset-0 z-20 flex flex-col bg-white dark:bg-slate-900">
                    <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={close}
                            aria-label="Back to chat"
                            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                        >
                            <FiArrowLeft size={14} /> Back to chat
                        </button>
                        <p className="ml-auto text-sm font-semibold text-slate-900 dark:text-slate-50">Text from your photo</p>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Your photo is read on your device. It is not uploaded or saved. Only the text below is sent, and only if you press the button.
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {preview && <img src={preview} alt="Your photo" className="mt-3 max-h-40 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain dark:border-slate-700 dark:bg-slate-950" />}

                        {phase === "reading" && (
                            <div className="mt-4" role="status">
                                <p className="text-xs text-slate-600 dark:text-slate-300">{STAGE_TEXT[progress.stage]}</p>
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${progress.percent}%` }} />
                                </div>
                            </div>
                        )}

                        {phase === "error" && <p className="mt-4 text-xs text-red-600 dark:text-red-400" role="alert">{error}</p>}

                        {phase === "review" && (
                            <div className="mt-4">
                                <label htmlFor="photo-text" className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                    This is what I could read. Fix anything that looks wrong, or delete what does not matter.
                                </label>
                                <textarea
                                    id="photo-text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    maxLength={MAX_TEXT}
                                    rows={8}
                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 font-mono text-[12px] leading-snug text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                                />
                                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                                    Please remove any name, address or number you do not want to share.
                                </p>
                            </div>
                        )}
                    </div>

                    {(phase === "review" || phase === "error") && (
                        <div className="shrink-0 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                {phase === "review" && (
                                    <button
                                        type="button"
                                        onClick={send}
                                        disabled={!text.trim()}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-50 cursor-pointer"
                                    >
                                        <FiSend size={13} /> Use this text
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => fileInput.current?.click()}
                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    <FiRefreshCw size={13} /> Try another photo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}