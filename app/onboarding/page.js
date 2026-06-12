"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Briefcase, User, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const { session } = useClerk();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!isLoaded) return null;

    // If user already has a role, redirect to dashboard
    if (user?.publicMetadata?.role) {
        router.push("/dashboard");
        return null;
    }

    const handleRoleSelection = async () => {
        if (!selectedRole || isLoading) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/set-role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: selectedRole })
            });

            if (!res.ok) throw new Error("Failed to set role");

            // We must reload the session to get the updated token with metadata
            await session?.reload();

            toast.success("Welcome aboard!");

            // Redirect based on role
            if (selectedRole === "recruiter") {
                router.push("/dashboard/organization"); // Next step: create company
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Error setting role:", error);
            toast.error("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const roles = [
        {
            id: "recruiter",
            title: "I'm a Recruiter",
            description: "I want to create jobs and evaluate candidates with AI.",
            icon: Briefcase,
            accent: "from-primary to-accent"
        },
        {
            id: "candidate",
            title: "I'm a Candidate",
            description: "I want to apply for jobs and take AI interviews.",
            icon: User,
            accent: "from-success to-emerald-400"
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full z-10"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                        Welcome to AI Recruiter
                    </h1>
                    <p className="text-lg text-text-secondary max-w-xl mx-auto">
                        How are you planning to use the platform? Choose your path to get started.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;

                        return (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                disabled={isLoading}
                                className={`
                                    relative p-8 rounded-3xl border-2 text-left transition-all duration-200 overflow-hidden
                                    ${isSelected
                                        ? "border-primary bg-card shadow-[0_0_30px_-5px_var(--primary)]"
                                        : "border-border bg-card/50 hover:border-border/80 hover:bg-card/80"
                                    }
                                `}
                            >
                                {isSelected && (
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${role.accent} opacity-10 blur-2xl rounded-bl-full`} />
                                )}

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-200 ${isSelected ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-background text-text-secondary"}`}>
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h3 className={`text-2xl font-bold mb-3 ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                                    {role.title}
                                </h3>
                                <p className="text-text-secondary leading-relaxed">
                                    {role.description}
                                </p>

                                <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${isSelected ? "border-primary bg-primary" : "border-border"}`}>
                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-center flex-col items-center">
                    <button
                        onClick={handleRoleSelection}
                        disabled={!selectedRole || isLoading}
                        className={`
                            px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all duration-200
                            ${!selectedRole
                                ? "bg-card border border-border text-text-secondary opacity-50 cursor-not-allowed"
                                : "bg-primary hover:bg-secondary text-white shadow-lg shadow-primary/25 active:scale-95"
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Setting up your account...
                            </>
                        ) : (
                            <>
                                Continue {selectedRole ? `as ${selectedRole === 'recruiter' ? 'Recruiter' : 'Candidate'}` : ''}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    {!selectedRole && (
                        <p className="text-sm text-text-secondary mt-4">Select a role to continue</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
