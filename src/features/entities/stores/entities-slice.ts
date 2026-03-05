import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {EntitiesState} from "@feature/entities/types";
import type {User} from "@shared/types/domain/auth";
import type {Hero} from "@shared/types/domain/heroes";
import type {Ban, DraftPlan, PreferredPick} from "@shared/types/domain/draft-plans";
import type {DraftSession, SessionAction} from "@shared/types/domain/sessions";
import type {TemplateDraftRule, TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules";
import type {GameMode} from "@shared/types/domain/game-modes";
import {normalizeTemplateDraftRuleEntries} from "@feature/entities/utils";

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
    gameModes: {},
    templateDraftRules: {},
    templateDraftRuleEntries: {},
    teams: {},
    players: {},
};

const entitiesSlice = createSlice({
    name: "entities",
    initialState,
    reducers: {

        /* ---------- USERS ---------- */

        upsertUser(state, action: PayloadAction<Omit<User, "password" | "updated_at">>) {
            state.users[action.payload.id] = action.payload;
        },

        /* ---------- HEROES ---------- */

        upsertHeroes(state, action: PayloadAction<Hero[]>) {
            action.payload.forEach(hero => {
                state.heroes[hero.open_dota_id] = hero;
            });
        },

        /* ---------- GAME MODES ---------- */

        upsertGameModes(state, action: PayloadAction<GameMode>) {
            state.gameModes[action.payload.id] = action.payload;
        },

        removeGameModes(state, action: PayloadAction<string>) {
            delete state.gameModes[action.payload];
        },
        
        /* ---------- TEMPLATE RULES ---------- */

        upsertTemplateDraftRules(state, action: PayloadAction<TemplateDraftRule>) {
            state.templateDraftRules[action.payload.id] = action.payload;
        },

        removeTemplateDraftRules(state, action: PayloadAction<string>) {
            delete state.templateDraftRules[action.payload];
        },

        /* ---------- TEMPLATE RULES ENTRIES ---------- */

        upsertTemplateDraftRuleEntries(state, action: PayloadAction<TemplateDraftRuleEntry>) {
            state.templateDraftRuleEntries[action.payload.id] = action.payload;
        },

        upsertManyTemplateDraftRuleEntries(
            state,
            action: PayloadAction<TemplateDraftRuleEntry[]>
        ) {
            const normalized = normalizeTemplateDraftRuleEntries(action.payload);

            Object.assign(state.templateDraftRuleEntries, normalized);
        },

        removeTemplateDraftRuleEntries(state, action: PayloadAction<string>) {
            delete state.templateDraftRuleEntries[action.payload];
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
    upsertGameModes,
    removeGameModes,
    upsertTemplateDraftRules,
    removeTemplateDraftRules,
    upsertTemplateDraftRuleEntries,
    upsertManyTemplateDraftRuleEntries,
    removeTemplateDraftRuleEntries,
    upsertBan,
    removeBan,
    upsertPreferredPick,
    removePreferredPick,
    upsertDraftSession,
    upsertSessionAction,
    resetEntities,
} = entitiesSlice.actions;

export default entitiesSlice.reducer;