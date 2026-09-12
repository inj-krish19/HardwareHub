import { create } from "zustand";
import { answerChat, confirmChat, selectBot, selectSymptomTitle, startChat } from "@/lib/api";
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
  chooseBot: (botChoice: string) => Promise<void>;
  chooseSymptom: (title: string) => Promise<void>;
}

async function runStep(
  set: (partial: Partial<ChatState> | ((s: ChatState) => Partial<ChatState>)) => void,
  userText: string,
  call: () => Promise<ChatStep>
) {
  set((s) => ({
    isLoading: true,
    error: null,
    messages: [...s.messages, { role: "user", text: userText }],
  }));
  try {
    const step = await call();
    set((s) => ({
      step,
      symptomId: step.symptom_id ?? s.symptomId,
      answerPath: [],
      isLoading: false,
      messages: [...s.messages, { role: "bot", text: step.message }],
    }));
  } catch (err) {
    set({ isLoading: false, error: (err as Error).message });
  }
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

  sendQuery: (query: string) => runStep(set, query, () => startChat(query)),

  confirmMatch: async (confirmed: boolean) => {
    const { symptomId } = get();
    if (!symptomId) return;
    await runStep(
      set,
      confirmed ? "Yes, that's it" : "No, that's not it",
      () => confirmChat(symptomId, confirmed)
    );
  },

  chooseBot: (botChoice: string) => runStep(set, botChoice, () => selectBot(botChoice)),

  chooseSymptom: (title: string) => runStep(set, title, () => selectSymptomTitle(title)),

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