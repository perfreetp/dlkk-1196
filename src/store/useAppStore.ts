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
  updateCanaryPercent: (strategyId: string, percent: number) => void;
  pauseCanary: (strategyId: string) => void;
  resumeCanary: (strategyId: string) => void;
  addAuditLog: (log: Omit<AuditLog, 'id'>) => void;
  updateNoticeStatus: (noticeId: string, status: Notice['status']) => void;
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

  updateCanaryPercent: (strategyId, percent) =>
    set((state) => ({
      canaryStrategies: state.canaryStrategies.map((s) =>
        s.id === strategyId ? { ...s, userPercent: percent } : s
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

  addAuditLog: (log) =>
    set((state) => ({
      auditLogs: [
        { ...log, id: Date.now().toString() },
        ...state.auditLogs,
      ],
    })),

  updateNoticeStatus: (noticeId, status) =>
    set((state) => ({
      notices: state.notices.map((n) =>
        n.id === noticeId ? { ...n, status } : n
      ),
    })),
}));
