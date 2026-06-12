import {
  Calendar,
  Rocket,
  Flame,
  RotateCcw,
  Bell,
  CheckCircle,
  Loader2,
  Clock,
  XCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { TimelineItem } from '@/types';

const typeConfig = {
  deploy: { icon: Rocket, color: 'blue' },
  canary: { icon: Flame, color: 'orange' },
  rollback: { icon: RotateCcw, color: 'red' },
  notice: { icon: Bell, color: 'purple' },
};

const statusConfig = {
  completed: { icon: CheckCircle, color: 'emerald', label: '已完成' },
  in_progress: { icon: Loader2, color: 'blue', label: '进行中' },
  pending: { icon: Clock, color: 'slate', label: '待执行' },
  failed: { icon: XCircle, color: 'red', label: '失败' },
};

export default function ReleaseTimeline() {
  const { timelineItems } = useAppStore();

  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">发布时间线</h3>
            <p className="text-slate-500 text-xs">近期发布计划与历史</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700/50" />

          <div className="space-y-6">
            {timelineItems.map((item, index) => {
              const type = typeConfig[item.type];
              const status = statusConfig[item.status];
              const TypeIcon = type.icon;
              const StatusIcon = status.icon;

              return (
                <div key={item.id} className="relative pl-10">
                  <div
                    className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center ${
                  item.status === 'completed'
                    ? 'bg-emerald-500'
                  : item.status === 'in_progress'
                    ? 'bg-blue-500'
                    : item.status === 'failed'
                      ? 'bg-red-500'
                      : 'bg-slate-700'
                }`}
                  >
                    <TypeIcon className="w-4 h-4 text-white" />
                    {item.status === 'in_progress' && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-50" />
                    )}
                  </div>

                  <div
                    className={`rounded-xl p-4 transition-all duration-300 hover:translate-x-1 cursor-pointer ${
                      item.status === 'completed'
                        ? 'bg-emerald-500/5 border border-emerald-500/20'
                        : item.status === 'in_progress'
                          ? 'bg-blue-500/5 border border-blue-500/20'
                          : item.status === 'failed'
                            ? 'bg-red-500/5 border border-red-500/20'
                            : 'bg-slate-900/40 border border-slate-700/30'
                    }`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">
                        {item.title}
                      </h4>
                      <div
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                          status.color === 'emerald'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : status.color === 'blue'
                              ? 'text-blue-400 bg-blue-500/10'
                              : status.color === 'red'
                                ? 'text-red-400 bg-red-500/10'
                                : 'text-slate-400 bg-slate-500/10'
                        }`}
                      >
                        <StatusIcon
                          className={`w-3 h-3 ${
                            item.status === 'in_progress' ? 'animate-spin' : ''
                          }`}
                        />
                        {status.label}
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{item.productLine}</span>
                      <span className="text-slate-500">{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
