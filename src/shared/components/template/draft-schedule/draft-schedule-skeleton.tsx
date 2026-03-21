'use client';

import React from 'react';
import { Skeleton } from '@shared/components/ui/skeleton';
import { cn } from '@shared/lib/shadcn';
import { SplitDraftBackground } from './split-draft-background';

export type DraftScheduleSkeletonProps = {
	className?: string;
	rowCount?: number;
};

export function DraftScheduleSkeleton({
	className,
	rowCount = 24,
}: DraftScheduleSkeletonProps) {
	const rows = Array.from({ length: rowCount });

	return (
		<SplitDraftBackground active_time_side={null}>
			<div className={cn('w-full min-w-0 p-3 overflow-y-auto max-h-[calc(100vh-4rem)]', className)}>
				<div className='mb-4 flex items-center justify-between gap-4'>
					<Skeleton className='h-8 w-20' />
					<Skeleton className='h-8 w-18' />
				</div>

				<div className='space-y-2'>
					{rows.map((_, index) => (
						<div
							key={`draft-schedule-skeleton-row-${index}`}
							className='grid grid-cols-[1fr_auto_1fr] items-center gap-3 my-8'
						>
							<Skeleton className='h-11 w-full max-w-28 justify-self-end' />
							<Skeleton className='h-6 w-10' />
							<Skeleton className='h-11 w-full max-w-28' />
						</div>
					))}
				</div>
			</div>
		</SplitDraftBackground>
	);
}
