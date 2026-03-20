"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Hero } from "@shared/types/domain/heroes";

type UseHeroItemParams = {
  hero: Hero;
  onClick?: (heroId: number) => void;
};

const FALLBACK_IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='80' viewBox='0 0 72 80'%3E%3Crect width='72' height='80' fill='%23111217'/%3E%3Crect x='2' y='2' width='68' height='76' fill='none' stroke='%23404a5a' stroke-width='1.5'/%3E%3Cpath d='M12 58L28 42L40 52L49 45L60 58' fill='none' stroke='%23717d90' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='25' cy='24' r='5' fill='%23717d90'/%3E%3C/svg%3E";

const slugifyHeroName = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const getHeroSlug = (hero: Hero): string => hero.slug ?? slugifyHeroName(hero.name);

const getHeroImagePath = (hero: Hero): string => `/images/heroes/${getHeroSlug(hero)}_full.png`;

export function useHeroItem({ hero, onClick }: UseHeroItemParams) {
  const [useFallbackImage, setUseFallbackImage] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUseFallbackImage(false);
  }, [hero.open_dota_id, hero.slug, hero.name]);

  const imageSrc = useMemo(
    () => (useFallbackImage ? FALLBACK_IMAGE_SRC : getHeroImagePath(hero)),
    [hero, useFallbackImage],
  );

  const handleError = useCallback(() => {
    setUseFallbackImage(true);
  }, []);

  const handleClick = useCallback(() => {
    onClick?.(hero.open_dota_id);
  }, [hero.open_dota_id, onClick]);

  return { imageSrc, handleError, handleClick };
}
