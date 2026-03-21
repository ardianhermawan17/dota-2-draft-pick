import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import type { PersistConfig } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist/es/constants";
import authSlice from "@feature/auth/stores/auth-slice";
import entitiesSlice from "@feature/entities/stores/entities-slice";
import staticDraftSlice from "@feature/static-draft/stores/static-draft-slice";
import liveDraftSlice from "@feature/live-draft/stores/live-draft-slice";
import {authApi} from "@feature/auth/api/auth-api";
import {draftRulesApi} from "@shared/api/draft-rules-api";
import {heroApi} from "@shared/api/hero-api";

const rootReducer = combineReducers({
  auth: authSlice,
  entities: entitiesSlice,
  staticDraft: staticDraftSlice,
  liveDraft: liveDraftSlice,
  [authApi.reducerPath]: authApi.reducer,
  [draftRulesApi.reducerPath]: draftRulesApi.reducer,
  [heroApi.reducerPath]: heroApi.reducer,
});

type RootReducerState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootReducerState> = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "entities", "staticDraft", "liveDraft"],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer<RootReducerState>(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(
          // middleware API
          authApi.middleware,
          draftRulesApi.middleware,
          heroApi.middleware,
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = RootReducerState;
export type AppDispatch = AppStore["dispatch"];
