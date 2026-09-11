CREATE TABLE IF NOT EXISTS clearing_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES settlement_batches(id),
  file_reference text NOT NULL UNIQUE,
  file_type text NOT NULL CHECK (file_type IN ('presentment','clearing','settlement')),
  storage_uri text,
  sha256 text NOT NULL,
  record_count integer NOT NULL DEFAULT 0 CHECK (record_count >= 0),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','validated','processed','rejected')),
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
CREATE INDEX IF NOT EXISTS clearing_files_batch_idx ON clearing_files(batch_id);
