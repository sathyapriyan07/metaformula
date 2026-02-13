-- Performance indexes for season statistics calculations
-- Run this in Supabase SQL Editor to optimize query performance

-- Index for filtering race results by season
CREATE INDEX IF NOT EXISTS idx_race_results_season 
ON race_results_positions(driver_id, position) 
WHERE position <= 3;

-- Index for races by season
CREATE INDEX IF NOT EXISTS idx_races_season_id 
ON races(season_id);

-- Composite index for race results joins
CREATE INDEX IF NOT EXISTS idx_race_results_race_driver 
ON race_results_positions(race_id, driver_id, position);

-- Index for driver lookups
CREATE INDEX IF NOT EXISTS idx_drivers_id 
ON drivers(id);

-- Analyze tables for query optimization
ANALYZE races;
ANALYZE race_results_positions;
ANALYZE drivers;
