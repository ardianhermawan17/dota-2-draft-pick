// domain/domain-rules/get-list.ts

// @ts-ignore
import { createSupabaseClient } from "../../(shared)/utils/db.ts";
// @ts-ignore
import { jsonResponse, errorResponse } from "../../(shared)/utils/response.ts";

export async function handleFindById(req: Request) {
    const url = new URL(req.url);

    // If an id query param is present, return the single item
    const idParam = url.searchParams.get("id");

    const supabase = createSupabaseClient(req);

    const { data, error } = await supabase
        .from("template_draft_rules")
        .select(`
        id,
        code,
        name,
        description,
        reserved_time,
        created_at,
        updated_at,
        game_mode_id,
        game_mode:game_modes ( id, code, name, created_at ),
        template_draft_rule_entries (
          id,
          rule_id,
          sequence_index,
          action_type,
          team_side,
          count,
          per_action_seconds,
          note,
          created_at
        )
      `)
        .eq("id", idParam)
        .eq("is_active", true)
        .maybeSingle();

    if (error) {
        return jsonResponse({ ...error }, error.message, 500);
    }

    if (!data) {
        return jsonResponse(null, "Draft rule not found", 404);
    }

    return jsonResponse(data, "Draft rule retrieved", 200);
}