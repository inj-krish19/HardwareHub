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