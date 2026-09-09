import { z } from "zod";

export const chatStartSchema = z.object({
  query: z.string().min(1, "Type a question first").max(500),
  user_id: z.uuid().optional(),
});
export type ChatStartInput = z.infer<typeof chatStartSchema>;

export const chatAnswerSchema = z.object({
  session_id: z.uuid(),
  symptom_id: z.uuid(),
  answer_path: z.array(z.string()).default([]),
});
export type ChatAnswerInput = z.infer<typeof chatAnswerSchema>;

export const chatStepSchema = z.object({
  session_id: z.uuid(),
  symptom_id: z.string().uuid().nullable().optional(),
  kind: z.enum(["question", "conclusion", "escalate", "clarify", "limit"]),
  message: z.string(),
  node_id: z.string().nullable().optional(),
  options: z.array(z.string()).nullable().optional(),
});
export type ChatStep = z.infer<typeof chatStepSchema>;

export const feedbackSchema = z.object({
  chatlog_id: z.uuid(),
  user_id: z.uuid().optional(),
  helpful: z.boolean(),
  comment: z.string().max(1000).optional(),
});
export type FeedbackInput = z.infer<typeof feedbackSchema>;