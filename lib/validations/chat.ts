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

export const chatConfirmSchema = z.object({
  symptom_id: z.uuid(),
  confirmed: z.boolean(),
});
export type ChatConfirmInput = z.infer<typeof chatConfirmSchema>;

export const chatStepSchema = z.object({
  symptom_id: z.uuid().nullable().optional(),
  kind: z.enum([
    "question",
    "conclusion",
    "escalate",
    "clarify",
    "suggest",
    "not_found",
    "clarify_bot_choice",
    "clarify_list",
  ]),
  message: z.string(),
  node_id: z.string().nullable().optional(),
  options: z.array(z.string()).nullable().optional(),
  stats: z.object({ helpful: z.number(), total: z.number() }).nullable().optional(),
});
export type ChatStep = z.infer<typeof chatStepSchema>;

export const reportSchema = z.object({
  title: z.string(),
  category: z.string(),
  steps: z.array(z.object({ question: z.string(), answer: z.string() })),
  finding: z.string(),
  // `header` (the problem) and `body` (what was checked and found) are separate so the
  // person's own details can be slotted between them; see lib/reportText.ts.
  header: z.string(),
  body: z.string(),
  text: z.string(),
});
export type TechnicianReport = z.infer<typeof reportSchema>;