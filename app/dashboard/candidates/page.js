import { fetchInterviews } from "@/app/actions/interview";
import { ArrowRight, Mail, Phone, Search, Star, UserRoundCheck } from "lucide-react";
import Link from "next/link";

export default async function CandidatesPage() {
    const interviews = await fetchInterviews();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Candidates</h1>
                    <p className="text-text-secondary mt-1">Search, compare, and review candidates across every active job.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-text-secondary">
                    <Search className="h-4 w-4" />
                    Smart filters are ready for search integration
                </div>
            </div>

            {interviews.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-10 text-center">
                    <UserRoundCheck className="w-12 h-12 mx-auto text-text-secondary mb-4" />
                    <h2 className="text-xl font-semibold text-text-primary">No candidates yet</h2>
                    <p className="text-text-secondary mt-2">Share a job interview link to start collecting responses.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {interviews.map((interview) => (
                        <Link
                            key={interview.id}
                            href={`/dashboard/candidates/${interview.id}`}
                            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50"
                        >
                            <div className="grid gap-5 md:grid-cols-[1.4fr_1fr_0.8fr_auto] md:items-center">
                                <div className="flex items-start gap-4">
                                    <div className="grid h-12 w-12 place-items-center rounded-full bg-text-primary text-card font-semibold">
                                        {interview.candidate_name?.charAt(0) || "C"}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-text-primary">{interview.candidate_name}</h2>
                                        <p className="text-sm text-text-secondary">{interview.jobs?.title || "Unknown role"}</p>
                                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-text-secondary">
                                            <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{interview.candidate_email}</span>
                                            {interview.candidate_phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{interview.candidate_phone}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="line-clamp-2 text-sm leading-6 text-text-secondary">{interview.ai_summary || "No summary yet."}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                                        <Star className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-semibold text-text-primary">{interview.overall_score || 0}</p>
                                        <p className="text-xs text-text-secondary">overall score</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 md:justify-end">
                                    <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold capitalize text-text-secondary">
                                        {interview.application_stage || "screening"}
                                    </span>
                                    <ArrowRight className="h-5 w-5 text-text-secondary transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
