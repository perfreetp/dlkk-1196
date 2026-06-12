import { useState, useEffect } from 'react';
import {
  Bell,
  Users,
  Briefcase,
  UserCircle,
  Send,
  Clock,
  CheckCircle,
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Copy,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { Notice } from '@/types';

const typeConfig: Record<Notice['type'], { icon: typeof Bell; label: string; color: string; targetLabel: string }> = {
  customer_service: { icon: Users, label: '客服通知', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30', targetLabel: '全体客服团队 (156人)' },
  sales: { icon: Briefcase, label: '销售通知', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30', targetLabel: '销售团队 (89人)' },
  user: { icon: UserCircle, label: '用户公告', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', targetLabel: '全量用户' },
};

const statusConfig: Record<Notice['status'], { icon: typeof Bell; label: string; color: string }> = {
  draft: { icon: FileText, label: '草稿', color: 'text-slate-400 bg-slate-700/50' },
  scheduled: { icon: Clock, label: '已定时', color: 'text-amber-400 bg-amber-500/10' },
  sent: { icon: CheckCircle, label: '已发送', color: 'text-emerald-400 bg-emerald-500/10' },
};

function NoticeCard({ notice, selected, onSelect }: { notice: Notice; selected: boolean; onSelect: () => void }) {
  const type = typeConfig[notice.type];
  const status = statusConfig[notice.status];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;

  return (
    <div onClick={onSelect} className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${selected ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10' : 'bg-slate-900/40 border-slate-700/30 hover:border-slate-600/50'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${type.color}`}>
          <TypeIcon className="w-3.5 h-3.5" />{type.label}
        </div>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
          <StatusIcon className="w-3 h-3" />{status.label}
        </div>
      </div>
      <h4 className="text-white font-medium mb-2 line-clamp-1">{notice.title}</h4>
      <p className="text-slate-400 text-sm line-clamp-2 mb-3">{notice.content}</p>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{notice.productLine}</span>
        {notice.sendTime && <span>{notice.sendTime}</span>}
      </div>
      {notice.status === 'sent' && (
        <div className="mt-3 pt-3 border-t border-slate-700/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">发送进度</span>
            <span className="text-slate-300">{notice.sentCount} / {notice.targetCount}</span>
          </div>
          <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700" style={{ width: `${(notice.sentCount / notice.targetCount) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function NoticeEditor({ notice }: { notice: Notice | null }) {
  const { saveNoticeDraft, sendNotice, cancelScheduledNotice } = useAppStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setContent(notice.content);
    }
  }, [notice?.id, notice?.title, notice?.content]);

  if (!notice) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg">选择一个公告进行编辑</p>
        <p className="text-sm mt-1">或点击新建按钮创建新公告</p>
      </div>
    );
  }

  const type = typeConfig[notice.type];
  const TypeIcon = type.icon;

  const handleSaveDraft = () => {
    saveNoticeDraft(notice.id, title, content);
  };

  const handleSend = () => {
    saveNoticeDraft(notice.id, title, content);
    sendNotice(notice.id);
  };

  const handleCancelScheduled = () => {
    cancelScheduledNotice(notice.id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/50 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${type.color}`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold">编辑公告</h3>
            <p className="text-slate-500 text-xs">{type.label} · {notice.productLine}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"><Eye className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"><Copy className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        <div>
          <label className="block text-slate-400 text-sm mb-2">公告标题</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-900/60 border border-slate-700/50 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 placeholder:text-slate-500" placeholder="请输入公告标题" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-2">公告内容</label>
          <div className="border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="flex items-center gap-1 px-3 py-2 bg-slate-900/80 border-b border-slate-700/50">
              <button className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"><span className="text-sm font-bold">B</span></button>
              <button className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"><span className="text-sm italic">I</span></button>
              <button className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"><span className="text-sm underline">U</span></button>
              <div className="w-px h-4 bg-slate-700 mx-1" />
              <button className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"><span className="text-xs">列表</span></button>
              <button className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"><span className="text-xs">链接</span></button>
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full bg-slate-900/40 text-slate-200 text-sm px-4 py-3 focus:outline-none resize-none" placeholder="请输入公告内容..." />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">发送对象</label>
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-2.5">
              <span className="text-slate-300 text-sm">{type.targetLabel}</span>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">关联产品线</label>
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-2.5">
              <span className="text-slate-300 text-sm">{notice.productLine}</span>
            </div>
          </div>
        </div>
        {notice.status === 'scheduled' && (
          <div>
            <label className="block text-slate-400 text-sm mb-2">定时发送</label>
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm">{notice.sendTime}</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-700/50 mt-4 flex gap-3">
        {notice.status !== 'sent' && (
          <button onClick={handleSaveDraft} className="flex-1 py-2.5 px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <Edit3 className="w-4 h-4" />保存草稿
          </button>
        )}
        {notice.status === 'draft' && (
          <button onClick={handleSend} className="flex-1 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
            <Send className="w-4 h-4" />立即发送
          </button>
        )}
        {notice.status === 'scheduled' && (
          <button onClick={handleCancelScheduled} className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
            <Clock className="w-4 h-4" />取消定时
          </button>
        )}
        {notice.status === 'sent' && (
          <div className="flex-1 py-2.5 px-4 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />已发送完成
          </div>
        )}
      </div>
    </div>
  );
}

export default function Notices() {
  const { notices, addNotice, productLines } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | Notice['type']>('all');
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(notices[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotices = notices.filter((n) => {
    const matchesTab = activeTab === 'all' || n.type === activeTab;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedNotice = notices.find((n) => n.id === selectedNoticeId) || null;

  const tabs = [
    { key: 'all' as const, label: '全部', icon: Bell },
    { key: 'customer_service' as const, label: '客服', icon: Users },
    { key: 'sales' as const, label: '销售', icon: Briefcase },
    { key: 'user' as const, label: '用户', icon: UserCircle },
  ];

  const handleCreateNotice = () => {
    const newId = Date.now().toString();
    const newNotice: Notice = {
      id: newId,
      title: '新建公告',
      content: '',
      type: 'customer_service',
      status: 'draft',
      sendTime: '',
      sender: '管理员',
      targetCount: 156,
      sentCount: 0,
      productLine: productLines[0]?.name || '未指定',
    };
    addNotice(newNotice);
    setSelectedNoticeId(newId);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">通知公告</h1>
          <p className="text-slate-400 text-sm mt-1">生成发布说明，面向不同人群发送通知</p>
        </div>
        <button onClick={handleCreateNotice} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />新建公告
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-96 flex-shrink-0 flex flex-col bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 space-y-3">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                    <Icon className="w-3.5 h-3.5" />{tab.label}
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索公告..." className="w-full bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 placeholder:text-slate-500" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-white text-sm transition-colors">
              <Filter className="w-4 h-4" />筛选与排序
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} selected={selectedNoticeId === notice.id} onSelect={() => setSelectedNoticeId(notice.id)} />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 overflow-hidden">
          <NoticeEditor notice={selectedNotice} />
        </div>
      </div>
    </div>
  );
}
