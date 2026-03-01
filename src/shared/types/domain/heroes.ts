import type { OpenDotaID, ISODateString } from "./common";

/**
 * heroes table
 */
export type Hero = {
    open_dota_id: OpenDotaID;
    name: string;
    slug: string | null;
    local_name: string | null;
    primary_attr: string | null;
    attack_type: string | null;
    roles: string[] | null; // jsonb
    icons: {
        portrait_url?: string;
        full_url?: string;
    } | null;
    meta_cached_at: ISODateString | null;
};