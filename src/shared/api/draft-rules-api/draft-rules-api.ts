import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@shared/lib/fetch-base-query";
import {
    upsertGameModes, upsertManyTemplateDraftRuleEntries,
    upsertTemplateDraftRules
} from "@feature/entities/stores/entities-slice";
import type {ApiResponse} from "@shared/types/api";
import type {TemplateDraftRule, TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules";
import type {GameMode} from "@shared/types/domain/game-modes";


type GetListResponse = ApiResponse<TemplateDraftRule[]>;

type GetFindByIdResponse = ApiResponse<TemplateDraftRule & {
    game_mode: GameMode,
    template_draft_rule_entries: TemplateDraftRuleEntry[]
}>;


export const draftRulesApi = createApi({
    reducerPath: "draftRulesApi",
    baseQuery,
    endpoints: (builder) => ({
        getList: builder.query<GetListResponse, { params : { limit: number } }>({
            query: (body) => ({
                url: "/draft-rules/get-list",
                params: body.params,
            })
        }),
        findById: builder.query<GetFindByIdResponse, { params : { id: TemplateDraftRule['id'] } }>({
            query: (body) => ({
                url: "/draft-rules/find-by-id",
                params: body.params,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data: response } = await queryFulfilled;

                    console.log('API response', response);
                    const { game_mode, template_draft_rule_entries, ...draft_rule } = response.data as GetFindByIdResponse["data"];

                    console.log('filteredDraftRules', draft_rule);
                    console.log('game_mode', game_mode);
                    console.log('template_draft_rule_entries', template_draft_rule_entries);
                    dispatch(upsertTemplateDraftRules(draft_rule));
                    dispatch(upsertGameModes(game_mode));
                    dispatch(upsertManyTemplateDraftRuleEntries(template_draft_rule_entries));

                } catch (error) {
                    // Optionally, you can dispatch an action to handle login failure
                    // dispatch(loginFailure(error.message));
                }
            }
        }),
    }),
});

export const {
    useLazyGetListQuery,
    useLazyFindByIdQuery,
} = draftRulesApi;