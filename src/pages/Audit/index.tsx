import { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronRight,
  User,
  Rocket,
  Pause,
  Play,
  RotateCcw,
  CheckCircle,
  Edit3,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { AuditLog, AuditAction } from '@/types';

const actionConfig: Record<AuditAction, { icon: typeof Rocket; label: string; color: string }> = {
  deploy: { icon: Rocket, label: '发布', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' },
  approve: { icon: CheckCircle, label: '审批', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' },
  change: { icon: Edit3, label: '变更', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' },
  pause: { icon: Pause, label: '暂停', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' },
  resume: { icon: Play, label: '恢复', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30' },
  rollback: { icon: RotateCcw, label: '回滚', color: 'text-red-400 bg-red-500/20 border-red-500/30' },
  create: { icon: Plus, label: '创建', color: 'text-green-400 bg-green-500/20 border-green-500/30' },
  update: { icon: Edit3, label: '更新', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' },
};

function DiffView({ before, after }: { before: Record<string, unknown>; after: Record<string, unknown> }) {
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];

  return (
    <div className="bg-slate-900/80 rounded-lg border border-slate-700/50 overflow-hidden">
      <div className="grid grid-cols-2 gap-px bg-slate-700/50">
        <div className="px-3 py-2 bg-slate-800/80">
          <span className="text-xs text-slate-500 font-medium">变更前</span>
        </div>
        <div className="px-3 py-2 bg-slate-800/80">
          <span className="text-xs text-slate-500 font-medium">变更后</span>
        </div>
      </div>
      <div className="divide-y divide-slate-700/30">
        {keys.map((key) => {
          const beforeVal = before[key];
          const afterVal = after[key];
          const changed = JSON.stringify(beforeVal) !== JSON.stringify(afterVal);

          return (
            <div key={key} className="grid grid-cols-2 gap-px">
              <div className={`px-3 py-2 font-mono text-xs ${changed && beforeVal !== undefined ? 'bg-red-500/10 text-red-400' : 'text-slate-400'}`}>
                {beforeVal !== undefined ? String(beforeVal) : '-'}
              </div>
              <div className={`px-3 py-2 font-mono text-xs ${changed && afterVal !== undefined ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400'}`}>
                {afterVal !== undefined ? String(afterVal) : '-'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AuditLogItem({ log }: { log: AuditLog }) {
  const [expanded, setExpanded] = useState(false);
  const action = actionConfig[log.action];
  const ActionIcon = action.icon;

  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      <div className="absolute left-0 top-1 bottom-0 w-px bg-slate-700/50" />

      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center ${action.color.split(' ')[1]}`}>
        <ActionIcon className="w-3.5 h-3.5" />
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-colors">
        <div
          onClick={() => setExpanded(!expanded)}
          className="p-4 cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`px-2.5 py-1 rounded-md text-xs font-medium border ${action.color}`}>
                {action.label}
              </div>
              <h4 className="text-white font-medium">{log.target}</h4>
            </div>
            {expanded ? (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-500" />
            )}
          </div>

          <p className="text-slate-400 text-sm mt-2">{log.detail}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {log.operator}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {log.time}
            </span>
          </div>
        </div>

        {expanded && (
          <div className="px-4 pb-4 border-t border-slate-700/30 pt-4">
            <p className="text-slate-500 text-xs mb-3">变更详情</p>
            <DiffView before={log.before} after={log.after} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Audit() {
  const { auditLogs } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [dateRange, setDateRange] = useState('7days');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const actionOptions: { key: AuditAction | 'all'; label: string }[] = [
    { key: 'all', label: '全部操作' },
    { key: 'deploy', label: '发布' },
    { key: 'approve', label: '审批' },
    { key: 'change', label: '变更' },
    { key: 'pause', label: '暂停' },
    { key: 'resume', label: '恢复' },
    { key: 'rollback', label: '回滚' },
    { key: 'create', label: '创建' },
    { key: 'update', label: '更新' },
  ];

  const stats = [
    { label: '总操作数', value: auditLogs.length, icon: FileText, color: 'text-blue-400' },
    { label: '发布次数', value: auditLogs.filter((l) => l.action === 'deploy').length, icon: Rocket, color: 'text-cyan-400' },
    { label: '回滚次数', value: auditLogs.filter((l) => l.action === 'rollback').length, icon: RotateCcw, color: 'text-red-400' },
    { label: '审批数量', value: auditLogs.filter((l) => l.action === 'approve').length, icon: CheckCircle, color: 'text-emerald-400' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">审计日志</h1>
          <p className="text-slate-400 text-sm mt-1">记录所有发布相关的操作与变更</p>
        </div>
        <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
          <FileText className="w-4 h-4" />
          导出日志
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-slate-500 text-xs">{stat.label}</p>
                <p className="text-white text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索操作、操作人、详情..."
                className="w-full bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value as AuditAction | 'all')}
                  className="appearance-none bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 cursor-pointer"
                >
                  {actionOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="appearance-none bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="today">今天</option>
                  <option value="3days">近3天</option>
                  <option value="7days">近7天</option>
                  <option value="30days">近30天</option>
                  <option value="all">全部</option>
                </select>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <button className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredLogs.length > 0 ? (
            <div>
              {filteredLogs.map((log) => (
                <AuditLogItem key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">暂无匹配的日志记录</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-between">
          <p className="text-slate-500 text-sm">
            共 {filteredLogs.length} 条记录
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-slate-700/50 text-slate-400 text-sm rounded hover:bg-slate-700 transition-colors">
              上一页
            </button>
            <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm rounded">
              1
            </span>
            <button className="px-3 py-1.5 bg-slate-700/50 text-slate-400 text-sm rounded hover:bg-slate-700 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
