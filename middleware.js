import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/set-role(.*)", "/onboarding"]);
const isRecruiterRoute = createRouteMatcher(["/dashboard/recruiter(.*)", "/dashboard/organization(.*)", "/dashboard/jobs(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();

        const { sessionClaims } = await auth();
        const role = sessionClaims?.metadata?.role || "candidate";

        // Role-based protection
        if (isRecruiterRoute(req) && role !== "recruiter" && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (isAdminRoute(req) && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
