import { fetchUserOrganization } from "@/app/actions/organizations";
import { getUserRole } from "@/lib/roles";
import { auth } from "@clerk/nextjs/server";
import { Building2, KeyRound, ShieldCheck, UserPlus, UserRound } from "lucide-react";

export default async function SettingsPage() {
    const { userId } = await auth();
    const role = await getUserRole();
    const org = await fetchUserOrganization();

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                <p className="text-text-secondary mt-1">Project configuration and account context for the current session.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <section className="bg-card border border-border rounded-xl p-6">
                    <UserRound className="w-6 h-6 text-accent mb-4" />
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Account</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-text-secondary">User ID</dt>
                            <dd className="text-text-primary text-right truncate max-w-[260px]">{userId}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-text-secondary">Role</dt>
                            <dd className="text-text-primary capitalize">{role}</dd>
                        </div>
                    </dl>
                </section>

                <section className="bg-card border border-border rounded-xl p-6">
                    <Building2 className="w-6 h-6 text-accent mb-4" />
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Organization</h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-text-secondary">Name</dt>
                            <dd className="text-text-primary">{org?.name || "Not configured"}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-text-secondary">Organization ID</dt>
                            <dd className="text-text-primary text-right truncate max-w-[260px]">{org?.id || "None"}</dd>
                        </div>
                    </dl>
                </section>
            </div>

            <section className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">Environment Checklist</h2>
                        <p className="text-text-secondary text-sm mt-1">
                            Keep real values in `.env.local` or your deployment provider. The public repository should only contain `.env.example` placeholders.
                        </p>
                        <div className="grid md:grid-cols-3 gap-3 mt-5">
                            {["Clerk auth", "Supabase database", "OpenAI scoring", "Vapi voice", "Email provider", "Calendar"].map((item) => (
                                <div key={item} className="bg-background border border-border rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-text-secondary">
                                    <KeyRound className="w-4 h-4 text-accent" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <UserPlus className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-text-primary">Team & Permissions</h2>
                        <p className="text-text-secondary text-sm mt-1">
                            Production recruiting teams usually invite hiring managers, recruiters, and admins with scoped permissions. The database now includes `team_invitations` and audit logs for this workflow.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
