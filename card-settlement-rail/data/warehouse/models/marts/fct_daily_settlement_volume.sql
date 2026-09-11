select
  date_trunc('day', occurred_at)::date as settlement_day,
  merchant_id,
  currency,
  count(*)::bigint as transaction_count,
  sum(amount)::numeric(38,18) as transaction_volume,
  count(*) filter (where status='settled')::bigint as settled_transaction_count,
  sum(amount) filter (where status='settled')::numeric(38,18) as settled_volume
from {{ ref('stg_transactions') }}
group by 1,2,3
