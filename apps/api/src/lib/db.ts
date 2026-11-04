import { Pool } from 'pg';
import { config } from './config.js';

export const db = new Pool({ connectionString: config.databaseUrl });

export async function runMigrations(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      plan TEXT NOT NULL,
      telegram_enabled BOOLEAN NOT NULL DEFAULT true,
      whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
      status TEXT NOT NULL DEFAULT 'provisioning',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tenant_secrets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      secret_key TEXT NOT NULL,
      secret_value TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(tenant_id, secret_key)
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      session_id TEXT NOT NULL,
      tool_name TEXT NOT NULL,
      payload JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      reason TEXT,
      decided_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      decided_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS chat_identities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      channel TEXT NOT NULL,
      external_user_id TEXT NOT NULL,
      allowlisted BOOLEAN NOT NULL DEFAULT false,
      approved_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(tenant_id, channel, external_user_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      channel TEXT NOT NULL,
      external_user_id TEXT NOT NULL,
      state JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      id BIGSERIAL PRIMARY KEY,
      tenant_id UUID NOT NULL,
      session_id TEXT NOT NULL,
      actor TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload JSONB NOT NULL,
      hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
