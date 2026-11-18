"use client";

import { FiMessageCircle } from "react-icons/fi";
import { useChatStore } from "@/lib/store/chatStore";

// The glue between the catalog and the chatbot: one tap opens the chat and
// asks the question, which the rule engine then matches to a guide.
export default function CommonIssues({ questions }: { questions: string[] }) {
    const { open, sendQuery } = useChatStore();
    if (questions.length === 0) return null;

    return (
        <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <h2 className="text-sm font-medium text-slate-900 dark:text-slate-50">Having trouble with this?</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Tap a question and the guided troubleshooter will walk you through it.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                {questions.map((q) => (
                    <button
                        key={q}
                        onClick={() => {
                            open();
                            sendQuery(q);
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-sky-500 dark:hover:text-sky-400"
                    >
                        <FiMessageCircle size={12} />
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
}