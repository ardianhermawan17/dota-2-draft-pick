import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@shared/lib/fetch-base-query";
import type { User } from "@shared/types/domain/auth";
import {upsertUser} from "@feature/entities/stores/entities-slice";
import {loginSuccess} from "@feature/auth/stores/auth-slice";
import type {ApiResponse} from "@shared/types/api";

export type LoginRequest = {
    email: string;
    password: string;
};

export type SignupRequest = {
    email: string;
    display_name: string;
    password: string;
};

export type AuthResponse = ApiResponse<
    Omit<User, "password" | "updated_at">
>;

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data: response } = await queryFulfilled;

                    dispatch(upsertUser(response.data));
                    dispatch(loginSuccess({userId: response.data.id}));

                } catch (error) {
                    // Optionally, you can dispatch an action to handle login failure
                    // dispatch(loginFailure(error.message));
                }
            }
        }),

        signup: builder.mutation<AuthResponse, SignupRequest>({
            query: (body) => ({
                url: "/auth/signup",
                method: "POST",
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data: response } = await queryFulfilled;

                    dispatch(upsertUser(response.data));
                    dispatch(loginSuccess({userId: response.data.id}));

                } catch (error) {
                    // Optionally, you can dispatch an action to handle login failure
                    // dispatch(loginFailure(error.message));
                }
            }
        }),

    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
} = authApi;