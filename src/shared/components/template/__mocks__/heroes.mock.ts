import type { Hero } from "@shared/types/domain/heroes";

type HeroAttribute = "strength" | "agility" | "intelligence" | "universal";
type OpenDotaPrimaryAttr = "str" | "agi" | "int" | "all";

type CachedHero = {
  id: number;
  primary_attr: OpenDotaPrimaryAttr;
  localized_name: string;
};

const HEROES_URL =
    "https://api.opendota.com/api/explorer?sql=SELECT%20*%0AFROM%20heroes%3B";

const ATTRIBUTE_TO_OPEN_DOTA: Record<HeroAttribute, OpenDotaPrimaryAttr> = {
  strength: "str",
  agility: "agi",
  intelligence: "int",
  universal: "all",
};

const OPEN_DOTA_TO_ATTRIBUTE: Record<OpenDotaPrimaryAttr, HeroAttribute> = {
  str: "strength",
  agi: "agility",
  int: "intelligence",
  all: "universal",
};

const ATTRIBUTE_ROLES: Record<HeroAttribute, string[]> = {
  strength: ["Durable", "Initiator"],
  agility: ["Carry", "Escape"],
  intelligence: ["Support", "Nuker"],
  universal: ["Versatile", "Disabler"],
};

let heroesCache: CachedHero[] | null = null;
let heroesCachePromise: Promise<CachedHero[]> | null = null;

function normalizePrimaryAttr(attr: HeroAttribute): OpenDotaPrimaryAttr {
  return ATTRIBUTE_TO_OPEN_DOTA[attr];
}

function denormalizePrimaryAttr(attr: OpenDotaPrimaryAttr): HeroAttribute {
  return OPEN_DOTA_TO_ATTRIBUTE[attr];
}

function toHeroLocalizedNameSlug(localizedName: string): string {
  return localizedName
      .trim()
      .replace(/-/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toLowerCase();
}


function buildHeroShape(params: {
  id: number;
  localized_name: string;
  primary_attr: HeroAttribute;
}): Hero {
  const temp_localized_name = params.localized_name;
  const hero_localized_name_slug = toHeroLocalizedNameSlug(temp_localized_name);

  return {
    open_dota_id: params.id,
    name: temp_localized_name,
    slug: hero_localized_name_slug,
    local_name: temp_localized_name,
    primary_attr: params.primary_attr,
    attack_type: "Melee",
    roles: ATTRIBUTE_ROLES["strength"],
    icons: null,
    meta_cached_at: null,
  };
}

function buildHeroFromCachedHero(hero: CachedHero): Hero {
  return buildHeroShape({
    id: hero.id,
    localized_name: hero.localized_name,
    primary_attr: denormalizePrimaryAttr(hero.primary_attr),
  });
}

function buildFallbackHero(id: number, attribute: HeroAttribute): Hero {
  return buildHeroShape({
    id,
    localized_name: `Mock Hero ${id}`,
    primary_attr: attribute,
  });
}

/**
 * Fetches heroes once, caches only:
 * - id
 * - primary_attr
 * - localized_name
 *
 * This starts running immediately on first import.
 */
export async function getDataHeroes(): Promise<CachedHero[]> {
  if (heroesCache) return heroesCache;

  if (!heroesCachePromise) {
    heroesCachePromise = fetch(HEROES_URL)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch heroes: ${response.status}`);
          }

          const data = (await response.json()) as {
            rows?: Array<{
              id: number;
              primary_attr: OpenDotaPrimaryAttr;
              localized_name: string;
            }>;
          };

          const rows = Array.isArray(data?.rows) ? data.rows : [];

          const cached = rows
              .filter(
                  (row): row is { id: number; primary_attr: OpenDotaPrimaryAttr; localized_name: string } =>
                      typeof row?.id === "number" &&
                      (row.primary_attr === "str" ||
                          row.primary_attr === "agi" ||
                          row.primary_attr === "int" ||
                          row.primary_attr === "all") &&
                      typeof row.localized_name === "string",
              )
              .map((row) => ({
                id: row.id,
                primary_attr: row.primary_attr,
                localized_name: row.localized_name,
              }));

          heroesCache = cached;
          return cached;
        })
        .catch((error) => {
          console.error("getDataHeroes error:", error);
          heroesCache = [];
          return [];
        });
  }

  return heroesCachePromise;
}

// Trigger the first fetch immediately on import.
void getDataHeroes();

/**
 * Keeps the same params, but now tries to use cached real data first.
 * If no cached match exists yet, it falls back to a mock hero.
 */
export function createMockHero(id: number, attribute: HeroAttribute): Hero {
  const cached = heroesCache?.find(
      (hero) => hero.id === id && denormalizePrimaryAttr(hero.primary_attr) === attribute,
  );

  if (cached) {
    return buildHeroFromCachedHero(cached);
  }

  return buildFallbackHero(id, attribute);
}

/**
 * Keeps the same params, but now filters cached heroes by primary_attr.
 * Returns the same Hero shape as createMockHero.
 */
export async function createMockHeroes(
    count: number,
    attribute: HeroAttribute,
): Promise<Hero[]> {
  const heroes = await getDataHeroes();
  const filteredAttr = normalizePrimaryAttr(attribute);

  const filteredHeroes = heroes
      .filter((hero) => hero.primary_attr === filteredAttr)
      .slice(0, count);

  const realHeroes = filteredHeroes.map(buildHeroFromCachedHero);

  if (realHeroes.length >= count) {
    return realHeroes;
  }

  const startId =
      heroes.reduce((max, hero) => Math.max(max, hero.id), 0) + 1;

  const fallbackHeroes = Array.from(
      { length: count - realHeroes.length },
      (_, index) => buildFallbackHero(startId + index, attribute),
  );

  return [...realHeroes, ...fallbackHeroes];
}

/**
 * Accepts `name` and matches it against cached localized_name.
 * Returns the same Hero shape as createMockHero.
 */
export function createRealHero(name: string): Hero {
  const hero = heroesCache?.find(
      (item) => item.localized_name === name
  );

  if (hero) {
    return buildHeroFromCachedHero(hero);
  }

  return buildHeroShape({
    id: -1,
    localized_name: name,
    primary_attr: "universal",
  });
}

/**
 * Accepts `attr` and matches it against cached primary_attr.
 * Returns the same Hero shape as createRealHero.
 */
export async function createRealAttributeHero(
    attr: HeroAttribute,
): Promise<Hero> {
  const heroes = await getDataHeroes();
  const filteredAttr = normalizePrimaryAttr(attr);
  const hero = heroes.find((item) => item.primary_attr === filteredAttr);

  if (hero) {
    return buildHeroFromCachedHero(hero);
  }

  return buildFallbackHero(-1, attr);
}

/**
 * Returns all cached heroes in the same format as createRealHero.
 */
export function createRealHeroes(
    count: number,
    attribute: HeroAttribute,
): Hero[] {
  const filteredAttr = normalizePrimaryAttr(attribute);

  const heroes =
      heroesCache
          ?.filter((hero) => hero.primary_attr === filteredAttr)
          .slice(0, count)
          .map(buildHeroFromCachedHero) ?? [];

  if (heroes.length >= count) {
    return heroes;
  }

  // fallback if cache not ready / not enough data
  const fallback = Array.from({ length: count - heroes.length }, (_, index) =>
      buildFallbackHero(index + 1, attribute),
  );

  return [...heroes, ...fallback];
}