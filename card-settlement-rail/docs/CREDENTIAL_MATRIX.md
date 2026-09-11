# Environment variables

| Variable | Scope | Format | Source | Mock behavior | Rotation |
|---|---|---|---|---|---|
| `ALCHEMY_API_KEY` | core/edge/contracts | `alch_(test|main)_[a-z0-9]{24}` | RPC provider | Fixture RPC | 90d / Infra |
| `DATABASE_URL` | core/workers | PostgreSQL URL | Postgres provider | Local Postgres | 90d / Infra |
| `REDIS_URL` | core/workers | Redis URL | Redis provider | Local Redis | 90d / Infra |
| `JWT_SECRET` | core/auth | 32+ chars | Secret manager | Local deterministic secret | 90d / Security |
| `API_KEY_PEPPER` | core/auth | 32+ chars | Secret manager | Local deterministic secret | 90d / Security |
| `INTERNAL_AUTH_TOKEN` | core/edge | 16+ chars | Secret manager | Local token | 90d / Platform |
| `WORKER_AUTH_TOKEN` | workers | 16+ chars | Secret manager | Local token | 90d / Platform |
| `WEBHOOK_SIGNING_KEY` | core/webhook/edge | 32+ chars | Secret manager | Local signing key | 90d / Security |
| `CIRCLE_API_KEY_SANDBOX` | payout/chargeback | provider token | Circle | Fixture response | 90d / Payments |
| `CIRCLE_ENTITY_ID_SANDBOX` | payout | provider ID | Circle | Fixture response | 90d / Payments |
| `CIRCLE_WEBHOOK_SECRET` | webhook | provider secret | Circle | Fixture verification | 90d / Payments |
| `MOONPAY_API_KEY_SANDBOX` | edge | provider token | MoonPay | Fixture quote | 90d / Payments |
| `MOONPAY_WEBHOOK_SECRET` | webhook | provider secret | MoonPay | Fixture verification | 90d / Payments |
| `TRANSAK_API_KEY_SANDBOX` | edge | provider token | Transak | Fixture quote | 90d / Payments |
| `TRANSAK_WEBHOOK_SECRET` | webhook | provider secret | Transak | Fixture verification | 90d / Payments |
| `PERSONA_API_KEY` | compliance | provider token | Persona | Passing fixture | 90d / Compliance |
| `PERSONA_WEBHOOK_SECRET` | webhook | provider secret | Persona | Fixture verification | 90d / Compliance |
| `OPENSANCTIONS_DATA_URL` | sanctions | HTTPS URL | OpenSanctions | Local fixture | 90d / Compliance |
| `CHAINALYSIS_API_KEY` | aml | provider token | Chainalysis | Local screening fixture | 90d / Compliance |
| `CHAINALYSIS_WEBHOOK_SECRET` | webhook | provider secret | Chainalysis | Fixture verification | 90d / Compliance |
| `ELLIPTIC_API_KEY` | aml | provider token | Elliptic | Local screening fixture | 90d / Compliance |
| `TRM_LABS_API_KEY` | aml | provider token | TRM Labs | Local screening fixture | 90d / Compliance |
| `AFRICASTALKING_API_KEY_SANDBOX` | payout | provider token | Africa's Talking | Fixture SMS result | 90d / Payments |
| `MTN_MOMO_API_KEY_SANDBOX` | payout | provider token | MTN MoMo | Fixture payment result | 90d / Payments |
| `MPESA_CONSUMER_KEY_SANDBOX` | payout | provider key | M-Pesa | Fixture STK result | 90d / Payments |
| `RESEND_API_KEY` | notification | `re_*` | Resend | Queued fixture | 90d / Platform |
| `TWILIO_AUTH_TOKEN` | notification | provider token | Twilio | Queued fixture | 90d / Platform |
| `SENTRY_DSN` | observability | HTTPS DSN | Sentry | No-op | 90d / Observability |
| `GRAFANA_CLOUD_API_KEY` | observability | provider token | Grafana Cloud | No-op | 90d / Observability |
| `UPTIMEROBOT_API_KEY` | observability | provider token | UptimeRobot | No-op | 90d / Observability |
| `POSTHOG_API_KEY` | observability | provider token | PostHog | No-op | 90d / Product |
| `SUPABASE_URL` | data/apps | Supabase URL | Supabase | Local Postgres | 90d / Data |
| `SUPABASE_ANON_KEY` | apps | provider token | Supabase | Local fixture | 90d / Data |
| `SUPABASE_SERVICE_ROLE_KEY` | server | provider token | Supabase | Local fixture | 90d / Data |
| `SUPABASE_JWT_SECRET` | server | 32+ chars | Supabase | Local secret | 90d / Data |
| `SUPABASE_DB_URL` | core | PostgreSQL URL | Supabase | Local Postgres | 90d / Data |
| `UPSTASH_REDIS_REST_URL` | workers | HTTPS URL | Upstash | Local Redis | 90d / Platform |
| `UPSTASH_REDIS_REST_TOKEN` | workers | provider token | Upstash | Local Redis | 90d / Platform |
| `QSTASH_TOKEN` | webhook/workers | provider token | Upstash | In-memory queue | 90d / Platform |
| `QSTASH_CURRENT_SIGNING_KEY` | webhook/workers | provider token | Upstash | Fixture verification | 90d / Platform |
| `QSTASH_NEXT_SIGNING_KEY` | webhook/workers | provider token | Upstash | Fixture verification | 90d / Platform |
| `R2_ACCESS_KEY_ID` | storage | provider key | Cloudflare | Local MinIO | 90d / Storage |
| `R2_SECRET_ACCESS_KEY` | storage | provider secret | Cloudflare | Local MinIO | 90d / Storage |
| `R2_BUCKET_NAME` | storage | bucket name | Cloudflare | Local bucket | N/A / Storage |
| `KV_NAMESPACE_ID` | edge | 32 hex chars | Cloudflare | In-memory KV | 90d / Platform |
| `EXPO_TOKEN` | mobile | provider token | Expo | No-op | 90d / Mobile |
| `WALLETCONNECT_PROJECT_ID` | web/mobile | 32 hex chars | WalletConnect | Static local ID | 90d / Web |
| `ETHERSCAN_API_KEY` | contracts | provider token | Etherscan | No-op | 90d / Contracts |
| `GH_PACKAGES_TOKEN` | SDK | provider token | GitHub Packages | Local package link | 90d / Release |
| `LAYERZERO_ENDPOINT` | bridges | HTTPS URL | LayerZero | Bridge fixture | 90d / Protocol |
| `WORMHOLE_ENDPOINT` | bridges | HTTPS URL | Wormhole | Bridge fixture | 90d / Protocol |
| `AXELAR_API_KEY` | bridges | provider token | Axelar | Bridge fixture | 90d / Protocol |
| `OPERATOR_PRIVATE_KEY` | contracts | 64-byte hex key | Secret manager/HSM | Dry-run only | Per deployment / Treasury |
| `DEPLOYER_PRIVATE_KEY` | contracts | 64-byte hex key | Secret manager/HSM | Dry-run only | Per deployment / Release |
| `ORACLE_PRIVATE_KEY` | contracts | 64-byte hex key | Secret manager/HSM | Dry-run only | Per deployment / Oracle |
| `SIWE_DOMAIN` | auth | hostname | Application config | localhost | N/A / Platform |
| `EIP712_DOMAIN_NAME` | auth/contracts | string | Application config | CardSettlementRail | N/A / Contracts |
| `EIP712_DOMAIN_VERSION` | auth/contracts | version | Application config | `1` | N/A / Contracts |
| `EIP712_DOMAIN_CHAIN_ID` | auth/contracts | positive integer | Chain config | `84532` | Chain change / Contracts |
| `EIP712_DOMAIN_VERIFYING_CONTRACT` | auth/contracts | Ethereum address | Deployment output | Local zero address fixture | Deployment / Contracts |
