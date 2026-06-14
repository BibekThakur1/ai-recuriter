"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { getUserRole } from "@/lib/roles";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const allowedRoles = ["candidate", "recruiter", "admin"];

function sanitizeText(value, maxLength = 200) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}

async function requireAdmin() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const role = await getUserRole();
    if (role !== "admin") {
        throw new Error("Forbidden: Admin access is required.");
    }

    return { userId };
}

async function countRows(supabase, table) {
    const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

    if (error) {
        console.error(`Admin count failed for ${table}:`, error);
        return 0;
    }

    return count || 0;
}

export async function fetchAdminDashboardData() {
    await requireAdmin();
    const supabase = createSupabaseServerClient();

    const [
        totalOrganizations,
        totalUsers,
        totalJobs,
        totalInterviews,
        completedInterviews,
        pendingInterviews,
    ] = await Promise.all([
        countRows(supabase, "organizations"),
        countRows(supabase, "users"),
        countRows(supabase, "jobs"),
        countRows(supabase, "interviews"),
        supabase.from("interviews").select("*", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("interviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    const [
        { data: users = [] },
        { data: organizations = [] },
        { data: jobs = [] },
        { data: interviews = [] },
        { data: auditLogs = [] },
    ] = await Promise.all([
        supabase
            .from("users")
            .select("id, email, role, full_name, organization_id, created_at, organizations(name)")
            .order("created_at", { ascending: false })
            .limit(12),
        supabase
            .from("organizations")
            .select("id, name, created_at")
            .order("created_at", { ascending: false })
            .limit(8),
        supabase
            .from("jobs")
            .select("id, title, experience_level, interview_type, created_at, organizations(name)")
            .order("created_at", { ascending: false })
            .limit(10),
        supabase
            .from("interviews")
            .select("id, candidate_name, candidate_email, overall_score, status, application_stage, created_at, jobs(title)")
            .order("created_at", { ascending: false })
            .limit(10),
        supabase
            .from("audit_logs")
            .select("id, action, entity_type, entity_id, actor_id, created_at")
            .order("created_at", { ascending: false })
            .limit(10),
    ]);

    return {
        metrics: {
            totalOrganizations,
            totalUsers,
            totalJobs,
            totalInterviews,
            completedInterviews: completedInterviews.count || 0,
            pendingInterviews: pendingInterviews.count || 0,
        },
        users,
        organizations,
        jobs,
        interviews,
        auditLogs,
    };
}

export async function updateUserRole(formData) {
    const { userId: actorId } = await requireAdmin();
    const targetUserId = sanitizeText(formData.get("user_id"), 120);
    const role = sanitizeText(formData.get("role"), 20);

    if (!targetUserId || !allowedRoles.includes(role)) {
        throw new Error("Invalid user or role.");
    }

    if (targetUserId === actorId && role !== "admin") {
        throw new Error("You cannot remove your own admin access.");
    }

    const supabase = createSupabaseServerClient();
    const { data: targetUser, error: targetError } = await supabase
        .from("users")
        .select("id, role, organization_id")
        .eq("id", targetUserId)
        .single();

    if (targetError || !targetUser) {
        throw new Error("User not found.");
    }

    const { error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", targetUserId);

    if (error) {
        console.error("Admin role update failed:", error);
        throw new Error("Unable to update user role.");
    }

    try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(targetUserId, {
            publicMetadata: { role },
        });
    } catch (metadataError) {
        console.warn("Supabase role updated, but Clerk metadata sync failed:", metadataError);
    }

    await supabase.from("audit_logs").insert({
        organization_id: targetUser.organization_id || null,
        actor_id: actorId,
        action: "user.role_updated",
        entity_type: "user",
        entity_id: targetUserId,
        metadata: {
            previous_role: targetUser.role,
            new_role: role,
        },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
}
