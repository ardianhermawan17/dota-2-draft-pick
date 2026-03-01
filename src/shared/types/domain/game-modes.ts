import type { SerialID, ISODateString } from "./common";

/**
 * game_modes table
 */
export type GameMode = {
    id: SerialID;
    code: string;
    name: string | null;
    created_at: ISODateString;
};