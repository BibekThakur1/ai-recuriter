import { fetchPipelineData, updateCandidateStage } from "@/app/actions/interview";
import { ArrowRight, KanbanSquare } from "lucide-react";
import Link from "next/link";

const stageLabels = {
    applied: "Applied",
    screening: "Screening",
    interview: "Interview",
    offer: "Offer",
    hired: "Hired",
    rejected: "Rejected",
};

export default async function PipelinePage() {
    const columns = await fetchPipelineData();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Pipeline</h1>
                <p className="text-text-secondary mt-1">Move candidates through the hiring process from application to decision.</p>
            </div>

            <div className="grid gap-4 xl:grid-cols-6">
                {columns.map((column) => (
                    <section key={column.stage} className="min-h-[460px] rounded-2xl border border-border bg-card p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-text-primary">{stageLabels[column.stage]}</h2>
                            <span className="rounded-full bg-background px-2 py-1 text-xs font-semibold text-text-secondary">
                                {column.candidates.length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {column.candidates.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border bg-background p-5 text-center text-sm text-text-secondary">
                                    <KanbanSquare className="mx-auto mb-3 h-5 w-5" />
                                    Empty
                                </div>
                            ) : (
                                column.candidates.map((candidate) => (
                                    <div key={candidate.id} className="rounded-xl border border-border bg-background p-4">
                                        <Link href={`/dashboard/candidates/${candidate.id}`} className="group block">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="font-semibold text-text-primary">{candidate.candidate_name}</h3>
                                                    <p className="mt-1 text-xs text-text-secondary">{candidate.jobs?.title}</p>
                                                </div>
                                                <span className="text-lg font-semibold text-primary">{candidate.overall_score || 0}</span>
                                            </div>
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-secondary">{candidate.ai_summary || "Awaiting score summary."}</p>
                                        </Link>

                                        <form action={updateCandidateStage} className="mt-4 flex gap-2">
                                            <input type="hidden" name="interview_id" value={candidate.id} />
                                            <select name="application_stage" defaultValue={column.stage} className="min-w-0 flex-1 rounded-full border border-border bg-card px-3 py-2 text-xs text-text-primary">
                                                {Object.entries(stageLabels).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                            <button className="rounded-full bg-text-primary px-3 py-2 text-card" title="Move candidate">
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </form>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
