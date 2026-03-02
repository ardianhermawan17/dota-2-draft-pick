-- Enable extensions -----------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- provides gen_random_uuid()

-- Schemas (optional) ----------------------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS dota2-draft-plan;  -- uncomment if you want a dedicated schema and prefix tables with app.

-- Table: users ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(200) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  display_name varchar(100),
  avatar_url varchar(255),
  role varchar NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

COMMENT ON TABLE users IS 'Application users';
COMMENT ON COLUMN users.role IS 'Role for access control. Allowed: ''user'', ''admin''. See CHECK constraint below.';
-- enforce roles
ALTER TABLE users
  ADD CONSTRAINT users_role_check CHECK (role IN ('user','admin'));

COMMENT ON COLUMN users.email IS 'Unique email used for sign-in';