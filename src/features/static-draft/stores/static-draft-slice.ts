import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {TeamSide, StaticActionType, StaticDraftState} from "@feature/static-draft/types";

const initialState: StaticDraftState = {
    currentPlanId: null,

    selection: {
        teamSide: "radiant",
        actionType: "ban",
    },

    heroBrowser: {
        isOpen: false,
    },

    editing: {
        editingBanId: null,
        editingPreferredPickId: null,
    },

    ui: {
        isSaving: false,
        error: null,
    },
};

const staticDraftSlice = createSlice({
    name: "staticDraft",
    initialState,
    reducers: {

        /* ---------- PLAN CONTROL ---------- */

        setCurrentPlanId(state, action: PayloadAction<string | null>) {
            state.currentPlanId = action.payload;
        },

        /* ---------- SELECTION CONTROL ---------- */

        setTeamSide(state, action: PayloadAction<TeamSide>) {
            state.selection.teamSide = action.payload;
        },

        setActionType(state, action: PayloadAction<StaticActionType>) {
            state.selection.actionType = action.payload;
        },

        /* ---------- HERO BROWSER ---------- */

        openHeroBrowser(state) {
            state.heroBrowser.isOpen = true;
        },

        closeHeroBrowser(state) {
            state.heroBrowser.isOpen = false;
        },

        /* ---------- EDITING ---------- */

        setEditingBanId(state, action: PayloadAction<string | null>) {
            state.editing.editingBanId = action.payload;
        },

        setEditingPreferredPickId(state, action: PayloadAction<string | null>) {
            state.editing.editingPreferredPickId = action.payload;
        },

        /* ---------- UI ---------- */

        setSaving(state, action: PayloadAction<boolean>) {
            state.ui.isSaving = action.payload;
        },

        setError(state, action: PayloadAction<string | null>) {
            state.ui.error = action.payload;
        },

        resetStaticDraft() {
            return initialState;
        },
    },
});

export const {
    setCurrentPlanId,
    setTeamSide,
    setActionType,
    openHeroBrowser,
    closeHeroBrowser,
    setEditingBanId,
    setEditingPreferredPickId,
    setSaving,
    setError,
    resetStaticDraft,
} = staticDraftSlice.actions;

export default staticDraftSlice.reducer;