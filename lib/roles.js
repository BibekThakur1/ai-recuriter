import { auth, currentUser } from "@clerk/nextjs/server";

export function getRoleFromClaims(sessionClaims) {
    return (
        sessionClaims?.metadata?.role ||
        sessionClaims?.publicMetadata?.role ||
        sessionClaims?.public_metadata?.role ||
        sessionClaims?.role ||
        "candidate"
    );
}

export function getExplicitRoleFromClaims(sessionClaims) {
    return (
        sessionClaims?.metadata?.role ||
        sessionClaims?.publicMetadata?.role ||
        sessionClaims?.public_metadata?.role ||
        sessionClaims?.role ||
        null
    );
}

export async function checkRole(role) {
    const { sessionClaims } = await auth();
    const explicitRole = getExplicitRoleFromClaims(sessionClaims);

    if (explicitRole) {
        return explicitRole === role;
    }

    const user = await currentUser();
    return user?.publicMetadata?.role === role;
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
    const explicitRole = getExplicitRoleFromClaims(sessionClaims);
    if (explicitRole) return explicitRole;

    const user = await currentUser();
    return user?.publicMetadata?.role || "candidate";
}

export async function getExplicitUserRole() {
    const { sessionClaims } = await auth();
    const explicitRole = getExplicitRoleFromClaims(sessionClaims);
    if (explicitRole) return explicitRole;

    const user = await currentUser();
    return user?.publicMetadata?.role || null;
}
