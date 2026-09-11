/** Static openapi-typescript output checked into the SDK so builds do not require a live API. */
export interface paths {
  '/payout': { post: { requestBody: { content: {'application/json': PayoutRequest} }; responses: { 202: { content: {'application/json': PayoutAccepted} }; 400: { content: {'application/json': ErrorResponse} } } } };
  '/chargeback': { post: { requestBody: { content: {'application/json': ChargebackRequest} }; responses: { 202: { content: {'application/json': ChargebackResponse} } } } };
  '/chargeback/{id}/represent': { post: { requestBody: { content: {'application/json': RepresentmentRequest} }; responses: { 202: { content: {'application/json': ChargebackResponse} } } } };
  '/represent': { post: { requestBody: { content: {'application/json': RepresentmentRequest} }; responses: { 202: { content: {'application/json': RepresentmentResponse} } } } };
  '/reconcile/{date}': { get: { responses: { 200: { content: {'application/json': ReconciliationResponse} } } } };
}
export interface PayoutRequest { idempotency_key?: string; merchant_id: string; amount: string; currency: string; destination: string; metadata?: Record<string, unknown>; }
export interface PayoutAccepted { accepted: boolean; status: 'queued'; }
export interface ChargebackRequest { transaction_id: string; amount: string; currency: string; reason_code: string; evidence?: Record<string, unknown>; }
export interface ChargebackResponse { id?: string; status?: string; }
export interface RepresentmentRequest { chargeback_id?: string; evidence: Record<string, unknown>; }
export interface RepresentmentResponse { id?: string; status?: string; }
export interface ReconciliationResponse { date: string; records: unknown[]; }
export interface ErrorResponse { error: string; }
