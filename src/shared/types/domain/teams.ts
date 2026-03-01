import type { UUID, ISODateString } from "./common";

/**
 * teams table
 */
export type Team = {
    id: UUID;
    owner_id: UUID | null;
    name: string | null;
    slug: string | null;
    logo_url: string | null;
    metadata: Record<string, unknown> | null;
    created_at: ISODateString;
};

/**
 * players table
 */
export type Player = {
    id: UUID;
    team_id: UUID;
    name: string | null;
    slot: number | null;
    avatar_url: string | null;
    preferred_roles: string[] | null;
    created_at: ISODateString;
};