CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL UNIQUE,
  merchant_id uuid NOT NULL REFERENCES accounts(id),
  acquirer_id uuid NOT NULL REFERENCES accounts(id),
  issuer_id uuid NOT NULL REFERENCES accounts(id),
  amount numeric(38,18) NOT NULL CHECK (amount > 0),
  currency char(3) NOT NULL,
  status text NOT NULL CHECK (status IN ('authorized','captured','cleared','settled','reversed','failed','disputed')),
  occurred_at timestamptz NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS transactions_merchant_time_idx ON transactions(merchant_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS transactions_status_time_idx ON transactions(status, occurred_at DESC);
