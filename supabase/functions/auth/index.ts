// index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @ts-ignore
import { handleLogin } from "./domain/login.ts";
// @ts-ignore
import { handleSignup } from "./domain/signup.ts";

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    // when deployed under /auth you may receive paths like "/login" or "/signup"
    // Example:
    // /auth/signup  -> ["", "auth", "signup"]
    const segments = url.pathname.split("/").filter(Boolean);

    // segments[0] = "auth"
    // segments[1] = "signup" | "login"
    const route = segments[1];

    // Accept JSON only for POST endpoints
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (route === "login" && req.method === "POST") {
      return await handleLogin(req);
    }

    if (route === "signup" && req.method === "POST") {
      return await handleSignup(req);
    }

    return new Response(JSON.stringify({ message: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unhandled error in router:", err);
    return new Response(JSON.stringify({ message: (err as any).message ?? String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});