CREATE TABLE IF NOT EXISTS settlement_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_reference text NOT NULL UNIQUE,
  acquirer_id uuid NOT NULL REFERENCES accounts(id),
  settlement_date date NOT NULL,
  currency char(3) NOT NULL,
  transaction_count integer NOT NULL DEFAULT 0 CHECK (transaction_count >= 0),
  gross_amount numeric(38,18) NOT NULL DEFAULT 0,
  net_amount numeric(38,18) NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('open','ready','submitted','processing','settled','failed','reconciled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS settlement_batches_date_status_idx ON settlement_batches(settlement_date, status);
