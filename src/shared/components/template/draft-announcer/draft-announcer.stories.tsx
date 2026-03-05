import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { DraftAnnouncer } from "./draft-announcer";
import {Button} from "@shared/components/ui/button";

const meta: Meta<typeof DraftAnnouncer> = {
    title: "Draft/DraftAnnouncer",
    component: DraftAnnouncer,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        active_time_side: {
            control: "select",
            options: ["radiant", "dire"],
        },
        active_action_type: {
            control: "select",
            options: ["pick", "ban"],
        },
        autoplayOnChange: {
            control: "boolean",
        },
        enabled: {
            control: "boolean",
        },
        volume: {
            control: { type: "range", min: 0, max: 1, step: 0.1 },
        },
        cooldownMs: {
            control: { type: "number" },
        },
    },
    args: {
        active_time_side: "radiant",
        active_action_type: "pick",
        autoplayOnChange: true,
        enabled: true,
        volume: 0.9,
        cooldownMs: 1500,
    },
};

export default meta;
type Story = StoryObj<typeof DraftAnnouncer>;

export const RadiantPick: Story = {
    args: {
        active_time_side: "radiant",
        active_action_type: "pick",
    },
};

export const RadiantBan: Story = {
    args: {
        active_time_side: "radiant",
        active_action_type: "ban",
    },
};

export const DirePick: Story = {
    args: {
        active_time_side: "dire",
        active_action_type: "pick",
    },
};

export const DireBan: Story = {
    args: {
        active_time_side: "dire",
        active_action_type: "ban",
    },
};

export const ToggleableCondition: Story = {
    render: (args) => {
        const [isRadiant, setIsRadiant] = useState(true);
        const [isPick, setIsPick] = useState(true);

        return (
            <div className="flex flex-col gap-6 items-center p-6">
                <div className="text-lg font-semibold">
                    {isRadiant ? "radiant" : "dire"} - {isPick ? "pick" : "ban"}
                </div>

                <div className="flex gap-4">
                    <Button onClick={() => setIsRadiant((p) => !p)}>
                        Toggle Side
                    </Button>
                    <Button onClick={() => setIsPick((p) => !p)}>
                        Toggle Action
                    </Button>
                </div>

                <DraftAnnouncer
                    {...args}
                    active_time_side={isRadiant ? "radiant" : "dire"}
                    active_action_type={isPick ? "pick" : "ban"}
                />
            </div>
        );
    },
};