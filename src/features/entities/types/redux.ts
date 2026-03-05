import type {Ban, DraftPlan, EnemyThreat, ItemTimingNote, PreferredPick} from "@shared/types/domain/draft-plans";
import type {User} from "@shared/types/domain/auth";
import type {Hero} from "@shared/types/domain/heroes";
import type {DraftSession, SessionAction} from "@shared/types/domain/sessions";
import type {TemplateDraftRule, TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules";
import type {Player, Team} from "@shared/types/domain/teams";
import type {GameMode} from "@shared/types/domain/game-modes";

export type EntitiesState = {
    users: Record<string, Omit<User, "password" | "updated_at">>;
    heroes: Record<number, Hero>;
    draftPlans: Record<string, DraftPlan>;
    bans: Record<string, Ban>;
    preferredPicks: Record<string, PreferredPick>;
    enemyThreats: Record<string, EnemyThreat>;
    itemTimingNotes: Record<string, ItemTimingNote>;
    draftSessions: Record<string, DraftSession>;
    sessionActions: Record<string, SessionAction>;
    gameModes: Record<string, GameMode>;
    templateDraftRules: Record<string, TemplateDraftRule>;
    templateDraftRuleEntries: Record<string, TemplateDraftRuleEntry>;
    teams: Record<string, Team>;
    players: Record<string, Player>;
};

// For O(1) lookup