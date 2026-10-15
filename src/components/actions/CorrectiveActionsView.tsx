import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import { OperationalIssue } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  User,
  ExternalLink,
  Search,
  Filter,
  Check
} from 'lucide-react';

export const CorrectiveActionsView: React.FC = () => {
  const {
    issues,
    committees,
    kpis,
    dataSources,
    resolveIssue,
    addIssue,
    openDrillDown
  } = useIntelligence();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution modal state
  const [resolvingIssue, setResolvingIssue] = useState<OperationalIssue | null>(null);
  const [rootCauseInput, setRootCauseInput] = useState('');
  const [correctiveActionInput, setCorrectiveActionInput] = useState('');

  // Add issue form state
  const [newTitle, setNewTitle] = useState('');
  const [newCommId, setNewCommId] = useState(committees[0]?.id || '');
  const [newSeverity, setNewSeverity] = useState<OperationalIssue['severity']>('High');
  const [newCategory, setNewCategory] = useState<OperationalIssue['category']>('Operational Bottleneck');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-10-18');

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && issue.status === 'Resolved') return false;
      if (statusFilter === 'resolved' && issue.status !== 'Resolved') return false;
      if (statusFilter === 'overdue' && !issue.isOverdue) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        issue.assignedTo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenResolve = (issue: OperationalIssue) => {
    setResolvingIssue(issue);
    setRootCauseInput(issue.rootCause || '');
    setCorrectiveActionInput(issue.correctiveAction || '');
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingIssue) return;
    resolveIssue(
      resolvingIssue.id,
      rootCauseInput || 'Executive audit review completed.',
      correctiveActionInput || 'Operational mitigation executed.'
    );
    setResolvingIssue(null);
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAssignedTo.trim()) return;

    addIssue({
      committeeId: newCommId,
      title: newTitle.trim(),
      severity: newSeverity,
      category: newCategory,
      description: newDescription.trim(),
      assignedTo: newAssignedTo.trim(),
      deadline: newDeadline,
      status: 'Open',
      rootCause: '',
      correctiveAction: ''
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewAssignedTo('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Leadership Accountability</span>
            <span>·</span>
            <span className="text-sky-400 font-medium">Root Cause & Bottleneck Governance</span>
            <span>·</span>
            <span>{issues.filter(i => i.status !== 'Resolved').length} Active Issues</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Operational Issues & Corrective Action Log
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Track, assign, and enforce resolution for cross-committee operational roadblocks, budget discrepancies, reporting lapses, and metric performance misses.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Dispatch Corrective Action</span>
        </button>
      </div>

      {/* Filter and Controls */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Segmented Filter */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'active' ? 'bg-slate-800 text-sky-400 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({issues.filter(i => i.status !== 'Resolved').length})
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'overdue' ? 'bg-slate-800 text-rose-400 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overdue ({issues.filter(i => i.isOverdue).length})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'resolved' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resolved ({issues.filter(i => i.status === 'Resolved').length})
            </button>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search issue title, assignee, or root cause..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-72"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Issues Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIssues.map(issue => {
          const comm = committees.find(c => c.id === issue.committeeId);
          const kpi = kpis.find(k => k.id === issue.supportingKpiId);
          const source = dataSources.find(s => s.id === issue.supportingSourceId);
          const isResolved = issue.status === 'Resolved';

          return (
            <div
              key={issue.id}
              className={`p-5 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : issue.isOverdue
                  ? 'bg-slate-950 border-rose-900/40 hover:border-rose-700/60'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-semibold text-sky-400 font-mono">
                      {comm?.name || 'General Org'}
                    </span>
                    <span>·</span>
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {issue.category}
                    </span>
                    <span>·</span>
                    <span className={`text-xs font-mono font-semibold ${
                      issue.severity === 'Critical' ? 'text-rose-400' : issue.severity === 'High' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {issue.severity} Priority
                    </span>
                    {issue.isOverdue && !isResolved && (
                      <span className="text-[11px] font-mono text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                        OVERDUE
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white">{issue.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {issue.description}
                  </p>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openDrillDown({
                      issueId: issue.id,
                      committeeId: issue.committeeId,
                      kpiId: issue.supportingKpiId,
                      sourceId: issue.supportingSourceId,
                      title: issue.title
                    })}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                  >
                    Drill Down
                  </button>

                  {!isResolved && (
                    <button
                      onClick={() => handleOpenResolve(issue)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sign-off & Resolve</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Accountability & Root cause details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Assigned Officer</span>
                  <div className="text-slate-200 font-medium mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{issue.assignedTo}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Resolution Target</span>
                  <div className="font-mono text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{issue.deadline}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Status State</span>
                  <div className="font-medium mt-0.5">
                    {isResolved ? (
                      <span className="text-emerald-400">Resolved & Closed</span>
                    ) : (
                      <span className="text-amber-400">{issue.status}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Diagnosed root cause & corrective action */}
              {(issue.rootCause || issue.correctiveAction) && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  {issue.rootCause && (
                    <div className="text-slate-400">
                      <strong className="text-slate-300">Diagnosed Root Cause: </strong>
                      <span>{issue.rootCause}</span>
                    </div>
                  )}
                  {issue.correctiveAction && (
                    <div className="text-sky-300">
                      <strong className="text-sky-200">Mandated Action: </strong>
                      <span>{issue.correctiveAction}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resolve Issue Modal */}
      {resolvingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">Sign-off Operational Resolution</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Document the root cause diagnosis and corrective action taken to close this issue.
                </p>
              </div>
              <button onClick={() => setResolvingIssue(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleConfirmResolve} className="my-4 space-y-4 overflow-y-auto pr-1 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Selected Bottleneck:</span>
                <span className="font-semibold text-white text-xs">{resolvingIssue.title}</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Diagnosed Root Cause *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What underlying failure, delay, or resource limitation caused this?"
                  value={rootCauseInput}
                  onChange={e => setRootCauseInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Mandated Corrective Action Taken *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What specific operational measure was executed to resolve and prevent recurrence?"
                  value={correctiveActionInput}
                  onChange={e => setCorrectiveActionInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolvingIssue(null)}
                  className="px-4 py-2 font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Resolution & Close</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Issue Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">Dispatch New Operational Issue</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assign corrective action requirement to a committee officer.
                </p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateIssue} className="my-4 space-y-4 overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Target Committee</label>
                  <select
                    value={newCommId}
                    onChange={e => setNewCommId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    {committees.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as OperationalIssue['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Operational Bottleneck">Operational Bottleneck</option>
                    <option value="Overdue Report">Overdue Report</option>
                    <option value="Target Miss">Target Miss</option>
                    <option value="Data Quality">Data Quality</option>
                    <option value="Budget Variance">Budget Variance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage Fabrication Material Shortage"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Operational Context & Description</label>
                <textarea
                  rows={2}
                  placeholder="Explain the impediment, impacts, and why executive intervention is requested..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Assigned Officer *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAssignedTo}
                    onChange={e => setNewAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Resolution Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Severity</label>
                <select
                  value={newSeverity}
                  onChange={e => setNewSeverity(e.target.value as OperationalIssue['severity'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dispatch Action</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
