# Operator Runbook

## Restart Tenant Runtime
1. Open dashboard tenant detail.
2. Click restart (or call `/api/tenants/:id/restart`).
3. Verify tenant status and `/health` for API/provisioner.

## Approval Queue Handling
1. Open `/approvals`.
2. Inspect tool payload and conversation context.
3. Approve or deny with reason.
4. Verify audit trail export for compliance.

## Incident Response (Channel Abuse)
1. Disable tenant channel integration.
2. Remove offending identity from allowlist.
3. Export audit events for time window and retain immutable copy.
