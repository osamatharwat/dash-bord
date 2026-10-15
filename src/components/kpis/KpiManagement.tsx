import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import { KpiDefinition, MetricUnit, AggregationMethod, ReportingCadence } from '../../types';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Database,
  ArrowRight
} from 'lucide-react';
import { KpiModal } from './KpiModal';

export const KpiManagement: React.FC = () => {
  const {
    kpis,
    committees,
    dataSources,
    deleteKpi,
    updateKpi
  } = useIntelligence();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KpiDefinition | null>(null);
  const [selectedCommitteeFilter, setSelectedCommitteeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAuditKpi, setActiveAuditKpi] = useState<KpiDefinition | null>(null);

  // Quick target adjust state
  const [quickTargetId, setQuickTargetId] = useState<string | null>(null);
  const [newTargetVal, setNewTargetVal] = useState<string>('');
  const [targetReason, setTargetReason] = useState<string>('');

  // Filtered KPIs
  const filteredKpis = kpis.filter(k => {
    if (selectedCommitteeFilter !== 'all') {
      if (k.committeeId !== selectedCommitteeFilter) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        k.code.toLowerCase().includes(q) ||
        k.title.toLowerCase().includes(q) ||
        k.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenEdit = (k: KpiDefinition) => {
    setEditingKpi(k);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingKpi(null);
    setIsModalOpen(true);
  };

  const handleSaveQuickTarget = (kpi: KpiDefinition) => {
    if (!newTargetVal) return;
    updateKpi(
      kpi.id,
      { target: Number(newTargetVal) },
      targetReason || 'Quarterly operational recalibration'
    );
    setQuickTargetId(null);
    setNewTargetVal('');
    setTargetReason('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Governance Registry</span>
            <span>·</span>
            <span className="text-sky-400 font-medium">Organization-Wide Metric Standards</span>
            <span>·</span>
            <span>{kpis.length} Active Key Indicators</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Configurable KPI & Target Management
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Centralized definition of committee-specific and organization-level KPIs, formulas, aggregation rules, performance thresholds, and historical target audit trails.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New KPI</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Filter by Committee:</span>
          <select
            value={selectedCommitteeFilter}
            onChange={e => setSelectedCommitteeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">All Committees ({committees.length})</option>
            {committees.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search metric title, code, or formula..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-72"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* KPI Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Code & Metric Name</th>
                <th className="py-3 px-3">Owner Committee</th>
                <th className="py-3 px-3">Aggregation & Cadence</th>
                <th className="py-3 px-3">Target & Current Actual</th>
                <th className="py-3 px-3">Threshold Boundaries</th>
                <th className="py-3 px-3">Connected Feed</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredKpis.map(kpi => {
                const comm = committees.find(c => c.id === kpi.committeeId);
                const source = dataSources.find(s => s.id === kpi.connectedSourceId);
                const isQuickEditing = quickTargetId === kpi.id;

                return (
                  <tr key={kpi.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Code & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sky-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {kpi.code}
                        </span>
                        <div>
                          <div className="font-semibold text-white">{kpi.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{kpi.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Committee */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-200 font-medium">{comm?.name || 'Whole-Team'}</div>
                      <div className="text-[11px] text-slate-500">{comm?.leadName}</div>
                    </td>

                    {/* Aggregation */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="text-slate-200 font-medium">{kpi.aggregationMethod}</div>
                      <div className="text-[11px] text-slate-500">{kpi.reportingCadence}</div>
                    </td>

                    {/* Target & Current */}
                    <td className="py-3.5 px-3">
                      {isQuickEditing ? (
                        <div className="space-y-1.5 p-2 bg-slate-900 rounded border border-slate-700 w-52">
                          <input
                            type="number"
                            placeholder="New Target"
                            value={newTargetVal}
                            onChange={e => setNewTargetVal(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Reason for change..."
                            value={targetReason}
                            onChange={e => setTargetReason(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-white"
                          />
                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              onClick={() => setQuickTargetId(null)}
                              className="text-[10px] px-2 py-0.5 text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveQuickTarget(kpi)}
                              className="text-[10px] px-2 py-0.5 bg-sky-500 text-slate-900 font-semibold rounded"
                            >
                              Save Target
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-white font-semibold">
                              Target: {kpi.target.toLocaleString()} {kpi.unit === 'percentage' ? '%' : ''}
                            </span>
                            <button
                              onClick={() => {
                                setQuickTargetId(kpi.id);
                                setNewTargetVal(String(kpi.target));
                              }}
                              title="Quick recalibrate target"
                              className="text-slate-500 hover:text-sky-400"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-[11px] font-mono">
                            {kpi.isMissingReport || kpi.currentValue === null ? (
                              <span className="text-rose-400">Missing Report</span>
                            ) : (
                              <span className="text-sky-300">
                                Actual: {kpi.currentValue.toLocaleString()} {kpi.unit === 'percentage' ? '%' : ''}
                                {kpi.currentValue === 0 && ' (0 reported)'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Thresholds */}
                    <td className="py-3.5 px-3 font-mono text-[11px]">
                      <div>Critical: &lt; {kpi.thresholds.criticalBelow}</div>
                      <div className="text-amber-400">Warning: &lt; {kpi.thresholds.warningBelow}</div>
                      <div className="text-emerald-400">On Track: &ge; {kpi.thresholds.onTrackMin}</div>
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-3">
                      {source ? (
                        <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[150px]">
                          <Database className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate">{source.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">Manual / Unlinked</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {kpi.targetChangeLog && kpi.targetChangeLog.length > 0 && (
                          <button
                            onClick={() => setActiveAuditKpi(kpi)}
                            title="View target change audit trail"
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded border border-slate-800 transition-colors"
                          >
                            <History className="w-3.5 h-3.5 text-sky-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(kpi)}
                          title="Edit KPI Definition"
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded border border-slate-800 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteKpi(kpi.id)}
                          title="Delete KPI"
                          className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-900 rounded border border-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Change Log Modal */}
      {activeAuditKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Target Audit Log: {activeAuditKpi.code}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Historical changes and executive reasons recorded for {activeAuditKpi.title}
                </p>
              </div>
              <button onClick={() => setActiveAuditKpi(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <div className="my-4 space-y-3 overflow-y-auto pr-1">
              {activeAuditKpi.targetChangeLog?.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sky-400 font-medium">
                      Changed from {log.oldTarget} → {log.newTarget}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{log.date}</span>
                  </div>
                  <div className="text-slate-300">Reason: {log.reason}</div>
                  <div className="text-[11px] text-slate-500">Authorized by: {log.changedBy}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveAuditKpi(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit KPI Modal */}
      <KpiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingKpi={editingKpi}
      />
    </div>
  );
};
