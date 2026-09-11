select
  id as transaction_id,
  external_id as transaction_reference,
  merchant_id,
  acquirer_id,
  issuer_id,
  amount::numeric(38,18) as amount,
  upper(currency) as currency,
  status,
  occurred_at,
  created_at
from public.transactions
