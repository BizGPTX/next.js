import crypto from 'node:crypto';
import type { FastifyPluginAsync } from 'fastify';
import { config } from '../lib/config.js';

export const internalAuthPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    if (!req.url.startsWith('/internal/')) return;
    const signature = req.headers['x-internal-signature'];
    const timestamp = req.headers['x-internal-timestamp'];
    if (!signature || !timestamp || Array.isArray(signature) || Array.isArray(timestamp)) {
      return reply.code(401).send({ error: 'Missing internal signature headers' });
    }
    const body = req.body ? JSON.stringify(req.body) : '';
    const base = `${req.method}|${req.url}|${timestamp}|${body}`;
    const expected = crypto.createHmac('sha256', config.internalSigningKey).update(base).digest('hex');
    if (expected !== signature) {
      return reply.code(401).send({ error: 'Invalid internal signature' });
    }
  });
};
