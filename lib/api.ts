import { chatStepSchema, type ChatStep } from "@/lib/validations/chat";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not set — add it to frontend/.env.local");
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API error ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export async function startChat(query: string): Promise<ChatStep> {
  const data = await post<unknown>("/chat/start", { query });
  return chatStepSchema.parse(data);
}

export async function answerChat(symptomId: string, answerPath: string[]): Promise<ChatStep> {
  const data = await post<unknown>("/chat/answer", {
    symptom_id: symptomId,
    answer_path: answerPath,
  });
  return chatStepSchema.parse(data);
}

export async function confirmChat(symptomId: string, confirmed: boolean): Promise<ChatStep> {
  const data = await post<unknown>("/chat/confirm", {
    symptom_id: symptomId,
    confirmed,
  });
  return chatStepSchema.parse(data);
}

export async function selectBot(botChoice: string): Promise<ChatStep> {
  const data = await post<unknown>("/chat/bot-selection", { bot_choice: botChoice });
  return chatStepSchema.parse(data);
}

export async function selectSymptomTitle(title: string): Promise<ChatStep> {
  const data = await post<unknown>("/chat/symptom-selection", { title });
  return chatStepSchema.parse(data);
}

export async function selectBudgetTask(taskType: string): Promise<ChatStep> {
  const data = await post<unknown>("/chat/budget-task-selection", { task_type: taskType });
  return chatStepSchema.parse(data);
}

export async function getBudgetRecommendation(taskType: string, budgetAmount: number): Promise<ChatStep> {
  const data = await post<unknown>("/chat/budget-amount", {
    task_type: taskType,
    budget_amount: budgetAmount,
  });
  return chatStepSchema.parse(data);
}