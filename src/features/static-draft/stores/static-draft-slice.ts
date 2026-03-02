import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {TeamSide, StaticDraftState, DraftActionType} from "@feature/static-draft/types";

const initialState: StaticDraftState = {
    currentPlanId: null,
    phase: "idle",
    template: {
        selectedRuleId: null,
    },
    engine: {
        currentSequenceIndex: 0,
        currentActionType: null,
        currentTeamSide: null,
        remainingActionsInGroup: 0,
    },
    ui: {
        selectedHeroId: null,
        isLocked: false,
        error: null,
    },
};

const staticDraftSlice = createSlice({
    name: "staticDraft",
    initialState,
    reducers: {

        /* ---------- SESSION ---------- */

        startStaticDraft(state, action: PayloadAction<{ planId: string }>) {
            state.currentPlanId = action.payload.planId;
            state.phase = "choose_template";
        },

        resetStaticDraft() {
            return initialState;
        },

        /* ---------- TEMPLATE ---------- */

        selectTemplate(state, action: PayloadAction<string>) {
            state.template.selectedRuleId = action.payload;
            state.phase = "choose_side";
        },

        /* ---------- SIDE ---------- */

        chooseSide(state, action: PayloadAction<TeamSide>) {
            state.engine.currentTeamSide = action.payload;
            state.phase = "in_progress";
        },

        /* ---------- ENGINE ---------- */

        setEngineState(
            state,
            action: PayloadAction<{
                sequenceIndex: number;
                actionType: DraftActionType;
                teamSide: TeamSide;
                remaining: number;
            }>
        ) {
            state.engine.currentSequenceIndex = action.payload.sequenceIndex;
            state.engine.currentActionType = action.payload.actionType;
            state.engine.currentTeamSide = action.payload.teamSide;
            state.engine.remainingActionsInGroup = action.payload.remaining;
        },

        decrementRemainingActions(state) {
            if (state.engine.remainingActionsInGroup > 0) {
                state.engine.remainingActionsInGroup -= 1;
            }
        },

        completeStaticDraft(state) {
            state.phase = "completed";
        },

        /* ---------- UI ---------- */

        setSelectedHero(state, action: PayloadAction<number | null>) {
            state.ui.selectedHeroId = action.payload;
        },

        setUILocked(state, action: PayloadAction<boolean>) {
            state.ui.isLocked = action.payload;
        },

        setStaticDraftError(state, action: PayloadAction<string | null>) {
            state.ui.error = action.payload;
        },
    },
});

export const {
    startStaticDraft,
    resetStaticDraft,
    selectTemplate,
    chooseSide,
    setEngineState,
    decrementRemainingActions,
    completeStaticDraft,
    setSelectedHero,
    setUILocked,
    setStaticDraftError,
} = staticDraftSlice.actions;

export default staticDraftSlice.reducer;