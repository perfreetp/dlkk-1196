import { useState } from 'react';
import {
  Flame,
  Users,
  MapPin,
  ListChecks,
  Activity,
  Play,
  Pause,
  SkipForward,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Target,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { CanaryStrategy, CanaryMetric } from '@/types';

const allRegions = ['华东', '华北', '华南', '西南', '西北', '东北', '华中'];

function MetricCard({ metric }: { metric: CanaryMetric }) {
  const isWarning = metric.status === 'warning';
  const isError = metric.status === 'error';
  const isNormal = metric.status === 'normal';
  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-slate-900/60 border border-slate-700/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">{metric.name}</span>
        <div className={`w-2 h-2 rounded-full ${isNormal ? 'bg-emerald-400' : isWarning ? 'bg-amber-400' : 'bg-red-400'} ${isError ? 'animate-pulse' : ''}`} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className={`text-2xl font-bold ${isNormal ? 'text-white' : isWarning ? 'text-amber-400' : 'text-red-400'}`}>{metric.value}</span>
          <span className="text-slate-500 text-sm ml-1">{metric.unit}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          metric.trend === 'stable' ? 'text-slate-400 bg-slate-700/50' : metric.trend === 'up' ? (isNormal ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10') : (isNormal ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10')
        }`}>
          <TrendIcon className="w-3 h-3" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>阈值: {metric.threshold}{metric.unit}</span>
        </div>
        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${isNormal ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}

function StrategyCard({ strategy }: { strategy: CanaryStrategy }) {
  const {
    pauseCanary, resumeCanary, updateCanaryPercent,
    toggleCanaryRegion, addCanaryWhitelist, removeCanaryWhitelist,
    startCanary, advanceCanaryPhase, terminateCanary,
  } = useAppStore();
  const [whitelistInput, setWhitelistInput] = useState('');

  const isRunning = strategy.status === 'running';
  const isPaused = strategy.status === 'paused';
  const isDraft = strategy.status === 'draft';
  const isCompleted = strategy.status === 'completed';

  const handleAddWhitelist = () => {
    const trimmed = whitelistInput.trim();
    if (!trimmed) return;
    addCanaryWhitelist(strategy.id, trimmed);
    setWhitelistInput('');
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRunning ? 'bg-orange-500/20' : isPaused ? 'bg-amber-500/20' : isCompleted ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
              <Flame className={`w-5 h-5 ${isRunning ? 'text-orange-400' : isPaused ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">{strategy.productLineName}</h3>
              <p className="text-slate-500 text-xs">目标版本: {strategy.targetVersion}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${isRunning ? 'bg-blue-500/20 text-blue-400' : isPaused ? 'bg-amber-500/20 text-amber-400' : isDraft ? 'bg-slate-700/50 text-slate-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isRunning ? '灰度进行中' : isPaused ? '已暂停' : isDraft ? '草稿' : '已完成'}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 text-sm font-medium">用户比例</span>
            </div>
            <span className="text-2xl font-bold text-blue-400">{strategy.userPercent}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={strategy.userPercent}
            onChange={(e) => updateCanaryPercent(strategy.id, Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
            disabled={!isRunning}
            style={{ background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${strategy.userPercent}%, #334155 ${strategy.userPercent}%, #334155 100%)` }}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: strategy.totalPhases }).map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i < strategy.currentPhase ? 'bg-blue-500' : i === strategy.currentPhase ? 'bg-blue-500/50' : 'bg-slate-700'}`} />
            ))}
          </div>
          <p className="text-slate-500 text-xs text-center mt-2">
            第 {strategy.currentPhase} / {strategy.totalPhases} 阶段
            {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline ml-1" />}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300 text-sm font-medium">灰度地区</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allRegions.map((region) => (
              <button
                key={region}
                onClick={() => toggleCanaryRegion(strategy.id, region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  strategy.regions.includes(region)
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-700/30 hover:border-slate-600'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 text-sm font-medium">账号白名单</span>
            </div>
            <span className="text-slate-500 text-xs">{strategy.whitelist.length} 个账号</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {strategy.whitelist.map((account) => (
              <span key={account} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-md border border-emerald-500/20">
                {account}
                <button onClick={() => removeCanaryWhitelist(strategy.id, account)} className="hover:text-emerald-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text" value={whitelistInput} onChange={(e) => setWhitelistInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddWhitelist(); }}
              placeholder="输入账号添加白名单"
              className="flex-1 bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 placeholder:text-slate-500"
            />
            <button onClick={handleAddWhitelist} className="px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 text-sm font-medium">观察指标</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {strategy.metrics.map((metric) => (
              <MetricCard key={metric.name} metric={metric} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>开始时间: {strategy.startTime || '未开始'}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-700/50 flex gap-3">
        {isRunning && (
          <>
            <button onClick={() => pauseCanary(strategy.id)} className="flex-1 py-2.5 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              <Pause className="w-4 h-4" />暂停灰度
            </button>
            <button onClick={() => advanceCanaryPhase(strategy.id)} className="flex-1 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
              <SkipForward className="w-4 h-4" />推进到下一阶段
            </button>
          </>
        )}
        {isPaused && (
          <>
            <button onClick={() => resumeCanary(strategy.id)} className="flex-1 py-2.5 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />继续灰度
            </button>
            <button onClick={() => terminateCanary(strategy.id)} className="flex-1 py-2.5 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />终止并回滚
            </button>
          </>
        )}
        {isDraft && (
          <button onClick={() => startCanary(strategy.id)} className="flex-1 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
            <Play className="w-4 h-4" />启动灰度
          </button>
        )}
        {isCompleted && (
          <div className="flex-1 py-2.5 px-4 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />灰度已完成，可全量发布
          </div>
        )}
      </div>
    </div>
  );
}

export default function Canary() {
  const { canaryStrategies } = useAppStore();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">灰度策略</h1>
          <p className="text-slate-400 text-sm mt-1">配置灰度规则，监控发布质量指标</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Target className="w-4 h-4" />策略模板
          </button>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />新建灰度
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {canaryStrategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
}
