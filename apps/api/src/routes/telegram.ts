import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { AuditService } from '../services/audit-service.js';
import { ToolPolicyEngine } from '../services/tool-policy-engine.js';
import { ApprovalService } from '../services/approval-service.js';
import { createInvoiceDraft, generateQuote, proposeSlots } from '../tools/electrician-tools.js';

const payloadSchema = z.object({
  tenantId: z.string().uuid(),
  message: z.object({ chat: z.object({ id: z.number() }), from: z.object({ id: z.number() }), text: z.string().default('') }),
});

const audit = new AuditService();
const policy = new ToolPolicyEngine();
const approvals = new ApprovalService();

export const telegramRoutes: FastifyPluginAsync = async (app) => {
  app.post('/channels/telegram/inbound', { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } }, async (req, reply) => {
    const body = payloadSchema.parse(req.body);
    const externalUserId = String(body.message.from.id);

    const identity = await db.query(
      `INSERT INTO chat_identities (tenant_id, channel, external_user_id)
       VALUES ($1,'telegram',$2)
       ON CONFLICT (tenant_id, channel, external_user_id)
       DO UPDATE SET external_user_id=EXCLUDED.external_user_id
       RETURNING *`,
      [body.tenantId, externalUserId],
    );

    if (!identity.rows[0].allowlisted) {
      return reply.code(202).send({ status: 'pending_approval', message: 'Contact awaits allowlist approval' });
    }

    const sessionResult = await db.query(
      `INSERT INTO sessions (tenant_id, channel, external_user_id) VALUES ($1,'telegram',$2) RETURNING id`,
      [body.tenantId, externalUserId],
    );
    const sessionId = sessionResult.rows[0].id as string;

    await audit.append({ tenantId: body.tenantId, sessionId, actor: 'user', eventType: 'message.inbound', payload: { text: body.message.text } });

    const quote = generateQuote({ workType: body.message.text || 'general electrical', urgency: 'standard' });
    const slots = proposeSlots();
    const draft = createInvoiceDraft({ customerName: 'Pending Customer', quoteTotal: quote.total, description: 'Electrical services' });

    const decision = policy.evaluate('webhook.send', { url: 'https://example.invalid/commitment' });
    if (decision.status === 'require_approval') {
      const approvalId = await approvals.create(body.tenantId, sessionId, 'booking.confirm', { quote, slots, draft });
      await audit.append({
        tenantId: body.tenantId,
        sessionId,
        actor: 'agent',
        eventType: 'tool.approval_requested',
        payload: { approvalId, tool: 'booking.confirm', reason: decision.reason },
      });
    }

    await audit.append({ tenantId: body.tenantId, sessionId, actor: 'agent', eventType: 'message.outbound', payload: { quote, slots, draft } });

    return { status: 'ok', quote, slots, invoiceDraft: draft, confirmation: 'Awaiting operator approval before booking confirmation.' };
  });
};
