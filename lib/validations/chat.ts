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

export const budgetTaskSelectionSchema = z.object({
  task_type: z.string().min(1),
});
export type BudgetTaskSelectionInput = z.infer<typeof budgetTaskSelectionSchema>;

export const budgetAmountSchema = z.object({
  task_type: z.string().min(1),
  budget_amount: z.number().int().positive(),
});
export type BudgetAmountInput = z.infer<typeof budgetAmountSchema>;

export const chatStepSchema = z.object({
  symptom_id: z.uuid().nullable().optional(),
  // Only populated mid-way through the Budget/Build Advisor flow — echoed
  // back on the /chat/budget-amount call since the chatbot is stateless.
  task_type: z.string().nullable().optional(),
  kind: z.enum([
    "question",
    "conclusion",
    "escalate",
    "clarify",
    "confirm",
    "not_found",
    "clarify_bot_choice",
    "clarify_list",
    "clarify_budget_task",
    "budget_amount_request",
  ]),
  message: z.string(),
  node_id: z.string().nullable().optional(),
  options: z.array(z.string()).nullable().optional(),
});
export type ChatStep = z.infer<typeof chatStepSchema>;