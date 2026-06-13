"use client";

import { SignIn } from "@clerk/nextjs";
import { ArrowLeft, Briefcase, UserRound } from "lucide-react";
import { useState } from "react";
import BrandMark from "@/app/components/BrandMark";

const appearance = {
    variables: {
        colorPrimary: "#1f6f5b",
        colorBackground: "#fffefa",
        colorText: "#171715",
        colorInputBackground: "#f6f5ef",
        colorInputText: "#171715",
        colorDanger: "#c2412d",
        colorSuccess: "#198754",
        borderRadius: "1rem",
    },
    elements: {
        card: "border border-border shadow-xl rounded-2xl bg-card",
        headerTitle: "text-text-primary text-2xl font-semibold",
        headerSubtitle: "text-text-secondary",
        formButtonPrimary: "bg-primary hover:bg-secondary text-white transition-all shadow-sm active:scale-[0.98]",
        formFieldInput: "bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary transition-all rounded-xl",
        formFieldLabel: "text-text-secondary",
        socialButtonsBlockButton: "border border-border text-text-primary hover:bg-background transition-colors rounded-xl",
        socialButtonsBlockButtonText: "font-medium",
        footerActionLink: "text-primary hover:text-secondary font-medium",
        dividerLine: "bg-border",
        dividerText: "text-text-secondary",
    },
};

export default function SignInPage() {
    const [intent, setIntent] = useState(null);

    function chooseIntent(role) {
        window.sessionStorage.setItem("hireflow_role_intent", role);
        setIntent(role);
    }

    return (
        <div className="min-h-screen bg-background px-4 py-8">
            <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center">
                {!intent ? (
                    <div className="w-full max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
                        <BrandMark />
                        <div className="mt-10 max-w-2xl">
                            <h1 className="text-4xl font-semibold tracking-tight text-text-primary md:text-5xl">
                                How are you signing in?
                            </h1>
                            <p className="mt-4 text-lg leading-8 text-text-secondary">
                                Choose the workspace you expect to use. Existing users go straight to their assigned dashboard after authentication.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <button
                                onClick={() => chooseIntent("recruiter")}
                                className="group rounded-3xl border border-border bg-background p-6 text-left transition-colors hover:border-primary"
                            >
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <h2 className="mt-6 text-2xl font-semibold text-text-primary">Recruiter login</h2>
                                <p className="mt-3 leading-7 text-text-secondary">
                                    Create jobs, generate AI questions, share interview links, and review candidates.
                                </p>
                                <p className="mt-6 text-sm font-semibold text-primary">Continue as recruiter</p>
                            </button>

                            <button
                                onClick={() => chooseIntent("candidate")}
                                className="group rounded-3xl border border-border bg-background p-6 text-left transition-colors hover:border-primary"
                            >
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                                    <UserRound className="h-6 w-6" />
                                </div>
                                <h2 className="mt-6 text-2xl font-semibold text-text-primary">Candidate login</h2>
                                <p className="mt-3 leading-7 text-text-secondary">
                                    Access your candidate portal. Interviews are usually opened from recruiter-shared links.
                                </p>
                                <p className="mt-6 text-sm font-semibold text-primary">Continue as candidate</p>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md">
                        <button
                            onClick={() => setIntent(null)}
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Change login type
                        </button>
                        <SignIn
                            routing="path"
                            path="/auth/sign-in"
                            signUpUrl="/auth/sign-up"
                            fallbackRedirectUrl="/dashboard"
                            appearance={appearance}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
