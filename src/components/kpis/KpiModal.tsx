import React, { useState, useEffect } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import { KpiDefinition, MetricUnit, AggregationMethod, ReportingCadence } from '../../types';
import { Plus, CheckCircle2, Sliders } from 'lucide-react';

export const KpiModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  editingKpi: KpiDefinition | null;
}> = ({ isOpen, onClose, editingKpi }) => {
  const { committees, dataSources, addKpi, updateKpi } = useIntelligence();

  const [committeeId, setCommitteeId] = useState('');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formulaDescription, setFormulaDescription] = useState('');
  const [unit, setUnit] = useState<MetricUnit>('count');
  const [aggregationMethod, setAggregationMethod] = useState<AggregationMethod>('SUM');
  const [reportingCadence, setReportingCadence] = useState<ReportingCadence>('Weekly');
  const [target, setTarget] = useState<number>(100);
  const [criticalBelow, setCriticalBelow] = useState<number>(60);
  const [warningBelow, setWarningBelow] = useState<number>(85);
  const [onTrackMin, setOnTrackMin] = useState<number>(85);
  const [connectedSourceId, setConnectedSourceId] = useState<string>('');
  const [changeReason, setChangeReason] = useState<string>('');

  useEffect(() => {
    if (editingKpi) {
      setCommitteeId(editingKpi.committeeId);
      setCode(editingKpi.code);
      setTitle(editingKpi.title);
      setDescription(editingKpi.description);
      setFormulaDescription(editingKpi.formulaDescription || '');
      setUnit(editingKpi.unit);
      setAggregationMethod(editingKpi.aggregationMethod);
      setReportingCadence(editingKpi.reportingCadence);
      setTarget(editingKpi.target);
      setCriticalBelow(editingKpi.thresholds.criticalBelow);
      setWarningBelow(editingKpi.thresholds.warningBelow);
      setOnTrackMin(editingKpi.thresholds.onTrackMin);
      setConnectedSourceId(editingKpi.connectedSourceId || '');
      setChangeReason('');
    } else {
      setCommitteeId(committees[0]?.id || '');
      setCode('');
      setTitle('');
      setDescription('');
      setFormulaDescription('');
      setUnit('count');
      setAggregationMethod('SUM');
      setReportingCadence('Weekly');
      setTarget(100);
      setCriticalBelow(60);
      setWarningBelow(85);
      setOnTrackMin(85);
      setConnectedSourceId('');
      setChangeReason('');
    }
  }, [editingKpi, committees, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    if (editingKpi) {
      updateKpi(
        editingKpi.id,
        {
          committeeId,
          code: code.trim().toUpperCase(),
          title: title.trim(),
          description: description.trim(),
          formulaDescription: formulaDescription.trim(),
          unit,
          aggregationMethod,
          reportingCadence,
          target: Number(target),
          thresholds: {
            criticalBelow: Number(criticalBelow),
            warningBelow: Number(warningBelow),
            onTrackMin: Number(onTrackMin)
          },
          connectedSourceId: connectedSourceId || undefined
        },
        changeReason || 'Target and formula updated via registry console'
      );
    } else {
      addKpi({
        committeeId,
        code: code.trim().toUpperCase(),
        title: title.trim(),
        description: description.trim(),
        formulaDescription: formulaDescription.trim(),
        unit,
        aggregationMethod,
        reportingCadence,
        target: Number(target),
        currentValue: 0,
        isMissingReport: false,
        history: [
          {
            period: 'Week 41',
            actual: 0,
            target: Number(target),
            timestamp: new Date().toISOString().slice(0, 10)
          }
        ],
        thresholds: {
          criticalBelow: Number(criticalBelow),
          warningBelow: Number(warningBelow),
          onTrackMin: Number(onTrackMin)
        },
        connectedSourceId: connectedSourceId || undefined
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {editingKpi ? `Edit KPI: ${editingKpi.code}` : 'Register New Performance Metric'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure metric definition, formula, targets, and committee ownership
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="my-4 space-y-4 overflow-y-auto pr-1 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Owner Committee *</label>
              <select
                value={committeeId}
                onChange={e => setCommitteeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {committees.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Metric Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. PR-03"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Reporting Cadence</label>
              <select
                value={reportingCadence}
                onChange={e => setReportingCadence(e.target.value as ReportingCadence)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Per Event">Per Event</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Metric Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Corporate Sponsorship Cashflow Collected"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Metric Description</label>
            <textarea
              rows={2}
              placeholder="Detailed description of what is measured..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Calculation Formula / Aggregation Logic</label>
            <input
              type="text"
              placeholder="e.g. (Verified Collected Funds / Target Budget) * 100"
              value={formulaDescription}
              onChange={e => setFormulaDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Unit</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value as MetricUnit)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="count">Count</option>
                <option value="percentage">Percentage (%)</option>
                <option value="currency">Currency ($)</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="ratio">Ratio</option>
                <option value="score">Score</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Aggregation Method</label>
              <select
                value={aggregationMethod}
                onChange={e => setAggregationMethod(e.target.value as AggregationMethod)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="SUM">SUM</option>
                <option value="AVG">AVG</option>
                <option value="LATEST">LATEST</option>
                <option value="MAX">MAX</option>
                <option value="MIN">MIN</option>
                <option value="RATIO">RATIO</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Target Value *</label>
              <input
                type="number"
                step="any"
                required
                value={target}
                onChange={e => setTarget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Thresholds */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <span className="text-slate-300 font-medium block">Performance Threshold Boundaries</span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-rose-400 text-[11px] block mb-1">Critical Below</label>
                <input
                  type="number"
                  step="any"
                  value={criticalBelow}
                  onChange={e => setCriticalBelow(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-amber-400 text-[11px] block mb-1">Warning Below</label>
                <input
                  type="number"
                  step="any"
                  value={warningBelow}
                  onChange={e => setWarningBelow(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-emerald-400 text-[11px] block mb-1">On Track Min</label>
                <input
                  type="number"
                  step="any"
                  value={onTrackMin}
                  onChange={e => setOnTrackMin(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Link Data Source */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Linked Data Source (Google Sheet / Form)</label>
            <select
              value={connectedSourceId}
              onChange={e => setConnectedSourceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="">-- No linked source (Manual Entry) --</option>
              {dataSources.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
              ))}
            </select>
          </div>

          {editingKpi && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Audit Reason for Target/Formula Change *</label>
              <input
                type="text"
                placeholder="e.g. Executive council resolution on revised sprint capacity"
                value={changeReason}
                onChange={e => setChangeReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

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
              <span>{editingKpi ? 'Save Changes' : 'Register KPI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
