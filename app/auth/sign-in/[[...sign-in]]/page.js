import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <SignIn
                appearance={{
                    variables: {
                        colorPrimary: "#4F46E5",
                        colorBackground: "#1E293B",
                        colorText: "#F8FAFC",
                        colorInputBackground: "#0F172A",
                        colorInputText: "#F8FAFC",
                        colorDanger: "#EF4444",
                        colorSuccess: "#10B981",
                        borderRadius: "0.75rem",
                    },
                    elements: {
                        card: "border border-border shadow-2xl rounded-xl bg-card",
                        headerTitle: "text-text-primary text-2xl font-semibold",
                        headerSubtitle: "text-text-secondary",
                        formButtonPrimary:
                            "bg-primary hover:bg-secondary text-white transition-all shadow-md active:scale-[0.98]",
                        formFieldInput:
                            "bg-background border-border focus:ring-2 focus:ring-accent focus:border-accent text-text-primary transition-all rounded-lg",
                        formFieldLabel: "text-text-secondary",
                        socialButtonsBlockButton:
                            "border border-border text-text-primary hover:bg-background transition-colors rounded-lg",
                        socialButtonsBlockButtonText: "font-medium",
                        footerActionLink: "text-primary hover:text-accent font-medium",
                        dividerLine: "bg-border",
                        dividerText: "text-text-secondary",
                    },
                }}
            />
        </div>
    );
}
