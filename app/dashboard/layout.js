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
    Bot
} from "lucide-react";
import SignOutButton from "@/app/components/SignOutButton";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Candidates", href: "/dashboard/candidates", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 fixed inset-y-0 left-0 bg-card border-r border-border flex flex-col z-10">
                <div className="h-16 flex items-center gap-2 px-6 border-b border-border/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-text-primary">
                        AI Recruiter
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-text-secondary"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border/50 space-y-4">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                        <div className="flex-1 truncate text-sm font-medium text-text-primary">
                            My Profile
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
                {children}
            </main>
        </div>
    );
}
