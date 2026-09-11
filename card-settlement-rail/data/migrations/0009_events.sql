CREATE TABLE IF NOT EXISTS events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, occurred_at),
  UNIQUE (event_id, occurred_at)
) PARTITION BY RANGE (occurred_at);
CREATE TABLE IF NOT EXISTS events_default PARTITION OF events DEFAULT;
CREATE INDEX IF NOT EXISTS events_aggregate_idx ON events(aggregate_type, aggregate_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS events_type_time_idx ON events(event_type, occurred_at DESC);
DO $$
DECLARE
  m date;
  start_m date;
  end_m date;
BEGIN
  FOR m IN SELECT (date_trunc('month', current_date) + (n || ' month')::interval)::date FROM generate_series(-1, 12) AS n LOOP
    start_m := m;
    end_m := (m + interval '1 month')::date;
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS events_%s PARTITION OF events FOR VALUES FROM (%L) TO (%L)',
      to_char(start_m,'YYYY_MM'), start_m, end_m
    );
  END LOOP;
END $$;
