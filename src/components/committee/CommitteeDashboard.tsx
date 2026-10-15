import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import {
  Users,
  Calendar,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  ExternalLink,
  Plus,
  RefreshCw,
  FileQuestion,
  FileText,
  Edit2,
  Archive,
  TrendingUp,
  Check
} from 'lucide-react';
import { Sparkline, TrendChart, ComparisonBar } from '../common/Charts';
import { KpiDefinition, DataSource } from '../../types';

export const CommitteeDashboard: React.FC = () => {
  const {
    committees,
    selectedCommitteeId,
    setSelectedCommitteeId,
    kpis,
    dataSources,
    issues,
    submissions,
    selectedPeriod,
    syncDataSource,
    submitCommitteeReport,
    archiveCommittee,
    openDrillDown
  } = useIntelligence();

  // Active committee
  const activeCommittees = committees.filter(c => !c.isArchived);
  const currentCommitteeId = selectedCommitteeId || activeCommittees[0]?.id;
  const currentCommittee = committees.find(c => c.id === currentCommitteeId) || activeCommittees[0];

  // State for report log modal
  const [isLogReportOpen, setIsLogReportOpen] = useState(false);
  const [reportNotes, setReportNotes] = useState('');
  const [formKpiValues, setFormKpiValues] = useState<Record<string, { val: string; isMissing: boolean }>>({});
  const [syncingSourceId, setSyncingSourceId] = useState<string | null>(null);

  if (!currentCommittee) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active committees found in registry.
      </div>
    );
  }

  // Filter committee specific assets
  const committeeKpis = kpis.filter(k => k.committeeId === currentCommittee.id);
  const committeeSources = dataSources.filter(s => s.assignedCommitteeIds.includes(currentCommittee.id));
  const committeeIssues = issues.filter(i => i.committeeId === currentCommittee.id);
  const committeeSubmissions = submissions.filter(s => s.committeeId === currentCommittee.id);

  // Handle data source sync
  const handleSyncSource = (srcId: string) => {
    setSyncingSourceId(srcId);
    setTimeout(() => {
      syncDataSource(srcId);
      setSyncingSourceId(null);
    }, 600);
  };

  // Open Log Report Modal
  const openReportModal = () => {
    const initialVals: Record<string, { val: string; isMissing: boolean }> = {};
    committeeKpis.forEach(k => {
      initialVals[k.id] = {
        val: k.currentValue !== null ? String(k.currentValue) : '',
        isMissing: k.isMissingReport
      };
    });
    setFormKpiValues(initialVals);
    setReportNotes('');
    setIsLogReportOpen(true);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = committeeKpis.map(k => {
      const entry = formKpiValues[k.id] || { val: '', isMissing: false };
      return {
        kpiId: k.id,
        value: entry.isMissing || entry.val === '' ? null : Number(entry.val),
        isMissing: entry.isMissing
      };
    });

    submitCommitteeReport(currentCommittee.id, payload, reportNotes);
    setIsLogReportOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Committee Selector Pill Bar / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Committee:
        </span>
        {activeCommittees.map(comm => (
          <button
            key={comm.id}
            onClick={() => setSelectedCommitteeId(comm.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              comm.id === currentCommittee.id
                ? 'bg-sky-400 text-slate-900 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800'
            }`}
          >
            {comm.name}
          </button>
        ))}
      </div>

      {/* Committee Hero Governance Profile */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-mono text-sky-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {currentCommittee.code}
              </span>
              <span>·</span>
              <span>{currentCommittee.category}</span>
              <span>·</span>
              <span>Cadence: {currentCommittee.reportingCadence}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {currentCommittee.name} Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {currentCommittee.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={openReportModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Log Period Report</span>
            </button>
            <button
              onClick={() => archiveCommittee(currentCommittee.id)}
              title="Archive committee from active list"
              className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lead and Schedule metadata strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-500 block">Lead Officer</span>
            <div className="font-medium text-slate-200 mt-0.5">{currentCommittee.leadName}</div>
            <span className="text-[11px] text-slate-400">{currentCommittee.leadEmail}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Active Headcount</span>
            <div className="font-mono font-medium text-slate-200 mt-0.5">
              {currentCommittee.memberCount} Registered Members
            </div>
          </div>

          <div>
            <span className="text-slate-500 block">Coordination Schedule</span>
            <div className="font-medium text-slate-200 mt-0.5">{currentCommittee.meetingDay}</div>
          </div>

          <div>
            <span className="text-slate-500 block">Current Status</span>
            <div className="mt-0.5 font-medium flex items-center gap-1.5">
              {currentCommittee.status === 'On Track' && <span className="text-emerald-400">On Track</span>}
              {currentCommittee.status === 'Needs Attention' && <span className="text-amber-400">Needs Attention</span>}
              {currentCommittee.status === 'Critical' && <span className="text-rose-400">Critical Backlog</span>}
              {currentCommittee.status === 'Missing Report' && <span className="text-rose-400">Missing Weekly Report</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Committee KPIs Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Configured Key Performance Indicators</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Operational metrics configured specifically for {currentCommittee.name}. Missing reports are segregated from zero values.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {committeeKpis.length} active metric(s)
          </span>
        </div>

        {committeeKpis.length === 0 ? (
          <div className="p-8 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
            No KPIs currently configured for {currentCommittee.name}. Use the KPI Registry to assign metrics.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {committeeKpis.map(kpi => {
              const isMissing = kpi.isMissingReport || kpi.currentValue === null;
              const isZero = kpi.currentValue === 0;
              const connSource = dataSources.find(s => s.id === kpi.connectedSourceId);

              // Target check
              let isNominal = false;
              if (!isMissing && kpi.currentValue !== null) {
                if (kpi.id === 'kpi-pr-response-time' || kpi.id === 'kpi-med-turnaround' || kpi.id === 'kpi-trs-variance') {
                  isNominal = kpi.currentValue <= kpi.target;
                } else if (kpi.id === 'kpi-chr-safety-incidents') {
                  isNominal = kpi.currentValue === 0;
                } else {
                  isNominal = kpi.currentValue >= kpi.target * 0.9;
                }
              }

              return (
                <div
                  key={kpi.id}
                  className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Code & Aggregation */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-mono text-slate-400 font-semibold">{kpi.code}</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {kpi.aggregationMethod} · {kpi.reportingCadence}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white">{kpi.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{kpi.description}</p>
                  </div>

                  {/* Value / Target Matrix */}
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Latest Result:</span>
                      {isMissing ? (
                        <div className="text-right">
                          <span className="text-xs font-semibold text-rose-400 block">
                            Missing Report
                          </span>
                          <span className="text-[10px] text-slate-500">Unsubmitted cycle</span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-lg font-bold font-mono tabular-nums text-white">
                            {kpi.currentValue?.toLocaleString()}
                            <span className="text-xs text-slate-400 ml-1">
                              {kpi.unit === 'percentage' ? '%' : kpi.unit === 'hours' ? 'hrs' : ''}
                            </span>
                          </span>
                          {isZero && (
                            <span className="text-[10px] text-emerald-400 block font-medium">
                              (Genuine 0 reported)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-1.5 text-slate-400">
                      <span>Configured Target:</span>
                      <span className="font-mono text-slate-200">
                        {kpi.target.toLocaleString()} {kpi.unit === 'percentage' ? '%' : kpi.unit === 'hours' ? 'hrs' : ''}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {!isMissing && kpi.currentValue !== null && (
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${isNominal ? 'bg-sky-400' : 'bg-rose-400'} transition-all`}
                          style={{
                            width: `${Math.min(100, Math.max(5, (kpi.currentValue / (kpi.target || 1)) * 100))}%`
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Historical Trend Sparkline */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Historical Cycles:</span>
                    <Sparkline
                      data={kpi.history.map(h => h.actual)}
                      color={isNominal ? '#38bdf8' : '#f43f5e'}
                    />
                  </div>

                  {/* Connected Source Provenance */}
                  {connSource && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                      <div className="flex items-center gap-1 truncate max-w-[170px]">
                        <Database className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate">{connSource.name}</span>
                      </div>
                      <span className="font-mono text-slate-500 shrink-0">
                        Sync: {connSource.lastSyncTime}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Trend Deep-Dive Chart for Committee */}
      {committeeKpis.length > 0 && (
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Multi-Cycle Metric Trend: {committeeKpis[0].title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Timeline audit showing actual results versus configured targets
              </p>
            </div>
            <span className="text-xs font-mono text-sky-400">
              {committeeKpis[0].code} · {committeeKpis[0].reportingCadence}
            </span>
          </div>

          <div className="pt-2">
            <TrendChart
              history={committeeKpis[0].history}
              unit={committeeKpis[0].unit}
              height={200}
            />
          </div>
        </div>
      )}

      {/* Connected Google Sheets & Forms for This Committee */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Connected Committee Data Sources</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Google Sheets and Google Forms response pipelines assigned to {currentCommittee.name}
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {committeeSources.length} source(s) mapped
          </span>
        </div>

        {committeeSources.length === 0 ? (
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-400 text-center">
            No Google Sheets or Forms assigned yet. Add one in the Data Sources Center.
          </div>
        ) : (
          <div className="space-y-3">
            {committeeSources.map(source => (
              <div
                key={source.id}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                      {source.type}
                    </span>
                    <h3 className="text-sm font-medium text-white">{source.name}</h3>
                    {source.sheetName && (
                      <span className="text-xs text-slate-400 font-mono">[{source.sheetName}]</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate max-w-xl">
                    {source.url}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>Validation Score: <strong className="text-white font-mono">{source.validationHealthScore}%</strong></span>
                    <span>·</span>
                    <span>{source.rowCount} records</span>
                    <span>·</span>
                    <span>Last sync: {source.lastSyncTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSyncSource(source.id)}
                    disabled={syncingSourceId === source.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingSourceId === source.id ? 'animate-spin text-sky-400' : ''}`} />
                    <span>{syncingSourceId === source.id ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
                    title="Open external Google Sheet or Form"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Committee Operational Issues & Corrective Actions */}
      {committeeIssues.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Active Operational Bottlenecks ({committeeIssues.length})</h2>
            <span className="text-xs text-slate-400">Assigned corrective measures</span>
          </div>

          <div className="space-y-2">
            {committeeIssues.map(issue => (
              <div
                key={issue.id}
                onClick={() => openDrillDown({
                  issueId: issue.id,
                  committeeId: currentCommittee.id,
                  title: issue.title
                })}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-rose-400 font-mono">{issue.severity}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-white font-medium">{issue.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{issue.description}</p>
                </div>
                <div className="text-right text-xs shrink-0">
                  <span className="text-slate-300 block">{issue.assignedTo}</span>
                  <span className="font-mono text-slate-500">Due: {issue.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Period Report Modal */}
      {isLogReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">Log {currentCommittee.name} Periodic Report</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recording official actuals for {selectedPeriod}. Clearly flag missing data vs actual zeros.
                </p>
              </div>
              <button onClick={() => setIsLogReportOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveReport} className="my-4 space-y-4 overflow-y-auto pr-1 text-xs">
              <div className="space-y-3">
                {committeeKpis.map(kpi => {
                  const state = formKpiValues[kpi.id] || { val: '', isMissing: false };
                  return (
                    <div key={kpi.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-sky-400 font-semibold">{kpi.code}:</span>
                          <span className="text-white font-medium ml-1.5">{kpi.title}</span>
                        </div>
                        <span className="text-slate-500 font-mono">Target: {kpi.target} {kpi.unit}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="number"
                            step="any"
                            disabled={state.isMissing}
                            placeholder={state.isMissing ? 'Flagged as missing report' : `Enter recorded actual (${kpi.unit})`}
                            value={state.val}
                            onChange={e => {
                              const val = e.target.value;
                              setFormKpiValues(prev => ({
                                ...prev,
                                [kpi.id]: { val, isMissing: false }
                              }));
                            }}
                            className={`w-full px-3 py-1.5 rounded-lg border font-mono text-xs focus:outline-none ${
                              state.isMissing
                                ? 'bg-slate-900 border-slate-800 text-slate-600'
                                : 'bg-slate-900 border-slate-700 text-white focus:border-sky-500'
                            }`}
                          />
                        </div>

                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white select-none">
                          <input
                            type="checkbox"
                            checked={state.isMissing}
                            onChange={e => {
                              const isMissing = e.target.checked;
                              setFormKpiValues(prev => ({
                                ...prev,
                                [kpi.id]: { val: isMissing ? '' : prev[kpi.id]?.val || '0', isMissing }
                              }));
                            }}
                            className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0"
                          />
                          <span className="text-[11px]">Flag as Missing</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Leadership Audit & Verification Notes</label>
                <textarea
                  rows={2}
                  placeholder="Context on variances, delays, or milestones accomplished..."
                  value={reportNotes}
                  onChange={e => setReportNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogReportOpen(false)}
                  className="px-4 py-2 font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Verified Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
