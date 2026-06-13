import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for server-side operations.
 * Prefers SUPABASE_SERVICE_ROLE_KEY for full RLS bypass,
 * falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY for basic operations.
 * IMPORTANT: Only use in Server Actions or Route Handlers.
 */
export function createSupabaseServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
    }

    if (supabaseUrl.includes("example.supabase.co") || supabaseKey.startsWith("add_your_")) {
        throw new Error(
            "Supabase is not fully configured. Add your real NEXT_PUBLIC_SUPABASE_URL and keys to .env.local."
        );
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
