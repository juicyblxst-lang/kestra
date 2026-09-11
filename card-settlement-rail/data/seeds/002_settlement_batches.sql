INSERT INTO settlement_batches (batch_reference, acquirer_id, settlement_date, currency, transaction_count, gross_amount, net_amount, status)
SELECT
  'batch_dev_' || lpad(g::text, 3, '0'),
  (SELECT id FROM accounts WHERE external_id='acq_dev_' || lpad(((g-1)%3+1)::text,3,'0')),
  current_date - (g-1),
  'USD',
  10,
  (SELECT coalesce(sum(amount),0) FROM transactions WHERE external_id IN ('txn_dev_' || lpad(((g-1)*10 + s)::text,4,'0')) FOR UPDATE),
  0,
  CASE g % 10 WHEN 1 THEN 'open' WHEN 2 THEN 'ready' WHEN 3 THEN 'submitted' WHEN 4 THEN 'processing' WHEN 5 THEN 'settled' WHEN 6 THEN 'failed' WHEN 7 THEN 'reconciled' WHEN 8 THEN 'ready' WHEN 9 THEN 'settled' ELSE 'processing' END
FROM generate_series(1,10) AS g
CROSS JOIN LATERAL generate_series(1,10) AS s
GROUP BY g
ON CONFLICT (batch_reference) DO NOTHING;

UPDATE settlement_batches b
SET gross_amount = x.gross_amount,
    net_amount = round(x.gross_amount * 0.9975, 2),
    transaction_count = x.transaction_count
FROM (
  SELECT b2.id,
         count(t.id)::integer AS transaction_count,
         coalesce(sum(t.amount),0) AS gross_amount
  FROM settlement_batches b2
  LEFT JOIN LATERAL (
    SELECT t.* FROM transactions t ORDER BY t.created_at LIMIT 10 OFFSET ((row_number() OVER (ORDER BY b2.batch_reference)-1)*10)
  ) t ON true
  GROUP BY b2.id
) x
WHERE b.id=x.id;

INSERT INTO settlements (batch_id, merchant_id, amount, fees, net_amount, currency, status, settlement_reference, settled_at)
SELECT b.id, m.id, round(b.gross_amount/5,2), round(b.gross_amount*0.0025,2), round(b.gross_amount*0.1975,2), 'USD',
       CASE WHEN b.status IN ('settled','reconciled') THEN 'settled' ELSE 'pending' END,
       CASE WHEN b.status IN ('settled','reconciled') THEN 'set_' || b.batch_reference ELSE NULL END,
       CASE WHEN b.status IN ('settled','reconciled') THEN now() - interval '1 day' ELSE NULL END
FROM settlement_batches b
CROSS JOIN LATERAL (SELECT id FROM accounts WHERE account_type='merchant' ORDER BY external_id LIMIT 1) m
ON CONFLICT (settlement_reference) DO NOTHING;
