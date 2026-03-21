import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertManyHeroes } from "@feature/entities/stores/entities-slice";
import type { OpenDotaHeroRaw, OpenDotaHeroesResponse } from "./hero-api.types";

const OPENDOTA_BASE =
  process.env.NEXT_PUBLIC_OPENDOTA_BASE_URL ?? "https://api.opendota.com/api";

export const heroApi = createApi({
  reducerPath: "heroApi",
  baseQuery: fetchBaseQuery({ baseUrl: OPENDOTA_BASE }),
  endpoints: (builder) => ({
    getAll: builder.query<OpenDotaHeroRaw[], void>({
      query: () => "/constants/heroes",
      transformResponse: (response: OpenDotaHeroesResponse): OpenDotaHeroRaw[] => {
        if (Array.isArray(response)) {
          return response;
        }

        return Object.values(response);
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertManyHeroes(data));
        } catch {
          // no-op: query errors are handled by RTK Query state
        }
      },
    }),
  }),
});

export const { useGetAllQuery, useLazyGetAllQuery } = heroApi;