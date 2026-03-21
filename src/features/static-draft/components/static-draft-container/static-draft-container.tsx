'use client';

import { DraftSchedule } from '@shared/components/template/draft-schedule';
import { ListHeroes } from '@shared/components/template/list-heroes';
import type { HeroAttribute } from '@shared/components/template/list-heroes';
import { useStaticDraftContainer } from './use-static-draft-container';
import { useMockDraftSchedule } from './use-mock-draft-schedule';

export function StaticDraftContainer() {
	const {
		isLoadingHeroes,
		isHeroesError,
		heroesByAttribute,
		handleHeroClick,
		activeTimeSide,
	} = useStaticDraftContainer();

	// Mock draft schedule data from draft-rules-api
	const {
		ruleId: mockRuleId,
		isLoading: isMockLoading,
		isError: isMockError,
		entries: mockEntries,
	} = useMockDraftSchedule();

	const heroPanels: Array<{
		attribute: HeroAttribute;
		heroes: (typeof heroesByAttribute)[HeroAttribute];
	}> = [
		{ attribute: 'strength', heroes: heroesByAttribute.strength },
		{ attribute: 'agility', heroes: heroesByAttribute.agility },
		{ attribute: 'intelligence', heroes: heroesByAttribute.intelligence },
		{ attribute: 'universal', heroes: heroesByAttribute.universal },
	];

	return (
		<div className='grid h-screen grid-cols-1 gap-3 bg-background lg:grid-cols-[minmax(0,78%)_auto] lg:gap-5 lg:px-2'>
			<div className='overflow-y-auto border-r border-border p-4 lg:min-w-0 lg:mr-1'>
				<div className='flex flex-row w-full gap-4 lg:items-start'>
					{heroPanels.map(({ attribute, heroes }) => (
						<div
							key={attribute}
							className={
								attribute === 'universal'
									? 'lg:w-[28%] lg:justify-self-end'
									: 'lg:min-w-0'
							}
						>
							<ListHeroes
								attribute={attribute}
								heroes={heroes}
								onHeroClick={handleHeroClick}
							/>
						</div>
					))}

					{isLoadingHeroes ? (
						<div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground lg:col-span-full'>
							Loading heroes...
						</div>
					) : null}

					{isHeroesError ? (
						<div className='rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive lg:col-span-full'>
							Failed to load heroes from OpenDota API.
						</div>
					) : null}
				</div>
			</div>

			<div className='overflow-hidden border-l border-border lg:ml-1'>
				{isMockLoading ? (
					<div className='mx-3 mt-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground'>
						Loading draft schedule mock data...
					</div>
				) : null}

				{isMockError ? (
					<div className='mx-3 mt-3 rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
						Failed to load mock draft schedule data.
					</div>
				) : null}

				<DraftSchedule
					template_draft_rule_entries={mockEntries}
					active_time_side={activeTimeSide}
					ruleId={mockRuleId}
				/>
			</div>
		</div>
	);
}
