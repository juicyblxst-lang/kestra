CREATE TABLE IF NOT EXISTS ledger_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES accounts(id),
  code text NOT NULL UNIQUE,
  currency char(3) NOT NULL,
  balance numeric(38,18) NOT NULL DEFAULT 0,
  available_balance numeric(38,18) NOT NULL DEFAULT 0,
  version bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (available_balance <= balance)
);
CREATE TABLE IF NOT EXISTS ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ledger_account_id uuid NOT NULL REFERENCES ledger_accounts(id),
  transaction_id uuid,
  entry_type text NOT NULL CHECK (entry_type IN ('debit','credit','hold','release','fee','adjustment')),
  amount numeric(38,18) NOT NULL CHECK (amount > 0),
  currency char(3) NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ledger_entries_account_created_idx ON ledger_entries(ledger_account_id, created_at);
