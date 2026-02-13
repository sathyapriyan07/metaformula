-- Optional: Materialized season statistics table for faster reads
-- This is an enhancement to cache calculated statistics
-- Run this in Supabase SQL Editor if you want to optimize performance further

-- Create season_stats table
CREATE TABLE IF NOT EXISTS season_stats (
  season_id BIGINT PRIMARY KEY REFERENCES seasons(id) ON DELETE CASCADE,
  total_races INTEGER NOT NULL DEFAULT 0,
  unique_winners INTEGER NOT NULL DEFAULT 0,
  most_wins_driver_id BIGINT REFERENCES drivers(id) ON DELETE SET NULL,
  most_wins_count INTEGER NOT NULL DEFAULT 0,
  most_podiums_driver_id BIGINT REFERENCES drivers(id) ON DELETE SET NULL,
  most_podiums_count INTEGER NOT NULL DEFAULT 0,
  total_laps INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE season_stats ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read" ON season_stats FOR SELECT USING (true);

-- Admin write policy
CREATE POLICY "Admin write" ON season_stats
  FOR ALL
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Function to recalculate season statistics
CREATE OR REPLACE FUNCTION recalculate_season_stats(p_season_id BIGINT)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_races INTEGER;
  v_unique_winners INTEGER;
  v_most_wins_driver_id BIGINT;
  v_most_wins_count INTEGER;
  v_most_podiums_driver_id BIGINT;
  v_most_podiums_count INTEGER;
  v_total_laps INTEGER;
BEGIN
  -- Total races
  SELECT COUNT(*), COALESCE(SUM(laps), 0)
  INTO v_total_races, v_total_laps
  FROM races
  WHERE season_id = p_season_id;

  -- Unique winners
  SELECT COUNT(DISTINCT driver_id)
  INTO v_unique_winners
  FROM race_results_positions rrp
  INNER JOIN races r ON r.id = rrp.race_id
  WHERE r.season_id = p_season_id AND rrp.position = 1;

  -- Most wins driver
  SELECT driver_id, COUNT(*)
  INTO v_most_wins_driver_id, v_most_wins_count
  FROM race_results_positions rrp
  INNER JOIN races r ON r.id = rrp.race_id
  WHERE r.season_id = p_season_id AND rrp.position = 1
  GROUP BY driver_id
  ORDER BY COUNT(*) DESC
  LIMIT 1;

  -- Most podiums driver
  SELECT driver_id, COUNT(*)
  INTO v_most_podiums_driver_id, v_most_podiums_count
  FROM race_results_positions rrp
  INNER JOIN races r ON r.id = rrp.race_id
  WHERE r.season_id = p_season_id AND rrp.position <= 3
  GROUP BY driver_id
  ORDER BY COUNT(*) DESC
  LIMIT 1;

  -- Upsert into season_stats
  INSERT INTO season_stats (
    season_id,
    total_races,
    unique_winners,
    most_wins_driver_id,
    most_wins_count,
    most_podiums_driver_id,
    most_podiums_count,
    total_laps,
    last_updated
  ) VALUES (
    p_season_id,
    v_total_races,
    v_unique_winners,
    v_most_wins_driver_id,
    COALESCE(v_most_wins_count, 0),
    v_most_podiums_driver_id,
    COALESCE(v_most_podiums_count, 0),
    v_total_laps,
    NOW()
  )
  ON CONFLICT (season_id) DO UPDATE SET
    total_races = EXCLUDED.total_races,
    unique_winners = EXCLUDED.unique_winners,
    most_wins_driver_id = EXCLUDED.most_wins_driver_id,
    most_wins_count = EXCLUDED.most_wins_count,
    most_podiums_driver_id = EXCLUDED.most_podiums_driver_id,
    most_podiums_count = EXCLUDED.most_podiums_count,
    total_laps = EXCLUDED.total_laps,
    last_updated = NOW();
END;
$$;

-- Trigger to auto-recalculate stats when race results change
CREATE OR REPLACE FUNCTION trigger_recalculate_season_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_season_id BIGINT;
BEGIN
  -- Get season_id from the race
  IF TG_OP = 'DELETE' THEN
    SELECT season_id INTO v_season_id FROM races WHERE id = OLD.race_id;
  ELSE
    SELECT season_id INTO v_season_id FROM races WHERE id = NEW.race_id;
  END IF;

  -- Recalculate stats for this season
  IF v_season_id IS NOT NULL THEN
    PERFORM recalculate_season_stats(v_season_id);
  END IF;

  RETURN NULL;
END;
$$;

-- Create trigger on race_results_positions
DROP TRIGGER IF EXISTS trigger_race_results_stats ON race_results_positions;
CREATE TRIGGER trigger_race_results_stats
AFTER INSERT OR UPDATE OR DELETE ON race_results_positions
FOR EACH ROW
EXECUTE FUNCTION trigger_recalculate_season_stats();

-- Create trigger on races (for laps updates)
DROP TRIGGER IF EXISTS trigger_races_stats ON races;
CREATE TRIGGER trigger_races_stats
AFTER INSERT OR UPDATE OR DELETE ON races
FOR EACH ROW
EXECUTE FUNCTION trigger_recalculate_season_stats();

-- Initial calculation for all existing seasons
DO $$
DECLARE
  season_record RECORD;
BEGIN
  FOR season_record IN SELECT id FROM seasons LOOP
    PERFORM recalculate_season_stats(season_record.id);
  END LOOP;
END;
$$;
