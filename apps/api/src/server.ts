import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { config } from './lib/config.js';
import { runMigrations } from './lib/db.js';
import { internalAuthPlugin } from './plugins/internal-auth.js';
import { tenantRoutes } from './routes/tenants.js';
import { approvalRoutes } from './routes/approvals.js';
import { telegramRoutes } from './routes/telegram.js';
import { auditRoutes } from './routes/audit.js';
import { sessionRoutes } from './routes/sessions.js';

const app = Fastify({ logger: true });

await app.register(jwt, { secret: config.jwtSecret });
await app.register(rateLimit, { global: true, max: config.defaultRateLimitPerMinute, timeWindow: '1 minute' });
await app.register(internalAuthPlugin);

app.get('/health', async () => ({ ok: true }));
await app.register(tenantRoutes, { prefix: '/api' });
await app.register(approvalRoutes, { prefix: '/api' });
await app.register(telegramRoutes, { prefix: '/api' });
await app.register(auditRoutes, { prefix: '/api' });
await app.register(sessionRoutes, { prefix: '/api' });

await runMigrations();
app.listen({ port: config.port, host: config.host });
