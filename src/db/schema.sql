CREATE OR REPLACE FUNCTION denormalize_tags()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL AS
$$
BEGIN
  INSERT INTO lane_tags
  SELECT UNNEST(NEW.tags)
  ON CONFLICT ("text") DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS denormalize_tags on lane_notes;

-- might leave trash tags in the db when deleting notes
CREATE TRIGGER denormalize_tags
  AFTER UPDATE OR INSERT
  ON lane_notes
  FOR EACH ROW
  EXECUTE PROCEDURE denormalize_tags();
