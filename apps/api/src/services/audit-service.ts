import crypto from 'node:crypto';
import type { AuditEventInput } from '@bizgptx/common';
import { db } from '../lib/db.js';

export class AuditService {
  async append(event: AuditEventInput): Promise<void> {
    const prev = await db.query<{ hash: string }>('SELECT hash FROM audit_events ORDER BY id DESC LIMIT 1');
    const prevHash = prev.rows[0]?.hash ?? 'GENESIS';
    const payloadString = JSON.stringify(event.payload);
    const hash = crypto
      .createHash('sha256')
      .update(`${prevHash}|${event.tenantId}|${event.sessionId}|${event.actor}|${event.eventType}|${payloadString}`)
      .digest('hex');

    await db.query(
      `INSERT INTO audit_events (tenant_id, session_id, actor, event_type, payload, hash)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
      [event.tenantId, event.sessionId, event.actor, event.eventType, payloadString, hash],
    );
  }
}
