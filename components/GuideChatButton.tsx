"use client";

import { FiMessageCircle } from "react-icons/fi";
import { useChatStore } from "@/lib/store/chatStore";

// Opens the chat already inside this guide, so the person can answer the
// questions one at a time instead of reading the whole tree.
export default function GuideChatButton({ title }: { title: string }) {
    const { open, chooseSymptom } = useChatStore();
    return (
        <button
            onClick={() => {
                open();
                chooseSymptom(title);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
            <FiMessageCircle size={14} /> Walk me through it
        </button>
    );
}