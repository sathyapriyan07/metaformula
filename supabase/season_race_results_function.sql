-- Optimized SQL function for season race results
-- Run this in Supabase SQL Editor for best performance

CREATE OR REPLACE FUNCTION get_season_race_results(p_season_id BIGINT)
RETURNS TABLE (
  race_id BIGINT,
  circuit_id BIGINT,
  circuit_name TEXT,
  country TEXT,
  race_date TEXT,
  winner_name TEXT,
  winner_image TEXT,
  team_name TEXT,
  team_logo TEXT,
  laps INTEGER,
  race_time TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id AS race_id,
    r.circuit_id,
    c.circuit_name,
    c.country,
    NULL::TEXT AS race_date,
    d.name AS winner_name,
    d.profile_image_url AS winner_image,
    t.team_name,
    t.logo_url AS team_logo,
    COALESCE(rrp.laps, r.laps) AS laps,
    rrp.time AS race_time
  FROM races r
  INNER JOIN circuits c ON c.id = r.circuit_id
  LEFT JOIN race_results_positions rrp ON rrp.race_id = r.id AND rrp.position = 1
  LEFT JOIN drivers d ON d.id = rrp.driver_id
  LEFT JOIN teams t ON t.id = rrp.team_id
  WHERE r.season_id = p_season_id
  ORDER BY r.id ASC;
END;
$$;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_race_results_race_position 
ON race_results_positions(race_id, position) 
WHERE position = 1;

CREATE INDEX IF NOT EXISTS idx_races_season_circuit 
ON races(season_id, circuit_id);
