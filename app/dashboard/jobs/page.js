import { fetchJobs } from "@/app/actions/jobs";
import { Briefcase, Calendar, Plus, Users } from "lucide-react";
import Link from "next/link";

export default async function JobsPage() {
    const jobs = await fetchJobs();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Jobs</h1>
                    <p className="text-text-secondary mt-1">Create roles, share interview links, and track candidate activity.</p>
                </div>
                <Link
                    href="/dashboard/jobs/new"
                    className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-lg font-medium shadow-lg transition-transform active:scale-95 shadow-primary/25 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-10 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-text-secondary mb-4" />
                    <h2 className="text-xl font-semibold text-text-primary">No jobs yet</h2>
                    <p className="text-text-secondary mt-2 mb-6">Create your first job to generate a candidate interview link.</p>
                    <Link href="/dashboard/jobs/new" className="text-primary hover:text-accent font-medium">
                        Create a job
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => {
                        const completed = job.interviews?.filter((item) => item.status === "completed").length || 0;
                        const candidateCount = job.interviews?.length || 0;

                        return (
                            <Link
                                key={job.id}
                                href={`/dashboard/jobs/${job.id}`}
                                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors block"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-xl font-semibold text-text-primary">{job.title}</h2>
                                            <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-semibold uppercase">
                                                {job.experience_level || "mid"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary line-clamp-2 max-w-2xl">{job.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {(job.required_skills || []).slice(0, 5).map((skill) => (
                                                <span key={skill} className="px-2 py-1 rounded border border-border bg-background text-xs text-text-secondary">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 md:w-56">
                                        <div className="bg-background border border-border rounded-lg p-3">
                                            <Users className="w-4 h-4 text-accent mb-2" />
                                            <p className="text-lg font-bold text-text-primary">{candidateCount}</p>
                                            <p className="text-xs text-text-secondary">{completed} completed</p>
                                        </div>
                                        <div className="bg-background border border-border rounded-lg p-3">
                                            <Calendar className="w-4 h-4 text-accent mb-2" />
                                            <p className="text-sm font-semibold text-text-primary">{new Date(job.created_at).toLocaleDateString()}</p>
                                            <p className="text-xs text-text-secondary">created</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
