import { IconType } from "react-icons";

export default function AdminPageHeader({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: IconType;
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="mb-6 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                <Icon size={17} />
            </div>
            <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h1>
                {subtitle && (
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
                )}
            </div>
        </div>
    );
}