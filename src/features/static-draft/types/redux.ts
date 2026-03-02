export type StaticDraftPhase =
    | "idle"
    | "choose_template"
    | "choose_side"
    | "in_progress"
    | "completed";

export type TeamSide = "radiant" | "dire";
export type DraftActionType = "ban" | "pick";

export type StaticDraftState = {
    currentPlanId: string | null;

    phase: StaticDraftPhase;

    template: {
        selectedRuleId: string | null;
    };

    engine: {
        currentSequenceIndex: number;
        currentActionType: DraftActionType | null;
        currentTeamSide: TeamSide | null;
        remainingActionsInGroup: number;
    };

    ui: {
        selectedHeroId: number | null;
        isLocked: boolean;
        error: string | null;
    };
};