import { fetchAdminDashboardData } from "@/app/actions/admin";
import { checkRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import AdminPanelClient from "./AdminPanelClient";

export default async function AdminDashboard() {
    if (!(await checkRole("admin"))) {
        redirect("/dashboard");
    }

    const data = await fetchAdminDashboardData();

    return <AdminPanelClient data={data} />;
}
