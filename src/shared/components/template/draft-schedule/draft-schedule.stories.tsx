import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '@shared/components/ui/button';
import { DraftSchedule } from './draft-schedule';
import { DraftScheduleSkeleton } from './draft-schedule-skeleton';
import { DraftAnnouncer } from '../draft-announcer';
import type { TemplateDraftRuleEntry } from '@shared/types/domain/template-draft-rules';
import '@app/globals.css';

const SAMPLE_ENTRIES: TemplateDraftRuleEntry[] = [
	{
		id: '4f509663-d805-4f50-9cff-7ec0789b0926',
		note: 'Initial radian ban 4',
		count: 4,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'radiant',
		created_at: '2026-03-02T10:39:21+00:00',
		action_type: 'ban',
		sequence_index: 1,
		per_action_seconds: 30,
	},
	{
		id: '50e509b8-a1c9-4820-ab67-d4c97d53623b',
		note: 'Initial dire ban 4',
		count: 4,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'dire',
		created_at: '2026-03-02T11:54:15+00:00',
		action_type: 'ban',
		sequence_index: 2,
		per_action_seconds: 30,
	},
	{
		id: '42512a05-c57e-4249-8232-2cf5c6af50f4',
		note: 'radiant team pick 2 heroes',
		count: 2,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'radiant',
		created_at: '2026-03-02T11:57:30+00:00',
		action_type: 'pick',
		sequence_index: 3,
		per_action_seconds: 30,
	},
	{
		id: '63883f99-7d18-4c01-acad-85f06758e442',
		note: 'dire team pick 2 heroes',
		count: 2,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'dire',
		created_at: '2026-03-02T12:10:59+00:00',
		action_type: 'pick',
		sequence_index: 4,
		per_action_seconds: 30,
	},
	{
		id: 'b0196999-5424-4f09-91f5-6c04fc20dbf3',
		note: 'radiant team ban 2 heroes',
		count: 2,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'radiant',
		created_at: '2026-03-02T12:11:52+00:00',
		action_type: 'ban',
		sequence_index: 5,
		per_action_seconds: 30,
	},
	{
		id: '154b9b49-6b68-41b0-bbf2-009e4eb60559',
		note: 'dire team ban 2 heroes',
		count: 2,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'dire',
		created_at: '2026-03-02T12:13:45+00:00',
		action_type: 'ban',
		sequence_index: 6,
		per_action_seconds: 30,
	},
	{
		id: 'aafbc5e5-e692-4613-b570-9f9261625247',
		note: 'radiant team pick 2 heroes',
		count: 2,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'radiant',
		created_at: '2026-03-02T12:14:31+00:00',
		action_type: 'pick',
		sequence_index: 7,
		per_action_seconds: 30,
	},
	{
		id: '891b10a8-0424-4aee-950e-1f2369cafcf0',
		note: 'dire team pick 2 heroes',
		count: 2,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'dire',
		created_at: '2026-03-02T12:15:33+00:00',
		action_type: 'pick',
		sequence_index: 8,
		per_action_seconds: 30,
	},
	{
		id: '4c97883b-f01a-49cb-887a-415f70dc81ff',
		note: 'radiant team ban 1 heroes',
		count: 1,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'radiant',
		created_at: '2026-03-02T12:16:56+00:00',
		action_type: 'ban',
		sequence_index: 9,
		per_action_seconds: 30,
	},
	{
		id: '9b407fbe-e04a-497d-b295-57d59245d09f',
		note: 'dire team ban 1 heroes',
		count: 1,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'dire',
		created_at: '2026-03-02T12:18:02+00:00',
		action_type: 'ban',
		sequence_index: 10,
		per_action_seconds: 30,
	},
	{
		id: '0e770f0e-77bd-4d3a-bd53-f254d03750c8',
		note: 'last pick, radiant team pick 1 heroes',
		count: 1,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'radiant',
		created_at: '2026-03-02T12:19:00+00:00',
		action_type: 'pick',
		sequence_index: 11,
		per_action_seconds: 30,
	},
	{
		id: 'e54d972f-9110-4bca-b795-7965a5dace2c',
		note: 'last pick, dire team pick 1 heroes',
		count: 1,
		rule_id: '60a4cd67-d017-4a99-83aa-cdd2df8f4918',
		team_side: 'dire',
		created_at: '2026-03-02T12:19:39+00:00',
		action_type: 'pick',
		sequence_index: 12,
		per_action_seconds: 30,
	},
];

