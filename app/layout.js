import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-inter",
  weight: "100 900",
});

export const metadata = {
  title: "AI Recruiter",
  description: "Hire 60% Faster with AI Interviews",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInUrl="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/onboarding"
      signUpForceRedirectUrl="/onboarding"
    >
      <html lang="en" className={geistSans.variable}>
        <body className="antialiased font-sans bg-background text-text-primary">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
