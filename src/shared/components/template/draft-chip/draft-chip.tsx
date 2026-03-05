"use client"

import React from "react"
import { X } from "lucide-react"            // example Lucide icon
import styles from "./draft-chip.module.css"
import type { UseDraftChipProps } from "./use-draft-chip";
import { useDraftChip } from "./use-draft-chip"

const cn = (...parts: Array<string | false | null | undefined>) =>
    parts.filter(Boolean).join(" ")

export function DraftChip(props: UseDraftChipProps) {
    const {
        sequence_number,
        hero_img,
        showHero,
        showBanLabel,
        showBanOverlay,
        desaturateHeroWhenBanned,
        isLeft,
        cardSizeClass,
        scale
    } = useDraftChip(props)

    // Card markup: outer .card allows badge to overflow, inner .cardInner clips image
    const Card = (
        <div className={styles.card} aria-hidden="false">
            <div
                className={cn(styles.cardInner, cardSizeClass)}
                style={{
                    transform: `scale(${scale})`,
                }}
            >
                {showHero && hero_img ? (
                    <img
                        src={hero_img}
                        alt="hero"
                        className={cn(styles.heroImg, desaturateHeroWhenBanned && styles.desaturate)}
                        draggable={false}
                    />
                ) : (
                    <div className={styles.cardLabelContainer}>
            <span className={styles.cardLabel}>
              {showBanLabel ? "BAN" : props.action_type.toUpperCase()}
            </span>
                    </div>
                )}
            </div>

            {showBanOverlay && (
                <div className={styles.banOverlay} aria-hidden>
                    {/* use Lucide X for crisp svg */}
                    <X size={14} strokeWidth={2} />
                </div>
            )}
        </div>
    )

    const placeholder = <div className={styles.invisibleCard} />

    return (
        <div className={styles.wrapper}>
            {/* LEFT */}
            <div className={`${styles.col} ${styles.left}`}>
                {/* render left card or placeholder */}
                {isLeft ? Card : placeholder}
                {/* connector: always present but hidden when not active to preserve spacing */}
                <div
                    className={styles.connector}
                    style={{ visibility: isLeft ? "visible" : "hidden", marginLeft: 12 }}
                    aria-hidden
                />
            </div>

            {/* CENTER */}
            <div className={styles.center}>
                <div className={styles.sequence}>{sequence_number}</div>
            </div>

            {/* RIGHT */}
            <div className={`${styles.col} ${styles.right}`}>
                {/* connector first then card for right side */}
                <div
                    className={styles.connector}
                    style={{ visibility: !isLeft ? "visible" : "hidden", marginRight: 12 }}
                    aria-hidden
                />
                {!isLeft ? Card : placeholder}
            </div>
        </div>
    )
}