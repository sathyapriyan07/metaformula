-- Delete all imported data (run in Supabase SQL Editor)
-- Order matters due to foreign key constraints

-- Drop and recreate trigger to avoid errors
DROP TRIGGER IF EXISTS recalculate_season_stats ON race_results_positions;
DROP TRIGGER IF EXISTS recalculate_season_stats_on_race ON races;

DELETE FROM race_results_positions;
DELETE FROM driver_standings;
DELETE FROM constructor_standings;
DELETE FROM races;
DELETE FROM driver_teams;
DELETE FROM drivers;
DELETE FROM teams;
DELETE FROM circuits;
DELETE FROM seasons;
DELETE FROM timeline_events;
DELETE FROM media;
