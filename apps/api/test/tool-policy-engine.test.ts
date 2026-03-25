import { describe, expect, it } from 'vitest';
import { ToolPolicyEngine } from '../src/services/tool-policy-engine.js';

describe('ToolPolicyEngine', () => {
  const engine = new ToolPolicyEngine();

  it('denies blocked tools', () => {
    const result = engine.evaluate('send.money', {});
    expect(result.status).toBe('deny');
  });

  it('requires approval for risky outbound tools', () => {
    const result = engine.evaluate('webhook.send', { url: 'https://example.com/hook' });
    expect(result.status).toBe('require_approval');
  });

  it('allows safe tools', () => {
    const result = engine.evaluate('quote.generate', {});
    expect(result.status).toBe('allow');
  });
});
