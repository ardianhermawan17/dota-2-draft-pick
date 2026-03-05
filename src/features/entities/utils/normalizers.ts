import type {TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules";


export function normalizeTemplateDraftRuleEntries(
    entries: TemplateDraftRuleEntry[]
): Record<string, TemplateDraftRuleEntry> {
    return entries.reduce((acc, entry) => {
        acc[entry.id] = entry;
        return acc;
    }, {} as Record<string, TemplateDraftRuleEntry>);
}