import type {Ban, DraftPlan, EnemyThreat, ItemTimingNote, PreferredPick} from "@shared/types/domain/draft-plans";
import type {User} from "@shared/types/domain/auth";
import type {Hero} from "@shared/types/domain/heroes";
import type {DraftSession, SessionAction} from "@shared/types/domain/sessions";
import type {TemplateDraftRule, TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules";
import type {Player, Team} from "@shared/types/domain/teams";

export type EntitiesState = {
    users: Record<string, User>;
    heroes: Record<number, Hero>;
    draftPlans: Record<string, DraftPlan>;
    bans: Record<string, Ban>;
    preferredPicks: Record<string, PreferredPick>;
    enemyThreats: Record<string, EnemyThreat>;
    itemTimingNotes: Record<string, ItemTimingNote>;
    draftSessions: Record<string, DraftSession>;
    sessionActions: Record<string, SessionAction>;
    templateRules: Record<string, TemplateDraftRule>;
    templateRuleEntries: Record<string, TemplateDraftRuleEntry>;
    teams: Record<string, Team>;
    players: Record<string, Player>;
};

// For O(1) lookup