/**
 * Raw types from OpenDota API (https://api.opendota.com/api/constants/heroes)
 * These are NOT normalized domain types - they represent the raw API response shape.
 */

export type OpenDotaHeroRaw = {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string | null;
  attack_type: string | null;
  roles: string[] | null;
  img: string;
  icon: string;
  base_health: number;
  base_mana: number;
  base_str: number;
  base_agi: number;
  base_int: number;
};

export type OpenDotaHeroesResponse = OpenDotaHeroRaw[] | Record<string, OpenDotaHeroRaw>;