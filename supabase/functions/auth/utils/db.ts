// utils/db.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @ts-ignore
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";

/**
 * Create a Supabase client using service role key for elevated access to your tables.
 * Uses PROJECT_URL and SERVICE_ROLE_KEY environment variables.
 */
export function createSupabaseClient(): SupabaseClient {
    const url = Deno.env.get("PROJECT_URL") ?? Deno.env.get("SUPABASE_URL") ?? "";
    const key = Deno.env.get("SERVICE_ROLE_KEY") ?? "";
    if (!url || !key) {
        throw new Error("PROJECT_URL and SERVICE_ROLE_KEY must be provided in environment");
    }

    // Pass Authorization header globally so queries use service role privileges
    const client = createClient(url, key, {
        global: {
            headers: {
                Authorization: `Bearer ${key}`,
            },
        },
    });

    return client;
}