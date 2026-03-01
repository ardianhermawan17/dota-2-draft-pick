import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {AuthState} from "@feature/auth/types";

export const initialState: AuthState = {
    userId: null,
    status: "idle",
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginRequest(state) {
            state.status = "loading";
            state.error = null;
        },

        loginSuccess(state, action: PayloadAction<{ userId: string }>) {
            state.status = "authenticated";
            state.userId = action.payload.userId;
            state.error = null;
        },

        loginFailure(state, action: PayloadAction<string>) {
            state.status = "error";
            state.error = action.payload;
            state.userId = null;
        },

        logout(state) {
            state.status = "idle";
            state.userId = null;
            state.error = null;
        },

        clearAuthError(state) {
            state.error = null;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    logout,
    clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;