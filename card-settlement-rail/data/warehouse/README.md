# Local warehouse

The warehouse layer is dbt + PostgreSQL and is intentionally isolated from production credentials.

## Prerequisites

- PostgreSQL 15+
- Python 3.10+
- dbt-postgres

## Local setup

From `card-settlement-rail/data/warehouse`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install dbt-postgres
export DBT_HOST=localhost DBT_PORT=5432 DBT_USER=postgres DBT_PASSWORD=postgres DBT_DBNAME=card_settlement_rail DBT_SCHEMA=analytics

dbt debug --profiles-dir .
dbt run --profiles-dir .
```

Apply the SQL migrations and development seeds to a **local** PostgreSQL database first. Never point `profiles.yml` at production/Supabase credentials during development.

The staging models read `public.transactions` and `public.settlements`; marts materialize into the configured `analytics` schema. `profiles.yml` uses environment variables so credentials are not committed.
