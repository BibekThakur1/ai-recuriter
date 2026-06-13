import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function BrandMark({ compact = false, href = "/" }) {
    return (
        <Link
            href={href}
            aria-label="Open Hireflow home"
            className="flex items-center gap-3 rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-text-primary text-card shadow-sm">
                <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent ring-2 ring-card" />
                <Sparkles className="h-4 w-4" />
            </div>
            {!compact && (
                <div className="leading-none">
                    <span className="block text-base font-semibold tracking-tight text-text-primary">
                        Hireflow
                    </span>
                    <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
                        AI Recruiter
                    </span>
                </div>
            )}
        </Link>
    );
}
