import type { HeroAttribute } from "./list-heroes";

export const ATTRIBUTE_CONFIG: Record<
  HeroAttribute,
  {
    label: string;
    iconSrc: string;
    colorClass: string;
  }
> = {
  strength: {
    label: "STRENGTH",
    iconSrc: "/images/attributes/strength-icon.png",
    colorClass: "text-[#c0392b]",
  },
  agility: {
    label: "AGILITY",
    iconSrc: "/images/attributes/agility-icon.png",
    colorClass: "text-[#27ae60]",
  },
  intelligence: {
    label: "INTELLIGENCE",
    iconSrc: "/images/attributes/intelligence-icon.png",
    colorClass: "text-[#2980b9]",
  },
  universal: {
    label: "UNIVERSAL",
    iconSrc: "/images/attributes/universal-icon.png",
    colorClass: "text-[#bdc3c7]",
  },
};

export function useListHeroes(attribute: HeroAttribute) {
  const config = ATTRIBUTE_CONFIG[attribute];

  return {
    attributeLabel: config.label,
    attributeIconSrc: config.iconSrc,
    attributeColor: config.colorClass,
  };
}
