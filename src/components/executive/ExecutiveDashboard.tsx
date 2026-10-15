import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  ArrowUpRight,
  Sliders,
  FileQuestion,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { RadialProgress, Sparkline } from '../common/Charts';
import { OrganizationHealthIndexModal } from './OrganizationHealthIndexModal';
import { AddCommitteeModal } from '../committee/AddCommitteeModal';

export const ExecutiveDashboard: React.FC = () => {
  const {
    committees,
    kpis,
    dataSources,
    issues,
    submissions,
    stats,
    selectedPeriod,
    setSelectedPeriod,
    navigateToCommittee,
    openDrillDown
  } = useIntelligence();

  const [isOhiModalOpen, setIsOhiModalOpen] = useState(false);
  const [isAddCommitteeModalOpen, setIsAddCommitteeModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCommittees = committees.filter(c => !c.isArchived);

  // Filtered committees
  const filteredCommittees = activeCommittees.filter(c => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'attention' && c.status !== 'Needs Attention' && c.status !== 'Critical') return false;
      if (statusFilter === 'missing' && c.status !== 'Missing Report') return false;
      if (statusFilter === 'ontrack' && c.status !== 'On Track') return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.leadName.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate committee level KPI fulfillment
  const getCommitteeKpiSummary = (commId: string) => {
    const commKpis = kpis.filter(k => k.committeeId === commId);
    if (commKpis.length === 0) return { total: 0, onTrack: 0, missing: 0 };
    const missing = commKpis.filter(k => k.isMissingReport || k.currentValue === null).length;
    let onTrack = 0;
    commKpis.forEach(k => {
      if (k.currentValue === null) return;
      if (k.id === 'kpi-pr-response-time' || k.id === 'kpi-med-turnaround' || k.id === 'kpi-trs-variance') {
        if (k.currentValue <= k.target) onTrack++;
      } else if (k.id === 'kpi-chr-safety-incidents') {
        if (k.currentValue === 0) onTrack++;
      } else {
        if (k.currentValue >= k.target * 0.9) onTrack++;
      }
    });
    return { total: commKpis.length, onTrack, missing };
  };

  // Get data source health for committee
  const getCommitteeSourceHealth = (commId: string) => {
    const sources = dataSources.filter(s => s.assignedCommitteeIds.includes(commId));
    if (sources.length === 0) return null;
    const avgScore = Math.round(sources.reduce((a, b) => a + b.validationHealthScore, 0) / sources.length);
    const hasError = sources.some(s => s.syncStatus === 'Error' || s.syncStatus === 'Warning');
    return { score: avgScore, hasError, count: sources.length };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Executive Header & Period Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>ALIENS Student Activity</span>
            <span>·</span>
            <span className="text-sky-400 font-medium">Whole-Team Intelligence Console</span>
            <span>·</span>
            <span>{activeCommittees.length} Active Committees</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Organization Executive Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Single-pane leadership monitoring of cross-committee performance, reporting compliance, data source health, and operational bottleneck resolution.
          </p>
        </div>

        {/* Global Period Selector & Add Committee Button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400">Reporting Period:</span>
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="Week 41, 2026" className="bg-slate-900 text-white">Week 41, 2026 (Current)</option>
              <option value="Week 40, 2026" className="bg-slate-900 text-white">Week 40, 2026</option>
              <option value="Week 39, 2026" className="bg-slate-900 text-white">Week 39, 2026</option>
              <option value="October 2026" className="bg-slate-900 text-white">October 2026 (M-o-M)</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddCommitteeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Add Committee</span>
          </button>
        </div>
      </div>

      {/* 7 Questions Summary Strip / Executive Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Organization Health Index (OHI) */}
        <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl relative group hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                Organization Health Index
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold font-mono tabular-nums text-white">
                  {stats.healthIndex}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <span>Weighted 4-Pillar Model</span>
                <span>·</span>
                <button
                  onClick={() => setIsOhiModalOpen(true)}
                  className="text-sky-400 hover:underline flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Weights</span>
                </button>
              </div>
            </div>
            <RadialProgress
              value={stats.healthIndex}
              size={64}
              strokeWidth={5}
              color={stats.healthIndex >= 85 ? '#38bdf8' : stats.healthIndex >= 70 ? '#f59e0b' : '#f43f5e'}
            />
          </div>
        </div>

        {/* KPI 2: Reporting Compliance Rate */}
        <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Reporting Compliance
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-white">
              {stats.overallComplianceRate}%
            </span>
            <span className="text-xs text-slate-400">on-time</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            {stats.missingReportCount > 0 ? (
              <span className="text-rose-400 font-medium flex items-center gap-1">
                <FileQuestion className="w-3.5 h-3.5" />
                <span>{stats.missingReportCount} Overdue Report(s)</span>
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>All Submissions Filed</span>
              </span>
            )}
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{stats.activeCommittees} tracked</span>
          </div>
        </div>

        {/* KPI 3: Target Attainment */}
        <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Target Attainment Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-white">
              {stats.overallKpiAttainmentRate}%
            </span>
            <span className="text-xs text-slate-400">KPIs met</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>{stats.onTrackCommitteesCount} on track</span>
            <span>·</span>
            <span className="text-amber-400 font-medium">{stats.needsAttentionCount} lagging</span>
            <span>·</span>
            <span className="text-rose-400 font-medium">{stats.criticalCount} critical</span>
          </div>
        </div>

        {/* KPI 4: Source Health & Headcount */}
        <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Data Source Health & Sync
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-white">
              {stats.sourceHealthScore}%
            </span>
            <span className="text-xs text-slate-400">integrity</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1 text-slate-300">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>{dataSources.length} Sheets & Forms</span>
            </div>
            <span>·</span>
            <span className="font-mono">{stats.totalHeadcount} members</span>
          </div>
        </div>
      </div>

      {/* Urgent Operational Bottlenecks & Overdue Actions Banner (Answers Question 6 & 7) */}
      <div className="p-4 bg-slate-950 rounded-xl border border-rose-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white">
              Priority Operational Issues & Overdue Corrective Actions ({issues.filter(i => i.status !== 'Resolved').length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any issue to drill down into root causes and connected Google sources
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {issues.filter(i => i.status !== 'Resolved').map(issue => {
            const comm = committees.find(c => c.id === issue.committeeId);
            return (
              <button
                key={issue.id}
                onClick={() => openDrillDown({
                  issueId: issue.id,
                  committeeId: issue.committeeId,
                  kpiId: issue.supportingKpiId,
                  sourceId: issue.supportingSourceId,
                  title: issue.title
                })}
                className="text-left p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-sky-400">{comm?.name || 'General Org'}</span>
                    <span className="font-mono text-rose-400 font-medium">
                      {issue.severity} · {issue.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white line-clamp-1">{issue.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{issue.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span>Assigned: <strong className="text-slate-300 font-normal">{issue.assignedTo}</strong></span>
                    {issue.isOverdue && (
                      <span className="text-rose-400 font-medium ml-1">· Overdue</span>
                    )}
                  </div>
                  <span className="text-sky-400 flex items-center gap-0.5">
                    Drill Down <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Whole-Team Committee Performance Matrix (Answers Question 1, 2, 3, 4) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Whole-Team Committee Performance Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative monitoring across all registered committees. Missing submissions are explicitly highlighted from true zeros.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Segmented Filter */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({activeCommittees.length})
              </button>
              <button
                onClick={() => setStatusFilter('attention')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'attention' ? 'bg-slate-800 text-amber-400 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Attention ({stats.needsAttentionCount + stats.criticalCount})
              </button>
              <button
                onClick={() => setStatusFilter('missing')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'missing' ? 'bg-slate-800 text-rose-400 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Missing Reports ({stats.missingReportCount})
              </button>
              <button
                onClick={() => setStatusFilter('ontrack')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'ontrack' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                On Track ({stats.onTrackCommitteesCount})
              </button>
            </div>

            {/* Quick Search */}
            <input
              type="text"
              placeholder="Filter committee..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-44"
            />
          </div>
        </div>

        {/* Committee Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Committee</th>
                <th className="py-3 px-3">Lead & Quorum</th>
                <th className="py-3 px-3">Reporting Status</th>
                <th className="py-3 px-3">KPI Attainment</th>
                <th className="py-3 px-3">Source Health</th>
                <th className="py-3 px-3">Primary Metric Preview</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredCommittees.map(comm => {
                const kpiSummary = getCommitteeKpiSummary(comm.id);
                const sourceInfo = getCommitteeSourceHealth(comm.id);
                const primaryKpi = kpis.find(k => k.committeeId === comm.id);
                const isMissing = comm.status === 'Missing Report';

                return (
                  <tr
                    key={comm.id}
                    className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                    onClick={() => navigateToCommittee(comm.id)}
                  >
                    {/* Committee Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {comm.code}
                        </span>
                        <div>
                          <div className="font-semibold text-white group-hover:text-sky-400 transition-colors">
                            {comm.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {comm.category} · {comm.reportingCadence}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Lead & Quorum */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-200">{comm.leadName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {comm.memberCount} members · {comm.meetingDay}
                      </div>
                    </td>

                    {/* Status with Non-Pill Clarity */}
                    <td className="py-3.5 px-3">
                      {comm.status === 'On Track' && (
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>On Track</span>
                        </span>
                      )}
                      {comm.status === 'Needs Attention' && (
                        <span className="text-amber-400 font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Needs Attention</span>
                        </span>
                      )}
                      {comm.status === 'Critical' && (
                        <span className="text-rose-400 font-medium flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Critical Backlog</span>
                        </span>
                      )}
                      {comm.status === 'Missing Report' && (
                        <span className="text-rose-400 font-medium flex items-center gap-1.5">
                          <FileQuestion className="w-3.5 h-3.5" />
                          <span>Missing Report</span>
                        </span>
                      )}
                    </td>

                    {/* KPI Attainment */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-slate-200">
                          {kpiSummary.onTrack}/{kpiSummary.total}
                        </span>
                        <span className="text-slate-500">met</span>
                      </div>
                      {kpiSummary.missing > 0 && (
                        <div className="text-[11px] text-rose-400">
                          {kpiSummary.missing} unfiled KPI(s)
                        </div>
                      )}
                    </td>

                    {/* Source Health */}
                    <td className="py-3.5 px-3">
                      {sourceInfo ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-medium text-slate-200">
                              {sourceInfo.score}%
                            </span>
                            {sourceInfo.hasError && (
                              <span className="text-rose-400 text-[10px]">· Warning</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {sourceInfo.count} connected source(s)
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono">No Source</span>
                      )}
                    </td>

                    {/* Primary Metric Preview */}
                    <td className="py-3.5 px-3">
                      {primaryKpi ? (
                        <div>
                          <div className="text-slate-300 font-medium truncate max-w-[160px]">
                            {primaryKpi.title}
                          </div>
                          <div className="text-[11px] font-mono">
                            {primaryKpi.isMissingReport || primaryKpi.currentValue === null ? (
                              <span className="text-rose-400">Missing Entry</span>
                            ) : (
                              <span className="text-sky-300">
                                {primaryKpi.currentValue.toLocaleString()} / {primaryKpi.target.toLocaleString()} {primaryKpi.unit === 'percentage' ? '%' : ''}
                                {primaryKpi.currentValue === 0 && ' (0 reported)'}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">No KPIs configured</span>
                      )}
                    </td>

                    {/* Direct Drill-down Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToCommittee(comm.id);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-sky-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 transition-colors"
                      >
                        Open Dashboard →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Organization Trends Section (Answers Question 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Compliance Trend */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Reporting Compliance Across Cycles</h3>
              <p className="text-xs text-slate-400 mt-0.5">Weekly whole-team on-time submission rate</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-medium">Nominal: ≥ 90%</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { period: 'Week 38, 2026', rate: 90, onTime: 9, total: 10 },
              { period: 'Week 39, 2026', rate: 90, onTime: 9, total: 10 },
              { period: 'Week 40, 2026', rate: 80, onTime: 8, total: 10 },
              { period: 'Week 41, 2026', rate: stats.overallComplianceRate, onTime: Math.round((stats.overallComplianceRate / 100) * 10), total: 10 }
            ].map((cycle, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{cycle.period}</span>
                  <span className="font-mono tabular-nums text-slate-200">
                    {cycle.rate}% ({cycle.onTime}/{cycle.total} committees)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cycle.rate >= 90 ? 'bg-sky-400' : cycle.rate >= 80 ? 'bg-amber-400' : 'bg-rose-400'} transition-all`}
                    style={{ width: `${cycle.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Committee Comparable Baseline */}
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Cross-Committee Comparable Governance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Strictly comparable operational measures</p>
            </div>
            <span className="text-xs text-slate-400">Strict Metric Isolation</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Data Completeness & Schema Integrity</div>
                <div className="text-[11px] text-slate-400">Automated Google Sheets row validation passes</div>
              </div>
              <span className="text-sm font-mono font-bold text-sky-400">{stats.sourceHealthScore}%</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Cross-Committee Milestone Execution Velocity</div>
                <div className="text-[11px] text-slate-400">134 sprint deliverables completed to date</div>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400">92.5%</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Active Corrective Actions In-Flight</div>
                <div className="text-[11px] text-slate-400">{stats.overdueActionsCount} flagged as overdue resolution</div>
              </div>
              <span className="text-sm font-mono font-bold text-amber-400">{stats.activeIssuesCount} open</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OrganizationHealthIndexModal
        isOpen={isOhiModalOpen}
        onClose={() => setIsOhiModalOpen(false)}
      />

      <AddCommitteeModal
        isOpen={isAddCommitteeModalOpen}
        onClose={() => setIsAddCommitteeModalOpen(false)}
      />
    </div>
  );
};
