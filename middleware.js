import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/set-role(.*)", "/onboarding"]);
const isRecruiterRoute = createRouteMatcher([
    "/dashboard/recruiter(.*)",
    "/dashboard/organization(.*)",
    "/dashboard/jobs(.*)",
    "/dashboard/pipeline(.*)",
    "/dashboard/candidates(.*)",
    "/dashboard/analytics(.*)",
    "/dashboard/integrations(.*)",
]);
const isAdminRoute = createRouteMatcher(["/dashboard/admin(.*)"]);

function getRoleFromClaims(sessionClaims) {
    return (
        sessionClaims?.metadata?.role ||
        sessionClaims?.publicMetadata?.role ||
        sessionClaims?.public_metadata?.role ||
        sessionClaims?.role ||
        "candidate"
    );
}

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const { userId, sessionClaims } = await auth();

        if (!userId) {
            const signInUrl = new URL("/auth/sign-in", req.url);
            signInUrl.searchParams.set("redirect_url", req.url);
            return NextResponse.redirect(signInUrl);
        }

        const role = getRoleFromClaims(sessionClaims);

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
