import reducer, {
    clearAuthError,
    initialState,
    loginFailure,
    loginRequest,
    loginSuccess,
    logout,
} from "./auth-slice";

describe("auth-slice", () => {
    it("returns the initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
    });

    it("sets loading state on loginRequest", () => {
        const state = reducer(
            {
                userId: null,
                status: "idle",
                error: "old error",
            },
            loginRequest()
        );

        expect(state).toEqual({
            userId: null,
            status: "loading",
            error: null,
        });
    });

    it("stores user and sets authenticated on loginSuccess", () => {
        const state = reducer(
            {
                userId: null,
                status: "loading",
                error: "some error",
            },
            loginSuccess({ userId: "user-123" })
        );

        expect(state).toEqual({
            userId: "user-123",
            status: "authenticated",
            error: null,
        });
    });

    it("sets error state on loginFailure", () => {
        const state = reducer(
            {
                userId: "existing-user",
                status: "loading",
                error: null,
            },
            loginFailure("Invalid credentials")
        );

        expect(state).toEqual({
            userId: null,
            status: "error",
            error: "Invalid credentials",
        });
    });

    it("resets to idle on logout", () => {
        const state = reducer(
            {
                userId: "user-123",
                status: "authenticated",
                error: "should clear",
            },
            logout()
        );

        expect(state).toEqual({
            userId: null,
            status: "idle",
            error: null,
        });
    });

    it("clears only auth error on clearAuthError", () => {
        const state = reducer(
            {
                userId: "user-123",
                status: "authenticated",
                error: "temporary error",
            },
            clearAuthError()
        );

        expect(state).toEqual({
            userId: "user-123",
            status: "authenticated",
            error: null,
        });
    });
});
