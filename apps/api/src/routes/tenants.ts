import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';

const createTenantSchema = z.object({
  name: z.string().min(2),
  plan: z.enum(['starter', 'pro']).default('starter'),
  channels: z.object({ telegram: z.boolean().default(true), whatsapp: z.boolean().default(false) }),
});

export const tenantRoutes: FastifyPluginAsync = async (app) => {
  app.get('/tenants', async () => {
    const result = await db.query('SELECT * FROM tenants ORDER BY created_at DESC');
    return result.rows;
  });

  app.post('/tenants', async (req) => {
    const body = createTenantSchema.parse(req.body);
    const result = await db.query(
      `INSERT INTO tenants (name, plan, telegram_enabled, whatsapp_enabled, status)
       VALUES ($1,$2,$3,$4,'running') RETURNING *`,
      [body.name, body.plan, body.channels.telegram, body.channels.whatsapp],
    );
    return result.rows[0];
  });

  app.post('/tenants/:id/restart', async (req) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    await db.query(`UPDATE tenants SET status='restarting' WHERE id=$1`, [params.id]);
    return { ok: true };
  });
};
