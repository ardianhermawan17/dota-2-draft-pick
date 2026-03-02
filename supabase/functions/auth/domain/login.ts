// domain/login.ts
// @ts-ignore
import { createSupabaseClient } from "../utils/db.ts";
// @ts-ignore
import { verifyPassword } from "../utils/hash.ts";
// @ts-ignore
import { jsonResponse, errorResponse } from "../utils/response.ts";

export async function handleLogin(req: Request): Promise<Response> {
    try {
        const body = await req.json().catch(() => null);
        if (!body) return errorResponse("Invalid JSON body", 400);

        const { email, password } = body;
        if (!email || !password) return errorResponse("email and password required", 400);

        const supabase = createSupabaseClient();

        const { data, error: selErr } = await supabase
            .from("users")
            .select("id, email, password_hash, display_name, avatar_url, role, created_at")
            .eq("email", email)
            .limit(1);

        if (selErr) {
            console.error("db select error:", selErr);
            return errorResponse("Database error", 500);
        }

        const user = Array.isArray(data) && data.length ? data[0] : null;
        if (!user) return errorResponse("Invalid credentials", 401);

        const ok = await verifyPassword(String(password), user.password_hash || "");
        if (!ok) return errorResponse("Invalid credentials", 401);

        // Remove password_hash from response
        const { password_hash, ...publicUser } = user as any;

        // Optionally: create and return a session token here (JWT or similar).
        return jsonResponse({ user: publicUser }, 200);
    } catch (err) {
        console.error("login error:", err);
        return errorResponse((err as any).message ?? "Internal error", 500);
    }
}