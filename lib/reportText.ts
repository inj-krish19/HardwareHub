import type { TechnicianReport } from "@/lib/validations/chat";

export interface ReportDetails {
    /** Make and model of the PC or part, typed by the person. Stays in their browser. */
    device: string;
    /** Anything else they noticed. Stays in their browser. */
    notes: string;
}

export const MAX_DEVICE_LENGTH = 120;
export const MAX_NOTES_LENGTH = 500;

/** Tidy a typed value: trim, and keep the line breaks of long notes readable under their label. */
function tidy(value: string, max: number): string {
    return value.replace(/\r/g, "").trim().slice(0, max).replace(/\n{2,}/g, "\n").replace(/\n/g, "\n   ");
}

/**
 * The text the person copies: the report's header (the problem), then the date and
 * whatever they typed about their device, then the report's body (what was checked and
 * what the guide found). The date is passed in so the function stays predictable.
 */
export function composeReport(report: TechnicianReport, details: ReportDetails, date: string): string {
    const device = tidy(details.device, MAX_DEVICE_LENGTH);
    const notes = tidy(details.notes, MAX_NOTES_LENGTH);
    const personal = [`Date: ${date}`];
    if (device) personal.push(`Device: ${device}`);
    if (notes) personal.push(`Other details: ${notes}`);
    return `${report.header}\n${personal.join("\n")}\n\n${report.body}`;
}

export function todayLabel(now: Date = new Date()): string {
    return now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}