import crypto from 'node:crypto';

export interface SecretsProvider {
  generateTenantSecrets(tenantId: string): Record<string, string>;
}

export class EnvSecretsProvider implements SecretsProvider {
  generateTenantSecrets(tenantId: string): Record<string, string> {
    return {
      OPENAI_API_KEY: `placeholder-${tenantId}`,
      TELEGRAM_BOT_TOKEN: `telegram-token-${tenantId}`,
      INTERNAL_SIGNING_KEY: crypto.randomBytes(32).toString('hex'),
    };
  }
}
