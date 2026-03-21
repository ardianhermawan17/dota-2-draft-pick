import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@shared/config/redux/store";

/* ========== HEROES ========== */

export const selectAllHeroes = (state: RootState) => 
  Object.values(state.entities.heroes ?? {});

export const selectHeroById = (heroId: number) => (state: RootState) =>
  state.entities.heroes?.[heroId] ?? null;

/* ========== TEMPLATE DRAFT RULES ========== */

export const selectAllTemplateDraftRules = (state: RootState) =>
  Object.values(state.entities.templateDraftRules ?? {});

export const selectTemplateDraftRuleById = (ruleId: string | null) => (state: RootState) => {
  if (!ruleId) return null;
  return state.entities.templateDraftRules?.[ruleId] ?? null;
};

/* ========== TEMPLATE DRAFT RULE ENTRIES ========== */

export const selectAllTemplateDraftRuleEntries = (state: RootState) =>
  Object.values(state.entities.templateDraftRuleEntries ?? {});

export const selectTemplateDraftRuleEntriesByRuleId = (ruleId: string | null) =>
  createSelector([selectAllTemplateDraftRuleEntries], (entries) => {
    if (!ruleId) return [];
    return entries.filter((entry) => entry.rule_id === ruleId);
  });

export const selectTemplateDraftRuleEntryById = (entryId: string | null) => (state: RootState) => {
  if (!entryId) return null;
  return state.entities.templateDraftRuleEntries?.[entryId] ?? null;
};

/* ========== GAME MODES ========== */

export const selectAllGameModes = (state: RootState) =>
  Object.values(state.entities.gameModes ?? {});

export const selectGameModeById = (modeId: string | number | null) => (state: RootState) => {
  if (!modeId) return null;
  return state.entities.gameModes?.[modeId] ?? null;
};

/* ========== DRAFT PLANS ========== */

export const selectAllDraftPlans = (state: RootState) =>
  Object.values(state.entities.draftPlans ?? {});

export const selectDraftPlanById = (planId: string | null) => (state: RootState) => {
  if (!planId) return null;
  return state.entities.draftPlans?.[planId] ?? null;
};

export const selectStaticDraftPlan = (state: RootState) => {
  const plans = Object.values(state.entities.draftPlans ?? {});
  return plans.find((plan) => plan.mode === "static") ?? null;
};

/* ========== BANS ========== */

export const selectAllBans = (state: RootState) =>
  Object.values(state.entities.bans ?? {});

export const selectBansByPlanId = (planId: string | null) =>
  createSelector([selectAllBans], (bans) => {
    if (!planId) return [];
    return bans.filter((ban) => ban.plan_id === planId);
  });

/* ========== PREFERRED PICKS ========== */

export const selectAllPreferredPicks = (state: RootState) =>
  Object.values(state.entities.preferredPicks ?? {});

export const selectPreferredPicksByPlanId = (planId: string | null) =>
  createSelector([selectAllPreferredPicks], (picks) => {
    if (!planId) return [];
    return picks.filter((pick) => pick.plan_id === planId);
  });
