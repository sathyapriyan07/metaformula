-- Add status column to tables for draft/publish system
-- Run this in Supabase SQL Editor

-- Add status to drivers table
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- Add status to teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- Add status to circuits table
ALTER TABLE circuits 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- Add status to seasons table
ALTER TABLE seasons 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_circuits_status ON circuits(status);
CREATE INDEX IF NOT EXISTS idx_seasons_status ON seasons(status);
