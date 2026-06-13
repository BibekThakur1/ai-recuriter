"use client";

import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock3,
  Link2,
  Mic2,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import BrandMark from "@/app/components/BrandMark";
import Footer from "@/app/components/Footer";

const metrics = [
  { label: "Screened", value: "128", detail: "+24 this week" },
  { label: "Avg. score", value: "82", detail: "top quartile" },
  { label: "Hours saved", value: "46", detail: "first rounds" },
];

const candidates = [
  { name: "Nisha P.", role: "Frontend Engineer", score: 92, tag: "Strong follow-up" },
  { name: "Daniel K.", role: "Backend Engineer", score: 86, tag: "Review today" },
  { name: "Maya R.", role: "Product Designer", score: 79, tag: "Good signal" },
];

export default function LandingPage() {
  const { userId } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-background text-text-primary selection:bg-primary selection:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <BrandMark />
        <div className="flex items-center gap-2">
          <Link
            href="/auth/sign-in"
            className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Sign in
          </Link>
          <Link
            href={userId ? "/dashboard" : "/auth/sign-up"}
            className="rounded-full bg-text-primary px-4 py-2 text-sm font-semibold text-card shadow-sm transition-transform hover:-translate-y-0.5"
          >
            {userId ? "Dashboard" : "Start hiring"}
          </Link>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-12 px-5 pb-14 pt-10 md:grid-cols-[0.92fr_1.08fr] md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-text-secondary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-success" />
              Structured first-round interviews, ready today
            </div>

            <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-tight text-text-primary md:text-7xl">
              Hire with clearer signal before the first call.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
              Hireflow turns every job post into a scored interview flow: generate questions, share a candidate link, and review summaries without spreadsheet chaos.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={userId ? "/dashboard" : "/auth/sign-up"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                {userId ? "Open workspace" : "Create an interview"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-text-primary shadow-sm transition-colors hover:bg-white"
              >
                View dashboard
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-2xl font-semibold tracking-tight">{metric.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-text-secondary">{metric.label}</p>
                  <p className="mt-1 text-sm text-text-secondary">{metric.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="relative"
          >
            <div className="paper-shadow overflow-hidden rounded-[28px] border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-danger" />
                  <span className="h-3 w-3 rounded-full bg-warning" />
                  <span className="h-3 w-3 rounded-full bg-success" />
                </div>
                <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-text-secondary">
                  recruiter workspace
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                <aside className="hidden border-r border-border bg-[#f0eee6] p-5 md:block">
                  <BrandMark compact />
                  <div className="mt-8 space-y-2">
                    {["Overview", "Jobs", "Candidates", "Analytics"].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-full px-3 py-2 text-sm font-medium ${index === 0 ? "bg-card text-text-primary shadow-sm" : "text-text-secondary"}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Senior Product Engineer</p>
                      <h2 className="mt-1 text-2xl font-semibold tracking-tight">Candidate review</h2>
                    </div>
                    <div className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                      8 questions ready
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {[
                      { icon: UsersRound, label: "Candidates", value: "34" },
                      { icon: Clock3, label: "Median time", value: "18m" },
                      { icon: BarChart3, label: "Top score", value: "92" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-2xl border border-border bg-background p-4">
                          <Icon className="h-4 w-4 text-primary" />
                          <p className="mt-4 text-2xl font-semibold">{item.value}</p>
                          <p className="text-sm text-text-secondary">{item.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 space-y-3">
                    {candidates.map((candidate) => (
                      <div key={candidate.name} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-text-primary text-sm font-semibold text-card">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{candidate.name}</p>
                            <p className="text-sm text-text-secondary">{candidate.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{candidate.score}</p>
                          <p className="text-xs text-text-secondary">{candidate.tag}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-border bg-[#173f35] p-5 text-white">
                    <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                      <Sparkles className="h-4 w-4 text-accent" />
                      AI summary
                    </div>
                    <p className="mt-3 leading-7 text-white/90">
                      Nisha shows strong React architecture depth, clear tradeoff thinking, and concise communication. Recommended for live technical round.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-border bg-card/70">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-3 md:px-8">
            {[
              {
                icon: Mic2,
                title: "Interview script in one click",
                body: "Generate role-specific questions from title, skills, seniority, and interview type.",
              },
              {
                icon: Link2,
                title: "Tokenized candidate links",
                body: "Each job gets a shareable public interview URL without exposing dashboard data.",
              },
              {
                icon: BadgeCheck,
                title: "Scored recruiter review",
                body: "Summaries, transcripts, score cards, and recommendations land back in the dashboard.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-3xl border border-border bg-background p-6">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-8 text-xl font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-text-secondary">{feature.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">How it works</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">A real hiring loop, not a demo shell.</h2>
            </div>
            <div className="grid gap-4">
              {[
                "Recruiter creates an organization and posts a role.",
                "OpenAI generates a structured interview script for the role.",
                "Candidate submits answers through a secure interview token.",
                "Recruiter reviews ranked candidates, summaries, and analytics.",
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-3xl border border-border bg-card p-5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-text-primary text-sm font-semibold text-card">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <p className="text-lg font-medium">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
