import React, { useState } from 'react';
import { useIntelligence } from '../../context/IntelligenceContext';
import { Sliders, CheckCircle2, RotateCcw, Info } from 'lucide-react';
import { INITIAL_WEIGHTS } from '../../data/initialData';

export const OrganizationHealthIndexModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { healthWeights, updateHealthWeights, stats } = useIntelligence();

  const [wCompliance, setWCompliance] = useState<number>(Math.round(healthWeights.reportingComplianceWeight * 100));
  const [wAttainment, setWAttainment] = useState<number>(Math.round(healthWeights.kpiAttainmentWeight * 100));
  const [wSourceHealth, setWSourceHealth] = useState<number>(Math.round(healthWeights.dataSourceHealthWeight * 100));
  const [wMilestones, setWMilestones] = useState<number>(Math.round(healthWeights.milestoneExecutionWeight * 100));

  if (!isOpen) return null;

  const totalWeight = wCompliance + wAttainment + wSourceHealth + wMilestones;
  const isValid = totalWeight === 100;

  const handleSave = () => {
    if (!isValid) return;
    updateHealthWeights({
      reportingComplianceWeight: wCompliance / 100,
      kpiAttainmentWeight: wAttainment / 100,
      dataSourceHealthWeight: wSourceHealth / 100,
      milestoneExecutionWeight: wMilestones / 100
    });
    onClose();
  };

  const handleReset = () => {
    setWCompliance(Math.round(INITIAL_WEIGHTS.reportingComplianceWeight * 100));
    setWAttainment(Math.round(INITIAL_WEIGHTS.kpiAttainmentWeight * 100));
    setWSourceHealth(Math.round(INITIAL_WEIGHTS.dataSourceHealthWeight * 100));
    setWMilestones(Math.round(INITIAL_WEIGHTS.milestoneExecutionWeight * 100));
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
              <h3 className="text-base font-semibold text-white">Organization Health Index (OHI) Methodology</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent cross-committee governance calculation & weight controls
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        <div className="my-4 space-y-4 overflow-y-auto pr-1">
          {/* Methodology Explainer */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <div className="flex items-start gap-2 text-sky-300 font-medium">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Anti-Slop Calculation Rigor</span>
            </div>
            <p>
              The ALIENS platform rejects pseudo-scientific single vanity numbers. Unrelated committee metrics (such as Marketing impressions, Treasury invoices, and Magic Hand wood builds) are <strong className="text-white">never combined directly</strong>.
            </p>
            <p>
              Instead, the Organization Health Index aggregates four standardized, organization-wide governance vectors that apply equally across all committees:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Reporting Compliance ({stats.overallComplianceRate}%):</strong> On-time submission of weekly/monthly governance reports.</li>
              <li><strong className="text-slate-200">KPI Attainment Rate ({stats.overallKpiAttainmentRate}%):</strong> Proportion of committee-defined targets currently within nominal thresholds.</li>
              <li><strong className="text-slate-200">Data Source Health ({stats.sourceHealthScore}%):</strong> Ingestion integrity and validation pass rate of connected Google Sheets & Forms.</li>
              <li><strong className="text-slate-200">Milestone Execution (92%):</strong> Master milestone timeline velocity tracked by the Planning committee.</li>
            </ul>
          </div>

          {/* Interactive Weight Sliders */}
          <div className="space-y-4 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white uppercase tracking-wider">Configure Pillar Weights</span>
              <span className={`font-mono font-medium ${isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                Total: {totalWeight}% {isValid ? '(Balanced 100%)' : `(Must equal 100%, currently ${totalWeight}%)`}
              </span>
            </div>

            {/* Slider 1: Reporting Compliance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Reporting Compliance Weight</span>
                <span className="font-mono text-white font-medium">{wCompliance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={wCompliance}
                onChange={e => setWCompliance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Slider 2: KPI Attainment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">KPI Attainment Weight</span>
                <span className="font-mono text-white font-medium">{wAttainment}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={wAttainment}
                onChange={e => setWAttainment(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Slider 3: Data Source Health */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Data Source Health & Schema Validity</span>
                <span className="font-mono text-white font-medium">{wSourceHealth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={wSourceHealth}
                onChange={e => setWSourceHealth(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Slider 4: Milestone Execution */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Planning Milestone Velocity</span>
                <span className="font-mono text-white font-medium">{wMilestones}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={wMilestones}
                onChange={e => setWMilestones(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!isValid}
              onClick={handleSave}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                isValid
                  ? 'bg-sky-400 hover:bg-sky-300 text-slate-900 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Weight Model</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
