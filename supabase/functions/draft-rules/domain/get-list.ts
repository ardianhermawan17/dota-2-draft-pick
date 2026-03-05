// domain/domain-rules/get-list.ts

// @ts-ignore
import { createSupabaseClient } from "../../(shared)/utils/db.ts";
// @ts-ignore
import { jsonResponse, errorResponse } from "../../(shared)/utils/response.ts";

export async function handleGetList(req: Request) {
    const url = new URL(req.url);

    const maxParam = url.searchParams.get("limit");
    let max = Number(maxParam) || 20;

    if (max < 1) max = 1;
    if (max > 100) max = 100;

    const supabase = createSupabaseClient(req);

    const { data, error } = await supabase
        .from("template_draft_rules")
        .select(`
      id,
      game_mode_id,
      code,
      name,
      description,
      reserved_time,
      created_at,
      updated_at
    `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(max);

    if (error) {
        return jsonResponse({ ...error}, error.message, 500);
    }

    return jsonResponse([...data], 'Draft rules retrieved', 200);
}