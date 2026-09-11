# Card Settlement SDK for Python

Small dependency-free Python client for the Card Settlement Rail API. Credentials are passed at runtime; none are stored in source.

```python
from card_settlement import CardSettlementClient
client = CardSettlementClient('https://api.example.invalid', api_key='runtime-key')
client.payout('merchant_123', '10000', 'USD', 'acct_123')
```

Round 1 does not publish to PyPI or call live APIs.
