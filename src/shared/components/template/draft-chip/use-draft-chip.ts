// use-draft-chip.ts
import { useMemo } from "react"

export type UserAction =
    | "pick"
    | "ban"
    | "pick_with_hero"
    | "ban_with_hero"
    | "idle"

export type TeamSide = "radiant" | "dire"
export type ActionType = "pick" | "ban"

export type UseDraftChipProps = {
    sequence_number: number
    team_side: TeamSide
    action_type: ActionType
    user_action: UserAction
    hero_img?: string | null
}

/**
 * The small state-machine map. Keys = user_action.
 * Each value dictates how the UI should render.
 */
export const DraftChipStateMap: Record<
    UserAction,
    {
        showHero: boolean
        showBanLabel: boolean
        showBanOverlay: boolean
        desaturateHeroWhenBanned: boolean
    }
> = {
    pick: {
        showHero: false,
        showBanLabel: false,
        showBanOverlay: false,
        desaturateHeroWhenBanned: false,
    },
    ban: {
        showHero: false,
        showBanLabel: true,
        showBanOverlay: false,
        desaturateHeroWhenBanned: false,
    },
    pick_with_hero: {
        showHero: true,
        showBanLabel: false,
        showBanOverlay: false,
        desaturateHeroWhenBanned: false,
    },
    ban_with_hero: {
        showHero: true,
        showBanLabel: false,
        showBanOverlay: true,
        desaturateHeroWhenBanned: true,
    },
    idle: {
        showHero: false,
        showBanLabel: false,
        showBanOverlay: false,
        desaturateHeroWhenBanned: false,
    },
}

export function useDraftChip(props: UseDraftChipProps) {
    const { sequence_number, team_side, action_type, user_action, hero_img } =
        props

    return useMemo(() => {
        const state = DraftChipStateMap[user_action] ?? DraftChipStateMap.idle
        const isLeft = team_side === "radiant"
        const isPick = action_type === "pick"

        // size scale for pick
        const scale = isPick ? 1.2 : 1

        return {
            sequence_number,
            team_side,
            action_type,
            user_action,
            hero_img,
            // computed flags from state map
            showHero: state.showHero,
            showBanLabel: state.showBanLabel,
            showBanOverlay: state.showBanOverlay,
            desaturateHeroWhenBanned: state.desaturateHeroWhenBanned,
            // layout helpers
            isLeft,
            isPick,
            scale,
            // card class helpers (string, consumer can append)
            cardSizeClass: isPick ? "pick" : "regular",
        }
    }, [sequence_number, team_side, action_type, user_action, hero_img])
}