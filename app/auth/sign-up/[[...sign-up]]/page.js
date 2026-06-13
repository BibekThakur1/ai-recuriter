import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <SignUp
                routing="path"
                path="/auth/sign-up"
                signInUrl="/auth/sign-in"
                fallbackRedirectUrl="/onboarding"
                forceRedirectUrl="/onboarding"
                appearance={{
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
                        formButtonPrimary:
                            "bg-primary hover:bg-secondary text-white transition-all shadow-sm active:scale-[0.98]",
                        formFieldInput:
                            "bg-background border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary transition-all rounded-xl",
                        formFieldLabel: "text-text-secondary",
                        socialButtonsBlockButton:
                            "border border-border text-text-primary hover:bg-background transition-colors rounded-xl",
                        socialButtonsBlockButtonText: "font-medium",
                        footerActionLink: "text-primary hover:text-secondary font-medium",
                        dividerLine: "bg-border",
                        dividerText: "text-text-secondary",
                    },
                }}
            />
        </div>
    );
}
