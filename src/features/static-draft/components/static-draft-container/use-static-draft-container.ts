"use client";

import { useEffect, useMemo } from "react";
import { useGetAllQuery } from "@shared/api/hero-api";
import { useAppDispatch, useAppSelector } from "@shared/config/redux/hooks";
import {
  chooseSide,
  selectTemplate,
  setEngineState,
  setSelectedHero,
  startStaticDraft,
} from "@feature/static-draft/stores/static-draft-slice";
import {
  selectCurrentPlanId,
  selectCurrentTeamSide,
  selectSelectedRuleId,
  selectEngineInitialized,
} from "@feature/static-draft/selectors/static-draft-selectors";
import type { Hero } from "@shared/types/domain/heroes";
import type { HeroAttribute, HeroWithStatus } from "@shared/components/template/list-heroes";

function mapPrimaryAttrToListAttribute(primaryAttr: Hero["primary_attr"]): HeroAttribute {
  switch (primaryAttr) {
    case "str":
      return "strength";
    case "agi":
      return "agility";
    case "int":
      return "intelligence";
    default:
      return "universal";
  }
}

function getOrCreatePlanIdFromState(
  currentPlanId: string | null,
  staticPlanId: string | undefined,
): string {
  if (currentPlanId) {
    return currentPlanId;
  }

  return staticPlanId ?? "static-local-plan";
}

export function useStaticDraftContainer() {
  const dispatch = useAppDispatch();

  const { isLoading: isLoadingHeroes, isError: isHeroesError } = useGetAllQuery();

  const heroesById = useAppSelector((state) => state.entities.heroes);
  const templateDraftRules = useAppSelector((state) => state.entities.templateDraftRules);
  const templateDraftRuleEntriesById = useAppSelector(
    (state) => state.entities.templateDraftRuleEntries,
  );
  const draftPlans = useAppSelector((state) => state.entities.draftPlans);
  const bansById = useAppSelector((state) => state.entities.bans);
  const picksById = useAppSelector((state) => state.entities.preferredPicks);

  /* Use selectors for safe state access */
  const currentPlanId = useAppSelector(selectCurrentPlanId);
  const selectedRuleId = useAppSelector(selectSelectedRuleId);
  const currentTeamSide = useAppSelector(selectCurrentTeamSide);
  const engineInitialized = useAppSelector(selectEngineInitialized);

  const heroes = useMemo(() => Object.values(heroesById), [heroesById]);

  const staticPlanId = useMemo(
    () => Object.values(draftPlans).find((plan) => plan.mode === "static")?.id,
    [draftPlans],
  );

  const fallbackRuleId = useMemo(
    () => Object.values(templateDraftRules)[0]?.id ?? null,
    [templateDraftRules],
  );

  const effectiveRuleId = selectedRuleId ?? fallbackRuleId;

  const selectedRuleEntries = useMemo(() => {
    const allEntries = Object.values(templateDraftRuleEntriesById);

    if (!effectiveRuleId) {
      return allEntries.sort((a, b) => a.sequence_index - b.sequence_index);
    }

    return allEntries
      .filter((entry) => entry.rule_id === effectiveRuleId)
      .sort((a, b) => a.sequence_index - b.sequence_index);
  }, [templateDraftRuleEntriesById, effectiveRuleId]);

  useEffect(() => {
    if (selectedRuleEntries.length === 0) {
      return;
    }

    const planId = getOrCreatePlanIdFromState(currentPlanId, staticPlanId);

    if (currentPlanId === null) {
      dispatch(startStaticDraft({ planId }));
    }

    if (selectedRuleId === null && effectiveRuleId) {
      dispatch(selectTemplate(effectiveRuleId));
    }

    if (currentTeamSide === null) {
      dispatch(chooseSide("radiant"));
    }

    const firstEntry = selectedRuleEntries[0];

    if (!engineInitialized) {
      dispatch(
        setEngineState({
          sequenceIndex: firstEntry.sequence_index,
          actionType: firstEntry.action_type,
          teamSide: firstEntry.team_side,
          remaining: firstEntry.count,
        }),
      );
    }
  }, [
    dispatch,
    selectedRuleEntries,
    currentPlanId,
    selectedRuleId,
    currentTeamSide,
    engineInitialized,
    effectiveRuleId,
    staticPlanId,
  ]);

  const workingPlanId = getOrCreatePlanIdFromState(currentPlanId, staticPlanId);

  const bannedByHeroId = useMemo(() => {
    const planBans = Object.values(bansById).filter((ban) => ban.plan_id === workingPlanId);

    return new Map(planBans.map((ban) => [ban.hero_id, ban]));
  }, [bansById, workingPlanId]);

  const pickedByHeroId = useMemo(() => {
    const planPicks = Object.values(picksById).filter((pick) => pick.plan_id === workingPlanId);

    return new Map(planPicks.map((pick) => [pick.hero_id, pick]));
  }, [picksById, workingPlanId]);

  const heroesByAttribute = useMemo<Record<HeroAttribute, HeroWithStatus[]>>(() => {
    const grouped: Record<HeroAttribute, HeroWithStatus[]> = {
      strength: [],
      agility: [],
      intelligence: [],
      universal: [],
    };

    const sortedHeroes = [...heroes].sort((a, b) => {
      const nameA = a.local_name ?? a.name ?? "";
      const nameB = b.local_name ?? b.name ?? "";
      return nameA.localeCompare(nameB);
    });

    sortedHeroes.forEach((hero) => {
      const banned = bannedByHeroId.get(hero.open_dota_id);
      const picked = pickedByHeroId.get(hero.open_dota_id);

      grouped[mapPrimaryAttrToListAttribute(hero.primary_attr)].push({
        hero,
        status: banned ? "banned" : picked ? "picked" : "normal",
        slotNumber: banned?.order_index ?? picked?.order_index ?? undefined,
      });
    });

    return grouped;
  }, [heroes, bannedByHeroId, pickedByHeroId]);

  const handleHeroClick = (heroId: number) => {
    dispatch(setSelectedHero(heroId));
  };

  return {
    isLoadingHeroes,
    isHeroesError,
    heroesByAttribute,
    handleHeroClick,
    draftScheduleEntries: selectedRuleEntries,
    activeTimeSide: currentTeamSide,
    selectedRuleId: effectiveRuleId,
  };
}
