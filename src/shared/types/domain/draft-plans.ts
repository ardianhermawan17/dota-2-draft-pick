import type { UUID, ISODateString, OpenDotaID } from "./common";

/**
 * draft_plans table
 */
export type DraftPlan = {
    id: UUID;
    owner_id: UUID;
    template_rule_id: UUID | null;
    name: string;
    description: string | null;
    mode: "static" | "live";
    is_public: boolean;
    created_at: ISODateString;
    updated_at: ISODateString | null;
    version: number;
};

/**
 * bans table
 */
export type Ban = {
    id: UUID;
    plan_id: UUID;
    hero_id: OpenDotaID;
    team_side: "radiant" | "dire";
    note: string | null;
    order_index: number | null;
    created_at: ISODateString;
};

/**
 * preferred_picks table
 */
export type PreferredPick = {
    id: UUID;
    plan_id: UUID;
    hero_id: OpenDotaID;
    team_side: "radiant" | "dire";
    role: string | null;
    priority: "high" | "medium" | "low" | null;
    note: string | null;
    order_index: number | null;
    created_at: ISODateString;
};

/**
 * enemy_threats table
 */
export type EnemyThreat = {
    id: UUID;
    plan_id: UUID;
    hero_id: OpenDotaID;
    note: string | null;
    created_at: ISODateString;
};

/**
 * item_timing_notes table
 */
export type ItemTimingNote = {
    id: UUID;
    plan_id: UUID;
    timing_key: string;
    timing_minute: number | null;
    explanation: string | null;
    created_at: ISODateString;
};