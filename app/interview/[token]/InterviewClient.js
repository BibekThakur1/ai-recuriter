"use client";

import { submitCandidateInterview } from "@/app/actions/interview";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, Loader2, Mic, PhoneOff, Send, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

const fallbackQuestions = [
    "Tell us about your most relevant experience for this role.",
    "Which technical skill from the job description is your strongest, and how have you used it?",
    "Describe a difficult problem you solved recently.",
    "How do you communicate progress or blockers to a team?",
    "Why are you interested in this role?",
];

export default function InterviewClient({ job, token }) {
    const questions = useMemo(() => {
        return job.ai_questions?.length ? job.ai_questions : fallbackQuestions;
    }, [job.ai_questions]);

    const [step, setStep] = useState("intro");
    const [candidate, setCandidate] = useState({ name: "", email: "", phone: "", resumeText: "" });
    const [answers, setAnswers] = useState(() => questions.map((question) => ({ question, answer: "" })));
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function startInterview(event) {
        event.preventDefault();
        setError("");
        if (!candidate.name || !candidate.email) {
            setError("Please enter your name and email to begin.");
            return;
        }
        setStep("questions");
    }

    async function finishInterview() {
        setIsSubmitting(true);
        setError("");

        try {
            const hasEmptyAnswer = answers.some((item) => !item.answer.trim());
            if (hasEmptyAnswer) {
                throw new Error("Please answer every question before submitting.");
            }

            const formData = new FormData();
            formData.set("token", token);
            formData.set("candidate_name", candidate.name);
            formData.set("candidate_email", candidate.email);
            formData.set("candidate_phone", candidate.phone);
            formData.set("resume_text", candidate.resumeText);
            formData.set("answers", JSON.stringify(answers));

            const result = await submitCandidateInterview(formData);
            if (result.success) {
                setStep("completed");
            }
        } catch (err) {
            setError(err.message || "Unable to submit interview.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const answeredCount = answers.filter((item) => item.answer.trim()).length;
    const currentAnswer = answers[currentQuestion];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <AnimatePresence>
                {step === "questions" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.12, scale: 1.15 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute p-[400px] bg-accent blur-[100px] rounded-full z-0"
                    />
                )}
            </AnimatePresence>

            <div className="max-w-3xl w-full z-10">
                <AnimatePresence mode="wait">
                    {step === "intro" && (
                        <motion.form
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={startInterview}
                            className="bg-card border border-border shadow-2xl rounded-2xl p-8"
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <Mic className="w-8 h-8" />
                            </div>
                            <p className="text-sm uppercase tracking-wider text-accent font-semibold mb-2">{job.organizations?.name || "AI Recruiter"}</p>
                            <h1 className="text-3xl font-bold text-text-primary mb-3">{job.title} Interview</h1>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                Complete this structured screening interview. Your answers will be scored and summarized for the hiring team.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <label className="block">
                                    <span className="text-sm font-medium text-text-primary mb-2 block">Full name</span>
                                    <input
                                        value={candidate.name}
                                        onChange={(event) => setCandidate((prev) => ({ ...prev, name: event.target.value }))}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Jane Candidate"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-text-primary mb-2 block">Email</span>
                                    <input
                                        type="email"
                                        value={candidate.email}
                                        onChange={(event) => setCandidate((prev) => ({ ...prev, email: event.target.value }))}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="jane@example.com"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-text-primary mb-2 block">Phone</span>
                                    <input
                                        value={candidate.phone}
                                        onChange={(event) => setCandidate((prev) => ({ ...prev, phone: event.target.value }))}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="+1 555 123 4567"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-text-primary mb-2 block">LinkedIn or portfolio</span>
                                    <input
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="https://..."
                                    />
                                </label>
                            </div>

                            <label className="block mb-6">
                                <span className="text-sm font-medium text-text-primary mb-2 block">Resume or background summary</span>
                                <textarea
                                    value={candidate.resumeText}
                                    onChange={(event) => setCandidate((prev) => ({ ...prev, resumeText: event.target.value }))}
                                    rows={5}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                    placeholder="Paste your resume text, project summary, or relevant experience..."
                                />
                            </label>

                            {error && <p className="text-danger text-sm mb-4">{error}</p>}

                            <button className="w-full bg-primary hover:bg-secondary text-white font-medium py-3.5 rounded-xl shadow-[0_0_20px_-5px_var(--primary)] transition-all active:scale-95 flex items-center justify-center gap-2">
                                <UserRound className="w-5 h-5" />
                                Begin Interview
                            </button>
                        </motion.form>
                    )}

                    {step === "questions" && (
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-card border border-accent shadow-[0_0_40px_-10px_var(--accent)] rounded-2xl p-8"
                        >
                            <div className="flex items-start justify-between gap-4 mb-8">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                        <Bot className="h-4 w-4" />
                                        AI interviewer
                                    </div>
                                    <h2 className="mt-2 text-2xl font-semibold text-text-primary">Question {currentQuestion + 1} of {answers.length}</h2>
                                    <p className="text-text-secondary text-sm mt-1">{answeredCount} of {answers.length} answered</p>
                                </div>
                                <button
                                    onClick={() => setStep("intro")}
                                    className="flex items-center justify-center w-11 h-11 bg-danger/10 text-danger rounded-full hover:bg-danger/20 transition-transform active:scale-90"
                                    title="Exit interview"
                                >
                                    <PhoneOff className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="rounded-2xl border border-border bg-background p-5">
                                <div className="flex items-start gap-4">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-white">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <p className="text-xl font-semibold leading-8 text-text-primary">
                                        {currentAnswer.question}
                                    </p>
                                </div>

                                <textarea
                                    value={currentAnswer.answer}
                                    onChange={(event) => {
                                        const nextAnswers = [...answers];
                                        nextAnswers[currentQuestion] = { ...currentAnswer, answer: event.target.value };
                                        setAnswers(nextAnswers);
                                    }}
                                    rows={8}
                                    className="mt-5 w-full bg-card border border-border rounded-xl px-4 py-3 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                    placeholder="Answer naturally. Include examples, tools used, decisions made, and results..."
                                />
                            </div>

                            {error && <p className="text-danger text-sm mt-5">{error}</p>}

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    onClick={() => setCurrentQuestion((value) => Math.max(0, value - 1))}
                                    disabled={currentQuestion === 0 || isSubmitting}
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-text-primary disabled:opacity-40"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Previous
                                </button>

                                {currentQuestion < answers.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentQuestion((value) => Math.min(answers.length - 1, value + 1))}
                                        disabled={isSubmitting}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                                    >
                                        Next question
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={finishInterview}
                                        disabled={isSubmitting}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white disabled:bg-primary/50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Scoring interview...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Submit interview
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {step === "completed" && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-success/30 shadow-[0_0_40px_-10px_var(--success)] rounded-2xl p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary mb-3">Interview Completed</h2>
                            <p className="text-text-secondary">
                                Your answers were submitted and scored. The recruiter can now review your transcript, summary, and recommendation.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
