## What the templates model does (short)

A template_draft_rules row belongs to one draft_plans (one-to-one). Each plan can define its own draft rule set.

The rules are an ordered sequence of entries (stored in template_draft_rule_entries). Each entry is a group like “Ban 4 (radiant)” or “Pick 2 (dire)”.

Each entry has count (how many consecutive actions of this type) and a sequence_index (group order). When the system needs absolute ordering (1,2,3,4…), it expands groups into count individual steps (either when instantiating a draft_session or when materializing a static plan view). That expansion sets the absolute order_index used by bans, preferred_picks (for static plans), or session_actions (for live sessions).

## How this maps to existing tables and flows

Static Draft:

Option A (recommended): when a static plan is created, expand the template into the concrete order_index values and persist them into bans and preferred_picks rows. Each persisted ban/preferred_pick uses order_index = absolute position (1..N).

Option B: keep bans/preferred_picks as domain entries and compute/show absolute order by joining the template and mapping group-offset on read. (This is read-time work; not ideal for very fast UI reads.)

Live Draft:

When a draft_session starts, expand the rule groups into session_actions seed rows (or seed only the planned actions with order_index and action_type). During the session, session_actions are updated/consumed and streamed via Realtime.

Frontend:

The Redux slice templateRules stores the rule + entries. UI renders the expanded steps for the draft board. For static plans, draftPlan.bans and preferredPicks should already carry order_index for the quick summary view.

Validation:

On expansion ensure UNIQUE(session_id, order_index) and UNIQUE(session_id, hero_id) constraints to prevent invalid duplication (already in session_actions).

## Example: represent your long rule in entries

Your example:

Ban 4 (rad), Ban 4(dire), Pick 2 (rad), Pick 2 (dire), Ban 2 (rad), Ban 2 (dire), Pick 2 (rad), Pick 2 (dire), Ban 1(rad), Ban 1 (dire), Pick 1(rad), Pick 1(dire)

Becomes template_draft_rule_entries (grouped):

sequence_index=1 → action_type=ban, team_side=radiant, count=4

sequence_index=2 → action_type=ban, team_side=dire, count=4

sequence_index=3 → action_type=pick, team_side=radiant, count=2

sequence_index=4 → action_type=pick, team_side=dire, count=2

sequence_index=5 → action_type=ban, team_side=radiant, count=2

sequence_index=6 → action_type=ban, team_side=dire, count=2

sequence_index=7 → action_type=pick, team_side=radiant, count=2

sequence_index=8 → action_type=pick, team_side=dire, count=2

sequence_index=9 → action_type=ban, team_side=radiant, count=1

sequence_index=10 -> action_type=ban, team_side=dire, count=1

sequence_index=11 -> action_type=pick, team_side=radiant, count=1

sequence_index=12 -> action_type=pick, team_side=dire, count=1

Expansion yields absolute step numbers 1..(sum of counts) used for UI order.