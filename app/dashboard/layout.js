import { getExplicitUserRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({ children }) {
    const role = await getExplicitUserRole();

    if (!role) {
        redirect("/onboarding");
    }

    return <DashboardShell role={role}>{children}</DashboardShell>;
}
