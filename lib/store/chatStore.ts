import { create } from "zustand";
import { answerChat, confirmChat, selectBot, selectSymptomTitle, sendFeedback, startChat } from "@/lib/api";
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
  /** true once the person has rated the current final answer */
  rated: boolean;

  open: () => void;
  close: () => void;
  reset: () => void;
  sendQuery: (query: string) => Promise<void>;
  confirmMatch: (confirmed: boolean) => Promise<void>;
  rejectSuggestions: () => Promise<void>;
  chooseOption: (option: string) => Promise<void>;
  chooseBot: (botChoice: string) => Promise<void>;
  chooseSymptom: (title: string) => Promise<void>;
  rateAnswer: (helpful: boolean) => Promise<void>;
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
      rated: false,
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
  rated: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () =>
    set({ symptomId: null, answerPath: [], step: null, messages: [], error: null, rated: false }),

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

  // "None of these" on a suggestion list. The backend ignores which guide id is sent
  // here; it just routes the person to the bot picker.
  rejectSuggestions: async () => {
    const { symptomId } = get();
    if (!symptomId) return;
    await runStep(set, "None of these", () => confirmChat(symptomId, false));
  },

  chooseBot: (botChoice: string) => runStep(set, botChoice, () => selectBot(botChoice)),

  chooseSymptom: (title: string) => runStep(set, title, () => selectSymptomTitle(title)),

  rateAnswer: async (helpful: boolean) => {
    const { symptomId, answerPath } = get();
    if (!symptomId) return;
    set({ rated: true }); // optimistic: a failed vote should never block the chat
    try {
      await sendFeedback(symptomId, answerPath, helpful);
    } catch {
      /* feedback is best-effort */
    }
    set((s) => ({
      messages: [
        ...s.messages,
        {
          role: "bot",
          text: helpful
            ? "Glad that helped! Your answer helps us improve this guide."
            : "Sorry it didn't fix it. Thanks for telling us, which helps us improve this guide. You can try another question below, or take it to a technician.",
        },
      ],
    }));
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
        rated: false,
        isLoading: false,
        messages: [...s.messages, { role: "bot", text: step.message }],
      }));
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },
}));