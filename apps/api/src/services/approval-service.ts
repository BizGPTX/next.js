import { db } from '../lib/db.js';

export class ApprovalService {
  async create(tenantId: string, sessionId: string, toolName: string, payload: Record<string, unknown>) {
    const result = await db.query(
      `INSERT INTO approvals (tenant_id, session_id, tool_name, payload)
       VALUES ($1,$2,$3,$4::jsonb) RETURNING id`,
      [tenantId, sessionId, toolName, JSON.stringify(payload)],
    );
    return result.rows[0].id as string;
  }

  async decide(approvalId: string, decision: 'approved' | 'denied', decidedBy: string, reason?: string) {
    await db.query(
      `UPDATE approvals SET status=$2, decided_by=$3, reason=$4, decided_at=NOW() WHERE id=$1`,
      [approvalId, decision, decidedBy, reason ?? null],
    );
  }
}
