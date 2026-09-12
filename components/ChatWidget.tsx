"use client";

import { useState } from "react";
import { FiMessageCircle, FiSend, FiX, FiRefreshCw, FiCpu, FiMaximize2, FiMinimize2, FiLayers, FiCompass } from "react-icons/fi";
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
        confirmMatch,
        chooseBot,
        chooseSymptom,
        reset,
    } = useChatStore();
    const [input, setInput] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

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
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-sky-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:bg-sky-500 hover:shadow-sky-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer"
            >
                <FiMessageCircle size={18} />
                Diagnose an issue
            </button>
        );
    }

    return (
        <div
            className={`fixed z-50 flex flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 ${isExpanded
                ? "inset-4 sm:inset-12 md:inset-20 max-w-4xl max-h-[85vh] rounded-3xl mx-auto my-auto"
                : "bottom-4 right-4 h-[75vh] max-h-[580px] w-[calc(100vw-2rem)] max-w-[400px] rounded-2xl sm:bottom-6 sm:right-6"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400">
                        <FiCpu size={18} />
                    </div>
                    <div>
                        <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Diagnostic Assistant
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                            AI-Powered PC Troubleshooting
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? "Minimize window" : "Expand window"}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                    </button>
                    <button
                        onClick={reset}
                        aria-label="Restart chat"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <FiRefreshCw size={16} />
                    </button>
                    <button
                        onClick={close}
                        aria-label="Close chat"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <FiX size={18} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 scrollbar-thin">
                {messages.length === 0 && (
                    <div className="my-auto flex flex-col items-center justify-center py-10 text-center">
                        <div className="mb-3 rounded-full bg-sky-50 p-3 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                            <FiMessageCircle size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            How can we help with your PC today?
                        </p>
                        <p className="mt-1 max-w-[260px] text-xs text-slate-400 dark:text-slate-500">
                            Describe your problem — e.g. &quot;RAM not detected&quot;, &quot;blue screen after upgrade&quot;, or &quot;won&apos;t boot&quot;.
                        </p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                    >
                        <div
                            className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${m.role === "user"
                                ? "bg-sky-600 text-white rounded-br-xs"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 rounded-bl-xs border border-slate-200/50 dark:border-slate-700/50"
                                }`}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 px-2 py-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-sky-600 [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-sky-600 [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-sky-600"></div>
                        <span className="text-xs ml-1">Analyzing issue...</span>
                    </div>
                )}
                {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                        {error}
                    </div>
                )}
            </div>

            {/* Interactive Options / Input Footer */}
            <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/50">
                {step?.kind === "confirm" && step.options ? (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Did you mean this issue?</p>
                        <div className="flex flex-wrap gap-2">
                            {step.options.map((opt) => (
                                <button
                                    key={opt}
                                    disabled={isLoading}
                                    onClick={() => confirmMatch(opt.startsWith("Yes"))}
                                    className="rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-medium text-sky-700 transition-all hover:bg-sky-100 disabled:opacity-50 dark:border-sky-700 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20 cursor-pointer"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : step?.kind === "clarify_bot_choice" && step.options ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            <FiCompass size={13} className="text-sky-600 dark:text-sky-400" />
                            <span>Select a bot category to view specific guides:</span>
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                            {step.options.map((opt) => (
                                <button
                                    key={opt}
                                    disabled={isLoading}
                                    onClick={() => chooseBot(opt)}
                                    className="w-full text-left rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 transition-all hover:border-sky-500 hover:bg-sky-50/50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-sky-500/10 cursor-pointer shadow-2xs"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : step?.kind === "clarify_list" && step.options ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            <FiLayers size={13} className="text-sky-600 dark:text-sky-400" />
                            <span>Select the closest match to proceed:</span>
                        </div>
                        <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                            {step.options.map((opt) => (
                                <button
                                    key={opt}
                                    disabled={isLoading}
                                    onClick={() => chooseSymptom(opt)}
                                    className="w-full text-left rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 transition-all hover:border-sky-500 hover:bg-sky-50/50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-sky-500/10 cursor-pointer shadow-2xs"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : step?.kind === "question" && step.options ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                            {step.options.map((opt) => (
                                <button
                                    key={opt}
                                    disabled={isLoading}
                                    onClick={() => chooseOption(opt)}
                                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-sky-500 hover:bg-sky-50/50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-sky-500/10 cursor-pointer"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe your PC issue..."
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            aria-label="Send message"
                            className="flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-white shadow-sm transition-all hover:bg-sky-500 disabled:opacity-50 cursor-pointer"
                        >
                            <FiSend size={16} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}