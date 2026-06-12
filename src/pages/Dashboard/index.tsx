import StatCards from './StatCards';
import ProductLineCards from './ProductLineCards';
import ReleaseTimeline from './ReleaseTimeline';
import EnvironmentOverview from './EnvironmentOverview';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">发布驾驶舱</h1>
          <p className="text-slate-400 text-sm mt-1">
            全局视角掌握所有产品线的发布状态与进度
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-sm">更新时间: 2026-06-13 10:30</span>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
            新建发布
          </button>
        </div>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductLineCards />
        </div>
        <div className="lg:col-span-1">
          <ReleaseTimeline />
        </div>
      </div>

      <EnvironmentOverview />
    </div>
  );
}
