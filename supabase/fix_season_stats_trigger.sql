-- Hotfix for: record "old" has no field "race_id"
-- Applies when trigger_recalculate_season_stats is attached to both:
--   1) races
--   2) race_results_positions
-- Run this once in Supabase SQL Editor.

CREATE OR REPLACE FUNCTION trigger_recalculate_season_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_season_id BIGINT;
  v_new_season_id BIGINT;
BEGIN
  IF TG_TABLE_NAME = 'races' THEN
    IF TG_OP = 'DELETE' THEN
      v_old_season_id := OLD.season_id;
    ELSIF TG_OP = 'UPDATE' THEN
      v_old_season_id := OLD.season_id;
      v_new_season_id := NEW.season_id;
    ELSE
      v_new_season_id := NEW.season_id;
    END IF;
  ELSE
    IF TG_OP = 'DELETE' THEN
      SELECT season_id INTO v_old_season_id FROM races WHERE id = OLD.race_id;
    ELSIF TG_OP = 'UPDATE' THEN
      SELECT season_id INTO v_old_season_id FROM races WHERE id = OLD.race_id;
      SELECT season_id INTO v_new_season_id FROM races WHERE id = NEW.race_id;
    ELSE
      SELECT season_id INTO v_new_season_id FROM races WHERE id = NEW.race_id;
    END IF;
  END IF;

  IF v_old_season_id IS NOT NULL THEN
    PERFORM recalculate_season_stats(v_old_season_id);
  END IF;

  IF v_new_season_id IS NOT NULL AND v_new_season_id <> v_old_season_id THEN
    PERFORM recalculate_season_stats(v_new_season_id);
  END IF;

  RETURN NULL;
END;
$$;
