import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import { SourceType, AggregationMethod, ColumnMapping } from '../../types';
import { Database, Plus, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const AddSourceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { committees, kpis, addDataSource } = useIntelligence();

  const [name, setName] = useState('');
  const [type, setType] = useState<SourceType>('Google Sheets');
  const [url, setUrl] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>([]);
  const [discoveredColumns, setDiscoveredColumns] = useState<string[]>([
    'Timestamp',
    'Committee_Name',
    'Metric_Value',
    'Reported_By',
    'Status_Notes'
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [targetKpiId, setTargetKpiId] = useState<string>('');
  const [sourceColumnToMap, setSourceColumnToMap] = useState<string>('Metric_Value');
  const [aggregation, setAggregation] = useState<AggregationMethod>('SUM');

  if (!isOpen) return null;

  const handleToggleCommittee = (commId: string) => {
    setSelectedCommittees(prev =>
      prev.includes(commId) ? prev.filter(id => id !== commId) : [...prev, commId]
    );
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    if (!discoveredColumns.includes(newColumnName.trim())) {
      setDiscoveredColumns(prev => [...prev, newColumnName.trim()]);
    }
    setNewColumnName('');
  };

  const handleAutoDiscover = () => {
    // Simulate auto-discovery from Google API
    if (type === 'Google Forms') {
      setDiscoveredColumns([
        'Timestamp',
        'Submission_ID',
        'Inbound_Channel',
        'Response_Latency_Hours',
        'Requester_Organization',
        'Officer_Assigned',
        'Resolution_Status'
      ]);
      setSourceColumnToMap('Response_Latency_Hours');
      setAggregation('AVG');
    } else {
      setDiscoveredColumns([
        'Cycle_Date',
        'Workstream_Phase',
        'Logged_Quantity',
        'Target_Goal',
        'Variance_Pct',
        'Auditor_Signoff'
      ]);
      setSourceColumnToMap('Logged_Quantity');
      setAggregation('SUM');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || selectedCommittees.length === 0) {
      alert('Please provide a source name, valid URL, and assign at least one committee.');
      return;
    }

    const mappings: ColumnMapping[] = targetKpiId
      ? [
          {
            sourceColumn: sourceColumnToMap,
            targetKpiId,
            dataType: 'number',
            aggregation
          }
        ]
      : [];

    addDataSource({
      name: name.trim(),
      type,
      url: url.trim(),
      sheetName: type === 'Google Sheets' ? sheetName : undefined,
      assignedCommitteeIds: selectedCommittees,
      rowCount: Math.floor(Math.random() * 80) + 20,
      validationHealthScore: 100,
      columns: discoveredColumns,
      mappings,
      validationRules: [
        { rule: `${sourceColumnToMap} must be valid numeric figure`, severity: 'Error' },
        { rule: 'Mandatory timestamp entry check', severity: 'Warning' }
      ],
      sampleRows: [
        {
          [discoveredColumns[0]]: '2026-10-15',
          [discoveredColumns[1] || 'Field_1']: 'Active Run',
          [discoveredColumns[2] || 'Field_2']: 142,
          [discoveredColumns[3] || 'Field_3']: 'Verified',
          [discoveredColumns[4] || 'Field_4']: 'Nominal batch'
        }
      ]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Connect New Google Data Source</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrate Google Sheets or Forms for any committee with schema auto-discovery.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-4 overflow-y-auto pr-1 text-xs">
          {/* Source Details */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-slate-300 font-medium">Source Feed Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Media Production Render Log 2026"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Source Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as SourceType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="Google Sheets">Google Sheets</option>
                <option value="Google Forms">Google Forms</option>
                <option value="CSV / Direct Feed">CSV / Direct Feed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-slate-300 font-medium">Google Drive URL *</label>
              <input
                type="url"
                required
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-sky-500"
              />
            </div>
            {type === 'Google Sheets' && (
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Worksheet Tab Name</label>
                <input
                  type="text"
                  placeholder="Sheet1"
                  value={sheetName}
                  onChange={e => setSheetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>

          {/* Committee Assignment (Multi-committee support) */}
          <div className="space-y-1.5 p-3 bg-slate-950 rounded-lg border border-slate-800">
            <label className="text-slate-300 font-medium block">
              Assign to Committees * (Can select multiple)
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {committees.filter(c => !c.isArchived).map(comm => {
                const isSelected = selectedCommittees.includes(comm.id);
                return (
                  <button
                    type="button"
                    key={comm.id}
                    onClick={() => handleToggleCommittee(comm.id)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-500 text-slate-900 font-semibold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{comm.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schema Discovery & Column Inspection */}
          <div className="space-y-2 p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Discovered Schema Columns</span>
              <button
                type="button"
                onClick={handleAutoDiscover}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Simulate Schema Discovery</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {discoveredColumns.map((col, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]"
                >
                  {col}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add additional column name..."
                value={newColumnName}
                onChange={e => setNewColumnName(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={handleAddColumn}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
              >
                Add Column
              </button>
            </div>
          </div>

          {/* Column Mapping to KPI */}
          <div className="space-y-2 p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-300 font-medium block">
              Map Feed Column to Target KPI (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Source Column</label>
                <select
                  value={sourceColumnToMap}
                  onChange={e => setSourceColumnToMap(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {discoveredColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Target KPI Metric</label>
                <select
                  value={targetKpiId}
                  onChange={e => setTargetKpiId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="">-- None / Raw Feed --</option>
                  {kpis.map(k => (
                    <option key={k.id} value={k.id}>{k.code}: {k.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Aggregation Rule</label>
                <select
                  value={aggregation}
                  onChange={e => setAggregation(e.target.value as AggregationMethod)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="SUM">SUM</option>
                  <option value="AVG">AVG</option>
                  <option value="LATEST">LATEST</option>
                  <option value="MAX">MAX</option>
                  <option value="MIN">MIN</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Connect Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
