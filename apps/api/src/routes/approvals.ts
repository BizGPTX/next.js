import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { ApprovalService } from '../services/approval-service.js';

const approvalService = new ApprovalService();

export const approvalRoutes: FastifyPluginAsync = async (app) => {
  app.get('/approvals', async () => {
    const result = await db.query('SELECT * FROM approvals ORDER BY created_at DESC');
    return result.rows;
  });

  app.post('/approvals/:id/decision', async (req) => {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    const body = z.object({ decision: z.enum(['approved', 'denied']), reason: z.string().optional() }).parse(req.body);
    await approvalService.decide(params.id, body.decision, 'operator', body.reason);
    return { ok: true };
  });
};
