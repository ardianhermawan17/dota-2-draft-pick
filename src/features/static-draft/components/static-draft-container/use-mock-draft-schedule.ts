"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@shared/config/redux/hooks";
import { useLazyFindByIdQuery } from "@shared/api/draft-rules-api";
import { selectTemplateDraftRuleEntriesByRuleId } from "@shared/selectors";
import {
  chooseSide,
  selectTemplate,
  startStaticDraft,
} from "@feature/static-draft/stores/static-draft-slice";
import type { TemplateDraftRuleEntry } from "@shared/types/domain/template-draft-rules";

/**
 * Mock hook for loading template draft rule entries from draft-rules-api
 * 
 * This hook:
 * 1. Triggers useLazyFindByIdQuery with a mocked template rule ID
 * 2. Returns the template draft rule entries from entities state
 * 3. Provides loading/error states
 */
export function useMockDraftSchedule() {
  const MOCK_RULE_ID = "60a4cd67-d017-4a99-83aa-cdd2df8f4918";
  const dispatch = useAppDispatch();

  // Lazy query hook -- doesn't fetch until manually triggered
  const [findById, { isLoading, isError, error }] = useLazyFindByIdQuery();

  // Safely get rule entries from entities (normalized from onQueryStarted in draft-rules-api)
  const ruleEntries = useAppSelector(selectTemplateDraftRuleEntriesByRuleId(MOCK_RULE_ID));

  // Trigger the query on mount
  useEffect(() => {
    const planId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `mock-plan-${Date.now()}`;

    // Simulate full static draft initialization for mock mode
    dispatch(startStaticDraft({ planId }));
    dispatch(selectTemplate(MOCK_RULE_ID));
    dispatch(chooseSide("radiant"));

    findById({
      params: {
        id: MOCK_RULE_ID,
      },
    }).catch((err) => {
      console.error("Failed to fetch mock template rule:", err);
    });
  }, [dispatch, findById]);

  return {
    ruleId: MOCK_RULE_ID,
    isLoading,
    isError,
    error,
    entries: (ruleEntries as TemplateDraftRuleEntry[]) ?? [],
  };
}
