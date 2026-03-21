import { fireEvent, render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRealHeroes } from '@shared/components/template/__mocks__/heroes.mock';
import type { HeroWithStatus } from './list-heroes';
import { ListHeroes } from './list-heroes';

const heroItemSpy = vi.fn();

vi.mock('next/image', () => ({
	default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock('@shared/components/template/hero-item', () => ({
	HeroItem: (props: {
		hero: { open_dota_id: number; name: string };
		status?: string;
		slotNumber?: number;
		onClick?: (heroId: number) => void;
	}) => {
		heroItemSpy(props);
		return (
			<button
				type='button'
				data-testid='hero-item-mock'
				onClick={() => props.onClick?.(props.hero.open_dota_id)}
			>
				{props.hero.name}
			</button>
		);
	},
}));

describe('ListHeroes', () => {
	it('renders section header with attribute name (uppercase)', () => {
		render(<ListHeroes attribute='strength' heroes={[]} />);
		expect(screen.getByText('STRENGTH')).toBeTruthy();
	});

	it('renders attribute icon', () => {
		render(<ListHeroes attribute='agility' heroes={[]} />);
		const icon = screen.getByRole('img', { name: 'AGILITY attribute' });
		expect(icon.getAttribute('src')).toContain(
			'/images/attributes/agility-icon.png',
		);
	});

	it('renders correct number of HeroItem children', () => {
		const heroes: HeroWithStatus[] = createRealHeroes(4, 'intelligence').map(
			(hero) => ({ hero }),
		);
		render(<ListHeroes attribute='intelligence' heroes={heroes} />);

		expect(screen.getAllByTestId('hero-item-mock')).toHaveLength(4);
	});

	it('renders empty state when heroes is empty', () => {
		render(<ListHeroes attribute='universal' heroes={[]} />);
		expect(screen.getByText('No heroes available.')).toBeTruthy();
	});

	it('passes correct status to each HeroItem', () => {
		heroItemSpy.mockClear();

		const [hero1, hero2, hero3] = createRealHeroes(3, 'strength');
		const heroes: HeroWithStatus[] = [
			{ hero: hero1, status: 'normal' },
			{ hero: hero2, status: 'banned' },
			{ hero: hero3, status: 'picked' },
		];

		render(<ListHeroes attribute='strength' heroes={heroes} />);

		expect(heroItemSpy).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ status: 'normal' }),
			undefined,
		);
		expect(heroItemSpy).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ status: 'banned' }),
			undefined,
		);
		expect(heroItemSpy).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({ status: 'picked' }),
			undefined,
		);
	});

	it('passes correct onHeroClick to each HeroItem', () => {
		const onHeroClick = vi.fn();
		const hero = createRealHeroes(1, 'strength')[0];
		const heroes: HeroWithStatus[] = [{ hero, status: 'normal' }];

		render(
			<ListHeroes
				attribute='strength'
				heroes={heroes}
				onHeroClick={onHeroClick}
			/>,
		);

		fireEvent.click(screen.getByTestId('hero-item-mock'));
		expect(onHeroClick).toHaveBeenCalledWith(hero.open_dota_id);
	});

	it('uses 6-column desktop grid for non-universal attributes', () => {
		const heroes: HeroWithStatus[] = createRealHeroes(6, 'strength').map(
			(hero) => ({ hero }),
		);
		render(<ListHeroes attribute='strength' heroes={heroes} />);

		const grid = screen.getByTestId('list-heroes-grid');
		expect(grid.className).toContain('md:grid-cols-6');
	});

	it('uses 4-column grid for universal attribute', () => {
		const heroes: HeroWithStatus[] = createRealHeroes(4, 'universal').map(
			(hero) => ({ hero }),
		);
		render(<ListHeroes attribute='universal' heroes={heroes} />);

		const grid = screen.getByTestId('list-heroes-grid');
		expect(grid.className).toContain('grid-cols-4');
		expect(grid.className).not.toContain('md:grid-cols-6');
	});
});
