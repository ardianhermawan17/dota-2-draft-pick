import type { UUID, ISODateString, SerialID } from "./common";

/**
 * template_draft_rules table
 */
export type TemplateDraftRule = {
    id: UUID;
    game_mode_id: SerialID | null;
    code: string;
    name: string;
    description: string | null;
    reserved_time: number;
    is_active: boolean;
    created_at: ISODateString;
    updated_at: ISODateString | null;
};

/**
 * template_draft_rule_entries table
 */
export type TemplateDraftRuleEntry = {
    id: UUID;
    rule_id: UUID;
    sequence_index: number;
    action_type: "ban" | "pick";
    team_side: "radiant" | "dire";
    count: number;
    per_action_seconds: number | null;
    note: string | null;
    created_at: ISODateString | null;
};