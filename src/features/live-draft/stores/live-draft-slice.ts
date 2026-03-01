import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {DraftActionType, LiveDraftState, TeamSide} from "@feature/live-draft/types";

const initialState: LiveDraftState = {
    currentSessionId: null,
    phase: "idle",

    template: {
        selectedRuleId: null,
    },

    coinFlip: {
        result: null,
        winnerSide: null,
    },

    engine: {
        currentSequenceIndex: 0,
        currentActionType: null,
        currentTeamSide: null,
        remainingActionsInGroup: 0,
    },

    timer: {
        draftTimeLeft: 0,
        reservedTimeLeft: 120,
        isUsingReservedTime: false,
        isRunning: false,
    },

    ui: {
        selectedHeroId: null,
        isLocked: false,
        error: null,
    },
};

const liveDraftSlice = createSlice({
    name: "liveDraft",
    initialState,
    reducers: {

        /* ---------- SESSION ---------- */

        startSession(state, action: PayloadAction<{ sessionId: string }>) {
            state.currentSessionId = action.payload.sessionId;
            state.phase = "choose_template";
        },

        resetLiveDraft() {
            return initialState;
        },

        /* ---------- TEMPLATE ---------- */

        selectTemplate(state, action: PayloadAction<string>) {
            state.template.selectedRuleId = action.payload;
            state.phase = "coin_flip";
        },

        /* ---------- COIN FLIP ---------- */

        setCoinFlipResult(state, action: PayloadAction<TeamSide>) {
            state.coinFlip.result = action.payload;
            state.coinFlip.winnerSide = action.payload;
            state.phase = "choose_side";
        },

        chooseSide(state, action: PayloadAction<TeamSide>) {
            // winner chooses which side to control first
            state.engine.currentTeamSide = action.payload;
            state.phase = "in_progress";
        },

        /* ---------- ENGINE CONTROL ---------- */

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

        completeDraft(state) {
            state.phase = "completed";
            state.timer.isRunning = false;
        },

        /* ---------- TIMER ---------- */

        startTimer(state, action: PayloadAction<{ draftTime: number }>) {
            state.timer.draftTimeLeft = action.payload.draftTime;
            state.timer.isRunning = true;
            state.timer.isUsingReservedTime = false;
        },

        tickDraftTimer(state) {
            if (state.timer.draftTimeLeft > 0) {
                state.timer.draftTimeLeft -= 1;
            }
        },

        useReservedTime(state) {
            state.timer.isUsingReservedTime = true;
        },

        tickReservedTimer(state) {
            if (state.timer.reservedTimeLeft > 0) {
                state.timer.reservedTimeLeft -= 1;
            }
        },

        stopTimer(state) {
            state.timer.isRunning = false;
        },

        /* ---------- UI ---------- */

        setSelectedHero(state, action: PayloadAction<number | null>) {
            state.ui.selectedHeroId = action.payload;
        },

        setUILocked(state, action: PayloadAction<boolean>) {
            state.ui.isLocked = action.payload;
        },

        setLiveDraftError(state, action: PayloadAction<string | null>) {
            state.ui.error = action.payload;
        },
    },
});

export const {
    startSession,
    resetLiveDraft,
    selectTemplate,
    setCoinFlipResult,
    chooseSide,
    setEngineState,
    decrementRemainingActions,
    completeDraft,
    startTimer,
    tickDraftTimer,
    useReservedTime,
    tickReservedTimer,
    stopTimer,
    setSelectedHero,
    setUILocked,
    setLiveDraftError,
} = liveDraftSlice.actions;

export default liveDraftSlice.reducer;