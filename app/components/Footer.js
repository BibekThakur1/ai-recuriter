"use client";

import { Github, ExternalLink, Bot } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-text-primary tracking-tight">
                            AI Recruiter
                        </span>
                    </div>

                    {/* Credit */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs">
                                BT
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-primary">
                                    Bibek Thakur
                                </p>
                                <p className="text-xs text-text-secondary">
                                    Full Stack Developer
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* GitHub */}
                    <a
                        href="https://github.com/BibekThakur1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors group"
                    >
                        <Github className="w-5 h-5" />
                        <span>github.com/BibekThakur1</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50 text-center">
                    <p className="text-xs text-text-secondary">
                        &copy; {new Date().getFullYear()} Bibek Thakur. Built with Next.js, Clerk &amp; Supabase.
                    </p>
                </div>
            </div>
        </footer>
    );
}
