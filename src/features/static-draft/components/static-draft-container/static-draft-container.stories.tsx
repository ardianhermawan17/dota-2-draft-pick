import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Provider } from 'react-redux';
import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import entitiesReducer from '@feature/entities/stores/entities-slice';
import staticDraftReducer from '@feature/static-draft/stores/static-draft-slice';
import type { RootState } from '@shared/config/redux/store';
import { StaticDraftContainer } from './static-draft-container';

const meta: Meta<typeof StaticDraftContainer> = {
	title: 'Features/StaticDraft/StaticDraftContainer',
	component: StaticDraftContainer,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

function makeStore(preloadedState: PreloadedState<RootState>) {
	return configureStore({
		reducer: {
			entities: entitiesReducer,
			staticDraft: staticDraftReducer,
		},
		preloadedState,
	});
}

const preloadedState: PreloadedState<RootState> = {
	entities: {
		heroes: {
			1: {
				open_dota_id: 1,
				name: 'npc_dota_hero_antimage',
				slug: 'antimage',
				local_name: 'Anti-Mage',
				primary_attr: 'agi',
				attack_type: 'Melee',
				roles: ['Carry'],
				icons: { portrait_url: '', full_url: '' },
				meta_cached_at: '2026-03-20T00:00:00.000Z',
			},
		},
		users: {},
		draftPlans: {
			'plan-1': {
				id: 'plan-1',
				owner_id: 'user-1',
				template_rule_id: 'rule-1',
				name: 'Plan A',
				description: null,
				mode: 'static',
				is_public: false,
				created_at: '2026-03-20T00:00:00.000Z',
				updated_at: null,
				version: 1,
			},
		},
		bans: {},
		preferredPicks: {},
		enemyThreats: {},
		itemTimingNotes: {},
		draftSessions: {},
		sessionActions: {},
		gameModes: {},
		templateDraftRules: {
			'rule-1': {
				id: 'rule-1',
				game_mode_id: 1,
				code: 'cm',
				name: 'Captains Mode',
				description: null,
				reserved_time: 120,
				is_active: true,
				created_at: '2026-03-20T00:00:00.000Z',
				updated_at: null,
			},
		},
		templateDraftRuleEntries: {
			'entry-1': {
				id: 'entry-1',
				rule_id: 'rule-1',
				sequence_index: 1,
				action_type: 'ban',
				team_side: 'radiant',
				count: 4,
				per_action_seconds: 30,
				note: null,
				created_at: '2026-03-20T00:00:00.000Z',
			},
		},
		teams: {},
		players: {},
	},
	staticDraft: {
		currentPlanId: 'plan-1',
		phase: 'in_progress',
		template: { selectedRuleId: 'rule-1' },
		engine: {
			currentSequenceIndex: 1,
			currentActionType: 'ban',
			currentTeamSide: 'radiant',
			remainingActionsInGroup: 4,
		},
		ui: {
			selectedHeroId: null,
			isLocked: false,
			error: null,
		},
	},
};

export const Default: Story = {
	render: () => {
		const store = makeStore(preloadedState);

		return (
			<Provider store={store}>
				<StaticDraftContainer />
			</Provider>
		);
	},
};
