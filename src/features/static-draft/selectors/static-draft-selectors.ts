import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@shared/config/redux/store";

/* ===== RAW STATE SELECTORS (null-safe) ===== */

export const selectStaticDraftState = (state: RootState) => state.staticDraft ?? {};

export const selectCurrentPlanId = (state: RootState) =>
  state.staticDraft?.currentPlanId ?? null;

export const selectStaticPhase = (state: RootState) =>
  state.staticDraft?.phase ?? "idle";

export const selectSelectedRuleId = (state: RootState) =>
  state.staticDraft?.template?.selectedRuleId ?? null;

export const selectCurrentSequenceIndex = (state: RootState) =>
  state.staticDraft?.engine?.currentSequenceIndex ?? 0;

export const selectCurrentActionType = (state: RootState) =>
  state.staticDraft?.engine?.currentActionType ?? null;

export const selectCurrentTeamSide = (state: RootState) =>
  state.staticDraft?.engine?.currentTeamSide ?? null;

export const selectRemainingActionsInGroup = (state: RootState) =>
  state.staticDraft?.engine?.remainingActionsInGroup ?? 0;

export const selectSelectedHeroId = (state: RootState) =>
  state.staticDraft?.ui?.selectedHeroId ?? null;

export const selectIsLocked = (state: RootState) =>
  state.staticDraft?.ui?.isLocked ?? false;

export const selectStaticDraftError = (state: RootState) =>
  state.staticDraft?.ui?.error ?? null;

/* ===== DERIVED SELECTORS ===== */

export const selectStaticDraftInitialized = createSelector(
  [selectCurrentPlanId, selectSelectedRuleId],
  (planId, ruleId) => planId !== null && ruleId !== null
);

export const selectEngineInitialized = createSelector(
  [selectCurrentSequenceIndex],
  (seqIndex) => seqIndex > 0
);