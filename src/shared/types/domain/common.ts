/**
 * Shared primitive types for domain models.
 * These map directly to database column types.
 */

export type UUID = string;
export type ISODateString = string; // timestamptz serialized
export type SerialID = number;
export type OpenDotaID = number;