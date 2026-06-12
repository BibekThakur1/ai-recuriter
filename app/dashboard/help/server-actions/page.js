"use client";

import React from "react";
import {
    AlertCircle,
    CheckCircle2,
    Code2,
    ExternalLink,
    Github,
    ArrowLeft,
    Lightbulb,
    FileCode,
    Cpu,
    Zap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServerActionsGuide() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <motion.div {...fadeIn} className="mb-12">
                <Link
                    href="/dashboard"
                    className="flex items-center text-sm text-text-secondary hover:text-primary transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-extrabold text-text-primary tracking-tight mb-4">
                    Mastering <span className="text-primary">Server Actions</span> in Next.js 14
                </h1>
                <p className="text-xl text-text-secondary">
                    Solving the &quot;Client Functions cannot be passed to Server Functions&quot; error with ease.
                </p>
            </motion.div>

            {/* Error Section */}
            <motion.section
                {...fadeIn}
                transition={{ delay: 0.1 }}
                className="bg-card/50 backdrop-blur-md border border-danger/20 rounded-2xl p-8 mb-8 shadow-xl"
            >
                <div className="flex items-start gap-4 mb-6">
                    <div className="bg-danger/10 p-3 rounded-xl text-danger">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary">The Common Error ❌</h2>
                        <code className="block mt-4 p-4 bg-background/50 rounded-lg text-danger-hover font-mono text-sm border border-danger/10">
                            Client Functions cannot be passed directly to Server Functions.
                            Only Functions passed from the Server can be passed back again.
                        </code>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="p-4 bg-background/40 rounded-xl border border-border/50">
                        <h4 className="font-bold flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-primary" /> Server Actions</h4>
                        <p className="text-sm text-text-secondary">Run strictly on the server side.</p>
                    </div>
                    <div className="p-4 bg-background/40 rounded-xl border border-border/50">
                        <h4 className="font-bold flex items-center gap-2 mb-2"><Code2 className="w-4 h-4 text-accent" /> Client Components</h4>
                        <p className="text-sm text-text-secondary">Run in the browser environment.</p>
                    </div>
                    <div className="p-4 bg-background/40 rounded-xl border border-border/50">
                        <h4 className="font-bold flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-warning" /> Serialization</h4>
                        <p className="text-sm text-text-secondary">Functions cannot be JSON.stringified.</p>
                    </div>
                </div>
            </motion.section>

            {/* Why it happens */}
            <motion.section
                {...fadeIn}
                transition={{ delay: 0.2 }}
                className="mb-12 space-y-6"
            >
                <h2 className="text-2xl font-bold text-text-primary px-2">🧠 Why This Happens</h2>
                <div className="prose prose-invert max-w-none px-2 text-text-secondary leading-relaxed space-y-4">
                    <p>
                        In the Next.js App Router, communication between the Client and Server requires data to be <strong>serializable</strong>.
                        When you trigger a Server Action from the browser, Next.js tries to bundle your arguments into a request.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>React attempts to <code>JSON.stringify()</code> your payload.</li>
                        <li>Browser-side functions (callbacks, handlers) exist only in memory.</li>
                        <li>This causes <code>encodeReply</code> or <code>fetchServerAction</code> to crash.</li>
                    </ul>
                </div>
            </motion.section>

            {/* Correct Pattern Carousel/Comparison */}
            <motion.div
                {...fadeIn}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-2 gap-8 mb-12"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-danger px-2 font-bold uppercase tracking-wider text-xs">
                        <AlertCircle className="w-4 h-4" /> The Wrong Way
                    </div>
                    <div className="bg-background border border-danger/20 rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-danger/5 px-4 py-2 border-b border-danger/10 text-xs font-mono text-danger">client-form.js</div>
                        <pre className="p-6 text-sm font-mono overflow-x-auto">
                            <code className="text-text-secondary">
                                {`"use client"
import { createJob } from "@/actions"

export default function Form() {
  const handleSubmit = () => {
    // ❌ WRONG: Passing callback
    await createJob(() => {
      console.log("Success")
    })
  }
  return <button onClick={handleSubmit}>Create</button>
}`}
                            </code>
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-success px-2 font-bold uppercase tracking-wider text-xs">
                        <CheckCircle2 className="w-4 h-4" /> The Correct Way
                    </div>
                    <div className="bg-background border border-success/20 rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-success/5 px-4 py-2 border-b border-success/10 text-xs font-mono text-success">client-form.js</div>
                        <pre className="p-6 text-sm font-mono overflow-x-auto">
                            <code className="text-text-secondary">
                                {`"use client"
import { createJob } from "@/actions"

export default function Form() {
  return (
    <form action={createJob}>
      <input name="title" />
      <button type="submit">
        Create
      </button>
    </form>
  )
}`}
                            </code>
                        </pre>
                    </div>
                </div>
            </motion.div>

            {/* Checklist */}
            <motion.section
                {...fadeIn}
                transition={{ delay: 0.4 }}
                className="bg-accent/5 border border-accent/20 rounded-2xl p-8 mb-12 shadow-inner"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="w-6 h-6 text-accent" />
                    <h2 className="text-2xl font-bold text-text-primary">Quick Debug Checklist</h2>
                </div>
                <ul className="grid md:grid-cols-2 gap-4">
                    {[
                        "Am I passing a function into a server action?",
                        "Am I passing a React handler (onClick, etc.)?",
                        "Am I passing a Clerk user object directly?",
                        "Am I passing a class instance?"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {item}
                        </li>
                    ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-accent/10 flex items-center gap-3 text-xs italic text-text-secondary">
                    <FileCode className="w-4 h-4" />
                    Tip: If you&apos;re using Clerk, only pass simple IDs or strings, not the whole user object.
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-20 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
                        BT
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-primary">Bibek Thakur</p>
                        <p className="text-xs text-text-secondary">Full Stack Developer & Founder</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <a
                        href="http://github.com/BibekThakur1/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors group"
                    >
                        <Github className="w-5 h-5" />
                        <span>github.com/BibekThakur1</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>
            </motion.footer>
        </div>
    );
}
