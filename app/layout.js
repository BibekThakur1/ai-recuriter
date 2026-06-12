import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "AI Recruiter",
  description: "Hire 60% Faster with AI Interviews",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="antialiased font-sans bg-background text-text-primary">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
