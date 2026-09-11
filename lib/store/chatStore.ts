import { create } from "zustand";
import { answerChat, confirmChat, startChat } from "@/lib/api";
import type { ChatStep } from "@/lib/validations/chat";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

interface ChatState {
  isOpen: boolean;
  symptomId: string | null;
  answerPath: string[];
  step: ChatStep | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  open: () => void;
  close: () => void;
  reset: () => void;
  sendQuery: (query: string) => Promise<void>;
  confirmMatch: (confirmed: boolean) => Promise<void>;
  chooseOption: (option: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  symptomId: null,
  answerPath: [],
  step: null,
  messages: [],
  isLoading: false,
  error: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ symptomId: null, answerPath: [], step: null, messages: [], error: null }),

  sendQuery: async (query: string) => {
    set((s) => ({
      isLoading: true,
      error: null,
      messages: [...s.messages, { role: "user", text: query }],
    }));
    try {
      const step = await startChat(query);
      set((s) => ({
        step,
        symptomId: step.symptom_id ?? null,
        answerPath: [],
        isLoading: false,
        messages: [...s.messages, { role: "bot", text: step.message }],
      }));
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  confirmMatch: async (confirmed: boolean) => {
    const { symptomId } = get();
    if (!symptomId) return;
    set((s) => ({
      isLoading: true,
      error: null,
      messages: [...s.messages, { role: "user", text: confirmed ? "Yes, that's it" : "No, that's not it" }],
    }));
    try {
      const step = await confirmChat(symptomId, confirmed);
      set((s) => ({
        step,
        answerPath: [],
        isLoading: false,
        messages: [...s.messages, { role: "bot", text: step.message }],
      }));
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  chooseOption: async (option: string) => {
    const { symptomId, answerPath } = get();
    if (!symptomId) return;
    const nextPath = [...answerPath, option];
    set((s) => ({
      isLoading: true,
      error: null,
      messages: [...s.messages, { role: "user", text: option }],
    }));
    try {
      const step = await answerChat(symptomId, nextPath);
      set((s) => ({
        step,
        answerPath: nextPath,
        isLoading: false,
        messages: [...s.messages, { role: "bot", text: step.message }],
      }));
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },
}));