import { fetchJobById } from "@/app/actions/jobs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, BrainCircuit, Link as LinkIcon, Sparkles } from "lucide-react";

export default async function JobDetailPage({ params }) {
    const job = await fetchJobById(params.id);

    if (!job) {
        notFound();
    }

    // Determine base URL for interview link
    // In production, this should be an env variable like NEXT_PUBLIC_APP_URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const interviewLink = `${baseUrl}/interview/${job.interview_token}`;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-24">
            <header>
                <Link
                    href="/dashboard/jobs"
                    className="flex items-center text-sm text-text-secondary hover:text-primary transition-colors mb-6 group w-fit"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Jobs
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-text-primary">{job.title}</h1>
                            <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                                {job.experience_level}
                            </span>
                        </div>
                        <p className="text-text-secondary">
                            {job.organizations?.name} • Created {new Date(job.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Interview Link Card */}
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                                <LinkIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-text-primary mb-2">Candidate Interview Link</h2>
                                <p className="text-text-secondary text-sm mb-4">
                                    Share this unique link with candidates. They will instantly connect with our Voice AI interviewer to complete their screening.
                                </p>

                                <div className="flex items-center gap-3">
                                    <code className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm text-text-primary overflow-x-auto whitespace-nowrap scrollbar-hide">
                                        {interviewLink}
                                    </code>
                                    {/* Client component wrapper for copy logic would go here, omitting for SSR simplicity, falling back to a dummy button for now */}
                                    <button className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium transition-all active:scale-95 shadow-lg shadow-primary/20 whitespace-nowrap">
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Questions Review */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3 bg-background/50">
                            <BrainCircuit className="w-5 h-5 text-accent" />
                            <h2 className="text-xl font-semibold text-text-primary">AI Interview Script</h2>
                        </div>
                        <div className="p-6">
                            {job.ai_questions && job.ai_questions.length > 0 ? (
                                <ul className="space-y-6">
                                    {job.ai_questions.map((q, idx) => (
                                        <li key={idx} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex justify-center items-center font-bold text-sm shrink-0">
                                                {idx + 1}
                                            </div>
                                            <p className="text-text-secondary mt-1">{q}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-text-secondary italic">No AI questions generated for this job.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-semibold text-text-primary mb-4">Job Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-text-secondary mb-1">Interview Type</p>
                                <p className="text-sm font-medium text-text-primary capitalize">{job.interview_type}</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-secondary mb-2">Required Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {job.required_skills?.map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-background border border-border rounded text-xs text-text-secondary flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3 text-accent" />
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Candidates Link */}
                    <div className="bg-card border border-border rounded-xl p-6 group cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-text-primary">Candidates</h3>
                            </div>
                            <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                0
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary">View and rank applicants</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
