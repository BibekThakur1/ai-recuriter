import { checkRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import { Users, Clock, Zap, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchUserOrganization } from "@/app/actions/organizations";
import { fetchRecruiterAnalytics } from "@/app/actions/interview";

export default async function RecruiterDashboard() {
    // Server-side role validation
    const isRecruiter = await checkRole("recruiter");
    const isAdmin = await checkRole("admin");
    if (!isRecruiter && !isAdmin) {
        redirect("/");
    }

    // Check if they have an organization
    const org = await fetchUserOrganization();
    if (isRecruiter && !org) {
        redirect("/dashboard/organization");
    }

    const analytics = await fetchRecruiterAnalytics();

    const stats = [
        { name: "Total Interviews", value: analytics.totalInterviews, icon: Users },
        { name: "Average Score", value: analytics.averageScore, icon: Target },
        { name: "Completed", value: analytics.completedInterviews, icon: Clock, highlight: true },
        { name: "Pending Review", value: analytics.pendingInterviews, icon: Zap },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Overview</h1>
                    <p className="text-text-secondary mt-1">Metrics and recent activity for your organization.</p>
                </div>
                <Link
                    href="/dashboard/jobs/new"
                    className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-lg font-medium shadow-lg transition-transform active:scale-95 shadow-primary/25"
                >
                    Create New Job
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.highlight ? "bg-accent/20 text-accent" : "bg-background text-primary"}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                {stat.change && (
                                    <span className="text-success text-sm font-medium bg-success/10 px-2.5 py-1 rounded-full">{stat.change}</span>
                                )}
                            </div>
                            <h3 className="text-text-secondary text-sm font-medium">{stat.name}</h3>
                            <p className={`text-3xl font-bold mt-1 ${stat.highlight ? "text-accent" : "text-text-primary"}`}>{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Candidates Table */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-text-primary">Recent Candidates</h2>
                    <Link href="/dashboard/candidates" className="text-sm text-primary hover:text-accent font-medium flex items-center gap-1 group">
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/50 border-b border-border/50">
                                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Candidate</th>
                                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Role</th>
                                <th className="px-6 py-4 text-sm font-medium text-text-secondary">AI Score</th>
                                <th className="px-6 py-4 text-sm font-medium text-text-secondary">Status</th>
                                <th className="px-6 py-4 text-sm font-medium text-text-secondary text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {analytics.topCandidates.length > 0 ? (
                                analytics.topCandidates.map((c) => (
                                    <tr key={c.id} className="hover:bg-background/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-text-primary">{c.candidate_name}</div>
                                            <div className="text-xs text-text-secondary">{c.candidate_email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary text-sm">{c.jobs?.title || "Unknown role"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-background rounded-full h-2 max-w-[100px]">
                                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${c.overall_score || 0}%` }} />
                                                </div>
                                                <span className="text-sm font-bold text-text-primary">{c.overall_score || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-success/10 text-success">
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/dashboard/candidates/${c.id}`} className="text-sm text-text-secondary hover:text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                View Results
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-6 py-10 text-center text-text-secondary" colSpan={5}>
                                        No completed interviews yet. Create a job and share its interview link to collect candidates.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
