import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function POST(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { role } = body;

        if (!role || (role !== "candidate" && role !== "recruiter")) {
            return new NextResponse("Invalid role", { status: 400 });
        }

        // 1. Update Clerk publicMetadata
        await clerkClient().users.updateUserMetadata(userId, {
            publicMetadata: {
                role: role,
            },
        });

        // 2. Update Supabase users table
        // We do this here as well to ensure it's immediately available,
        // rather than waiting for the webhook to eventually sync it.
        const supabase = createSupabaseServerClient();
        await supabase
            .from("users")
            .update({ role: role })
            .eq("id", userId);

        return NextResponse.json({ success: true, role });
    } catch (error) {
        console.error("[SET_ROLE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
