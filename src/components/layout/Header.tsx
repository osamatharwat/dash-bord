import React, { useState } from 'react';
import { useIntelligence, NavigationTab } from '../../context/IntelligenceContext';
import { Download, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, stats, committees, kpis, dataSources, issues } = useIntelligence();
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateReportJson = () => {
    return JSON.stringify(
      {
        organization: 'ALIENS Student Activity',
        generatedAt: new Date().toISOString(),
        summaryStats: stats,
        activeCommittees: committees.filter(c => !c.isArchived).map(c => ({
          name: c.name,
          code: c.code,
          lead: c.leadName,
          status: c.status,
          memberCount: c.memberCount
        })),
        kpiSnapshots: kpis.map(k => ({
          code: k.code,
          title: k.title,
          target: k.target,
          currentValue: k.currentValue,
          isMissingReport: k.isMissingReport
        })),
        dataSourcesHealth: dataSources.map(s => ({
          name: s.name,
          type: s.type,
          status: s.syncStatus,
          score: s.validationHealthScore
        })),
        activeIssues: issues.filter(i => i.status !== 'Resolved')
      },
      null,
      2
    );
  };

  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(generateReportJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ALIENS_Org_Intelligence_Report_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportModal(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-sm">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('executive')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-sky-400 transition-colors text-left"
        >
          ALIENS Platform
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('executive')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'executive'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Executive Overview
          </button>
          <button
            onClick={() => setActiveTab('committee')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'committee'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Committees
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'sources'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Data Sources
          </button>
          <button
            onClick={() => setActiveTab('kpis')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'kpis'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            KPI Registry
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'compliance'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Reporting Compliance
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'actions'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Corrective Actions
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 rounded-lg hover:bg-sky-300 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Intel Report</span>
          </button>
        </div>
      </header>

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">Export Whole-Team Intelligence Briefing</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full organization audit data across all {committees.length} committees, sources, and KPIs.
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-4 flex-1 overflow-auto bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {generateReportJson()}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Report File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
