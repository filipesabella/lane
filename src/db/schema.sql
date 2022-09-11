CREATE OR REPLACE FUNCTION denormalize_tags()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL AS
$$
BEGIN
  DELETE FROM lane_tags;

  INSERT INTO lane_tags
  SELECT UNNEST(lane_notes.tags) FROM lane_notes
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS denormalize_tags on lane_notes;

CREATE TRIGGER denormalize_tags
  AFTER UPDATE OR INSERT OR DELETE
  ON lane_notes
  FOR EACH ROW
  EXECUTE PROCEDURE denormalize_tags();
