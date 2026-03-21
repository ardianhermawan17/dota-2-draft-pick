'use client';

import Image from 'next/image';
import { cn } from '@shared/lib/shadcn';
import type { Hero } from '@shared/types/domain/heroes';
import { useHeroItem } from './use-hero-item';

export type HeroStatus = 'normal' | 'banned' | 'picked';

export interface HeroItemProps {
	hero: Hero;
	status?: HeroStatus;
	slotNumber?: number;
	onClick?: (heroId: number) => void;
	className?: string;
}

export function HeroItem({
	hero,
	status = 'normal',
	slotNumber,
	onClick,
	className,
}: HeroItemProps) {
	const { imageSrc, handleError, handleClick } = useHeroItem({ hero, onClick });

	const imageStateClass =
		status === 'banned'
			? 'grayscale opacity-50'
			: status === 'picked'
				? 'grayscale-[60%] opacity-70'
				: 'opacity-100';

	return (
		<button
			type='button'
			onClick={handleClick}
			className={cn(
				'group relative aspect-9/10 w-full max-w-18 overflow-hidden border border-border bg-background text-foreground transition duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70',
				className,
			)}
			aria-label={`Select ${hero.name}`}
			data-testid='hero-item'
		>
			<Image
				src={imageSrc}
				alt={hero.name}
				width={90}
				height={80}
				className={cn(
					'h-full w-full object-cover transition duration-150 ease-in-out',
					imageStateClass,
				)}
				onError={handleError}
				unoptimized
				data-testid='hero-item-image'
			/>

			{status === 'banned' ? (
				<div
					className='pointer-events-none absolute inset-0 flex items-center justify-center'
					aria-hidden
					data-testid='hero-item-banned-icon'
				>
					<div className='flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-2xl font-black leading-none text-destructive'>
						✕
					</div>
				</div>
			) : null}

			{slotNumber ? (
				<div
					className='pointer-events-none absolute bottom-1 left-1 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-foreground'
					data-testid='hero-item-slot'
				>
					{slotNumber}
				</div>
			) : null}

			<div
				className='pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[7px] border-x-transparent border-t-orange-500'
				aria-hidden
			/>
		</button>
	);
}
