import type { RootState } from "@shared/config/redux/store";

export const selectStaticRuleId = (state: RootState) =>
    state.staticDraft?.template?.selectedRuleId ?? null;

export const selectLiveRuleId = (state: RootState) =>
    state.liveDraft?.template?.selectedRuleId ?? null;