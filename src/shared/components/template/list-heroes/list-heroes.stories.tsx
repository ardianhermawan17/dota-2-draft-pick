import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createRealHeroes } from '@shared/components/template/__mocks__/heroes.mock';
import type { HeroStatus } from '@shared/components/template/hero-item';
import { ListHeroes } from './list-heroes';

const withStatus = (
	count: number,
	attribute: 'strength' | 'agility' | 'intelligence' | 'universal',
) =>
	createRealHeroes(count, attribute).map((hero, index) => ({
		hero,
		status: (index % 5 === 0
			? 'banned'
			: index % 3 === 0
				? 'picked'
				: 'normal') as HeroStatus,
		slotNumber: (index % 5) + 1,
	}));

const meta: Meta<typeof ListHeroes> = {
	title: 'Template/ListHeroes',
	component: ListHeroes,
	parameters: {
		layout: 'centered',
		backgrounds: { default: 'dark' },
	},
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div className='w-85 bg-background p-4 sm:w-140 md:w-190'>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StrengthHeroes: Story = {
	args: {
		attribute: 'strength',
		heroes: withStatus(10, 'strength'),
	},
};

export const AgilityHeroes: Story = {
	args: {
		attribute: 'agility',
		heroes: createRealHeroes(8, 'agility').map((hero, index) => ({
			hero,
			status: 'normal',
			slotNumber: (index % 5) + 1,
		})),
	},
};

export const IntelHeroes: Story = {
	args: {
		attribute: 'intelligence',
		heroes: withStatus(12, 'intelligence'),
	},
};

export const UniversalHeroes: Story = {
	args: {
		attribute: 'universal',
		heroes: withStatus(8, 'universal'),
	},
};

export const Empty: Story = {
	args: {
		attribute: 'strength',
		heroes: [],
	},
};

export const SingleRow: Story = {
	args: {
		attribute: 'strength',
		heroes: withStatus(5, 'strength'),
	},
};

export const DesktopFitSixColumns: Story = {
	args: {
		attribute: 'agility',
		heroes: withStatus(18, 'agility'),
	},
};

export const UniversalFourColumns: Story = {
	args: {
		attribute: 'universal',
		heroes: withStatus(12, 'universal'),
	},
};
