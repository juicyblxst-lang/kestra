# Card Settlement SDK for Go

Dependency-free Go client using `net/http`. Runtime API credentials are never committed.

```go
client := cardsettlement.Client{BaseURL: "https://api.example.invalid", APIKey: os.Getenv("CSR_API_KEY")}
var result map[string]any
err := client.Payout(ctx, cardsettlement.PayoutRequest{MerchantID:"merchant_123", Amount:"10000", Currency:"USD", Destination:"acct_123"}, &result)
```

Round 1 does not publish a module or call live APIs.
