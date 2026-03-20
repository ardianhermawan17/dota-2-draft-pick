import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createRealHero } from "@shared/components/template/__mocks__/heroes.mock";
import { HeroItem } from "./hero-item";

const baseHero = createRealHero('Anti-Mage');

const meta: Meta<typeof HeroItem> = {
  title: "Template/HeroItem",
  component: HeroItem,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hero: baseHero,
    status: "normal",
    slotNumber: 1,
  },
};

export const Banned: Story = {
  args: {
    hero: createRealHero("Axe"),
    status: "banned",
  },
};

export const Picked: Story = {
  args: {
    hero: createRealHero("Morphling"),
    status: "picked",
  },
};

export const NoSlotNumber: Story = {
  args: {
    hero: createRealHero("Bane"),
    status: "normal",
  },
};

export const WithError: Story = {
  args: {
    hero: {
      ...createRealHero("Bloodseeker"),
      slug: "hero_image_that_does_not_exist",
    },
    status: "normal",
    slotNumber: 2,
  },
};
