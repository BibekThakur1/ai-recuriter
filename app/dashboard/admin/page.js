import { checkRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import { ShieldAlert, Database, Activity, Users } from "lucide-react";

export default async function AdminDashboard() {
    if (!(await checkRole("admin"))) {
        redirect("/");
    }

    const systemMetrics = [
        { name: "Total Organizations", value: "42", icon: Users },
        { name: "Global Interviews", value: "1,204", icon: Activity },
        { name: "System Health", value: "99.9%", icon: ShieldAlert, highlight: true },
        { name: "Database Load", value: "24%", icon: Database },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Admin Portal</h1>
                <p className="text-text-secondary mt-1">Platform-wide analytics and system monitoring.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {systemMetrics.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.highlight ? "bg-success/20 text-success" : "bg-background text-primary"}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <h3 className="text-text-secondary text-sm font-medium">{stat.name}</h3>
                            <p className={`text-3xl font-bold mt-1 ${stat.highlight ? "text-success" : "text-text-primary"}`}>{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-8 text-center mt-8">
                <Database className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold text-text-primary mb-2">Platform Data Management</h2>
                <p className="text-text-secondary">Comprehensive tools for managing platform data, API keys, and global limits will be available here.</p>
                <button className="mt-6 bg-background border border-border hover:bg-border text-text-primary px-5 py-2.5 rounded-lg font-medium transition-colors">
                    View Logs
                </button>
            </div>
        </div>
    );
}
