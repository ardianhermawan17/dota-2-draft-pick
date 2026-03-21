'use client';

import Image from 'next/image';
import { HeroItem } from '@shared/components/template/hero-item';
import { cn } from '@shared/lib/shadcn';
import type { Hero } from '@shared/types/domain/heroes';
import type { HeroStatus } from '@shared/components/template/hero-item/hero-item';
import { useListHeroes } from './use-list-heroes';

export type HeroAttribute =
	| 'strength'
	| 'agility'
	| 'intelligence'
	| 'universal';

export interface HeroWithStatus {
	hero: Hero;
	status?: HeroStatus;
	slotNumber?: number;
}

export interface ListHeroesProps {
	attribute: HeroAttribute;
	heroes: HeroWithStatus[];
	onHeroClick?: (heroId: number) => void;
	className?: string;
}

export function ListHeroes({
	attribute,
	heroes,
	onHeroClick,
	className,
}: ListHeroesProps) {
	const { attributeLabel, attributeIconSrc, attributeColor } =
		useListHeroes(attribute);
	const gridClassName =
		attribute === 'universal'
			? 'grid grid-cols-4 gap-0.5'
			: 'grid grid-cols-4 gap-0.5 sm:grid-cols-5 md:grid-cols-6';

	return (
		<section
			className={cn('w-full', className)}
			aria-label={`${attributeLabel} heroes`}
		>
			<header className='mb-2 flex items-center gap-2'>
				<Image
					src={attributeIconSrc}
					alt={`${attributeLabel} attribute`}
					width={20}
					height={20}
					unoptimized
				/>
				<h3
					className={cn(
						'text-sm font-bold uppercase tracking-wide',
						attributeColor,
					)}
				>
					{attributeLabel}
				</h3>
			</header>

			{heroes.length === 0 ? (
				<div className='rounded-md border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground'>
					No heroes available.
				</div>
			) : (
				<div className={cn(gridClassName)} data-testid='list-heroes-grid'>
					{heroes.map(({ hero, status, slotNumber }) => (
						<HeroItem
							key={hero.open_dota_id}
							hero={hero}
							status={status}
							slotNumber={slotNumber}
							onClick={onHeroClick}
							className='justify-self-center'
						/>
					))}
				</div>
			)}
		</section>
	);
}
