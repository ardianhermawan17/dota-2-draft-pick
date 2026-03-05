/* eslint-disable @typescript-eslint/no-explicit-any */
/** DraftChip props shape expected by DraftChip component */
export type DraftChipInput = {
    key: string
    sequence_number: number
    team_side: "radiant" | "dire"
    action_type: "ban" | "pick"
    user_action: "pick" | "ban" | "pick_with_hero" | "ban_with_hero" | "idle"
    hero_img?: string | null
    meta?: Record<string, any>
}