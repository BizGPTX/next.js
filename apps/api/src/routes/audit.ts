import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';

export const auditRoutes: FastifyPluginAsync = async (app) => {
  app.get('/tenants/:id/audit', async (req) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    const format = z.enum(['json', 'csv']).default('json').parse((req.query as { format?: 'json' | 'csv' }).format ?? 'json');
    const result = await db.query('SELECT * FROM audit_events WHERE tenant_id=$1 ORDER BY id ASC', [params.id]);

    if (format === 'csv') {
      const header = 'id,tenant_id,session_id,actor,event_type,payload,hash,created_at';
      const lines = result.rows.map((r) =>
        [r.id, r.tenant_id, r.session_id, r.actor, r.event_type, JSON.stringify(r.payload).replaceAll(',', ';'), r.hash, r.created_at].join(','),
      );
      return `${header}\n${lines.join('\n')}`;
    }

    return result.rows;
  });
};
