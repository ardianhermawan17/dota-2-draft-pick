import type { UUID, ISODateString } from "./common";

/**
 * users table
 * Pure database representation.
 */
export type User = {
    id: UUID;
    email: string;
    password: string; // hashed password stored in DB
    display_name: string | null;
    avatar_url: string | null;
    role: "user" | "admin";
    created_at: ISODateString;
    updated_at: ISODateString | null;
};