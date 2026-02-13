-- Search performance indexes
-- Run this in Supabase SQL Editor

-- Driver search indexes
CREATE INDEX IF NOT EXISTS idx_drivers_name_search ON drivers USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_drivers_nationality_search ON drivers(nationality);

-- Team search indexes
CREATE INDEX IF NOT EXISTS idx_teams_name_search ON teams USING gin(to_tsvector('english', team_name));
CREATE INDEX IF NOT EXISTS idx_teams_country_search ON teams(base_country);

-- Circuit search indexes
CREATE INDEX IF NOT EXISTS idx_circuits_name_search ON circuits USING gin(to_tsvector('english', circuit_name));
CREATE INDEX IF NOT EXISTS idx_circuits_country_search ON circuits(country);

-- Season search indexes
CREATE INDEX IF NOT EXISTS idx_seasons_year_search ON seasons(year);

-- Timeline search indexes
CREATE INDEX IF NOT EXISTS idx_timeline_title_search ON timeline_events USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_timeline_year_search ON timeline_events(year);
