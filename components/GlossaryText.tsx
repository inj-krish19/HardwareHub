"use client";

import { Fragment } from "react";
import { TEXT_TERMS } from "@/lib/glossary";
import Term from "@/components/Term";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Longest terms first so "CAS latency" wins over a shorter overlap.
const PATTERN = new RegExp(
    `(?<![A-Za-z0-9])(${Object.keys(TEXT_TERMS)
        .sort((a, b) => b.length - a.length)
        .map(escape)
        .join("|")})(?![A-Za-z0-9])`,
    "g"
);

// Renders blog text with jargon underlined. Only the first mention of each
// term is marked, to avoid a page full of underlines.
export default function GlossaryText({ text }: { text: string }) {
    const seen = new Set<string>();
    const parts = text.split(PATTERN);
    return (
        <>
            {parts.map((part, i) => {
                const definition = TEXT_TERMS[part];
                if (definition && !seen.has(part)) {
                    seen.add(part);
                    return (
                        <Term key={i} definition={definition}>
                            {part}
                        </Term>
                    );
                }
                return <Fragment key={i}>{part}</Fragment>;
            })}
        </>
    );
}