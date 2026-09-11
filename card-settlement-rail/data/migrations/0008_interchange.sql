CREATE TABLE IF NOT EXISTS interchange_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES transactions(id),
  network_code text NOT NULL,
  rate_bps numeric(12,4) NOT NULL CHECK (rate_bps >= 0),
  fee_amount numeric(38,18) NOT NULL CHECK (fee_amount >= 0),
  currency char(3) NOT NULL,
  assessment_amount numeric(38,18) NOT NULL DEFAULT 0 CHECK (assessment_amount >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(transaction_id, network_code)
);
CREATE INDEX IF NOT EXISTS interchange_created_idx ON interchange_records(created_at);
