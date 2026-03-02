import { describe, expect, it } from 'vitest';
import { generateTenantComposeTemplate } from '../../provisioner/src/template.js';
import { ToolPolicyEngine } from '../src/services/tool-policy-engine.js';
import { createInvoiceDraft, generateQuote } from '../src/tools/electrician-tools.js';

describe('MVP integration flow', () => {
  it('provisions tenant and produces quote plus approval requirement', () => {
    const tenantId = '11111111-1111-4111-8111-111111111111';
    const compose = generateTenantComposeTemplate({
      tenantId,
      image: 'openclaw:latest',
      internalSigningKey: 'devkey',
      telegramEnabled: true,
      whatsappEnabled: false,
    });
    expect(compose).toContain(`openclaw-${tenantId}`);

    const quote = generateQuote({ workType: 'switchboard fault', urgency: 'standard' });
    const draft = createInvoiceDraft({ customerName: 'ACME', quoteTotal: quote.total, description: 'Switchboard fault repair' });
    expect(draft.total).toBeGreaterThan(quote.total);

    const engine = new ToolPolicyEngine();
    const decision = engine.evaluate('webhook.send', { url: 'https://example.com/booking' });
    expect(decision.status).toBe('require_approval');
  });
});
