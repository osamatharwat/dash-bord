import React, { useState } from 'react';
import { IntelligenceProvider, useIntelligence } from './context/IntelligenceContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/executive/ExecutiveDashboard';
import { CommitteeDashboard } from './components/committee/CommitteeDashboard';
import { DataSourcesCenter } from './components/datasources/DataSourcesCenter';
import { KpiManagement } from './components/kpis/KpiManagement';
import { ReportingComplianceView } from './components/compliance/ReportingComplianceView';
import { CorrectiveActionsView } from './components/actions/CorrectiveActionsView';
import { DrillDownModal } from './components/common/DrillDownModal';
import { AddCommitteeModal } from './components/committee/AddCommitteeModal';
import { OrganizationHealthIndexModal } from './components/executive/OrganizationHealthIndexModal';

const DashboardContent: React.FC = () => {
  const { activeTab } = useIntelligence();
  const [isAddCommitteeOpen, setIsAddCommitteeOpen] = useState(false);
  const [isOhiOpen, setIsOhiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Bar adhering strictly to Top Bar Contract */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar Navigation */}
        <Sidebar
          onOpenAddCommittee={() => setIsAddCommitteeOpen(true)}
          onOpenOhiModal={() => setIsOhiOpen(true)}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 overflow-y-auto bg-slate-900 pb-12">
          {activeTab === 'executive' && <ExecutiveDashboard />}
          {activeTab === 'committee' && <CommitteeDashboard />}
          {activeTab === 'sources' && <DataSourcesCenter />}
          {activeTab === 'kpis' && <KpiManagement />}
          {activeTab === 'compliance' && <ReportingComplianceView />}
          {activeTab === 'actions' && <CorrectiveActionsView />}
        </main>
      </div>

      {/* Global Modals */}
      <DrillDownModal />
      <AddCommitteeModal
        isOpen={isAddCommitteeOpen}
        onClose={() => setIsAddCommitteeOpen(false)}
      />
      <OrganizationHealthIndexModal
        isOpen={isOhiOpen}
        onClose={() => setIsOhiOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <IntelligenceProvider>
      <DashboardContent />
    </IntelligenceProvider>
  );
}
