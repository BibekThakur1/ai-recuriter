"use client";

import { useState } from "react";
import { Mic, PhoneOff, Waveform, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewPage({ params }) {
    const [isStarted, setIsStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const startInterview = () => setIsStarted(true);
    const endInterview = () => {
        setIsStarted(false);
        setIsCompleted(true);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pulse Effect when active */}
            <AnimatePresence>
                {isStarted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.15, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute p-[400px] bg-accent blur-[100px] rounded-full z-0"
                    />
                )}
            </AnimatePresence>

            <div className="max-w-md w-full z-10">
                <AnimatePresence mode="wait">
                    {!isStarted && !isCompleted && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border shadow-2xl rounded-2xl p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                <Mic className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-text-primary mb-3">Frontend Engineer Interview</h1>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                You are about to start your AI-guided voice interview. Ensure you are in a quiet room and your microphone is working perfectly.
                            </p>
                            <button
                                onClick={startInterview}
                                className="w-full bg-primary hover:bg-secondary text-white font-medium py-3.5 rounded-xl shadow-[0_0_20px_-5px_var(--primary)] transition-all active:scale-95"
                            >
                                Begin Interview
                            </button>
                        </motion.div>
                    )}

                    {isStarted && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-card border border-accent shadow-[0_0_40px_-10px_var(--accent)] rounded-2xl p-8 text-center"
                        >
                            <h2 className="text-xl font-semibold text-text-primary mb-8">Interview in Progress</h2>

                            {/* Virtual AI Avatar / Visualiser */}
                            <div className="relative w-32 h-32 mx-auto mb-10">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 bg-accent/20 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                    className="absolute inset-2 bg-accent/40 rounded-full"
                                />
                                <div className="absolute inset-4 bg-accent rounded-full flex items-center justify-center shadow-[0_0_20px_0_var(--accent)]">
                                    <Mic className="w-8 h-8 text-card" />
                                </div>
                            </div>

                            <button
                                onClick={endInterview}
                                className="mx-auto flex items-center justify-center w-14 h-14 bg-danger text-white rounded-full hover:bg-danger/80 transition-transform active:scale-90 shadow-[0_0_20px_-5px_var(--danger)]"
                                title="End Interview"
                            >
                                <PhoneOff className="w-6 h-6" />
                            </button>
                        </motion.div>
                    )}

                    {isCompleted && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-success/30 shadow-[0_0_40px_-10px_var(--success)] rounded-2xl p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary mb-3">Interview Completed!</h2>
                            <p className="text-text-secondary">
                                Thank you for your time. The recruiter will review your AI-assessed transcript and get back to you shortly.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
