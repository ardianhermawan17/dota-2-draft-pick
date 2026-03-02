// domain/signup.ts

// @ts-ignore
import { createSupabaseClient } from "../utils/db.ts";
// @ts-ignore
import { createPasswordHash } from "../utils/hash.ts";
// @ts-ignore
import { jsonResponse, errorResponse } from "../utils/response.ts";

export async function handleSignup(req: Request): Promise<Response> {
    try {
        const body = await req.json().catch(() => null);
        if (!body) return errorResponse("Invalid JSON body", 400);

        const { email, password, display_name } = body;
        if (!email || !password) return errorResponse("email and password required", 400);

        const supabase = createSupabaseClient();

        // check existing user
        const { data: existing, error: selErr } = await supabase
            .from("users")
            .select("id, email")
            .eq("email", email)
            .limit(1);

        if (selErr) {
            console.error("db select error:", selErr);
            return errorResponse("Database error", 500);
        }
        if (existing && existing.length > 0) {
            return errorResponse("Email already registered", 409);
        }

        // hash password (on edge)
        const password_hash = await createPasswordHash(String(password));

        const insertPayload: Record<string, any> = {
            email,
            password_hash,
            display_name: display_name ?? null,
        };

        const { data, error: insertErr } = await supabase
            .from("users")
            .insert(insertPayload)
            .select("id, email, display_name, avatar_url, role, created_at")
            .limit(1);

        if (insertErr) {
            console.error("db insert error:", insertErr);
            return errorResponse("Database error on insert", 500);
        }

        const user = Array.isArray(data) ? data[0] : data;

        return jsonResponse({ ...user }, 'Signup success',201);
    } catch (err) {
        console.error("signup error:", err);
        return errorResponse((err as any).message ?? "Internal error", 500);
    }
}