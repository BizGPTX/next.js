import type { ToolPolicyDecision } from '@bizgptx/common';

const blockedTools = new Set(['delete.resource', 'send.money', 'email.bulk']);
const approvalRequired = new Set(['webhook.send', 'invoice.send', 'booking.confirm']);

export class ToolPolicyEngine {
  evaluate(toolName: string, payload: Record<string, unknown>): ToolPolicyDecision {
    if (blockedTools.has(toolName)) {
      return { status: 'deny', reason: `${toolName} is blocked by default policy` };
    }

    if (approvalRequired.has(toolName)) {
      return {
        status: 'require_approval',
        reason: `${toolName} requires operator approval due to outbound commitment risk`,
      };
    }

    if (toolName === 'webhook.send' && typeof payload.url === 'string' && !payload.url.startsWith('https://')) {
      return { status: 'deny', reason: 'Outbound webhook requires HTTPS URL' };
    }

    return { status: 'allow' };
  }
}
