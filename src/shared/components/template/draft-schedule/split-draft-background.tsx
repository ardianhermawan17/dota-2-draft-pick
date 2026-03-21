'use client';

import React from 'react';
import type { Variants, Transition } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';

type ActiveSide = 'radiant' | 'dire' | null;

interface SplitDraftBackgroundProps {
	active_time_side: ActiveSide;
	children?: React.ReactNode;
}

/**
 * SplitDraftBackground
 * - active_time_side: "radiant" | "dire"
 * - responsive, animated glow shift + pulse on active side
 * - place your content (draft UI) as children
 */
export function SplitDraftBackground({
	active_time_side = 'radiant',
	children,
}: SplitDraftBackgroundProps) {
	const radiantGrad = `linear-gradient(270deg,
    #000000 0%,
    rgba(16,185,129,0.12) 25%,
    rgba(16,185,129,0.28) 45%,
    rgba(16,185,129,0.34) 100%)`;

	const direGrad = `linear-gradient(90deg,
    #000000 0%,
    rgba(239,68,68,0.12) 25%,
    rgba(239,68,68,0.28) 45%,
    rgba(239,68,68,0.34) 100%)`;

	const sideVariantTransition: Transition = {
		duration: 0.6,
		ease: 'easeInOut',
	};
	const sideVariants: Variants = {
		active: {
			opacity: 1,
			scale: 1.03,
			transition: sideVariantTransition,
		},
		idle: {
			opacity: 0.45,
			scale: 1,
			transition: sideVariantTransition,
		},
	};

	// pulse animation for the active highlight circle
	const pulseVariants = {
		initial: { scale: 0.92, opacity: 0.0 },
		pulse: {
			scale: [0.95, 1.05, 0.98],
			opacity: [0.0, 0.25, 0.0],
			transition: {
				duration: 2.2,
				repeat: Infinity,
				transition: sideVariantTransition,
			},
		},
	};

	// position highlight center depending on side
	const highlightLeft = active_time_side === 'radiant' ? '18%' : '82%';
	const highlightBg =
		active_time_side === 'radiant'
			? 'radial-gradient(circle at center, rgba(16,185,129,0.35), rgba(16,185,129,0.15) 30%, rgba(16,185,129,0) 55%)'
			: 'radial-gradient(circle at center, rgba(239,68,68,0.35), rgba(239,68,68,0.15) 30%, rgba(239,68,68,0) 55%)';

	return (
		<div className='relative w-full min-w-0 min-h-0 h-full max-h-10/12 overflow-hidden bg-[#0b0b0d] rounded-2xl p-3'>
			{/* Left: Radiant base */}
			<motion.div
				className='absolute inset-y-0 left-0 w-1/2 pointer-events-none'
				initial='idle'
				animate={active_time_side === 'radiant' ? 'active' : 'idle'}
				variants={sideVariants}
				style={{
					background: radiantGrad,
					mixBlendMode: 'screen',
				}}
			/>

			{/* Right: Dire base */}
			<motion.div
				className='absolute inset-y-0 right-0 w-1/2 pointer-events-none'
				initial='idle'
				animate={active_time_side === 'dire' ? 'active' : 'idle'}
				variants={sideVariants}
				style={{
					background: direGrad,
					mixBlendMode: 'screen',
				}}
			/>

			{/* soft center darkening to mimic Dota panel */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{
					background:
						'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 80%)',
				}}
			/>

			{/* Animated highlight / pulse that moves to active side */}
			<AnimatePresence mode='wait'>
				<motion.div
					key={active_time_side} // restart animation on change
					initial={{ left: highlightLeft, opacity: 0 }}
					animate={{
						left: highlightLeft,
						opacity: [0, 1, 0.9],
						transition: { duration: 0.55, ease: 'easeOut' },
					}}
					className='absolute top-1/4 h-2/3 w-3/5 -translate-x-1/2 pointer-events-none'
					style={{
						// will be clipped by the container edges; this creates the soft green/red wash
						background: highlightBg,
						filter: 'blur(36px)',
						transformOrigin: 'center',
					}}
				>
					{/* subtle pulsing inner layer */}
					<motion.div
						className='absolute inset-0 pointer-events-none'
						variants={pulseVariants}
						initial='initial'
						animate='pulse'
					/>
				</motion.div>
			</AnimatePresence>

			{/* optional thin rim line in center (like draft board gutter) */}
			<div
				className='absolute top-0 bottom-0 left-1/2 -translate-x-1 w-px pointer-events-none'
				style={{
					background:
						'linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(0,0,0,0.25))',
				}}
			/>

			{/* content on top */}
			<div className='relative z-10 w-full min-w-0'>{children}</div>
		</div>
	);
}
