export type Side = "radiant" | "dire";
export type ActionType = "pick" | "ban";
export type SoundKey = `${Side}_${ActionType}`;

export const SOUND_FILES: Record<SoundKey, string> = {
    radiant_pick: "/sounds/radiant_pick.mp3",
    radiant_ban: "/sounds/radiant_ban.mp3",
    dire_pick: "/sounds/dire_pick.mp3",
    dire_ban: "/sounds/dire_ban.mp3",
};