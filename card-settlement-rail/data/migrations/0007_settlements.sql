CREATE TABLE IF NOT EXISTS settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES settlement_batches(id),
  merchant_id uuid NOT NULL REFERENCES accounts(id),
  amount numeric(38,18) NOT NULL CHECK (amount > 0),
  fees numeric(38,18) NOT NULL DEFAULT 0 CHECK (fees >= 0),
  net_amount numeric(38,18) NOT NULL CHECK (net_amount >= 0),
  currency char(3) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','processing','settled','failed','reversed')),
  settlement_reference text UNIQUE,
  settled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS settlements_merchant_date_idx ON settlements(merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS settlements_batch_idx ON settlements(batch_id);
