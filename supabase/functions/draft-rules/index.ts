// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
// @ts-ignore
import {handleGetList} from "./domain/get-list.ts";
// @ts-ignore
import {handleFindById} from "./domain/find-by-id.ts";

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    // when deployed under /auth you may receive paths like "/login" or "/signup"
    // Example:
    // /auth/signup  -> ["", "auth", "signup"]
    const segments = url.pathname.split("/").filter(Boolean);

    // segments[0] = "draft-rules"
    // segments[1] = "get-list"
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

    if (route === "get-list" && req.method === "GET") {
      return await handleGetList(req);
    }

    if (route === "find-by-id" && req.method === "GET") {
      return await handleFindById(req);
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
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/draft-rules' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
