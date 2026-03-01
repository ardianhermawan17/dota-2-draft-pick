export type LiveDraftPhase =
    | "idle"
    | "choose_template"
    | "coin_flip"
    | "choose_side"
    | "in_progress"
    | "completed";

export type TeamSide = "radiant" | "dire";
export type DraftActionType = "ban" | "pick";

export type LiveDraftState = {
    currentSessionId: string | null;

    phase: LiveDraftPhase;

    template: {
        selectedRuleId: string | null;
    };

    coinFlip: {
        result: TeamSide | null;
        winnerSide: TeamSide | null;
    };

    engine: {
        currentSequenceIndex: number;
        currentActionType: DraftActionType | null;
        currentTeamSide: TeamSide | null;
        remainingActionsInGroup: number;
    };

    timer: {
        draftTimeLeft: number;
        reservedTimeLeft: number;
        isUsingReservedTime: boolean;
        isRunning: boolean;
    };

    ui: {
        selectedHeroId: number | null;
        isLocked: boolean;
        error: string | null;
    };
};