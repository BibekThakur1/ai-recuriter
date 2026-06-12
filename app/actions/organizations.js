"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createOrganization(formData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const name = formData.get("name");
    if (!name) throw new Error("Organization name is required");

    const supabase = createSupabaseServerClient();

    // 1. Create org
    const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({ name })
        .select()
        .single();

    if (orgError || !org) {
        console.error("Error creating org:", orgError);
        throw new Error("Failed to create organization");
    }

    // 2. Link user to org
    const { error: userError } = await supabase
        .from("users")
        .update({ organization_id: org.id })
        .eq("id", userId);

    if (userError) {
        console.error("Error linking user to org:", userError);
        throw new Error("Failed to link user to organization");
    }

    revalidatePath("/dashboard");
    return { success: true, orgId: org.id };
}

export async function fetchUserOrganization() {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = createSupabaseServerClient();

    // Get user's org relation
    const { data: user } = await supabase
        .from("users")
        .select("organization_id")
        .eq("id", userId)
        .single();

    if (!user?.organization_id) return null;

    // Get org details
    const { data: org } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", user.organization_id)
        .single();

    return org;
}
