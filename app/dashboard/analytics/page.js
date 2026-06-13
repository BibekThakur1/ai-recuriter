import { fetchRecruiterAnalytics } from "@/app/actions/interview";
import { Activity, Clock, GitBranch, Star, Users } from "lucide-react";

export default async function AnalyticsPage() {
    const analytics = await fetchRecruiterAnalytics();

    const stats = [
        { label: "Total Interviews", value: analytics.totalInterviews, icon: Users },
        { label: "Completed", value: analytics.completedInterviews, icon: Activity },
        { label: "Pending", value: analytics.pendingInterviews, icon: Clock },
        { label: "Average Score", value: analytics.averageScore, icon: Star },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
                <p className="text-text-secondary mt-1">A live summary of your interview pipeline and AI score distribution.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
                            <Icon className="w-5 h-5 text-accent mb-5" />
                            <p className="text-sm text-text-secondary">{stat.label}</p>
                            <p className="text-3xl font-bold text-text-primary mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <section className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-5">Recommendations</h2>
                    <div className="space-y-3">
                        {Object.entries(analytics.recommendationCounts).length === 0 ? (
                            <p className="text-text-secondary text-sm">No completed interviews yet.</p>
                        ) : (
                            Object.entries(analytics.recommendationCounts).map(([label, count]) => (
                                <div key={label} className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3">
                                    <span className="text-text-secondary text-sm">{label}</span>
                                    <span className="text-text-primary font-bold">{count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-5">Top Candidates</h2>
                    <div className="space-y-3">
                        {analytics.topCandidates.length === 0 ? (
                            <p className="text-text-secondary text-sm">Top candidates will appear after interviews are completed.</p>
                        ) : (
                            analytics.topCandidates.map((candidate) => (
                                <div key={candidate.id} className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3">
                                    <div>
                                        <p className="text-text-primary font-medium">{candidate.candidate_name}</p>
                                        <p className="text-xs text-text-secondary">{candidate.jobs?.title}</p>
                                    </div>
                                    <span className="text-accent font-bold">{candidate.overall_score}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <section className="bg-card border border-border rounded-xl p-6">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary mb-5">
                    <GitBranch className="h-5 w-5 text-primary" />
                    Pipeline Stages
                </h2>
                <div className="grid gap-3 md:grid-cols-6">
                    {["applied", "screening", "interview", "offer", "hired", "rejected"].map((stage) => (
                        <div key={stage} className="rounded-2xl border border-border bg-background p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">{stage}</p>
                            <p className="mt-3 text-3xl font-semibold text-text-primary">{analytics.stageCounts?.[stage] || 0}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
