import React from 'react';
import { useIntelligence, NavigationTab } from '../../context/IntelligenceContext';
import {
  LayoutDashboard,
  Users,
  Database,
  Sliders,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  Plus,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileQuestion
} from 'lucide-react';

export const Sidebar: React.FC<{
  onOpenAddCommittee: () => void;
  onOpenOhiModal: () => void;
}> = ({ onOpenAddCommittee, onOpenOhiModal }) => {
  const {
    activeTab,
    setActiveTab,
    committees,
    selectedCommitteeId,
    setSelectedCommitteeId,
    stats,
    issues,
    resetAllData
  } = useIntelligence();

  const activeCommittees = committees.filter(c => !c.isArchived);
  const activeIssuesCount = issues.filter(i => i.status !== 'Resolved').length;

  const handleSelectCommittee = (commId: string) => {
    setSelectedCommitteeId(commId);
    setActiveTab('committee');
  };

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-65px)]">
      {/* Top Organization Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            ALIENS ACTIVITY
          </span>
          <span className="font-mono text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            v2.6 ORG
          </span>
        </div>
        <div className="mt-1 font-semibold text-white text-sm truncate">
          Whole-Team Intelligence
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
          <span>{stats.activeCommittees} Committees</span>
          <span>·</span>
          <span>{stats.totalHeadcount} Members</span>
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="p-3 space-y-1">
        <button
          onClick={() => setActiveTab('executive')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'executive'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Overview</span>
          </div>
          {stats.healthIndex > 0 && (
            <span className="font-mono text-[11px] text-slate-400">{stats.healthIndex}%</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'sources'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4" />
            <span>Data Sources</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">Google Feeds</span>
        </button>

        <button
          onClick={() => setActiveTab('kpis')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'kpis'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4" />
            <span>KPI Registry</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'compliance'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-4 h-4" />
            <span>Reporting Compliance</span>
          </div>
          {stats.missingReportCount > 0 && (
            <span className="font-mono text-[11px] text-rose-400 font-semibold">
              {stats.missingReportCount} late
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('actions')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'actions'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Corrective Actions</span>
          </div>
          {activeIssuesCount > 0 && (
            <span className="font-mono text-[11px] text-amber-400 font-semibold">
              {activeIssuesCount}
            </span>
          )}
        </button>
      </div>

      {/* Committees Sub-Navigation */}
      <div className="flex-1 p-3 border-t border-slate-800/80 overflow-y-auto">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Committees ({activeCommittees.length})
          </span>
          <button
            onClick={onOpenAddCommittee}
            title="Register new committee"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        <div className="space-y-0.5">
          {activeCommittees.map(comm => {
            const isSelected = activeTab === 'committee' && selectedCommitteeId === comm.id;
            return (
              <button
                key={comm.id}
                onClick={() => handleSelectCommittee(comm.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-slate-800 text-sky-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[10px] text-slate-500 font-semibold shrink-0">
                    {comm.code}
                  </span>
                  <span className="truncate">{comm.name}</span>
                </div>

                <div className="shrink-0 ml-1">
                  {comm.status === 'On Track' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" title="On Track" />
                  )}
                  {comm.status === 'Needs Attention' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" title="Needs Attention" />
                  )}
                  {comm.status === 'Critical' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" title="Critical Backlog" />
                  )}
                  {comm.status === 'Missing Report' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" title="Missing Report" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Governance Card & Reset */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
        <button
          onClick={onOpenOhiModal}
          className="w-full p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors text-left"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Health Index (OHI)</span>
            <span className="font-mono font-bold text-sky-400">{stats.healthIndex}/100</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-sky-400"
              style={{ width: `${stats.healthIndex}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Click to configure pillar weights
          </span>
        </button>

        <button
          onClick={() => {
            if (confirm('Reset ALIENS Intelligence platform to default seed data?')) {
              resetAllData();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Sample Telemetry</span>
        </button>
      </div>
    </aside>
  );
};
