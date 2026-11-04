export const config = {
  port: Number(process.env.PORT ?? 4000),
  host: process.env.HOST ?? '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@postgres:5432/bizgptx',
  redisUrl: process.env.REDIS_URL ?? 'redis://redis:6379',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  internalSigningKey: process.env.INTERNAL_SIGNING_KEY ?? 'internal-dev-key',
  defaultRateLimitPerMinute: Number(process.env.DEFAULT_RATE_LIMIT_PER_MINUTE ?? 60),
};
