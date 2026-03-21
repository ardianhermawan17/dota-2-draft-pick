import type { RootState } from "@shared/config/redux/store";


export const selectLiveRuleId = (state: RootState) =>
    state.liveDraft?.template?.selectedRuleId ?? null;