import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import {
  FileCheck,
  Clock,
  AlertTriangle,
  Mail,
  Send,
  Calendar,
  CheckCircle2,
  FileQuestion,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { RadialProgress } from '../common/Charts';

export const ReportingComplianceView: React.FC = () => {
  const {
    committees,
    submissions,
    selectedPeriod,
    setSelectedPeriod,
    sendReminderNotice,
    navigateToCommittee,
    openDrillDown,
    stats
  } = useIntelligence();

  const [reminderStatus, setReminderStatus] = useState<string | null>(null);

  const activeCommittees = committees.filter(c => !c.isArchived);

  // Group submissions by committee for current period
  const currentSubmissions = submissions.filter(s => s.period === selectedPeriod);

  const handleSendReminder = (commId: string) => {
    const res = sendReminderNotice(commId);
    setReminderStatus(res.message);
    setTimeout(() => setReminderStatus(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Governance & Accountability</span>
            <span>·</span>
            <span className="text-sky-400 font-medium">Reporting Cadence Enforcement</span>
            <span>·</span>
            <span>{selectedPeriod}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Reporting Compliance & Overdue Submissions
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Track weekly reporting fidelity, detect overdue submissions, dispatch executive leadership notices, and maintain an audit log of whole-team operational filings.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          <span className="text-xs text-slate-400">Target Cycle:</span>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            <option value="Week 41, 2026" className="bg-slate-900 text-white">Week 41, 2026 (Current)</option>
            <option value="Week 40, 2026" className="bg-slate-900 text-white">Week 40, 2026</option>
            <option value="Week 39, 2026" className="bg-slate-900 text-white">Week 39, 2026</option>
            <option value="October 2026" className="bg-slate-900 text-white">October 2026</option>
          </select>
        </div>
      </div>

      {/* Reminder notification banner */}
      {reminderStatus && (
        <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-lg text-xs text-sky-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-sky-400" />
            <span>{reminderStatus}</span>
          </div>
          <button onClick={() => setReminderStatus(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Compliance Overview Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
              On-Time Filing Rate
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-white">
                {stats.overallComplianceRate}%
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Nominal benchmark: ≥ 90%
            </div>
          </div>
          <RadialProgress
            value={stats.overallComplianceRate}
            size={70}
            strokeWidth={6}
            color={stats.overallComplianceRate >= 90 ? '#38bdf8' : '#f59e0b'}
          />
        </div>

        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Filing Status Breakdown
          </span>
          <div className="flex items-center gap-4 pt-2 text-xs">
            <div>
              <span className="text-emerald-400 font-mono font-bold text-lg block">
                {currentSubmissions.filter(s => s.status === 'On Time').length}
              </span>
              <span className="text-slate-400">On Time</span>
            </div>
            <div>
              <span className="text-amber-400 font-mono font-bold text-lg block">
                {currentSubmissions.filter(s => s.status === 'Late').length}
              </span>
              <span className="text-slate-400">Late Filing</span>
            </div>
            <div>
              <span className="text-rose-400 font-mono font-bold text-lg block">
                {stats.missingReportCount}
              </span>
              <span className="text-slate-400">Overdue / Missing</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
            Cadence & Schedule Mandate
          </span>
          <div className="text-xs text-slate-300 mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Weekly Deadline:</span>
              <span className="font-mono text-white">Sundays 23:59 GMT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Grace Period:</span>
              <span className="font-mono text-slate-300">12 Hours (Auto-Late)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Escalation Threshold:</span>
              <span className="font-mono text-rose-400">&gt; 24h → Executive Notice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Whole-Team Submissions Grid */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Committee Submission Matrix: {selectedPeriod}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit verification of official periodic reports logged across all committees
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activeCommittees.length} Tracked Workstreams
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Committee</th>
                <th className="py-3 px-3">Lead & Officer</th>
                <th className="py-3 px-3">Submission Timestamp</th>
                <th className="py-3 px-3">Compliance Status</th>
                <th className="py-3 px-3">Metrics Filed</th>
                <th className="py-3 px-3">Leadership Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {activeCommittees.map(comm => {
                const sub = currentSubmissions.find(s => s.committeeId === comm.id);
                const isOverdue = !sub || sub.status === 'Overdue';
                const isLate = sub?.status === 'Late';
                const isOnTime = sub?.status === 'On Time';

                return (
                  <tr key={comm.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Committee */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {comm.code}
                        </span>
                        <div>
                          <span className="font-semibold text-white block">{comm.name}</span>
                          <span className="text-[11px] text-slate-500">{comm.reportingCadence}</span>
                        </div>
                      </div>
                    </td>

                    {/* Lead */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-200">{comm.leadName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{comm.leadEmail}</div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-3 font-mono">
                      {sub && sub.submittedAt ? (
                        <span className="text-slate-200">{sub.submittedAt}</span>
                      ) : (
                        <span className="text-rose-400 font-medium">Unsubmitted</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {isOnTime && (
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>On Time</span>
                        </span>
                      )}
                      {isLate && (
                        <span className="text-amber-400 font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late (+{sub?.notes ? 'Delayed' : 'Pending'})</span>
                        </span>
                      )}
                      {isOverdue && (
                        <span className="text-rose-400 font-medium flex items-center gap-1.5">
                          <FileQuestion className="w-3.5 h-3.5" />
                          <span>Overdue (&gt; 24h)</span>
                        </span>
                      )}
                    </td>

                    {/* Metrics Filed */}
                    <td className="py-3.5 px-3 font-mono">
                      {sub ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-white font-medium">{sub.kpisReportedCount} reported</span>
                          {sub.kpisMissingCount > 0 && (
                            <span className="text-rose-400 text-[11px]">
                              ({sub.kpisMissingCount} missing)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-rose-400">0 / All Missing</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-3">
                      <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">
                        {sub?.notes || 'Standard cycle submission.'}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isOverdue && (
                          <button
                            onClick={() => handleSendReminder(comm.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded transition-colors flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Remind</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigateToCommittee(comm.id)}
                          className="px-2.5 py-1 text-xs font-medium text-sky-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 transition-colors"
                        >
                          View →
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
    </div>
  );
};
