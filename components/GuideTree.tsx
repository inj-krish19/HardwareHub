import { isFinal, type TreeNode } from "@/lib/guides";

// Renders a guide's whole decision tree as plain HTML, every branch expanded, so
// search engines can read all of it. Each question lists its answers, and under
// each answer comes the next question or the final answer.

function FinalAnswer({ node }: { node: { type: "conclusion" | "escalate"; text: string } }) {
    const isEscalate = node.type === "escalate";
    return (
        <div
            className={`mt-2 rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-line ${isEscalate
                ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100"
                }`}
        >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide">
                {isEscalate ? "Time to ask a professional" : "What to do"}
            </p>
            {node.text}
        </div>
    );
}

function Node({ node }: { node: TreeNode }) {
    if (isFinal(node)) return <FinalAnswer node={node} />;
    return (
        <div className="mt-2">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">{node.question}</h3>
            <ul className="mt-2 space-y-3 border-l border-slate-200 pl-4 dark:border-slate-800">
                {node.options.map((option) => (
                    <li key={option.answer}>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="mr-1.5 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                                If
                            </span>
                            {option.answer}
                        </p>
                        <Node node={option.next} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function GuideTree({ tree }: { tree: TreeNode }) {
    return <Node node={tree} />;
}