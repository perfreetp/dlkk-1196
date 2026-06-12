import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  Flame,
  Bell,
  RotateCcw,
  FileText,
  ChevronLeft,
  ChevronRight,
  Rocket,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { path: '/dashboard', label: '发布驾驶舱', icon: LayoutDashboard },
  { path: '/environments', label: '环境管理', icon: Server },
  { path: '/canary', label: '灰度策略', icon: Flame },
  { path: '/notices', label: '通知公告', icon: Bell },
  { path: '/rollback', label: '回滚中心', icon: RotateCcw },
  { path: '/audit', label: '审计日志', icon: FileText },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`h-screen bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col transition-all duration-300 flex-shrink-0 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="whitespace-nowrap">
              <h1 className="text-white font-bold text-base">发布管理平台</h1>
              <p className="text-slate-400 text-xs">Release Hub</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            )}
            {!sidebarCollapsed && (
              <div
                className={`ml-auto w-1.5 h-1.5 rounded-full ${
                  item.path === '/canary' ? 'bg-orange-400 animate-pulse' : ''
                }`}
              />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm ml-2">收起菜单</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
