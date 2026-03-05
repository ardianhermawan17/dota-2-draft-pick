// use-draft-schedule.ts
import { useMemo } from "react"
import type { DraftChipInput } from "./types"
import type {TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules";

export type ActiveSide = "radiant" | "dire" | null

export function useDraftScheduleMapper(params: {
    template_draft_rule_entries: TemplateDraftRuleEntry[] | null | undefined
    ruleId?: string | null
    active_time_side?: ActiveSide
}) {
    const { template_draft_rule_entries, ruleId = null, active_time_side = null } = params

    // 1) get array (may be null) and sort by sequence_index; stable fallback
    const entriesArray = useMemo<TemplateDraftRuleEntry[]>(() => {
        if (!template_draft_rule_entries || template_draft_rule_entries.length === 0) return []
        const arr = template_draft_rule_entries.slice()
        arr.sort((a, b) => {
            if (a.sequence_index !== b.sequence_index) return a.sequence_index - b.sequence_index
            // fallback: use created_at if present
            if (a.created_at && b.created_at) return a.created_at.localeCompare(b.created_at)
            return a.id.localeCompare(b.id)
        })
        return arr
    }, [template_draft_rule_entries])

    // 2) optional filter by ruleId
    const filteredEntries = useMemo(() => {
        if (!ruleId) return entriesArray
        return entriesArray.filter((e) => e.rule_id === ruleId)
    }, [entriesArray, ruleId])

    // 3) expand entries by `count` into chipProps and assign increasing sequence_number
    const chipProps = useMemo<DraftChipInput[]>(() => {
        const out: DraftChipInput[] = []
        let seq = 1

        for (const entry of filteredEntries) {
            const count = Math.max(1, Number(entry.count ?? 1)) // ensure >=1 and numeric
            for (let i = 0; i < count; i += 1) {
                const key = `${entry.id}::${i}`

                const user_action: DraftChipInput["user_action"] =
                    entry.action_type === "pick" ? "pick" : "ban"

                out.push({
                    key,
                    sequence_number: seq,
                    team_side: entry.team_side,
                    action_type: entry.action_type,
                    user_action,
                    hero_img: null, // templates don't carry hero images
                    meta: {
                        // include original entry for reference + index within group
                        original_entry_id: entry.id,
                        original_sequence_index: entry.sequence_index,
                        index_within_group: i,
                        per_action_seconds: entry.per_action_seconds,
                        note: entry.note,
                        count: entry.count,
                        rule_id: entry.rule_id,
                        created_at: entry.created_at,
                    },
                })

                seq += 1
            }
        }

        return out
    }, [filteredEntries])

    // 4) overlay info derived from active_time_side
    const overlay = useMemo(() => {
        if (active_time_side === "radiant") {
            return { visible: true, side: "left" as const, color: "linear-gradient(\n" +
                    "    270deg,\n" +
                    "    #000000 0%,\n" +
                    "    rgba(16,185,129,0.25) 45%,\n" +
                    "    rgba(16,185,129,0.35) 100%\n" +
                    "  ),\n" +
                    "  radial-gradient(\n" +
                    "    circle at left center,\n" +
                    "    rgba(16,185,129,0.25),\n" +
                    "    transparent 60%\n" +
                    "  )" }
        }
        if (active_time_side === "dire") {
            return { visible: true, side: "right" as const, color: "linear-gradient(\n" +
                    "  to right,\n" +
                    "  rgba(0,0,0,0.50) 0%,\n" +
                    "  rgba(0,0,0,0.40) 20%,\n" +
                    "  rgba(0,0,0,0.35) 40%,\n" +
                    "  rgba(0,0,0,0.30) 55%,\n" +
                    "  rgba(239,68,68,0.60) 70%,\n" +
                    "  rgba(239,68,68,0.70) 80%,\n" +
                    "  rgba(239,68,68,0.75) 90%,\n" +
                    "  rgba(239,68,68,0.80) 100%\n" +
                    ")" }
        }
        return { visible: false, side: null as null | "left" | "right", color: "transparent" }
    }, [active_time_side])

    return { entries: filteredEntries, chipProps, overlay }
}