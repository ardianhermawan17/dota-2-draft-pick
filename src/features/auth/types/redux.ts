export type AuthStatus =
    | "idle"
    | "loading"
    | "authenticated"
    | "error";

export type AuthState = {
    userId: string | null;     // reference to users.id
    status: AuthStatus;
    error: string | null;
};
