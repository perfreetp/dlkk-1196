import { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Server,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  Users,
  Database,
  Zap,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { RollbackRecord, RollbackCondition } from '@/types';

function ConditionCheckItem({ condition, onToggle }: { condition: RollbackCondition; onToggle: () => void }) {
  return (
    <div onClick={onToggle} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${condition.checked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/40 border-slate-700/30 hover:border-slate-600/50'}`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${condition.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
        {condition.checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className={`text-sm flex-1 ${condition.checked ? 'text-slate-200' : 'text-slate-400'}`}>{condition.label}</span>
      {condition.required && <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">必需</span>}
    </div>
  );
}

function RollbackRecordItem({ record }: { record: RollbackRecord }) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = {
    success: { label: '成功', color: 'text-emerald-400 bg-emerald-500/10', icon: CheckCircle2 },
    failed: { label: '失败', color: 'text-red-400 bg-red-500/10', icon: X },
    in_progress: { label: '进行中', color: 'text-blue-400 bg-blue-500/10', icon: RotateCcw },
  };
  const status = statusConfig[record.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl overflow-hidden hover:border-slate-600/50 transition-colors">
      <div onClick={() => setExpanded(!expanded)} className="p-4 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${status.color}`}>
              <StatusIcon className={`w-5 h-5 ${record.status === 'in_progress' ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-medium">{record.productLineName}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 font-mono">{record.fromVersion}</span>
                <ArrowRight className="w-3.5 h-3.5 text-red-400" />
                <span className="text-emerald-400 font-mono">{record.toVersion}</span>
              </div>
            </div>
          </div>
          {expanded ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{record.time}</span>
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{record.operator}</span>
          <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5" />{record.environment}</span>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-700/30 pt-4 space-y-3">
          <div><p className="text-slate-500 text-xs mb-1.5">回滚原因</p><p className="text-slate-300 text-sm">{record.reason}</p></div>
          <div><p className="text-slate-500 text-xs mb-1.5">影响范围</p><p className="text-slate-300 text-sm">{record.impactScope}</p></div>
          <div><p className="text-slate-500 text-xs mb-1.5">回滚耗时</p><p className="text-slate-300 text-sm">{record.duration}</p></div>
        </div>
      )}
    </div>
  );
}

export default function Rollback() {
  const { rollbackConditions, rollbackRecords, toggleRollbackCondition, productLines, addRollbackRecord } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState(productLines[0]?.id || '');
  const [confirmText, setConfirmText] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [rollbackReason, setRollbackReason] = useState('');

  const requiredChecked = rollbackConditions.filter((c) => c.required).every((c) => c.checked);
  const currentProduct = productLines.find((p) => p.id === selectedProduct);
  const canRollback = requiredChecked && confirmText === '确认回滚';

  const handleConfirmRollback = () => {
    if (!currentProduct || !canRollback) return;
    addRollbackRecord({
      productLineId: currentProduct.id,
      productLineName: currentProduct.name,
      environment: '正式环境',
      fromVersion: currentProduct.currentVersion,
      toVersion: currentProduct.pendingVersion,
      reason: rollbackReason.trim() || '未填写原因',
      operator: '管理员',
      time: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      status: 'success',
      impactScope: '约 120万用户，影响时长约 15 分钟',
      duration: '约 15 分钟',
    });
    setShowConfirmDialog(false);
    setConfirmText('');
    setRollbackReason('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">回滚中心</h1>
          <p className="text-slate-400 text-sm mt-1">执行版本回滚，查看历史回滚记录</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg">
          <AlertTriangle className="w-4 h-4" /><span>高危操作，请谨慎执行</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><Shield className="w-5 h-5 text-red-400" /></div>
              <div><h3 className="text-white font-semibold">回滚条件检查</h3><p className="text-slate-500 text-xs">执行回滚前请确认以下条件已满足</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {rollbackConditions.map((condition) => (
                <ConditionCheckItem key={condition.id} condition={condition} onToggle={() => toggleRollbackCondition(condition.id)} />
              ))}
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg border border-slate-700/30">
              <span className="text-slate-400 text-sm">已检查 {rollbackConditions.filter((c) => c.checked).length} / {rollbackConditions.length} 项</span>
              {requiredChecked ? (
                <span className="text-emerald-400 text-sm font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" />必要条件已满足</span>
              ) : (
                <span className="text-red-400 text-sm font-medium flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" />请完成必要条件</span>
              )}
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center"><RotateCcw className="w-5 h-5 text-orange-400" /></div>
              <div><h3 className="text-white font-semibold">回滚操作</h3><p className="text-slate-500 text-xs">选择产品线并执行回滚</p></div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">选择产品线</label>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50">
                  {productLines.map((p) => (<option key={p.id} value={p.id}>{p.name} - 当前版本 {p.currentVersion}</option>))}
                </select>
              </div>
              {currentProduct && (
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-3"><span className="text-slate-500 text-sm">回滚方向</span><span className="text-red-400 text-xs bg-red-500/10 px-2 py-0.5 rounded-full">版本降级</span></div>
                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="text-center"><p className="text-slate-500 text-xs mb-1">当前版本</p><p className="text-white font-mono font-bold text-lg">{currentProduct.currentVersion}</p></div>
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center"><ArrowRight className="w-5 h-5 text-red-400" /></div>
                    <div className="text-center"><p className="text-slate-500 text-xs mb-1">回滚至</p><p className="text-emerald-400 font-mono font-bold text-lg">{currentProduct.pendingVersion}</p></div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30"><Users className="w-4 h-4 text-blue-400 mb-1.5" /><p className="text-slate-500 text-xs">影响用户</p><p className="text-white font-medium text-sm">约 120万</p></div>
                <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30"><Database className="w-4 h-4 text-purple-400 mb-1.5" /><p className="text-slate-500 text-xs">数据变更</p><p className="text-amber-400 font-medium text-sm">有风险</p></div>
                <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/30"><Zap className="w-4 h-4 text-emerald-400 mb-1.5" /><p className="text-slate-500 text-xs">预计耗时</p><p className="text-white font-medium text-sm">约 15 分钟</p></div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">回滚原因</label>
                <textarea value={rollbackReason} onChange={(e) => setRollbackReason(e.target.value)} rows={3} placeholder="请详细描述回滚原因..." className="w-full bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 resize-none placeholder:text-slate-500" />
              </div>
              <button onClick={() => setShowConfirmDialog(true)} disabled={!requiredChecked} className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${requiredChecked ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'}`}>
                <RotateCcw className="w-4 h-4" />执行回滚
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/40 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center"><FileText className="w-5 h-5 text-cyan-400" /></div>
              <div><h3 className="text-white font-semibold">历史回滚记录</h3><p className="text-slate-500 text-xs">共 {rollbackRecords.length} 条记录</p></div>
            </div>
            <div className="space-y-3">
              {rollbackRecords.map((record) => (<RollbackRecordItem key={record.id} record={record} />))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-400 font-semibold mb-2">安全提示</h4>
                <ul className="space-y-1.5 text-sm text-amber-200/80">
                  <li>• 回滚操作不可逆，请谨慎操作</li>
                  <li>• 建议在低峰期执行回滚</li>
                  <li>• 确保已备份关键数据</li>
                  <li>• 通知相关团队和人员</li>
                  <li>• 准备好应急预案</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-400" /></div>
              <div><h3 className="text-white font-bold text-lg">确认回滚？</h3><p className="text-slate-400 text-sm">此操作不可逆</p></div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-4 mb-4 border border-red-500/20">
              <p className="text-slate-300 text-sm leading-relaxed">
                您即将将 <span className="text-white font-medium">{currentProduct?.name}</span> 从
                <span className="text-red-400 font-mono"> {currentProduct?.currentVersion} </span>回滚到
                <span className="text-emerald-400 font-mono"> {currentProduct?.pendingVersion}</span>。
                这可能导致数据丢失和服务中断。
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-slate-400 text-sm mb-2">请输入 <span className="text-red-400 font-medium">确认回滚</span> 以继续</label>
              <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="请输入确认回滚" className="w-full bg-slate-900/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 placeholder:text-slate-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowConfirmDialog(false); setConfirmText(''); }} className="flex-1 py-2.5 px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors">取消</button>
              <button onClick={handleConfirmRollback} disabled={!canRollback} className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${canRollback ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'}`}>
                <RotateCcw className="w-4 h-4" />确认回滚
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
