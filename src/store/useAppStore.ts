import { create } from 'zustand';
import type {
  ProductLine,
  Environment,
  CanaryStrategy,
  Notice,
  RollbackRecord,
  RollbackCondition,
  AuditLog,
  StatCard,
  TimelineItem,
} from '@/types';
import {
  productLines as mockProductLines,
  environments as mockEnvironments,
  canaryStrategies as mockCanaryStrategies,
  notices as mockNotices,
  rollbackConditions as mockRollbackConditions,
  rollbackRecords as mockRollbackRecords,
  auditLogs as mockAuditLogs,
  statCards as mockStatCards,
  timelineItems as mockTimelineItems,
} from '@/data/mockData';

interface AppState {
  productLines: ProductLine[];
  environments: Environment[];
  canaryStrategies: CanaryStrategy[];
  notices: Notice[];
  rollbackConditions: RollbackCondition[];
  rollbackRecords: RollbackRecord[];
  auditLogs: AuditLog[];
  statCards: StatCard[];
  timelineItems: TimelineItem[];
  selectedProductLine: string | null;
  sidebarCollapsed: boolean;

  setSelectedProductLine: (id: string | null) => void;
  toggleSidebar: () => void;

  toggleRollbackCondition: (id: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id'>) => void;

  updateEnvironment: (envId: string, updates: Partial<Environment>) => void;
  refreshEnvironment: (envId: string) => void;

  updateCanaryPercent: (strategyId: string, percent: number) => void;
  toggleCanaryRegion: (strategyId: string, region: string) => void;
  addCanaryWhitelist: (strategyId: string, account: string) => void;
  removeCanaryWhitelist: (strategyId: string, account: string) => void;
  startCanary: (strategyId: string) => void;
  pauseCanary: (strategyId: string) => void;
  resumeCanary: (strategyId: string) => void;
  advanceCanaryPhase: (strategyId: string) => void;
  terminateCanary: (strategyId: string) => void;

  addNotice: (notice: Notice) => void;
  updateNotice: (noticeId: string, updates: Partial<Notice>) => void;
  saveNoticeDraft: (noticeId: string, title: string, content: string) => void;
  sendNotice: (noticeId: string) => void;
  cancelScheduledNotice: (noticeId: string) => void;

  addRollbackRecord: (record: Omit<RollbackRecord, 'id'>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  productLines: mockProductLines,
  environments: mockEnvironments,
  canaryStrategies: mockCanaryStrategies,
  notices: mockNotices,
  rollbackConditions: mockRollbackConditions,
  rollbackRecords: mockRollbackRecords,
  auditLogs: mockAuditLogs,
  statCards: mockStatCards,
  timelineItems: mockTimelineItems,
  selectedProductLine: null,
  sidebarCollapsed: false,

  setSelectedProductLine: (id) => set({ selectedProductLine: id }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  toggleRollbackCondition: (id) =>
    set((state) => ({
      rollbackConditions: state.rollbackConditions.map((c) =>
        c.id === id ? { ...c, checked: !c.checked } : c
      ),
    })),

  addAuditLog: (log) =>
    set((state) => ({
      auditLogs: [
        { ...log, id: Date.now().toString() },
        ...state.auditLogs,
      ],
    })),

  updateEnvironment: (envId, updates) =>
    set((state) => ({
      environments: state.environments.map((e) =>
        e.id === envId ? { ...e, ...updates } : e
      ),
    })),

  refreshEnvironment: (envId) =>
    set((state) => ({
      environments: state.environments.map((e) => {
        if (e.id !== envId) return e;
        const healthJitter = Math.floor(Math.random() * 5);
        const cpuJitter = Math.floor(Math.random() * 10) - 5;
        const memJitter = Math.floor(Math.random() * 8) - 4;
        return {
          ...e,
          health: Math.min(100, Math.max(70, e.health + healthJitter)),
          cpuUsage: Math.min(95, Math.max(10, e.cpuUsage + cpuJitter)),
          memoryUsage: Math.min(95, Math.max(15, e.memoryUsage + memJitter)),
          status: 'running' as const,
        };
      }),
    })),

  updateCanaryPercent: (strategyId, percent) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) =>
        s.id === strategyId ? { ...s, userPercent: percent } : s
      ),
    })),

  toggleCanaryRegion: (strategyId, region) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) => {
        if (s.id !== strategyId) return s;
        const regions = s.regions.includes(region)
          ? s.regions.filter((r) => r !== region)
          : [...s.regions, region];
        return { ...s, regions };
      }),
    })),

  addCanaryWhitelist: (strategyId, account) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) => {
        if (s.id !== strategyId) return s;
        if (s.whitelist.includes(account)) return s;
        return { ...s, whitelist: [...s.whitelist, account] };
      }),
    })),

  removeCanaryWhitelist: (strategyId, account) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) => {
        if (s.id !== strategyId) return s;
        return { ...s, whitelist: s.whitelist.filter((a) => a !== account) };
      }),
    })),

  startCanary: (strategyId) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) =>
        s.id === strategyId
          ? { ...s, status: 'running' as const, currentPhase: 1, startTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-') }
          : s
      ),
    })),

  pauseCanary: (strategyId) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) =>
        s.id === strategyId ? { ...s, status: 'paused' as const } : s
      ),
    })),

  resumeCanary: (strategyId) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) =>
        s.id === strategyId ? { ...s, status: 'running' as const } : s
      ),
    })),

  advanceCanaryPhase: (strategyId) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) => {
        if (s.id !== strategyId) return s;
        const nextPhase = s.currentPhase + 1;
        if (nextPhase >= s.totalPhases) {
          return { ...s, currentPhase: s.totalPhases, status: 'completed' as const, userPercent: 100 };
        }
        const newPercent = Math.min(100, Math.round(((nextPhase) / s.totalPhases) * 100));
        return { ...s, currentPhase: nextPhase, userPercent: newPercent };
      }),
    })),

  terminateCanary: (strategyId) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) =>
        s.id === strategyId ? { ...s, status: 'draft' as const, currentPhase: 0, userPercent: 0 } : s
      ),
    })),

  addNotice: (notice) =>
    set((state) => ({
      notices: [notice, ...state.notices],
    })),

  updateNotice: (noticeId, updates) =>
    set((state) => ({
      notices: state.notices.map((n) =>
        n.id === noticeId ? { ...n, ...updates } : n
      ),
    })),

  saveNoticeDraft: (noticeId, title, content) =>
    set((state) => ({
      notices: state.notices.map((n) =>
        n.id === noticeId ? { ...n, title, content, status: 'draft' as const } : n
      ),
    })),

  sendNotice: (noticeId) =>
    set((state) => ({
      notices: state.notices.map((n) =>
        n.id === noticeId
          ? { ...n, status: 'sent' as const, sendTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'), sentCount: n.targetCount }
          : n
      ),
    })),

  cancelScheduledNotice: (noticeId) =>
    set((state) => ({
      notices: state.notices.map((n) =>
        n.id === noticeId ? { ...n, status: 'draft' as const, sendTime: '' } : n
      ),
    })),

  addRollbackRecord: (record) =>
    set((state) => ({
      rollbackRecords: [
        { ...record, id: Date.now().toString() },
        ...state.rollbackRecords,
      ],
    })),
}));
