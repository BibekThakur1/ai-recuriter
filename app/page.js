"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Clock, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Footer from "@/app/components/Footer";


export default function LandingPage() {
  const { isLoaded, userId } = useAuth();

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-text-primary">
            AI Recruiter
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/sign-in" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Log in
          </Link>
          <Link
            href={userId ? "/dashboard" : "/auth/sign-up"}
            className="text-sm font-medium bg-card border border-border px-4 py-2 rounded-lg text-text-primary hover:bg-border transition-colors"
          >
            {userId ? "Dashboard" : "Get Started"}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center max-w-3xl mx-auto"
        >
          <motion.div variants={itemVars} className="mb-6 px-4 py-1.5 rounded-full border border-border/50 bg-card/30 backdrop-blur-md">
            <span className="text-sm font-medium bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Introducing Voice AI Interviews 2.0 ✨
            </span>
          </motion.div>

          <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-bold tracking-tight text-balance mb-8">
            Hire <span className="text-accent">60% Faster</span> with AI Interviews
          </motion.h1>

          <motion.p variants={itemVars} className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl text-balance">
            Automate first-round screening with an intelligent voice AI that conducts technical and behavioral interviews, scores candidates, and delivers actionable insights.
          </motion.p>

          <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link
              href="/auth/sign-up"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-medium text-lg hover:bg-secondary transition-all hover:shadow-[0_0_30px_-5px_var(--accent)] flex items-center justify-center gap-2 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-32 grid md:grid-cols-3 gap-6 text-left"
        >
          {[
            {
              icon: <Clock className="w-6 h-6 text-accent" />,
              title: "Save Time",
              desc: "Reclaim hundreds of hours spent on initial phone screens. Let the AI do the heavy lifting.",
            },
            {
              icon: <Zap className="w-6 h-6 text-accent" />,
              title: "Deep Evaluation",
              desc: "Get comprehensive scores on technical skills, communication, and confidence.",
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-accent" />,
              title: "Unbiased Scoring",
              desc: "Ensure fair and consistent evaluations across all candidates without human bias.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card border border-border hover:border-border/80 hover:bg-card/80 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-primary">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-40 pt-20 border-t border-border/50 text-left relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="text-center mb-20 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">How AI Recruiter Works</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              From job post to final decision in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {[
              {
                step: "01",
                title: "Create Job & Generate Questions",
                desc: "Enter your job requirements. Our AI instantly generates a structured, technical, and behavioral interview script tailored to the role."
              },
              {
                step: "02",
                title: "Share Link with Candidates",
                desc: "Send the unique interview link. Candidates join a voice-to-voice call with our intelligent AI interviewer at their convenience."
              },
              {
                step: "03",
                title: "Review Ranked Results",
                desc: "Get instantly scored transcripts. Candidates are automatically ranked by technical knowledge, communication, and confidence."
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl font-black text-border/50 absolute -top-10 -left-4 group-hover:text-primary/20 transition-colors z-0">
                  {item.step}
                </div>
                <div className="relative z-10 pt-6">
                  <h3 className="text-xl font-bold text-text-primary mb-4">{item.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Section */}
        <div className="mt-40 pt-20 border-t border-border/50 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">Simple, transparent pricing</h2>
          <p className="text-text-secondary text-lg mb-16 max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {[
              {
                name: "Starter",
                price: "Free",
                features: ["3 AI Interviews / month", "Basic Question Generation", "Standard Analytics", "Community Support"]
              },
              {
                name: "Growth",
                price: "$99/mo",
                popular: true,
                features: ["100 AI Interviews / month", "Advanced AI Evaluation", "Custom Interview Scripts", "Priority Support"]
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: ["Unlimited Interviews", "Multi-Org & SSO", "Custom AI Models", "Dedicated Success Manager"]
              },
            ].map((tier, i) => (
              <div key={i} className={`p-8 rounded-3xl border flex flex-col h-full ${tier.popular ? 'border-primary shadow-[0_0_30px_-15px_var(--primary)] relative bg-card/80 backdrop-blur-sm' : 'border-border bg-card/50'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-text-primary mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold mb-6 text-text-primary">{tier.price}</div>

                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-text-secondary">
                      <ShieldCheck className="w-5 h-5 text-success shrink-0" />
                      <span className="text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.name === "Enterprise" ? "mailto:contact@airecruiter.com" : "/auth/sign-up"}>
                  <button className={`w-full py-4 rounded-xl font-bold transition-all ${tier.popular ? 'bg-primary hover:bg-secondary text-white shadow-lg shadow-primary/25' : 'bg-background hover:bg-border text-text-primary border border-border'}`}>
                    {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
