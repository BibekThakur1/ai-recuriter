"use client";

import React, { useState } from "react";
import {
    Briefcase,
    ArrowLeft,
    Plus,
    FileText,
    Sparkles,
    CheckCircle2,
    Loader2,
    Github,
    ExternalLink,
    BrainCircuit,
    Layers,
    ListChecks
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createJob } from "@/app/actions/jobs";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // ✅ CORRECT: Use onSubmit + preventDefault, then pass FormData to server action.
    // ❌ WRONG:  action={handleSubmit} — that passes a CLIENT function, causing serialization crash.
    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Build FormData from the form element — this is plain, serializable data.
            const formData = new FormData(e.target);

            // Pass only FormData (serializable) to the server action.
            // NEVER pass functions, callbacks, or complex objects.
            const result = await createJob(formData);

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push(`/dashboard/jobs/${result.job.id}`);
                }, 2000);
            }
        } catch (err) {
            setError(err.message || "Something went wrong while creating the job.");
            setIsSubmitting(false);
        }
    }

    const inputClasses = "w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-text-secondary/50";
    const labelClasses = "block text-sm font-semibold text-text-primary mb-2 flex items-center gap-2";

    return (
        <div className="max-w-2xl mx-auto pb-24">
            <header className="mb-10">
                <Link
                    href="/dashboard/recruiter"
                    className="flex items-center text-sm text-text-secondary hover:text-primary transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Post a New Role</h1>
                        <p className="text-text-secondary mt-1">Ready to find your next great hire?</p>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!success ? (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSubmit}
                        className="bg-card border border-border shadow-xl rounded-2xl p-8 space-y-8"
                    >
                        {error && (
                            <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Job Title */}
                            <div>
                                <label htmlFor="title" className={labelClasses}>
                                    <Briefcase className="w-4 h-4 text-primary" />
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    required
                                    placeholder="e.g. Senior Frontend Engineer"
                                    className={inputClasses}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className={labelClasses}>
                                    <FileText className="w-4 h-4 text-primary" />
                                    Job Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    required
                                    rows={5}
                                    placeholder="Outline the role, responsibilities, and team culture..."
                                    className={`${inputClasses} resize-none`}
                                />
                            </div>

                            {/* Required Skills */}
                            <div>
                                <label htmlFor="required_skills" className={labelClasses}>
                                    <Sparkles className="w-4 h-4 text-accent" />
                                    Required Skills
                                </label>
                                <input
                                    type="text"
                                    name="required_skills"
                                    id="required_skills"
                                    placeholder="e.g. React, Next.js, TypeScript (comma separated)"
                                    className={inputClasses}
                                />
                                <p className="text-xs text-text-secondary mt-2 pl-1">
                                    Tips: AI uses these to assess candidates during interviews.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Experience Level */}
                                <div>
                                    <label htmlFor="experience_level" className={labelClasses}>
                                        <Layers className="w-4 h-4 text-primary" />
                                        Experience Level
                                    </label>
                                    <select
                                        name="experience_level"
                                        id="experience_level"
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="junior">Junior (0-2 years)</option>
                                        <option value="mid">Mid-Level (3-5 years)</option>
                                        <option value="senior">Senior (5+ years)</option>
                                        <option value="lead">Lead / Staff</option>
                                    </select>
                                </div>

                                {/* Interview Type */}
                                <div>
                                    <label htmlFor="interview_type" className={labelClasses}>
                                        <ListChecks className="w-4 h-4 text-primary" />
                                        Interview Type
                                    </label>
                                    <select
                                        name="interview_type"
                                        id="interview_type"
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="technical">Technical Focus</option>
                                        <option value="behavioral">HR / Behavioral</option>
                                        <option value="mixed">Mixed (Technical & HR)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Generate AI Questions Toggle */}
                            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                <input
                                    type="checkbox"
                                    name="generate_questions"
                                    id="generate_questions"
                                    defaultChecked
                                    value="true"
                                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-background bg-background cursor-pointer"
                                />
                                <label htmlFor="generate_questions" className="text-sm font-medium text-text-primary cursor-pointer flex flex-col">
                                    <span className="flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4 text-accent" />
                                        Auto-Generate AI Interview Questions
                                    </span>
                                    <span className="text-text-secondary text-xs mt-0.5">
                                        Our AI will create a structured 8-question script based on the job details.
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-secondary disabled:bg-primary/50 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Posting Job...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    <span>Publish Job Post</span>
                                </>
                            )}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-success/30 shadow-2xl rounded-2xl p-12 text-center"
                    >
                        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-text-primary mb-4">Job Published!</h2>
                        <p className="text-text-secondary mb-8 leading-relaxed">
                            Your job post is live. You can now start sharing the interview link with candidates.
                        </p>
                        <div className="flex items-center justify-center gap-3 text-sm text-primary font-medium">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirecting you back...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="mt-20 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                        BT
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-primary">Bibek Thakur</p>
                        <p className="text-xs text-text-secondary">Full Stack Developer</p>
                    </div>
                </div>
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
            </footer>
        </div>
    );
}
