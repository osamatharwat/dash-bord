import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import { DataSource, SourceType, ColumnMapping } from '../../types';
import {
  Database,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  CheckSquare,
  Search,
  Filter,
  Trash2,
  Table,
  Sliders,
  ChevronDown,
  Eye
} from 'lucide-react';
import { AddSourceModal } from './AddSourceModal';

export const DataSourcesCenter: React.FC = () => {
  const {
    dataSources,
    committees,
    kpis,
    syncDataSource,
    deleteDataSource
  } = useIntelligence();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCommitteeFilter, setSelectedCommitteeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectSource, setInspectSource] = useState<DataSource | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Filter sources
  const filteredSources = dataSources.filter(src => {
    if (selectedCommitteeFilter !== 'all') {
      if (!src.assignedCommitteeIds.includes(selectedCommitteeFilter)) return false;
    }
    if (typeFilter !== 'all') {
      if (src.type !== typeFilter) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        src.name.toLowerCase().includes(q) ||
        src.url.toLowerCase().includes(q) ||
        src.columns.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSyncAll = () => {
    setSyncingAll(true);
    setTimeout(() => {
      dataSources.forEach(s => syncDataSource(s.id));
      setSyncingAll(false);
    }, 800);
  };

  const handleSingleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      syncDataSource(id);
      setSyncingId(null);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>Unified Integration Hub</span>
            <span>·</span>
            <span className="text-sky-400 font-medium">Google Workspace & Forms Pipelines</span>
            <span>·</span>
            <span>{dataSources.length} Connected Feeds</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Data Sources & Schema Connection Center
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Centralized orchestration of Google Sheets and Google Forms response pipelines across all ALIENS committees. Schema auto-discovery, column mapping, and health verification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin text-sky-400' : ''}`} />
            <span>{syncingAll ? 'Syncing Feeds...' : 'Sync All Feeds'}</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect New Source</span>
          </button>
        </div>
      </div>

      {/* Health & Diagnostics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Global Ingestion Health</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {Math.round(dataSources.reduce((a, b) => a + b.validationHealthScore, 0) / (dataSources.length || 1))}%
            </span>
            <span className="text-xs text-slate-400">schema pass rate</span>
          </div>
          <div className="text-xs text-slate-500">
            {dataSources.filter(s => s.syncStatus === 'Synced').length} nominal · {dataSources.filter(s => s.syncStatus !== 'Synced').length} requiring review
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Ingested Records</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {dataSources.reduce((a, b) => a + b.rowCount, 0).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">rows active</span>
          </div>
          <div className="text-xs text-slate-500">
            Across {committees.length} functional student activity committees
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Google Pipeline Types</span>
          <div className="flex items-center gap-4 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{dataSources.filter(s => s.type === 'Google Sheets').length} Google Sheets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-violet-400" />
              <span>{dataSources.filter(s => s.type === 'Google Forms').length} Google Forms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Committee Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Committee:</span>
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

          {/* Type Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Source Type:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="Google Sheets">Google Sheets</option>
              <option value="Google Forms">Google Forms</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search schema columns, names, or URLs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-full sm:w-72"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSources.map(source => {
          const assignedComms = committees.filter(c => source.assignedCommitteeIds.includes(c.id));
          return (
            <div
              key={source.id}
              className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {source.type}
                    </span>
                    <h3 className="text-base font-semibold text-white">{source.name}</h3>
                    {source.sheetName && (
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Tab: {source.sheetName}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate max-w-3xl">
                    {source.url}
                  </div>
                </div>

                {/* Right badges & controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setInspectSource(source)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>Inspect Raw Schema</span>
                  </button>

                  <button
                    onClick={() => handleSingleSync(source.id)}
                    disabled={syncingId === source.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === source.id ? 'animate-spin text-sky-400' : ''}`} />
                    <span>{syncingId === source.id ? 'Syncing...' : 'Sync'}</span>
                  </button>

                  <button
                    onClick={() => deleteDataSource(source.id)}
                    title="Remove source connection"
                    className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Assigned Committee(s)</span>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {assignedComms.map(c => (
                      <span key={c.id} className="text-slate-300 font-medium">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Ingestion Freshness</span>
                  <div className="font-mono text-slate-300 mt-0.5">
                    {source.lastSyncTime} ({source.rowCount} rows)
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Schema Health Score</span>
                  <div className="font-mono font-medium text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <span>{source.validationHealthScore}% pass</span>
                    {source.syncStatus === 'Warning' && <span className="text-amber-400 text-[10px]">(Warning)</span>}
                    {source.syncStatus === 'Error' && <span className="text-rose-400 text-[10px]">(Stale Error)</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Discovered Columns</span>
                  <div className="font-mono text-slate-400 mt-0.5">
                    {source.columns.length} columns detected
                  </div>
                </div>
              </div>

              {/* Error Callout if any */}
              {source.recentError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-medium text-rose-200 block">Ingestion Validation Warning</span>
                    <span>{source.recentError}</span>
                  </div>
                </div>
              )}

              {/* Discovered Columns Pill Strip */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1.5">
                  Schema Fields Mapped:
                </span>
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                  {source.columns.map(col => {
                    const isMapped = source.mappings.some(m => m.sourceColumn === col);
                    return (
                      <span
                        key={col}
                        className={`px-2 py-0.5 rounded border text-[11px] ${
                          isMapped
                            ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {col} {isMapped && '✓'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw Schema & Records Inspector Modal */}
      {inspectSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Raw Schema & Data Inspector: {inspectSource.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified sample payloads from {inspectSource.type} pipeline
                </p>
              </div>
              <button onClick={() => setInspectSource(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <div className="my-4 space-y-4 overflow-y-auto pr-1">
              {/* Column Mappings Table */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Column to KPI Mappings
                </span>
                <div className="overflow-x-auto border border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="p-2.5">Source Column</th>
                        <th className="p-2.5">Target KPI Code</th>
                        <th className="p-2.5">Data Type</th>
                        <th className="p-2.5">Aggregation Rule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {inspectSource.mappings.map((m, idx) => {
                        const targetKpi = kpis.find(k => k.id === m.targetKpiId);
                        return (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            <td className="p-2.5 text-sky-300 font-semibold">{m.sourceColumn}</td>
                            <td className="p-2.5">{targetKpi ? `${targetKpi.code} (${targetKpi.title})` : m.targetKpiId}</td>
                            <td className="p-2.5 text-slate-400">{m.dataType}</td>
                            <td className="p-2.5 text-emerald-400">{m.aggregation}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Rows Preview */}
              {inspectSource.sampleRows && inspectSource.sampleRows.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Sample Records Preview ({inspectSource.sampleRows.length} rows)
                  </span>
                  <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                        <tr>
                          {Object.keys(inspectSource.sampleRows[0]).map(key => (
                            <th key={key} className="p-2 whitespace-nowrap">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {inspectSource.sampleRows.map((row, rIdx) => (
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

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <a
                href={inspectSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:underline"
              >
                <span>Open in Google Drive / Forms</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setInspectSource(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      <AddSourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
