select
  s.id as settlement_id,
  s.batch_id,
  s.merchant_id,
  s.amount::numeric(38,18) as gross_amount,
  s.fees::numeric(38,18) as fees,
  s.net_amount::numeric(38,18) as net_amount,
  upper(s.currency) as currency,
  s.status,
  s.settlement_reference,
  s.settled_at,
  s.created_at
from public.settlements s
