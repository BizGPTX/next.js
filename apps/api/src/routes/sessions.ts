import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';

export const sessionRoutes: FastifyPluginAsync = async (app) => {
  app.get('/sessions/:tenantId', async (req) => {
    const params = z.object({ tenantId: z.string().uuid() }).parse(req.params);
    const result = await db.query('SELECT * FROM sessions WHERE tenant_id=$1 ORDER BY created_at DESC', [params.tenantId]);
    return result.rows;
  });
};
