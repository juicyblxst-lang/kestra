CREATE TABLE IF NOT EXISTS audit_log (
  id bigserial PRIMARY KEY,
  event_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_type text NOT NULL CHECK (actor_type IN ('user','service','system')),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  previous_hash text NOT NULL DEFAULT repeat('0',64),
  entry_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_log_resource_idx ON audit_log(resource_type, resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_actor_idx ON audit_log(actor_id, created_at DESC);
CREATE OR REPLACE FUNCTION audit_log_compute_hash() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.previous_hash = repeat('0',64) AND EXISTS (SELECT 1 FROM audit_log ORDER BY id DESC LIMIT 1) THEN
    SELECT entry_hash INTO NEW.previous_hash FROM audit_log ORDER BY id DESC LIMIT 1;
  END IF;
  NEW.entry_hash := encode(digest(
    concat_ws('|', NEW.event_id::text, coalesce(NEW.actor_id::text,''), NEW.actor_type, NEW.action,
      NEW.resource_type, NEW.resource_id, NEW.payload::text, NEW.previous_hash, NEW.created_at::text), 'sha256'), 'hex');
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS audit_log_hash_trigger ON audit_log;
CREATE TRIGGER audit_log_hash_trigger BEFORE INSERT ON audit_log FOR EACH ROW EXECUTE FUNCTION audit_log_compute_hash();
