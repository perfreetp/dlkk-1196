import { Search, Bell, User, Settings, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Header() {
  const { productLines, selectedProductLine, setSelectedProductLine } = useAppStore();

  const currentProduct = productLines.find((p) => p.id === selectedProductLine);

  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-6">
        <div className="relative">
          <select
            value={selectedProductLine || ''}
            onChange={(e) => setSelectedProductLine(e.target.value || null)}
            className="appearance-none bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <option value="">全部产品线</option>
            {productLines.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {currentProduct && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">当前版本:</span>
            <span className="text-emerald-400 font-mono font-medium">
              {currentProduct.currentVersion}
            </span>
            <span className="text-slate-600">→</span>
            <span className="text-blue-400 font-mono font-medium">
              {currentProduct.pendingVersion}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索发布、版本..."
            className="w-64 bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-slate-500 transition-colors"
          />
        </div>

        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-slate-700/50 mx-2" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm">
            <p className="text-slate-200 font-medium">管理员</p>
            <p className="text-slate-500 text-xs">admin@company.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
