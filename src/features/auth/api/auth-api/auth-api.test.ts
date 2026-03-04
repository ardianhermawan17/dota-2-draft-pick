import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import authReducer from "@feature/auth/stores/auth-slice";
import entitiesReducer from "@feature/entities/stores/entities-slice";
import { authApi } from "./auth-api";

function createMockJsonResponse(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

type TestStore = ReturnType<typeof createTestStore>;

function createTestStore() {
    return configureStore({
        reducer: {
            auth: authReducer,
            entities: entitiesReducer,
            [authApi.reducerPath]: authApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(authApi.middleware),
    });
}

describe("auth-api", () => {
    const fetchMock = vi.fn<typeof fetch>();

    beforeEach(() => {
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
        fetchMock.mockReset();
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("login mutation updates auth and entities on success", async () => {
        const store = createTestStore();

        const payload = {
            message: "Login success",
            status: 200,
            data: {
                id: "user-1",
                email: "test@example.com",
                display_name: "Tester",
                avatar_url: null,
                role: "user" as const,
                created_at: "2026-03-04T00:00:00.000Z",
            },
        };

        fetchMock.mockResolvedValueOnce(createMockJsonResponse(payload));

        const result = await store.dispatch(
            authApi.endpoints.login.initiate({
                email: "test@example.com",
                password: "secret123",
            })
        );

        expect("data" in result).toBe(true);

        const state = store.getState() as ReturnType<TestStore["getState"]>;

        expect(state.auth.status).toBe("authenticated");
        expect(state.auth.userId).toBe("user-1");
        expect(state.auth.error).toBeNull();

        expect(state.entities.users["user-1"]).toEqual(payload.data);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("signup mutation updates auth and entities on success", async () => {
        const store = createTestStore();

        const payload = {
            message: "Signup success",
            status: 201,
            data: {
                id: "user-2",
                email: "new@example.com",
                display_name: "New User",
                avatar_url: null,
                role: "user" as const,
                created_at: "2026-03-04T00:00:00.000Z",
            },
        };

        fetchMock.mockResolvedValueOnce(createMockJsonResponse(payload, 201));

        const result = await store.dispatch(
            authApi.endpoints.signup.initiate({
                email: "new@example.com",
                password: "secret123",
                display_name: "New User",
            })
        );

        expect("data" in result).toBe(true);

        const state = store.getState() as ReturnType<TestStore["getState"]>;

        expect(state.auth.status).toBe("authenticated");
        expect(state.auth.userId).toBe("user-2");
        expect(state.auth.error).toBeNull();

        expect(state.entities.users["user-2"]).toEqual(payload.data);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("login mutation does not update auth state on failed response", async () => {
        const store = createTestStore();

        fetchMock.mockResolvedValueOnce(
            createMockJsonResponse(
                {
                    message: "Invalid credentials",
                    status: 401,
                    data: null,
                },
                401
            )
        );

        const result = await store.dispatch(
            authApi.endpoints.login.initiate({
                email: "test@example.com",
                password: "wrong",
            })
        );

        expect("error" in result).toBe(true);

        const state = store.getState() as ReturnType<TestStore["getState"]>;
        expect(state.auth).toEqual({
            userId: null,
            status: "idle",
            error: null,
        });
        expect(Object.keys(state.entities.users)).toHaveLength(0);
    });
});
