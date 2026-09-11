select
  date_trunc('month', occurred_at)::date as reporting_month,
  currency,
  count(*)::bigint as transaction_count,
  sum(amount)::numeric(38,18) as total_transaction_volume,
  count(*) filter (where status='settled')::bigint as settled_transaction_count,
  sum(amount) filter (where status='settled')::numeric(38,18) as settled_volume,
  count(*) filter (where status='disputed')::bigint as disputed_transaction_count
from {{ ref('stg_transactions') }}
group by 1,2
order by 1,2
