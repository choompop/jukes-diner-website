-- Supabase schema for Juke's Diner brain dumps
-- Run this in the Supabase SQL editor to set up the table

CREATE TABLE IF NOT EXISTS dumps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_name TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  message TEXT NOT NULL,
  ai_response TEXT
);

CREATE INDEX IF NOT EXISTS idx_dumps_user_name ON dumps(user_name);
CREATE INDEX IF NOT EXISTS idx_dumps_category ON dumps(category);
CREATE INDEX IF NOT EXISTS idx_dumps_timestamp ON dumps(timestamp DESC);
