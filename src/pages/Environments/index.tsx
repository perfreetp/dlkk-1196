import { useState } from 'react';
import {
  Server,
  RefreshCw,
  GitCompare,
  Clock,
  User,
  FileText,
  Cpu,
  HardDrive,
  Activity,
  ChevronDown,
  ChevronUp,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Environment } from '@/types';

const envColors: Record<Environment['type'], { gradient: string; bg: string; text: string }> = {
  dev: {
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  test: {
    gradient: 'from-amber-500 to-orange-400',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  staging: {
    gradient: 'from-purple-500 to-pink-400',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
  },
  prod: {
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
};

function StatusBadge({ status }: { status: Environment['status'] }) {
  const config = {
    running: { icon: CheckCircle2, label: '运行中', className: 'text-emerald-400' },
    updating: { icon: Loader2, label: '更新中', className: 'text-blue-400' },
    error: { icon: AlertTriangle, label: '异常', className: 'text-red-400' },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className={`w-4 h-4 ${status === 'updating' ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function EnvironmentCard({
  env,
  expanded,
  onToggle,
}: {
  env: Environment;
  expanded: boolean;
  onToggle: () => void;
}) {
  const colors = envColors[env.type];

  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300">
      <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <Server className={`w-6 h-6 ${colors.text}`} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{env.name}</h3>
              <StatusBadge status={env.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-1">健康度</p>
            <p className={`text-2xl font-bold ${env.health >= 90 ? 'text-emerald-400' : env.health >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
              {env.health}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-slate-500 text-xs mb-1">当前版本</p>
            <p className="text-white font-mono font-medium">{env.version}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">实例数量</p>
            <p className="text-white font-medium">{env.instances} 台</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400">CPU</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${env.cpuUsage}%` }}
                />
              </div>
              <span className="text-slate-300 text-sm w-10 text-right">{env.cpuUsage}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">内存</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-500"
                  style={{ width: `${env.memoryUsage}%` }}
                />
              </div>
              <span className="text-slate-300 text-sm w-10 text-right">{env.memoryUsage}%</span>
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-1 py-2 text-slate-400 hover:text-white text-sm border-t border-slate-700/50 -mx-5 -mb-5 mt-2 transition-colors"
        >
          {expanded ? (
            <>
              收起详情 <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              查看详情 <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-700/50 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400 text-sm">部署时间:</span>
              <span className="text-slate-200 text-sm">{env.deployTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400 text-sm">变更人:</span>
              <span className="text-slate-200 text-sm">{env.deployer}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400 text-sm">变更备注</span>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30">
              <p className="text-slate-300 text-sm">{env.changeNotes}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2 px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              刷新状态
            </button>
            <button className="flex-1 py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
              <Edit3 className="w-4 h-4" />
              编辑备注
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function VersionCompare({ environments }: { environments: Environment[] }) {
  const versions = environments.map((e) => ({ name: e.name, version: e.version, type: e.type }));

  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <GitCompare className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">版本对比</h3>
            <p className="text-slate-500 text-xs">各环境版本差异对比</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-end justify-between gap-4">
          {versions.map((v, index) => (
            <div key={v.type} className="flex-1 text-center">
              <div
                className={`h-20 rounded-t-xl flex items-center justify-center mb-3 ${
                  index === versions.length - 1
                    ? 'bg-gradient-to-t from-emerald-500/30 to-emerald-500/10'
                    : index === versions.length - 2
                      ? 'bg-gradient-to-t from-purple-500/30 to-purple-500/10'
                      : index === versions.length - 3
                        ? 'bg-gradient-to-t from-amber-500/30 to-amber-500/10'
                        : 'bg-gradient-to-t from-blue-500/30 to-blue-500/10'
                }`}
              >
                <span className="text-white font-mono font-bold text-sm">{v.version}</span>
              </div>
              <p className="text-slate-300 text-sm font-medium">{v.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{v.version}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>版本同步状态良好，正式环境版本稳定</span>
        </div>
      </div>
    </div>
  );
}

export default function Environments() {
  const { environments } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">环境管理</h1>
          <p className="text-slate-400 text-sm mt-1">管理开发、测试、预发、正式四套环境的版本状态</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            刷新全部
          </button>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
            部署新版本
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {environments.map((env) => (
          <EnvironmentCard
            key={env.id}
            env={env}
            expanded={expandedId === env.id}
            onToggle={() => setExpandedId(expandedId === env.id ? null : env.id)}
          />
        ))}
      </div>

      <VersionCompare environments={environments} />
    </div>
  );
}
