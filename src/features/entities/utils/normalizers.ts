import type {TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules";
import type { Hero } from "@shared/types/domain/heroes";
import type { OpenDotaHeroRaw } from "@shared/api/hero-api";


export function normalizeTemplateDraftRuleEntries(
    entries: TemplateDraftRuleEntry[]
): Record<string, TemplateDraftRuleEntry> {
    return entries.reduce((acc, entry) => {
        acc[entry.id] = entry;
        return acc;
    }, {} as Record<string, TemplateDraftRuleEntry>);
}

/**
 * Transform localized_name from OpenDota into slug format
 * Rules applied in order:
 * 1. Remove all hyphens and merge surrounding words: "Anti-Mage" → "AntiMage"
 * 2. Replace all spaces with underscores: "Ember Spirit" → "Ember_Spirit"
 * 3. Lowercase entire string: "Ember_Spirit" → "ember_spirit"
 *
 * Examples:
 * - "Anti-Mage" → "antimage"
 * - "Keeper of the Light" → "keeper_of_the_light"
 * - "Wraith King" → "wraith_king"
 * - "Magnus" → "magnus"
 * - "Nature's Prophet" → "nature's_prophet" (apostrophe NOT removed)
 */
function filterLocalizedName(localizedName: string): string {
    // Step 1: Remove all hyphens
    let slug = localizedName.replace(/-/g, "");

    // Step 2: Replace spaces with underscores
    slug = slug.replace(/ /g, "_");

    // Step 3: Lowercase
    slug = slug.toLowerCase();

    // Step 4: Remove apostrophes (merge text)
    slug = slug.replace(/'/g, "");

    return slug;
}

/**
 * Normalize OpenDota heroes raw data into the Hero domain type
 * Returns Record<number, Hero> where key is open_dota_id
 */
export function normalizeHeroes(raw: OpenDotaHeroRaw[]): Record<number, Hero> {
    const now = new Date().toISOString();

    return raw.reduce((acc, heroRaw) => {
        const hero: Hero = {
            open_dota_id: heroRaw.id,
            name: heroRaw.name,
            slug: filterLocalizedName(heroRaw.localized_name),
            local_name: heroRaw.localized_name,
            primary_attr: heroRaw.primary_attr,
            attack_type: heroRaw.attack_type,
            roles: heroRaw.roles,
            icons: {
                portrait_url: heroRaw.img,
                full_url: heroRaw.icon,
            },
            meta_cached_at: now,
        };

        acc[hero.open_dota_id] = hero;
        return acc;
    }, {} as Record<number, Hero>);
}