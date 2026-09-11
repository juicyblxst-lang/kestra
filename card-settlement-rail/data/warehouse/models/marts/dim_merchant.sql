select
  id as merchant_id,
  external_id as merchant_reference,
  legal_name,
  country_code,
  currency,
  status,
  created_at,
  updated_at
from public.accounts
where account_type='merchant'
