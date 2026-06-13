"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    BarChart,
    Settings,
    KanbanSquare,
    PlugZap,
    Menu,
    Mic2,
} from "lucide-react";
import SignOutButton from "@/app/components/SignOutButton";
import BrandMark from "@/app/components/BrandMark";

const navByRole = {
    candidate: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    recruiter: [
        { name: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboard },
        { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
        { name: "Pipeline", href: "/dashboard/pipeline", icon: KanbanSquare },
        { name: "Candidates", href: "/dashboard/candidates", icon: Users },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
        { name: "Integrations", href: "/dashboard/integrations", icon: PlugZap },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    admin: [
        { name: "Admin", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
        { name: "Pipeline", href: "/dashboard/pipeline", icon: KanbanSquare },
        { name: "Candidates", href: "/dashboard/candidates", icon: Users },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
        { name: "Integrations", href: "/dashboard/integrations", icon: PlugZap },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
};

export default function DashboardShell({ role, children }) {
    const pathname = usePathname();
    const navItems = navByRole[role] || navByRole.candidate;

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 lg:hidden">
                <BrandMark compact />
                <div className="flex items-center gap-3">
                    <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                    <Menu className="h-5 w-5 text-text-secondary" />
                </div>
            </header>

            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-border bg-card/95 lg:flex">
                <div className="flex h-20 items-center px-5 border-b border-border">
                    <BrandMark />
                </div>

                <div className="border-b border-border px-5 py-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-background p-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                            <Mic2 className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Mode</p>
                            <p className="text-sm font-semibold capitalize text-text-primary">{role}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                    ? "bg-text-primary text-card shadow-sm"
                                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                                    }`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? "text-card" : "text-text-secondary"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-4 border-t border-border p-4">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                        <div className="flex-1 truncate text-sm font-medium text-text-primary">
                            My Profile
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            <nav className="sticky top-16 z-10 flex gap-2 overflow-x-auto border-b border-border bg-card/95 px-4 py-3 lg:hidden">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${isActive
                                ? "bg-text-primary text-card"
                                : "bg-background text-text-secondary"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8">
                {children}
            </main>
        </div>
    );
}
