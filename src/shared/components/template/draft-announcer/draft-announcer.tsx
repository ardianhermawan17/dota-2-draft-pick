// draft-announcer/draft-announcer.tsx
import React, { useEffect } from "react";
import { useDraftAnnouncer } from "./use-draft-announcer";
import type { Side, ActionType } from "./types";

export type DraftAnnouncerProps = {
    active_time_side?: Side | null;
    active_action_type?: ActionType | null;
    autoplayOnChange?: boolean;
    cooldownMs?: number;
    volume?: number;
    enabled?: boolean;
};

export function DraftAnnouncer({
    active_time_side = null,
    active_action_type = null,
    autoplayOnChange = true,
    cooldownMs = 1500,
    volume = 1,
    enabled = true,
}: DraftAnnouncerProps) {
    const { playAnnouncement } = useDraftAnnouncer({ cooldownMs, volume });

    useEffect(() => {
        if (!autoplayOnChange) return;
        if (!enabled) return;
        if (!active_time_side || !active_action_type) return;

        // call play every time the tuple changes — rely on hook cooldown to prevent spam
        playAnnouncement(active_time_side, active_action_type);
    }, [active_time_side, active_action_type, autoplayOnChange, enabled, cooldownMs, volume, playAnnouncement]);

    return (
        <div aria-hidden={!enabled} style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <span className="sr-only" aria-live="polite">
        {active_time_side && active_action_type ? `${active_time_side} ${active_action_type}` : ""}
      </span>
        </div>
    );
}