const meta: Meta<typeof DraftSchedule> = {
	title: 'Draft/DraftSchedule',
	component: DraftSchedule,
	parameters: {
		layout: 'centered',
		backgrounds: { default: 'dark' },
	},
	tags: ['autodocs'],
	argTypes: {
		active_time_side: { control: 'select', options: ['radiant', 'dire'] },
		ruleId: { control: 'text' },
		className: { control: 'text' },
	},
	// do NOT pass SAMPLE_ENTRIES here; we'll inject per-story to avoid serialization issues
};

export default meta;
type Story = StoryObj<typeof DraftSchedule>;

/** Radiant active — visible container + passes SAMPLE_ENTRIES directly */
export const RadiantActive: Story = {
	args: {
		active_time_side: 'radiant',
	},
	render: (args) => (
		<div className='w-full max-w-130 min-w-80 rounded-lg bg-linear-to-r from-slate-900 via-black to-slate-900 p-6 h-[70vh]'>
			<DraftSchedule {...args} template_draft_rule_entries={SAMPLE_ENTRIES} />
		</div>
	),
};

/** Dire active */
export const DireActive: Story = {
	args: {
		active_time_side: 'dire',
	},
	render: (args) => (
		<div className='w-full max-w-130 min-w-80 rounded-lg bg-linear-to-r from-slate-900 via-black to-slate-900 p-6 h-[70vh]'>
			<DraftSchedule {...args} template_draft_rule_entries={SAMPLE_ENTRIES} />
		</div>
	),
};

/** Long draft column — shows scrolling behavior */
export const LongDraftColumn: Story = {
	render: (args) => {
		// build long list (keeps original entries intact)
		const long = Array.from({ length: 18 }).flatMap((_, i) => {
			const base = SAMPLE_ENTRIES[i % SAMPLE_ENTRIES.length];
			// keep sequence_index incremental and id unique
			return [{ ...base, id: `${base.id}-${i}`, sequence_index: i + 1 }];
		});
		return (
			<div className='w-full max-w-130 min-w-80 rounded-lg bg-[#071027] p-4 h-[70vh]'>
				<DraftSchedule {...args} template_draft_rule_entries={long} />
			</div>
		);
	},
};

/** Toggleable interactive story (mimics your page) */
export const ToggleableCondition: Story = {
	render: (args) => {
		const [isRadiant, setIsRadiant] = useState(true);
		const [isPick, setIsPick] = useState(true);

		return (
			<div className='flex gap-6 p-6'>
				<div className='w-full max-w-130 min-w-80 rounded-lg bg-[#071027] p-4'>
					<div className='flex items-center justify-between mb-4'>
						<div className='text-slate-200 font-semibold'>
							{isRadiant ? 'Radiant' : 'Dire'} — {isPick ? 'Pick' : 'Ban'}
						</div>
						<div className='flex gap-2'>
							<Button onClick={() => setIsRadiant((p) => !p)}>
								Toggle Side
							</Button>
							<Button onClick={() => setIsPick((p) => !p)}>
								Toggle Action
							</Button>
						</div>
					</div>

					{/* announcer included so you can test audio while toggling */}
					<DraftAnnouncer
						active_time_side={isRadiant ? 'radiant' : 'dire'}
						active_action_type={isPick ? 'pick' : 'ban'}
						autoplayOnChange
						cooldownMs={1000}
						volume={0.9}
					/>

					<DraftSchedule
						{...args}
						active_time_side={isRadiant ? 'radiant' : 'dire'}
						template_draft_rule_entries={SAMPLE_ENTRIES}
					/>
				</div>
			</div>
		);
	},
};

export const ConstrainedParentWidth: Story = {
	args: {
		active_time_side: 'radiant',
	},
	render: (args) => (
		<div className='w-88 rounded-lg bg-[#071027] p-3 h-[70vh]'>
			<DraftSchedule {...args} template_draft_rule_entries={SAMPLE_ENTRIES} />
		</div>
	),
};

export const LoadingComponent: Story = {
	render: () => (
		<div className='w-full max-w-130 min-w-80 rounded-lg bg-[#071027] p-4 h-[70vh]'>
			<DraftScheduleSkeleton />
		</div>
	),
};
