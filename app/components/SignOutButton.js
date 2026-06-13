"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

/**
 * Isolated client component for sign-out functionality.
 * Keeps the signOut function contained so it doesn't leak
 * through the React Server Components boundary.
 */
export default function SignOutButton() {
    const { signOut } = useClerk();

    return (
        <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-danger hover:bg-danger/10 transition-colors font-medium text-sm"
        >
            <LogOut className="w-5 h-5" />
            Logout
        </button>
    );
}
