export type ActorType = 'agent' | 'operator' | 'user' | 'system';

export type EventType =
  | 'tool.call'
  | 'tool.blocked'
  | 'tool.approval_requested'
  | 'tool.executed'
  | 'message.inbound'
  | 'message.outbound'
  | 'tenant.provisioned'
  | 'approval.decision';

export type ToolRisk = 'safe' | 'approval_required' | 'blocked';

export interface ToolPolicyDecision {
  status: 'allow' | 'require_approval' | 'deny';
  reason?: string;
}

export interface AuditEventInput {
  tenantId: string;
  sessionId: string;
  actor: ActorType;
  eventType: EventType;
  payload: Record<string, unknown>;
}

export interface TenantRecord {
  id: string;
  name: string;
  plan: 'starter' | 'pro';
  telegramEnabled: boolean;
  whatsappEnabled: boolean;
}

export interface ToolContext {
  tenantId: string;
  sessionId: string;
  actor: ActorType;
}
