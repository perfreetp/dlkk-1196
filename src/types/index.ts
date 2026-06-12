export interface ProductLine {
  id: string;
  name: string;
  code: string;
  currentVersion: string;
  pendingVersion: string;
  owner: string;
  ownerAvatar: string;
  status: 'normal' | 'deploying' | 'warning';
  launchWindow: string;
  lastDeployTime: string;
}

export interface Environment {
  id: string;
  name: string;
  type: 'dev' | 'test' | 'staging' | 'prod';
  version: string;
  deployTime: string;
  deployer: string;
  changeNotes: string;
  health: number;
  status: 'running' | 'updating' | 'error';
  instances: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface CanaryMetric {
  name: string;
  value: number;
  threshold: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'error';
}

export interface CanaryStrategy {
  id: string;
  productLineId: string;
  productLineName: string;
  userPercent: number;
  regions: string[];
  whitelist: string[];
  metrics: CanaryMetric[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startTime: string;
  targetVersion: string;
  currentPhase: number;
  totalPhases: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'customer_service' | 'sales' | 'user';
  status: 'draft' | 'sent' | 'scheduled';
  sendTime: string;
  sender: string;
  targetCount: number;
  sentCount: number;
  productLine: string;
}

export interface RollbackCondition {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
}

export interface RollbackRecord {
  id: string;
  productLineId: string;
  productLineName: string;
  environment: string;
  fromVersion: string;
  toVersion: string;
  reason: string;
  operator: string;
  time: string;
  status: 'success' | 'failed' | 'in_progress';
  impactScope: string;
  duration: string;
}

export type AuditAction = 'approve' | 'change' | 'pause' | 'resume' | 'rollback' | 'deploy' | 'create' | 'update';

export interface AuditLog {
  id: string;
  action: AuditAction;
  operator: string;
  operatorAvatar: string;
  target: string;
  time: string;
  detail: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
}

export interface StatCard {
  label: string;
  value: number;
  unit?: string;
  trend: number;
  trendType: 'up' | 'down';
  icon: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  time: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  type: 'deploy' | 'canary' | 'rollback' | 'notice';
  productLine: string;
  description: string;
}
