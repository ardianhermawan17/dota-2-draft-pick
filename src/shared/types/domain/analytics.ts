import type { UUID, ISODateString, OpenDotaID } from "./common";

/**
 * draft_sessions table
 */
export type DraftSession = {
    id: UUID;
    plan_id: UUID;
    radiant_team_id: UUID | null;
    dire_team_id: UUID | null;
    started_at: ISODateString | null;
    ended_at: ISODateString | null;
    current_phase: "ban" | "pick" | "complete" | null;
    reserved_seconds_left: number | null;
    created_at: ISODateString;
};

/**
 * session_actions table
 */
export type SessionAction = {
    id: UUID;
    session_id: UUID;
    action_type: "ban" | "pick";
    hero_id: OpenDotaID;
    team_side: "radiant" | "dire";
    order_index: number;
    role: string | null;
    priority: "high" | "medium" | "low" | null;
    note: string | null;
    created_at: ISODateString;
};