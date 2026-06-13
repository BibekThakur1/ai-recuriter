import { CalendarDays, Mail, Mic2, PlugZap, ShieldCheck, UploadCloud, Workflow } from "lucide-react";

const integrations = [
    {
        name: "Vapi Voice Interviews",
        status: process.env.VAPI_PRIVATE_API_KEY?.startsWith("add_your") ? "Needs keys" : "Configured",
        icon: Mic2,
        body: "Connect live voice interviews, recordings, and call-completion webhooks.",
    },
    {
        name: "OpenAI Scoring",
        status: process.env.OPENAI_API_KEY?.startsWith("sk-") ? "Configured" : "Fallback mode",
        icon: ShieldCheck,
        body: "Generate interview scripts, score resumes, summarize transcripts, and draft recruiter feedback.",
    },
    {
        name: "Resume Storage",
        status: "Ready to connect",
        icon: UploadCloud,
        body: "Use Supabase Storage or S3 for resume PDFs, recordings, and candidate attachments.",
    },
    {
        name: "Email Provider",
        status: "Ready to connect",
        icon: Mail,
        body: "Connect Resend, SendGrid, or Postmark for confirmations, reminders, and decisions.",
    },
    {
        name: "Calendar",
        status: "Ready to connect",
        icon: CalendarDays,
        body: "Google Calendar or Outlook scheduling for live recruiter interviews.",
    },
    {
        name: "ATS Export",
        status: "Ready to connect",
        icon: Workflow,
        body: "Sync candidate data to Greenhouse, Lever, Workable, or a custom webhook.",
    },
];

export default function IntegrationsPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Integrations</h1>
                <p className="mt-1 text-text-secondary">Production services that turn Hireflow into a complete recruiting platform.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {integrations.map((integration) => {
                    const Icon = integration.icon;
                    return (
                        <section key={integration.name} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-background text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-text-secondary">
                                    {integration.status}
                                </span>
                            </div>
                            <h2 className="mt-8 text-xl font-semibold text-text-primary">{integration.name}</h2>
                            <p className="mt-3 leading-7 text-text-secondary">{integration.body}</p>
                        </section>
                    );
                })}
            </div>

            <section className="rounded-3xl border border-border bg-text-primary p-8 text-card">
                <div className="flex items-start gap-4">
                    <PlugZap className="mt-1 h-6 w-6 text-accent" />
                    <div>
                        <h2 className="text-2xl font-semibold">Production setup checklist</h2>
                        <p className="mt-3 max-w-3xl leading-7 text-card/75">
                            Add real service keys in `.env.local`, configure Clerk webhooks, run the Supabase schema, and connect storage/email/calendar providers when you are ready for a live deployment.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
