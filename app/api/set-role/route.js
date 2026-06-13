import { NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(req) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { role } = body;

        if (!role || (role !== "candidate" && role !== "recruiter")) {
            return new NextResponse("Invalid role", { status: 400 });
        }

        // 1. Update Clerk publicMetadata
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: role,
            },
        });

        // 2. Update Supabase users table
        // We do this here as well to ensure it's immediately available,
        // rather than waiting for the webhook to eventually sync it.
        const supabase = createSupabaseServerClient();
        const email = user?.emailAddresses?.[0]?.emailAddress || `${userId}@unknown.local`;
        const fullName = user?.firstName
            ? `${user.firstName} ${user.lastName || ""}`.trim()
            : null;

        const { error: upsertError } = await supabase
            .from("users")
            .upsert({
                id: userId,
                email,
                role,
                full_name: fullName,
                avatar_url: user?.imageUrl || null,
            }, { onConflict: "id" });

        if (upsertError) {
            console.error("[SET_ROLE_SUPABASE_ERROR]", upsertError);
            return new NextResponse("Unable to sync user profile", { status: 500 });
        }

        return NextResponse.json({ success: true, role });
    } catch (error) {
        console.error("[SET_ROLE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
