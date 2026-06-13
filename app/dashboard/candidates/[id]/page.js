import {
    fetchInterviewById,
    generateRecruiterEmailDraft,
    saveCandidateNotes,
    updateCandidateStage,
} from "@/app/actions/interview";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Mail, NotebookPen, Send, Star, UserRound, XCircle } from "lucide-react";
import Link from "next/link";
import CopyButton from "@/app/components/CopyButton";

const stages = ["applied", "screening", "interview", "offer", "hired", "rejected"];

function ScoreCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-text-primary">{value || 0}</p>
        </div>
    );
}

export default async function CandidateDetailPage({ params }) {
    const candidate = await fetchInterviewById(params.id);
    if (!candidate) notFound();

    const nextRoundEmail = await generateRecruiterEmailDraft(params.id, "next-round");
    const rejectEmail = await generateRecruiterEmailDraft(params.id, "reject");

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <Link href="/dashboard/candidates" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to candidates
            </Link>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
                    <div className="flex items-start gap-5">
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-text-primary text-2xl font-semibold text-card">
                            {candidate.candidate_name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-text-primary">{candidate.candidate_name}</h1>
                            <p className="mt-1 text-text-secondary">{candidate.jobs?.title} at {candidate.jobs?.organizations?.name}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {(candidate.tags || []).map((tag) => (
                                    <span key={tag} className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-text-secondary">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-background p-5 text-center">
                        <Star className="mx-auto h-5 w-5 text-primary" />
                        <p className="mt-2 text-4xl font-semibold text-text-primary">{candidate.overall_score || 0}</p>
                        <p className="text-sm text-text-secondary">overall score</p>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                <main className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <ScoreCard label="Technical" value={candidate.technical_score} />
                        <ScoreCard label="Communication" value={candidate.communication_score} />
                        <ScoreCard label="Skill match" value={candidate.skill_match_score} />
                        <ScoreCard label="Resume" value={candidate.resume_score} />
                        <ScoreCard label="Confidence" value={candidate.confidence_score} />
                        <ScoreCard label="Culture fit" value={candidate.cultural_fit_score} />
                    </div>

                    <section className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-semibold text-text-primary">AI Review</h2>
                        <p className="mt-4 leading-7 text-text-secondary">{candidate.ai_summary || "No AI summary available."}</p>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-background p-4">
                                <h3 className="flex items-center gap-2 font-semibold text-text-primary">
                                    <CheckCircle2 className="h-4 w-4 text-success" />
                                    Strengths
                                </h3>
                                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                                    {(candidate.strengths?.length ? candidate.strengths : ["Awaiting human review"]).map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-2xl bg-background p-4">
                                <h3 className="font-semibold text-text-primary">Concerns</h3>
                                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                                    {(candidate.concerns?.length ? candidate.concerns : ["No major concerns captured"]).map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-semibold text-text-primary">Transcript</h2>
                        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-background p-5 text-sm leading-7 text-text-secondary">
                            {candidate.transcript || "No transcript available."}
                        </pre>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-semibold text-text-primary">Resume / Background</h2>
                        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-background p-5 text-sm leading-7 text-text-secondary">
                            {candidate.candidate_resume_text || "No resume text provided."}
                        </pre>
                    </section>
                </main>

                <aside className="space-y-6">
                    <section className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
                            <UserRound className="h-5 w-5 text-primary" />
                            Contact
                        </h2>
                        <div className="mt-4 space-y-3 text-sm text-text-secondary">
                            <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{candidate.candidate_email}</p>
                            <p>{candidate.candidate_phone || "No phone provided"}</p>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-semibold text-text-primary">Pipeline Stage</h2>
                        <form action={updateCandidateStage} className="mt-4 flex gap-2">
                            <input type="hidden" name="interview_id" value={candidate.id} />
                            <select name="application_stage" defaultValue={candidate.application_stage || "screening"} className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm">
                                {stages.map((stage) => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>
                            <button className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white">Save</button>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-semibold text-text-primary">Decision</h2>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            Use these after reviewing the AI score, transcript, and resume signal.
                        </p>
                        <div className="mt-4 grid gap-3">
                            <form action={updateCandidateStage}>
                                <input type="hidden" name="interview_id" value={candidate.id} />
                                <input type="hidden" name="application_stage" value="interview" />
                                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-white">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Select for next round
                                </button>
                            </form>
                            <form action={updateCandidateStage}>
                                <input type="hidden" name="interview_id" value={candidate.id} />
                                <input type="hidden" name="application_stage" value="rejected" />
                                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-danger px-4 py-3 text-sm font-semibold text-white">
                                    <XCircle className="h-4 w-4" />
                                    Reject candidate
                                </button>
                            </form>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
                            <NotebookPen className="h-5 w-5 text-primary" />
                            Recruiter Notes
                        </h2>
                        <form action={saveCandidateNotes} className="mt-4 space-y-4">
                            <input type="hidden" name="interview_id" value={candidate.id} />
                            <textarea name="recruiter_notes" defaultValue={candidate.recruiter_notes || ""} rows={6} className="w-full rounded-2xl border border-border bg-background p-4 text-sm text-text-primary" placeholder="Private team notes..." />
                            <input name="next_step" defaultValue={candidate.next_step || ""} className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-text-primary" placeholder="Next step: schedule live interview..." />
                            <button className="w-full rounded-full bg-text-primary px-4 py-3 text-sm font-semibold text-card">Save notes</button>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-text-primary">
                            <Send className="h-5 w-5 text-primary" />
                            Email Drafts
                        </h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-text-primary">Next round</p>
                                    <CopyButton value={nextRoundEmail} label="Copy" compact />
                                </div>
                                <pre className="whitespace-pre-wrap rounded-2xl bg-background p-4 text-xs leading-6 text-text-secondary">{nextRoundEmail}</pre>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-text-primary">Rejection</p>
                                    <CopyButton value={rejectEmail} label="Copy" compact />
                                </div>
                                <pre className="whitespace-pre-wrap rounded-2xl bg-background p-4 text-xs leading-6 text-text-secondary">{rejectEmail}</pre>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
