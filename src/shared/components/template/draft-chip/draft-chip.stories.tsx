/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { DraftChip } from "./draft-chip";
import {Button} from "@shared/components/ui/button";

const meta: Meta<typeof DraftChip> = {
    title: "Draft/DraftChip",
    component: DraftChip,
    parameters: {
        layout: "fullscreen",
        // show a dark background that's typical for the draft UI
        backgrounds: { default: "dark" },
    },
    tags: ["autodocs"],
    argTypes: {
        sequence_number: { control: "number" },
        team_side: {
            control: "select",
            options: ["radiant", "dire"],
        },
        action_type: {
            control: "select",
            options: ["pick", "ban"],
        },
        user_action: {
            control: "select",
            options: ["pick", "ban", "pick_with_hero", "ban_with_hero", "idle"],
        },
        hero_img: { control: "text" },
    },
    args: {
        sequence_number: 1,
        team_side: "radiant",
        action_type: "pick",
        user_action: "pick",
        hero_img: undefined,
    },
};

export default meta;
type Story = StoryObj<typeof DraftChip>;

/** Simple: Radiant pick */
export const Pick: Story = {
    args: {
        sequence_number: 1,
        team_side: "radiant",
        action_type: "pick",
        user_action: "pick",
    },
};

/** Simple: Dire ban */
export const Ban: Story = {
    args: {
        sequence_number: 2,
        team_side: "dire",
        action_type: "ban",
        user_action: "ban",
    },
};

/** Pick with hero image (radiant) */
export const PickWithHero: Story = {
    args: {
        sequence_number: 3,
        team_side: "radiant",
        action_type: "pick",
        user_action: "pick_with_hero",
        hero_img:
            "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/ember_spirit_full.png",
    },
};

/** Ban with hero image (dire) */
export const BanWithHero: Story = {
    args: {
        sequence_number: 4,
        team_side: "dire",
        action_type: "ban",
        user_action: "ban_with_hero",
        hero_img:
            "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/zeus_full.png",
    },
};

/** Idle state (no hero) */
export const Idle: Story = {
    args: {
        sequence_number: 5,
        team_side: "radiant",
        action_type: "pick",
        user_action: "idle",
    },
};

/** Column of multiple DraftChip items (compositional story) */
export const DraftColumn: Story = {
    render: () => {
        const draft = [
            {
                sequence_number: 5,
                team_side: "radiant",
                action_type: "ban",
                user_action: "ban_with_hero",
                hero_img:
                    "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/kunkka_full.png",
            },
            {
                sequence_number: 8,
                team_side: "radiant",
                action_type: "pick",
                user_action: "pick_with_hero",
                hero_img:
                    "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/gyrocopter_full.png",
            },
            {
                sequence_number: 9,
                team_side: "dire",
                action_type: "pick",
                user_action: "pick_with_hero",
                hero_img:
                    "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/doom_bringer_full.png",
            },
            {
                sequence_number: 10,
                team_side: "dire",
                action_type: "ban",
                user_action: "ban_with_hero",
                hero_img:
                    "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/lion_full.png",
            },
            {
                sequence_number: 11,
                team_side: "radiant",
                action_type: "pick",
                user_action: "pick",
            },
            {
                sequence_number: 12,
                team_side: "dire",
                action_type: "ban",
                user_action: "ban",
            },
        ];

        return (
            <div
                style={{
                    width: 420,
                    padding: "32px 24px",
                    background: "linear-gradient(90deg, #0f172a 0%, #020617 50%, #0f172a 100%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                }}
            >
                {draft.map((row) => (
                    <DraftChip
                        key={row.sequence_number}
                        sequence_number={row.sequence_number}
                        team_side={row.team_side as any}
                        action_type={row.action_type as any}
                        user_action={row.user_action as any}
                        hero_img={row.hero_img}
                    />
                ))}
            </div>
        );
    },
};

/** Interactive story — toggles similar to your page for quick QA */
export const ToggleableCondition: Story = {
    render: (args) => {
        const [isRadiant, setIsRadiant] = useState(true);
        const [isPick, setIsPick] = useState(true);

        return (
            <div style={{ padding: 24, display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ width: 420, padding: 24, background: "#071027", borderRadius: 8 }}>
                    <div style={{ marginBottom: 12, color: "#cbd5e1" }}>
                        <strong>
                            {isRadiant ? "Radiant" : "Dire"} — {isPick ? "Pick" : "Ban"}
                        </strong>
                    </div>

                    <DraftChip
                        {...args}
                        sequence_number={1}
                        team_side={isRadiant ? "radiant" : "dire"}
                        action_type={isPick ? "pick" : "ban"}
                        user_action={isPick ? "pick" : "ban"}
                    />

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <Button onClick={() => setIsRadiant((p) => !p)}>Toggle Side</Button>
                        <Button onClick={() => setIsPick((p) => !p)}>Toggle Action</Button>
                    </div>
                </div>
            </div>
        );
    },
};