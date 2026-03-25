# Threat Model (MVP)

## Assets
- Tenant conversation data and PII
- Tool execution rights and outbound integrations
- Operator credentials and approvals
- Tenant secrets (Telegram/OpenAI/internal signing keys)

## Trust Boundaries
1. Public channels (Telegram inbound) -> API webhook boundary
2. Operator dashboard -> API (authenticated boundary)
3. API -> Provisioner/OpenClaw internal services (HMAC signed internal boundary)
4. API -> Postgres/Redis private network boundary
5. Per-tenant OpenClaw runtime isolated to tenant network

## Key Threats + Mitigations
- **Cross-tenant data access:** per-tenant IDs on all records + isolated tenant networks and volumes.
- **Prompt injection/tool abuse:** ToolPolicyEngine blocks dangerous tools and enforces approvals on risky outbound actions.
- **Webhook spoofing/internal service impersonation:** HMAC signatures (`x-internal-signature`, timestamp) required on internal routes.
- **Message flood/DoS:** rate limits on inbound channel endpoints.
- **Tampering with logs:** append-only audit_events with hash chaining.
- **Untrusted payload injection:** schema validation with Zod, strict TypeScript, and content treated as untrusted.
