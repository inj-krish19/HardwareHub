"use client";

import { useState } from "react";
import { FiMessageCircle, FiSend, FiX, FiRefreshCw, FiCpu } from "react-icons/fi";
import { useChatStore } from "@/lib/store/chatStore";
import { chatStartSchema } from "@/lib/validations/chat";

export default function ChatWidget() {
    const {
        isOpen,
        open,
        close,
        messages,
        step,
        isLoading,
        error,
        sendQuery,
        chooseOption,
        reset,
    } = useChatStore();
    const [input, setInput] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const parsed = chatStartSchema.safeParse({ query: input });
        if (!parsed.success) return;
        sendQuery(parsed.data.query);
        setInput("");
    }

    if (!isOpen) {
        return (
            <button
                onClick={open}
                className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
                <FiMessageCircle size={16} />
                Diagnose an issue
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 flex h-[75vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:bottom-6 sm:right-6">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    <FiCpu className="text-sky-600 dark:text-sky-400" size={16} />
                    Diagnostic Bot
                </span>
                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        aria-label="Restart"
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                        <FiRefreshCw size={15} />
                    </button>
                    <button
                        onClick={close}
                        aria-label="Close"
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                        <FiX size={17} />
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                {messages.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Describe what&apos;s wrong — e.g. &quot;RAM not detected&quot; or &quot;blue screen
                        after upgrade.&quot;
                    </p>
                )}
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={
                            m.role === "user"
                                ? "ml-auto max-w-[80%] rounded-lg bg-sky-600 px-3 py-2 text-sm text-white"
                                : "mr-auto max-w-[80%] rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                        }
                    >
                        {m.text}
                    </div>
                ))}
                {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
            </div>

            <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                {step?.kind === "question" && step.options ? (
                    <div className="flex flex-wrap gap-2">
                        {step.options.map((opt) => (
                            <button
                                key={opt}
                                disabled={isLoading}
                                onClick={() => chooseOption(opt)}
                                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="What's going on with your PC?"
                            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            aria-label="Send"
                            className="flex items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-white hover:bg-sky-500 disabled:opacity-50"
                        >
                            <FiSend size={15} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}