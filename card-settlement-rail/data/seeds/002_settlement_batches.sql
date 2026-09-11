WITH tx_grouped AS (
  SELECT t.*, ((row_number() OVER (ORDER BY t.external_id) - 1)::integer / 10) + 1 AS batch_no
  FROM transactions t
  WHERE t.external_id LIKE 'txn_dev_%'
), batch_totals AS (
  SELECT batch_no, count(*)::integer AS transaction_count, sum(amount) AS gross_amount
  FROM tx_grouped GROUP BY batch_no
)
INSERT INTO settlement_batches (batch_reference, acquirer_id, settlement_date, currency, transaction_count, gross_amount, net_amount, status)
SELECT
  'batch_dev_' || lpad(bt.batch_no::text,3,'0'),
  (SELECT id FROM accounts WHERE external_id='acq_dev_' || lpad((((bt.batch_no-1)%3)+1)::text,3,'0')),
  current_date - (bt.batch_no-1), 'USD', bt.transaction_count, bt.gross_amount,
  round(bt.gross_amount * 0.9975, 2),
  (ARRAY['open','ready','submitted','processing','settled','failed','reconciled','ready','settled','processing'])[bt.batch_no]
FROM batch_totals bt
ON CONFLICT (batch_reference) DO UPDATE SET
  transaction_count=EXCLUDED.transaction_count,
  gross_amount=EXCLUDED.gross_amount,
  net_amount=EXCLUDED.net_amount,
  status=EXCLUDED.status;

WITH batch_ranked AS (
  SELECT b.*, row_number() OVER (ORDER BY b.batch_reference) AS rn
  FROM settlement_batches b
  WHERE b.batch_reference LIKE 'batch_dev_%'
)
INSERT INTO settlements (batch_id, merchant_id, amount, fees, net_amount, currency, status, settlement_reference, settled_at)
SELECT
  b.id,
  (SELECT id FROM accounts WHERE external_id='mrc_dev_' || lpad((((b.rn-1)%5)+1)::text,3,'0')),
  b.gross_amount,
  round(b.gross_amount * 0.0025,2),
  round(b.gross_amount * 0.9975,2),
  'USD',
  CASE WHEN b.status IN ('settled','reconciled') THEN 'settled' WHEN b.status='failed' THEN 'failed' ELSE 'pending' END,
  CASE WHEN b.status IN ('settled','reconciled') THEN 'set_' || b.batch_reference ELSE NULL END,
  CASE WHEN b.status IN ('settled','reconciled') THEN now() - interval '1 day' ELSE NULL END
FROM batch_ranked b
ON CONFLICT (settlement_reference) DO UPDATE SET status=EXCLUDED.status, settled_at=EXCLUDED.settled_at;
