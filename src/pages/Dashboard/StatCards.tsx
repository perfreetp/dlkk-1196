import {
  Rocket,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const iconMap: Record<string, typeof Rocket> = {
  rocket: Rocket,
  'check-circle': CheckCircle,
  clock: Clock,
  activity: Activity,
};

export default function StatCards() {
  const { statCards } = useAppStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = iconMap[stat.icon] || Rocket;
        return (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/5 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />

            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trendType === 'up'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-orange-400 bg-orange-500/10'
                  }`}
                >
                  {stat.trendType === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.trend}%
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-slate-500 text-sm">{stat.unit}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
