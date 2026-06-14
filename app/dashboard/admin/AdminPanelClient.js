"use client";

import { updateUserRole } from "@/app/actions/admin";
import { Activity, Briefcase, Building2, Database, ShieldCheck, Users } from "lucide-react";
import { useMemo, useState } from "react";

const roleOptions = ["candidate", "recruiter", "admin"];

function MetricCard({ label, value, icon: Icon }) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <Icon className="mb-4 h-5 w-5 text-primary" />
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-1 text-3xl font-semibold text-text-primary">{value}</p>
        </div>
    );
}

export default function AdminPanelClient({ data }) {
    const [query, setQuery] = useState("");
    const normalizedQuery = query.trim().toLowerCase();

    const filteredUsers = useMemo(() => {
        if (!normalizedQuery) return data.users;
        return data.users.filter((user) => {
            return [user.email, user.full_name, user.role, user.organizations?.name]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(normalizedQuery));
        });
    }, [data.users, normalizedQuery]);

    const metrics = [
        { label: "Organizations", value: data.metrics.totalOrganizations, icon: Building2 },
        { label: "Users", value: data.metrics.totalUsers, icon: Users },
        { label: "Jobs", value: data.metrics.totalJobs, icon: Briefcase },
        { label: "Interviews", value: data.metrics.totalInterviews, icon: Activity },
        { label: "Completed", value: data.metrics.completedInterviews, icon: ShieldCheck },
        { label: "Pending", value: data.metrics.pendingInterviews, icon: Database },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Admin Panel</h1>
                    <p className="mt-1 text-text-secondary">Server-side platform controls with client-side filtering.</p>
                </div>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full rounded-full border border-border bg-card px-4 py-3 text-sm text-text-primary outline-none focus:border-primary md:max-w-sm"
                    placeholder="Search users, roles, organizations..."
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {metrics.map((metric) => (
                    <MetricCard key={metric.label} {...metric} />
                ))}
            </div>

            <section className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-5 py-4">
                    <h2 className="text-xl font-semibold text-text-primary">Users & Roles</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-b border-border bg-background text-text-secondary">
                            <tr>
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Organization</th>
                                <th className="px-5 py-3 font-medium">Current Role</th>
                                <th className="px-5 py-3 font-medium">Change Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-text-primary">{user.full_name || "Unnamed user"}</p>
                                        <p className="text-xs text-text-secondary">{user.email}</p>
                                    </td>
                                    <td className="px-5 py-4 text-text-secondary">{user.organizations?.name || "None"}</td>
                                    <td className="px-5 py-4 capitalize text-text-primary">{user.role}</td>
                                    <td className="px-5 py-4">
                                        <form action={updateUserRole} className="flex gap-2">
                                            <input type="hidden" name="user_id" value={user.id} />
                                            <select
                                                name="role"
                                                defaultValue={user.role}
                                                className="rounded-full border border-border bg-background px-3 py-2 text-xs text-text-primary"
                                            >
                                                {roleOptions.map((role) => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            <button className="rounded-full bg-text-primary px-3 py-2 text-xs font-semibold text-card">
                                                Save
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td className="px-5 py-8 text-center text-text-secondary" colSpan={4}>
                                        No users match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-xl border border-border bg-card p-5">
                    <h2 className="text-xl font-semibold text-text-primary">Recent Jobs</h2>
                    <div className="mt-4 space-y-3">
                        {data.jobs.map((job) => (
                            <div key={job.id} className="rounded-lg border border-border bg-background p-4">
                                <p className="font-medium text-text-primary">{job.title}</p>
                                <p className="text-xs text-text-secondary">{job.organizations?.name || "No organization"} · {job.experience_level}</p>
                            </div>
                        ))}
                        {data.jobs.length === 0 && <p className="text-sm text-text-secondary">No jobs yet.</p>}
                    </div>
                </section>

                <section className="rounded-xl border border-border bg-card p-5">
                    <h2 className="text-xl font-semibold text-text-primary">Recent Interviews</h2>
                    <div className="mt-4 space-y-3">
                        {data.interviews.map((interview) => (
                            <div key={interview.id} className="rounded-lg border border-border bg-background p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium text-text-primary">{interview.candidate_name}</p>
                                        <p className="text-xs text-text-secondary">{interview.jobs?.title || "Unknown job"} · {interview.application_stage}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">{interview.overall_score || 0}</span>
                                </div>
                            </div>
                        ))}
                        {data.interviews.length === 0 && <p className="text-sm text-text-secondary">No interviews yet.</p>}
                    </div>
                </section>
            </div>

            <section className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-xl font-semibold text-text-primary">Audit Logs</h2>
                <div className="mt-4 space-y-3">
                    {data.auditLogs.map((log) => (
                        <div key={log.id} className="flex flex-col justify-between gap-2 rounded-lg border border-border bg-background p-4 text-sm md:flex-row">
                            <span className="font-medium text-text-primary">{log.action}</span>
                            <span className="text-text-secondary">{log.entity_type} · {log.entity_id || "none"}</span>
                        </div>
                    ))}
                    {data.auditLogs.length === 0 && <p className="text-sm text-text-secondary">No audit events yet.</p>}
                </div>
            </section>
        </div>
    );
}
