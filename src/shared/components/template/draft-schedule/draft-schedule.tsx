// draft-schedule.tsx
"use client"

import React from "react"
import styles from "./draft-schedule.module.css"
import { useDraftScheduleMapper } from "./use-draft-schedule"
import { DraftChip } from "../draft-chip"
import type {TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules"; // adjust path if needed
import { motion } from "framer-motion";
import {SplitDraftBackground} from "@shared/components/template/draft-schedule/split-draft-background";

export type DraftScheduleProps = {
    // now accepts COMPLETE (unnormalized) array data
    template_draft_rule_entries: TemplateDraftRuleEntry[] | null | undefined
    active_time_side?: "radiant" | "dire" | null
    ruleId?: string | null
    className?: string
}

// TODO: Make a Hero componnent list
/**
 * Presentational DraftSchedule:
 * - accepts array of TemplateDraftRuleEntry (complete data)
 * - sorts & maps via useDraftScheduleMapper
 * - renders overlay + DraftChip rows
 */
export function DraftSchedule({
    template_draft_rule_entries,
    active_time_side = null,
    ruleId = null,
    className = "",
}: DraftScheduleProps) {
    const { chipProps, overlay } = useDraftScheduleMapper({
        template_draft_rule_entries,
        ruleId,
        active_time_side,
    })

    const variant = {
        active: { scale: 1.09, y: -6, opacity: 1, transition: { duration: 0.34 } },
        idle: { scale: 1, y: 0, opacity: 0.75, transition: { duration: 0.34 } },
    };

    return (
        <SplitDraftBackground active_time_side={active_time_side}>
            <div
                className={`${styles.wrapper} ${className}`}
                style={{
                    // background: overlay.visible ? overlay.color : "transparent",
                }}
            >
                <div className={styles.titles}>
                    <motion.div
                        initial="idle"
                        animate={active_time_side === "radiant" ? "active" : "idle"}
                        variants={variant}
                        className="flex justify-start"
                    >
                    <span
                        className={`uppercase font-extrabold text-2xl tracking-widest transition-colors ${
                            active_time_side === "radiant"
                                ? "text-[rgba(16,185,129,1)] drop-shadow-[0_6px_12px_rgba(16,185,129,0.22)]"
                                : "text-slate-300"
                        }`}
                    >
                      Radiant
                    </span>
                    </motion.div>

                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/5 to-black/25 opacity-70" />

                    <motion.div
                        initial="idle"
                        animate={active_time_side === "dire" ? "active" : "idle"}
                        variants={variant}
                        className="flex justify-end"
                    >
                    <span
                        className={`uppercase font-extrabold text-2xl tracking-widest transition-colors ${
                            active_time_side === "dire"
                                ? "text-[rgba(239,68,68,1)] drop-shadow-[0_6px_12px_rgba(239,68,68,0.22)]"
                                : "text-slate-300"
                        }`}
                    >
                      Dire
                    </span>
                    </motion.div>
                </div>

                <div className={styles.schedule} aria-live="polite">
                    <div
                        className={styles.overlayLeft}
                        style={{
                            // background: overlay.visible && overlay.side === "left" ? overlay.color : "transparent",
                            visibility: overlay.visible && overlay.side === "left" ? "visible" : "hidden",
                        }}
                        aria-hidden
                    />
                    <div
                        className={styles.overlayRight}
                        style={{
                            // background: overlay.visible && overlay.side === "right" ? overlay.color : "transparent",
                            visibility: overlay.visible && overlay.side === "right" ? "visible" : "hidden",
                        }}
                        aria-hidden
                    />
                    <div className={styles.centerShade} aria-hidden />

                    {chipProps.map((c) => (
                        <DraftChip
                            key={c.key}
                            sequence_number={c.sequence_number}
                            team_side={c.team_side}
                            action_type={c.action_type}
                            user_action={c.user_action}
                            hero_img={c.hero_img ?? null}
                        />
                    ))}
                </div>
            </div>
        </SplitDraftBackground>
    )
}