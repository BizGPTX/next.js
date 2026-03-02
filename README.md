# BizGPTX Secure Agent Hosting (AU) + ElectricianGPT Starter Pack

## Architecture
- **apps/api**: Fastify operator API with tenant lifecycle, Telegram inbound handling, approvals, sessions, and immutable audit logs.
- **apps/provisioner**: Tenant OpenClaw compose-template generator + per-tenant secrets bootstrap.
- **apps/dashboard**: Next.js operator UI for tenants, approvals, and session viewing.
- **packages/common**: Shared types/contracts.
- **infra/docker**: Docker Compose orchestration.
- **infra/caddy**: TLS-ready reverse proxy template.

## Quickstart
1. Create `.env` in repo root:
   ```bash
   cp .env.example .env
   ```
2. Start the platform:
   ```bash
   docker compose -f infra/docker/docker-compose.yml up --build
   ```
3. Create a tenant:
   ```bash
   curl -X POST http://localhost/api/tenants \
     -H 'content-type: application/json' \
     -d '{"name":"Sparky AU","plan":"starter","channels":{"telegram":true,"whatsapp":false}}'
   ```
4. Paste Telegram token into tenant secret (MVP uses placeholder provider; replace `TELEGRAM_BOT_TOKEN` in secrets backend).
5. Test chat flow with Telegram webhook payload:
   ```bash
   curl -X POST http://localhost/api/channels/telegram/inbound \
     -H 'content-type: application/json' \
     -d '{"tenantId":"<tenant-id>","message":{"chat":{"id":1},"from":{"id":99},"text":"switchboard fault"}}'
   ```

## Approval Gating Rules
- **Blocked by default:** delete.resource, send.money, email.bulk.
- **Approval required:** webhook.send, invoice.send, booking.confirm.
- **Allowed:** quote.generate, schedule.propose_slots, invoice.create_draft, crm.upsert_lead.

## MVP Known Limitations
- WhatsApp integration is feature-flagged and not active.
- Provisioner currently returns compose output but does not run Docker Engine APIs.
- Dashboard approve/deny actions are read-focused; action buttons are minimal.
- Secrets provider stores placeholders and needs Vault/KMS for production.
