import { getExplicitUserRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import { Briefcase, Mic, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function DashboardHome() {
    const role = await getExplicitUserRole();

    if (!role) redirect("/onboarding");

    if (role === "admin") redirect("/dashboard/admin");
    if (role === "recruiter") redirect("/dashboard/recruiter");

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <section className="bg-card border border-border rounded-xl p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Mic className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-text-primary">Candidate Dashboard</h1>
                <p className="text-text-secondary mt-2 max-w-2xl">
                    Your interview links will come from recruiters. Open the shared link, answer the AI-generated questions, and your result will be sent to the hiring team.
                </p>
            </section>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        icon: Briefcase,
                        title: "Role-specific interviews",
                        body: "Each link is generated from a real job post and tailored to the required skills.",
                    },
                    {
                        icon: Mic,
                        title: "Structured answers",
                        body: "The current portfolio version captures written responses and can be extended to Vapi voice calls.",
                    },
                    {
                        icon: ShieldCheck,
                        title: "AI-assisted scoring",
                        body: "Recruiters see transcripts, summaries, scores, and recommendations in their dashboard.",
                    },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.title} className="bg-card border border-border rounded-xl p-6">
                            <Icon className="w-6 h-6 text-accent mb-4" />
                            <h2 className="font-semibold text-text-primary mb-2">{item.title}</h2>
                            <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
                        </div>
                    );
                })}
            </div>

            <Link href="/" className="inline-flex text-primary hover:text-accent font-medium">
                Back to home
            </Link>
        </div>
    );
}
