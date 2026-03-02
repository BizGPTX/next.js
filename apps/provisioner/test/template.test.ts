import { describe, expect, it } from 'vitest';
import { generateTenantComposeTemplate } from '../src/template.js';

describe('generateTenantComposeTemplate', () => {
  it('builds isolated network and volume names per tenant', () => {
    const yaml = generateTenantComposeTemplate({
      tenantId: '11111111-1111-1111-1111-111111111111',
      image: 'test/openclaw:dev',
      internalSigningKey: 'abc',
      telegramEnabled: true,
      whatsappEnabled: false,
    });

    expect(yaml).toContain('tenant_11111111-1111-1111-1111-111111111111');
    expect(yaml).toContain('internal: true');
  });
});
