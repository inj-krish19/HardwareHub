import { z } from "zod";

export const chatStartSchema = z.object({
  query: z.string().min(1, "Type a question first").max(500),
});
export type ChatStartInput = z.infer<typeof chatStartSchema>;

export const chatAnswerSchema = z.object({
  symptom_id: z.uuid(),
  answer_path: z.array(z.string()).default([]),
});
export type ChatAnswerInput = z.infer<typeof chatAnswerSchema>;

export const chatStepSchema = z.object({
  symptom_id: z.uuid().nullable().optional(),
  kind: z.enum(["question", "conclusion", "escalate", "clarify"]),
  message: z.string(),
  node_id: z.string().nullable().optional(),
  options: z.array(z.string()).nullable().optional(),
});
export type ChatStep = z.infer<typeof chatStepSchema>;