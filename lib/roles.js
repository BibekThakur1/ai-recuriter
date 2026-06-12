import { auth } from "@clerk/nextjs/server";

export async function checkRole(role) {
    const { sessionClaims } = await auth();
    return sessionClaims?.metadata?.role === role;
}

export async function isRecruiter() {
    return checkRole("recruiter");
}

export async function isCandidate() {
    return checkRole("candidate");
}

export async function isAdmin() {
    return checkRole("admin");
}

export async function getUserRole() {
    const { sessionClaims } = await auth();
    return sessionClaims?.metadata?.role || "candidate";
}
