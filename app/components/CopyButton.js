"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ value, label = "Copy", compact = false }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`${compact ? "px-3 py-2 text-xs" : "px-5 py-3"} bg-primary hover:bg-secondary text-white rounded-lg font-medium transition-all active:scale-95 shadow-lg shadow-primary/20 whitespace-nowrap flex items-center gap-2`}
        >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : label}
        </button>
    );
}
