import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:54321/functions/v1",
    prepareHeaders: (headers, { getState }) => {

        // If later you add token support:
        // const token = (getState() as RootState).auth.token
        // if (token) headers.set("Authorization", `Bearer ${token}`)

        headers.set("Content-Type", "application/json");

        // Required by Supabase Edge Functions
        headers.set(
            "Authorization",
            `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        );

        return headers;
    },
});