ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearing_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE interchange_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY accounts_service_access ON accounts FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY transactions_service_access ON transactions FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY settlements_service_access ON settlements FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY batches_service_access ON settlement_batches FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY ledger_accounts_service_access ON ledger_accounts FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY ledger_entries_service_access ON ledger_entries FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY clearing_files_service_access ON clearing_files FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY interchange_service_access ON interchange_records FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY events_service_access ON events FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
  CREATE POLICY audit_service_access ON audit_log FOR ALL USING (current_setting('request.jwt.claim.role', true) IN ('service_role','admin')) WITH CHECK (current_setting('request.jwt.claim.role', true) IN ('service_role','admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
