import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {EntitiesState} from "@feature/entities/types";
import type {User} from "@shared/types/domain/auth";
import type {Hero} from "@shared/types/domain/heroes";
import type {Ban, DraftPlan, PreferredPick} from "@shared/types/domain/draft-plans";
import type {DraftSession, SessionAction} from "@shared/types/domain/sessions";

const initialState: EntitiesState = {
    users: {},
    heroes: {},
    draftPlans: {},
    bans: {},
    preferredPicks: {},
    enemyThreats: {},
    itemTimingNotes: {},
    draftSessions: {},
    sessionActions: {},
    templateRules: {},
    templateRuleEntries: {},
    teams: {},
    players: {},
};

const entitiesSlice = createSlice({
    name: "entities",
    initialState,
    reducers: {

        /* ---------- USERS ---------- */

        upsertUser(state, action: PayloadAction<User>) {
            state.users[action.payload.id] = action.payload;
        },

        /* ---------- HEROES ---------- */

        upsertHeroes(state, action: PayloadAction<Hero[]>) {
            action.payload.forEach(hero => {
                state.heroes[hero.open_dota_id] = hero;
            });
        },

        /* ---------- DRAFT PLANS ---------- */

        upsertDraftPlan(state, action: PayloadAction<DraftPlan>) {
            state.draftPlans[action.payload.id] = action.payload;
        },

        removeDraftPlan(state, action: PayloadAction<string>) {
            delete state.draftPlans[action.payload];
        },

        /* ---------- BANS ---------- */

        upsertBan(state, action: PayloadAction<Ban>) {
            state.bans[action.payload.id] = action.payload;
        },

        removeBan(state, action: PayloadAction<string>) {
            delete state.bans[action.payload];
        },

        /* ---------- PREFERRED PICKS ---------- */

        upsertPreferredPick(state, action: PayloadAction<PreferredPick>) {
            state.preferredPicks[action.payload.id] = action.payload;
        },

        removePreferredPick(state, action: PayloadAction<string>) {
            delete state.preferredPicks[action.payload];
        },

        /* ---------- SESSION ---------- */

        upsertDraftSession(state, action: PayloadAction<DraftSession>) {
            state.draftSessions[action.payload.id] = action.payload;
        },

        upsertSessionAction(state, action: PayloadAction<SessionAction>) {
            state.sessionActions[action.payload.id] = action.payload;
        },

        resetEntities() {
            return initialState;
        },
    },
});

export const {
    upsertUser,
    upsertHeroes,
    upsertDraftPlan,
    removeDraftPlan,
    upsertBan,
    removeBan,
    upsertPreferredPick,
    removePreferredPick,
    upsertDraftSession,
    upsertSessionAction,
    resetEntities,
} = entitiesSlice.actions;

export default entitiesSlice.reducer;