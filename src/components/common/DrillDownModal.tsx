import React from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import { AlertTriangle, ArrowRight, Database, ExternalLink, ShieldAlert, CheckCircle2, User, Clock } from 'lucide-react';

export const DrillDownModal: React.FC = () => {
  const {
    drillDown,
    closeDrillDown,
    committees,
    kpis,
    dataSources,
    issues,
    navigateToCommittee,
    resolveIssue,
    sendReminderNotice,
    setActiveTab
  } = useIntelligence();

  if (!drillDown.isOpen) return null;

  const currentCommittee = committees.find(c => c.id === drillDown.committeeId);
  const currentKpi = kpis.find(k => k.id === drillDown.kpiId);
  const currentSource = dataSources.find(s => s.id === drillDown.sourceId || (currentKpi && s.id === currentKpi.connectedSourceId));
  const currentIssue = issues.find(i => i.id === drillDown.issueId);

  const handleResolve = () => {
    if (currentIssue) {
      resolveIssue(
        currentIssue.id,
        currentIssue.rootCause || 'Leadership executive review completed.',
        'Action executed and verified across committee workflow.'
      );
      closeDrillDown();
    }
  };

  const handleSendNotice = () => {
    if (currentCommittee) {
      const res = sendReminderNotice(currentCommittee.id);
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Executive Intelligence Audit</span>
                <span>·</span>
                <span className="font-mono text-slate-300">{currentCommittee?.name || 'Whole-Team Scope'}</span>
              </div>
              <h3 className="text-base font-semibold text-white mt-0.5">{drillDown.title}</h3>
            </div>
          </div>
          <button onClick={closeDrillDown} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        {/* Content body */}
        <div className="my-4 space-y-4 overflow-y-auto pr-1">
          {/* Issue Details if present */}
          {currentIssue && (
            <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Operational Bottleneck
                </span>
                <span className="text-xs font-mono text-rose-400 font-medium">
                  {currentIssue.severity} Priority · {currentIssue.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentIssue.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/60">
                <div>
                  <span className="text-slate-500 block mb-0.5">Assigned Officer</span>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentIssue.assignedTo}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Resolution Deadline</span>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{currentIssue.deadline}</span>
                    {currentIssue.isOverdue && (
                      <span className="text-rose-400 font-medium text-[11px]">(Overdue)</span>
                    )}
                  </div>
                </div>
              </div>

              {currentIssue.rootCause && (
                <div className="pt-2 text-xs border-t border-slate-800/60">
                  <span className="text-slate-500 block mb-0.5">Diagnosed Root Cause</span>
                  <p className="text-slate-300">{currentIssue.rootCause}</p>
                </div>
              )}

              {currentIssue.correctiveAction && (
                <div className="pt-2 text-xs border-t border-slate-800/60">
                  <span className="text-slate-500 block mb-0.5">Mandated Corrective Action</span>
                  <p className="text-sky-300">{currentIssue.correctiveAction}</p>
                </div>
              )}
            </div>
          )}

          {/* Committee Summary Card */}
          {currentCommittee && (
            <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Committee Governance Profile
                </span>
                <span className="text-xs text-slate-400">
                  Status: <strong className="text-slate-200">{currentCommittee.status}</strong>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block">Lead Officer</span>
                  <span>{currentCommittee.leadName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Active Headcount</span>
                  <span className="font-mono">{currentCommittee.memberCount} members</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Cadence & Sync</span>
                  <span>{currentCommittee.reportingCadence} ({currentCommittee.meetingDay})</span>
                </div>
              </div>
            </div>
          )}

          {/* KPI Context */}
          {currentKpi && (
            <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Configured KPI Metric
                </span>
                <span className="text-xs font-mono text-slate-400">{currentKpi.code}</span>
              </div>
              <h4 className="text-sm font-medium text-white">{currentKpi.title}</h4>
              <p className="text-xs text-slate-400">{currentKpi.description}</p>
              
              <div className="flex items-center gap-6 pt-2 text-xs font-mono border-t border-slate-800/60">
                <div>
                  <span className="text-slate-500 block text-[11px]">Configured Target</span>
                  <span className="text-white font-medium">{currentKpi.target.toLocaleString()} {currentKpi.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Latest Recorded Actual</span>
                  {currentKpi.isMissingReport || currentKpi.currentValue === null ? (
                    <span className="text-rose-400 font-medium">Missing Report (Unsubmitted)</span>
                  ) : (
                    <span className="text-sky-300 font-medium">
                      {currentKpi.currentValue.toLocaleString()} {currentKpi.unit}
                      {currentKpi.currentValue === 0 && ' (True Zero Reported)'}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Aggregation Formula</span>
                  <span className="text-slate-400">{currentKpi.aggregationMethod}</span>
                </div>
              </div>
            </div>
          )}

          {/* Supporting Data Source Provenance & Raw Rows */}
          {currentSource && (
            <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Connected Data Source Provenance
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Health: {currentSource.validationHealthScore}% · Synced {currentSource.lastSyncTime}
                </span>
              </div>
              <div className="text-xs text-slate-300">
                <div className="font-medium text-white">{currentSource.name}</div>
                <div className="text-slate-400 truncate mt-0.5 font-mono">{currentSource.url}</div>
              </div>

              {currentSource.recentError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded text-xs text-rose-300">
                  <div className="flex items-center gap-1.5 font-medium mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Schema Validation Discrepancy Detected</span>
                  </div>
                  <span>{currentSource.recentError}</span>
                </div>
              )}

              {/* Sample Raw Records */}
              {currentSource.sampleRows && currentSource.sampleRows.length > 0 && (
                <div className="mt-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Ingested Raw Records Sample ({currentSource.sampleRows.length} rows preview)
                  </span>
                  <div className="overflow-x-auto border border-slate-800 rounded">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                        <tr>
                          {Object.keys(currentSource.sampleRows[0]).map(key => (
                            <th key={key} className="p-2 whitespace-nowrap">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {currentSource.sampleRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/50">
                            {Object.values(row).map((val: any, cIdx) => (
                              <td key={cIdx} className="p-2 whitespace-nowrap">{String(val)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            {currentCommittee && (
              <button
                onClick={() => {
                  navigateToCommittee(currentCommittee.id);
                  closeDrillDown();
                }}
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Open {currentCommittee.name} Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {currentSource && (
              <button
                onClick={() => {
                  setActiveTab('sources');
                  closeDrillDown();
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <span>View All Sources</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentCommittee && currentCommittee.status === 'Missing Report' && (
              <button
                onClick={handleSendNotice}
                className="px-3.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors"
              >
                Send Reminder Notice
              </button>
            )}
            {currentIssue && currentIssue.status !== 'Resolved' && (
              <button
                onClick={handleResolve}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Action Resolved</span>
              </button>
            )}
            <button
              onClick={closeDrillDown}
              className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
