'use client';

import { StaticDraftContainer } from '@feature/static-draft/components/static-draft-container';

/**
 * StaticDraftPage - Main page for static (non-timed) draft
 * Renders:
 * - Left: ListHeroes (hero selection grid)
 * - Right: DraftSchedule (24-step draft board + confirmation)
 */
export default function StaticDraftPage() {
	return <StaticDraftContainer />;
}
