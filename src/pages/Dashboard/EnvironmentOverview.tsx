import { Server, Cpu, HardDrive, Activity, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Environment } from '@/types';

const envColors: Record<Environment['type'], string> = {
  dev: 'from-blue-500 to-cyan-400',
  test: 'from-amber-500 to-orange-400',
  staging: 'from-purple-500 to-pink-400',
  prod: 'from-emerald-500 to-teal-400',
};

function ProgressRing({ value, size = 48 }: { value: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const color = value >= 90 ? '#10B981' : value >= 70 ? '#F59E0B' : '#EF4444';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export default function EnvironmentOverview() {
  const { environments } = useAppStore();

  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">环境状态</h3>
            <p className="text-slate-500 text-xs">四套环境运行概况</p>
          </div>
        </div>
        <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
          环境管理
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {environments.map((env, index) => (
          <div
            key={env.id}
            className="group relative bg-slate-900/60 border border-slate-700/30 rounded-xl p-4 hover:border-slate-600/50 transition-all duration-300 cursor-pointer overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${envColors[env.type]}`}
            />

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium text-sm">{env.name}</h4>
              <div className="relative">
                <ProgressRing value={env.health} size={40} />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {env.health}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">版本</span>
                <span className="text-slate-200 text-xs font-mono">
                  {env.version}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">实例</span>
                <span className="text-slate-200 text-xs">{env.instances} 台</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/30 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">CPU</span>
                <span className="text-slate-300 ml-auto">{env.cpuUsage}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-400">内存</span>
                <span className="text-slate-300 ml-auto">
                  {env.memoryUsage}%
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <Activity
                className={`w-3 h-3 ${
                  env.status === 'running'
                    ? 'text-emerald-400'
                    : env.status === 'updating'
                      ? 'text-blue-400 animate-pulse'
                      : 'text-red-400'
                }`}
              />
              <span
                className={`text-xs ${
                  env.status === 'running'
                    ? 'text-emerald-400'
                    : env.status === 'updating'
                      ? 'text-blue-400'
                      : 'text-red-400'
                }`}
              >
                {env.status === 'running'
                  ? '运行中'
                  : env.status === 'updating'
                    ? '更新中'
                    : '异常'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
