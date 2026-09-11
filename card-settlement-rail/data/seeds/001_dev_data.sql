INSERT INTO accounts (external_id, account_type, legal_name, country_code, currency) VALUES
('mrc_dev_001','merchant','Acme Retail Ltd','US','USD'),
('mrc_dev_002','merchant','Northstar Goods Inc','US','USD'),
('mrc_dev_003','merchant','Harbor Market LLC','GB','USD'),
('mrc_dev_004','merchant','Summit Commerce Ltd','CA','USD'),
('mrc_dev_005','merchant','Cedar Digital Co','US','USD'),
('acq_dev_001','acquirer','Atlas Acquiring Bank','US','USD'),
('acq_dev_002','acquirer','Continental Acquiring','GB','USD'),
('acq_dev_003','acquirer','Frontier Merchant Services','CA','USD'),
('iss_dev_001','issuer','Metro Card Bank','US','USD'),
('iss_dev_002','issuer','Union Issuing Bank','GB','USD'),
('iss_dev_003','issuer','Pioneer Issuing Bank','CA','USD')
ON CONFLICT (external_id) DO UPDATE SET legal_name=EXCLUDED.legal_name;

INSERT INTO ledger_accounts (account_id, code, currency)
SELECT id, external_id || ':settlement', currency FROM accounts
WHERE account_type IN ('merchant','acquirer','issuer')
ON CONFLICT (code) DO NOTHING;

INSERT INTO transactions (external_id, merchant_id, acquirer_id, issuer_id, amount, currency, status, occurred_at, metadata)
SELECT
  'txn_dev_' || lpad(g::text, 4, '0'),
  (SELECT id FROM accounts WHERE external_id='mrc_dev_' || lpad(((g-1)%5+1)::text,3,'0')),
  (SELECT id FROM accounts WHERE external_id='acq_dev_' || lpad(((g-1)%3+1)::text,3,'0')),
  (SELECT id FROM accounts WHERE external_id='iss_dev_' || lpad(((g-1)%3+1)::text,3,'0')),
  round((25 + ((g * 137) % 4975))::numeric, 2),
  'USD',
  CASE g % 7 WHEN 0 THEN 'authorized' WHEN 1 THEN 'captured' WHEN 2 THEN 'cleared' WHEN 3 THEN 'settled' WHEN 4 THEN 'reversed' WHEN 5 THEN 'failed' ELSE 'disputed' END,
  now() - make_interval(days => (g % 30), hours => (g % 24)),
  jsonb_build_object('seed',true,'sequence',g)
FROM generate_series(1,100) AS g
ON CONFLICT (external_id) DO NOTHING;
