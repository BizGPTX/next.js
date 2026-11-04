import Fastify from 'fastify';
import { z } from 'zod';
import { generateTenantComposeTemplate } from './template.js';
import { EnvSecretsProvider } from './secrets-provider.js';

const app = Fastify({ logger: true });
const secretsProvider = new EnvSecretsProvider();

app.post('/provision', async (req) => {
  const body = z
    .object({ tenantId: z.string().uuid(), telegramEnabled: z.boolean().default(true), whatsappEnabled: z.boolean().default(false) })
    .parse(req.body);

  const secrets = secretsProvider.generateTenantSecrets(body.tenantId);
  const compose = generateTenantComposeTemplate({
    tenantId: body.tenantId,
    image: 'ghcr.io/bizgptx/openclaw:latest',
    internalSigningKey: secrets.INTERNAL_SIGNING_KEY,
    telegramEnabled: body.telegramEnabled,
    whatsappEnabled: body.whatsappEnabled,
  });

  return { status: 'provisioned', compose, secrets: Object.keys(secrets) };
});

app.get('/health', async () => ({ ok: true }));
app.listen({ host: '0.0.0.0', port: Number(process.env.PORT ?? 4010) });
