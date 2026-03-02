-- Table: heroes ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS heroes (
  open_dota_id int PRIMARY KEY, -- primary id from OpenDota
  name varchar(200),
  slug varchar(220),
  local_name varchar(100),
  primary_attr varchar(24),
  attack_type varchar(24),
  roles jsonb,
  icons jsonb,
  meta_cached_at timestamptz
);

COMMENT ON TABLE heroes IS 'Hero metadata (sourced from OpenDota).';
COMMENT ON COLUMN heroes.roles IS 'JSONB array of role strings (e.g. [\"carry\",\"support\"])';
COMMENT ON COLUMN heroes.icons IS 'JSONB object, e.g. { "portrait_url": "...", "full_url": "..." }';

-- Table: game_modes -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_modes (
  id serial PRIMARY KEY,
  code varchar(200) NOT NULL UNIQUE,
  name varchar(200),
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE game_modes IS 'Available game modes (e.g. captains mode).';
COMMENT ON COLUMN game_modes.code IS 'Unique code, e.g. ''game_mode_captains_mode''.';

-- New Table: template_draft_rules ---------------------------------------------------
CREATE TABLE IF NOT EXISTS template_draft_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_mode_id int,
  code varchar(255) NOT NULL, -- e.g. 'captains_mode_default'
  name varchar(255) NOT NULL,
  description text,
  reserved_time int NOT NULL DEFAULT 130, -- total reserved time in seconds (optional)
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

COMMENT ON TABLE template_draft_rules IS 'Template rules for drafting (shared presets).';
COMMENT ON COLUMN template_draft_rules.code IS 'Unique code, e.g. ''captains_mode_default''';
COMMENT ON COLUMN template_draft_rules.is_active IS 'Whether this template is available for use';

ALTER TABLE template_draft_rules
  ADD CONSTRAINT fk_template_draft_rules_gamemode FOREIGN KEY (game_mode_id) REFERENCES game_modes(id) ON DELETE SET NULL;

-- Unique constraint on template code
ALTER TABLE template_draft_rules
  ADD CONSTRAINT uniq_template_draft_rules_code UNIQUE (code);

-- constrains
ALTER TABLE template_draft_rules
  ADD CONSTRAINT reserved_time_positive CHECK (reserved_time > 0);

-- New Table: template_draft_rule_entries --------------------------------------------
CREATE TABLE IF NOT EXISTS template_draft_rule_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL,
  sequence_index int NOT NULL, -- group order (1,2,3...)
  action_type varchar(20) NOT NULL, -- enum('ban','pick')
  team_side varchar(50), -- enum('radiant','dire') -- who acts
  count int, -- how many consecutive actions (e.g., 4 for "Ban 4")
  per_action_seconds int, -- optional override
  note text, -- optional note/label (ex: "Initial bans")
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE template_draft_rule_entries IS 'Entries (steps) that compose a template draft rule.';
COMMENT ON COLUMN template_draft_rule_entries.action_type IS 'Action type enum: ''ban'' or ''pick''';
COMMENT ON COLUMN template_draft_rule_entries.team_side IS 'Team side enum: ''radiant'' or ''dire''';

ALTER TABLE template_draft_rule_entries
  ADD CONSTRAINT fk_template_draft_rule_entries_rule FOREIGN KEY (rule_id) REFERENCES template_draft_rules(id) ON DELETE CASCADE;

-- Unique constraint: one sequence index per rule
ALTER TABLE template_draft_rule_entries
  ADD CONSTRAINT uniq_template_draft_rule_entries_rule_seq UNIQUE (rule_id, sequence_index);
