import {
  Package,
  User,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { ProductLine } from '@/types';

function StatusBadge({ status }: { status: ProductLine['status'] }) {
  const config = {
    normal: {
      icon: CheckCircle2,
      label: '正常',
      className: 'text-emerald-400 bg-emerald-500/10',
    },
    deploying: {
      icon: Loader2,
      label: '发布中',
      className: 'text-blue-400 bg-blue-500/10',
    },
    warning: {
      icon: AlertTriangle,
      label: '需关注',
      className: 'text-orange-400 bg-orange-500/10',
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'deploying' ? 'animate-spin' : ''}`} />
      {label}
    </div>
  );
}

export default function ProductLineCards() {
  const { productLines } = useAppStore();

  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">产品线概览</h3>
            <p className="text-slate-500 text-xs">共 {productLines.length} 条产品线</p>
          </div>
        </div>
        <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
          查看全部
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productLines.map((product, index) => (
          <div
            key={product.id}
            className="group relative bg-slate-900/60 border border-slate-700/30 rounded-xl p-4 hover:border-slate-600/50 hover:bg-slate-900/80 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-semibold">{product.name}</h4>
                  <span className="text-slate-500 text-xs font-mono">
                    {product.code}
                  </span>
                </div>
                <StatusBadge status={product.status} />
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">当前版本</span>
                <span className="text-emerald-400 font-mono font-medium">
                  {product.currentVersion}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">待发布</span>
                <span className="text-blue-400 font-mono font-medium">
                  {product.pendingVersion}
                </span>
              </div>
              <div className="h-px bg-slate-700/30" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">负责人</span>
                <span className="text-slate-300">{product.owner}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  上线窗口
                </span>
                <span className="text-slate-300 text-xs">
                  {product.launchWindow}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center justify-between">
              <span className="text-slate-500 text-xs">
                上次部署: {product.lastDeployTime}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
