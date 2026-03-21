'use client';

import { DraftSchedule } from '@shared/components/template/draft-schedule';
import { ListHeroes } from '@shared/components/template/list-heroes';
import { useStaticDraftContainer } from './use-static-draft-container';

export function StaticDraftContainer() {
	const {
		isLoadingHeroes,
		isHeroesError,
		heroesByAttribute,
		handleHeroClick,
		draftScheduleEntries,
		activeTimeSide,
		selectedRuleId,
	} = useStaticDraftContainer();

	return (
		<div className='grid h-screen grid-cols-1 gap-1 bg-background lg:grid-cols-2'>
			<div className='overflow-y-auto border-r border-border p-4'>
				<div className='space-y-5'>
					<ListHeroes
						attribute='strength'
						heroes={heroesByAttribute.strength}
						onHeroClick={handleHeroClick}
					/>
					<ListHeroes
						attribute='agility'
						heroes={heroesByAttribute.agility}
						onHeroClick={handleHeroClick}
					/>
					<ListHeroes
						attribute='intelligence'
						heroes={heroesByAttribute.intelligence}
						onHeroClick={handleHeroClick}
					/>
					<ListHeroes
						attribute='universal'
						heroes={heroesByAttribute.universal}
						onHeroClick={handleHeroClick}
					/>

					{isLoadingHeroes ? (
						<div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
							Loading heroes...
						</div>
					) : null}

					{isHeroesError ? (
						<div className='rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
							Failed to load heroes from OpenDota API.
						</div>
					) : null}
				</div>
			</div>

			<div className='overflow-hidden border-l border-border'>
				<DraftSchedule
					template_draft_rule_entries={draftScheduleEntries}
					active_time_side={activeTimeSide}
					ruleId={selectedRuleId}
				/>
			</div>
		</div>
	);
}
