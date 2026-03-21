'use client';

import { DraftSchedule } from '@shared/components/template/draft-schedule';
import { ListHeroes } from '@shared/components/template/list-heroes';
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

	return (
		<div className='grid h-screen grid-cols-1 gap-3 bg-background lg:grid-cols-[minmax(0,7fr)_auto] lg:gap-4'>
			<div className='overflow-y-auto border-r border-border p-4 lg:min-w-0'>
				<div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
					<div className='lg:col-span-3'>
						<ListHeroes
							attribute='strength'
							heroes={heroesByAttribute.strength}
							onHeroClick={handleHeroClick}
						/>
					</div>
					<div className='lg:col-span-3'>
						<ListHeroes
							attribute='agility'
							heroes={heroesByAttribute.agility}
							onHeroClick={handleHeroClick}
						/>
					</div>
					<div className='lg:col-span-3'>
						<ListHeroes
							attribute='intelligence'
							heroes={heroesByAttribute.intelligence}
							onHeroClick={handleHeroClick}
						/>
					</div>
					<div className='lg:col-span-3'>
						<ListHeroes
							attribute='universal'
							heroes={heroesByAttribute.universal}
							onHeroClick={handleHeroClick}
						/>
					</div>

					{isLoadingHeroes ? (
						<div className='rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground lg:col-span-12'>
							Loading heroes...
						</div>
					) : null}

					{isHeroesError ? (
						<div className='rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-sm text-destructive lg:col-span-12'>
							Failed to load heroes from OpenDota API.
						</div>
					) : null}
				</div>
			</div>

			<div className='overflow-hidden border-l border-border'>
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
