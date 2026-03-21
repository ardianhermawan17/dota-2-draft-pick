'use client';

import { Skeleton } from '@shared/components/ui/skeleton';
import { cn } from '@shared/lib/shadcn';

type SkeletonCardConfig = {
	key: string;
	headerWidthClass: string;
	iconColumns: 4 | 6;
	rows: number;
	cardClassName?: string;
};

const CARD_CONFIGS: SkeletonCardConfig[] = [
	{
		key: 'strength',
		headerWidthClass: 'w-28',
		iconColumns: 6,
		rows: 6,
	},
	{
		key: 'agility',
		headerWidthClass: 'w-24',
		iconColumns: 6,
		rows: 6,
	},
	{
		key: 'intelligence',
		headerWidthClass: 'w-30',
		iconColumns: 6,
		rows: 6,
	},
	{
		key: 'universal',
		headerWidthClass: 'w-26',
		iconColumns: 4,
		rows: 6,
		cardClassName: 'lg:w-[82%] lg:justify-self-end',
	},
];

export type ListHeroesSkeletonProps = {
	className?: string;
};

export function ListHeroesSkeleton({ className }: ListHeroesSkeletonProps) {
	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-start',
				className,
			)}
		>
			{CARD_CONFIGS.map((card) => {
				const totalIcons = card.iconColumns * card.rows;
				const iconGridClass =
					card.iconColumns === 4
						? 'grid grid-cols-4 gap-0.5'
						: 'grid grid-cols-4 gap-0.5 sm:grid-cols-5 md:grid-cols-6';

				return (
					<section
						key={card.key}
						className={cn(
							'w-full min-w-0 rounded-md border border-border/60 p-2',
							card.cardClassName,
						)}
					>
						<header className='mb-2 flex items-center gap-2'>
							<Skeleton className='h-5 w-5 rounded-full' />
							<Skeleton className={cn('h-4', card.headerWidthClass)} />
						</header>

						<div className={iconGridClass}>
							{Array.from({ length: totalIcons }).map((_, index) => (
								<Skeleton
									key={`${card.key}-icon-${index}`}
									className='aspect-9/10 w-full max-w-18 justify-self-center rounded-sm'
								/>
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
}
