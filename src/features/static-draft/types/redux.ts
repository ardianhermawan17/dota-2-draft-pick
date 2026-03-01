export type TeamSide = "radiant" | "dire";
export type StaticActionType = "ban" | "preferred_pick";

export type StaticDraftState = {
    currentPlanId: string | null;

    selection: {
        teamSide: TeamSide;
        actionType: StaticActionType;
    };

    heroBrowser: {
        isOpen: boolean;
    };

    editing: {
        editingBanId: string | null;
        editingPreferredPickId: string | null;
    };

    ui: {
        isSaving: boolean;
        error: string | null;
    };
};