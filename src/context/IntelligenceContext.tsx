import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Committee,
  KpiDefinition,
  DataSource,
  ReportingSubmission,
  OperationalIssue,
  OrganizationHealthWeights
} from '../types';
import {
  INITIAL_COMMITTEES,
  INITIAL_KPIS,
  INITIAL_DATA_SOURCES,
  INITIAL_SUBMISSIONS,
  INITIAL_ISSUES,
  INITIAL_WEIGHTS
} from '../data/initialData';

export type NavigationTab = 'executive' | 'committee' | 'sources' | 'kpis' | 'compliance' | 'actions';

export interface DrillDownState {
  isOpen: boolean;
  committeeId?: string;
  kpiId?: string;
  sourceId?: string;
  issueId?: string;
  title: string;
}

interface IntelligenceContextType {
  // State
  committees: Committee[];
  kpis: KpiDefinition[];
  dataSources: DataSource[];
  submissions: ReportingSubmission[];
  issues: OperationalIssue[];
  healthWeights: OrganizationHealthWeights;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCommitteeId: string | null;
  setSelectedCommitteeId: (id: string | null) => void;
  drillDown: DrillDownState;
  
  // Drill-down actions
  openDrillDown: (params: { committeeId?: string; kpiId?: string; sourceId?: string; issueId?: string; title: string }) => void;
  closeDrillDown: () => void;
  navigateToCommittee: (committeeId: string) => void;

  // Committee CRUD
  addCommittee: (committee: Omit<Committee, 'id' | 'createdAt'>) => void;
  updateCommittee: (id: string, updates: Partial<Committee>) => void;
  archiveCommittee: (id: string) => void;
  deleteCommittee: (id: string) => void;

  // KPI Management
  addKpi: (kpi: Omit<KpiDefinition, 'id'>) => void;
  updateKpi: (id: string, updates: Partial<KpiDefinition>, changeReason?: string) => void;
  deleteKpi: (id: string) => void;

  // Data Sources
  addDataSource: (source: Omit<DataSource, 'id' | 'lastSyncTime' | 'syncStatus'>) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;
  syncDataSource: (id: string) => void;
  deleteDataSource: (id: string) => void;

  // Reporting Compliance & Submissions
  submitCommitteeReport: (committeeId: string, kpiValues: { kpiId: string; value: number | null; isMissing: boolean }[], notes?: string) => void;
  sendReminderNotice: (committeeId: string) => { success: boolean; message: string };

  // Issues & Corrective Actions
  addIssue: (issue: Omit<OperationalIssue, 'id' | 'detectedAt' | 'isOverdue'>) => void;
  updateIssue: (id: string, updates: Partial<OperationalIssue>) => void;
  resolveIssue: (id: string, rootCause: string, correctiveAction: string) => void;

  // Config & Weights
  updateHealthWeights: (weights: OrganizationHealthWeights) => void;
  resetAllData: () => void;

  // Computed Org-Wide Intelligence
  stats: {
    totalCommittees: number;
    activeCommittees: number;
    onTrackCommitteesCount: number;
    needsAttentionCount: number;
    criticalCount: number;
    missingReportCount: number;
    overallComplianceRate: number; // 0-100%
    overallKpiAttainmentRate: number; // 0-100%
    sourceHealthScore: number; // 0-100%
    activeIssuesCount: number;
    overdueActionsCount: number;
    healthIndex: number; // 0-100 computed weighted index
    totalHeadcount: number;
  };
}

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMMITTEES: 'aliens_intel_committees_v1',
  KPIS: 'aliens_intel_kpis_v1',
  SOURCES: 'aliens_intel_sources_v1',
  SUBMISSIONS: 'aliens_intel_submissions_v1',
  ISSUES: 'aliens_intel_issues_v1',
  WEIGHTS: 'aliens_intel_weights_v1'
};

export const IntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [committees, setCommittees] = useState<Committee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMITTEES);
      return saved ? JSON.parse(saved) : INITIAL_COMMITTEES;
    } catch {
      return INITIAL_COMMITTEES;
    }
  });

  const [kpis, setKpis] = useState<KpiDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KPIS);
      return saved ? JSON.parse(saved) : INITIAL_KPIS;
    } catch {
      return INITIAL_KPIS;
    }
  });

  const [dataSources, setDataSources] = useState<DataSource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOURCES);
      return saved ? JSON.parse(saved) : INITIAL_DATA_SOURCES;
    } catch {
      return INITIAL_DATA_SOURCES;
    }
  });

  const [submissions, setSubmissions] = useState<ReportingSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [issues, setIssues] = useState<OperationalIssue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
      return saved ? JSON.parse(saved) : INITIAL_ISSUES;
    } catch {
      return INITIAL_ISSUES;
    }
  });

  const [healthWeights, setHealthWeights] = useState<OrganizationHealthWeights>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      return saved ? JSON.parse(saved) : INITIAL_WEIGHTS;
    } catch {
      return INITIAL_WEIGHTS;
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState<string>('Week 41, 2026');
  const [activeTab, setActiveTab] = useState<NavigationTab>('executive');
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string | null>(null);

  const [drillDown, setDrillDown] = useState<DrillDownState>({
    isOpen: false,
    title: ''
  });

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMITTEES, JSON.stringify(committees));
      localStorage.setItem(STORAGE_KEYS.KPIS, JSON.stringify(kpis));
      localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(dataSources));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(healthWeights));
    } catch {
      // Silently handle quota errors
    }
  }, [committees, kpis, dataSources, submissions, issues, healthWeights]);

  // Drill-down controls
  const openDrillDown = (params: { committeeId?: string; kpiId?: string; sourceId?: string; issueId?: string; title: string }) => {
    setDrillDown({
      isOpen: true,
      ...params
    });
  };

  const closeDrillDown = () => {
    setDrillDown({ isOpen: false, title: '' });
  };

  const navigateToCommittee = (committeeId: string) => {
    setSelectedCommitteeId(committeeId);
    setActiveTab('committee');
  };

  // Committee CRUD
  const addCommittee = (committeeData: Omit<Committee, 'id' | 'createdAt'>) => {
    const id = `comm-${committeeData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newCommittee: Committee = {
      ...committeeData,
      id,
      createdAt: new Date().toISOString().slice(0, 10),
      isArchived: false
    };
    setCommittees(prev => [...prev, newCommittee]);
  };

  const updateCommittee = (id: string, updates: Partial<Committee>) => {
    setCommittees(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const archiveCommittee = (id: string) => {
    setCommittees(prev => prev.map(c => c.id === id ? { ...c, isArchived: !c.isArchived } : c));
  };

  const deleteCommittee = (id: string) => {
    setCommittees(prev => prev.filter(c => c.id !== id));
    setKpis(prev => prev.filter(k => k.committeeId !== id));
    if (selectedCommitteeId === id) {
      setSelectedCommitteeId(null);
      setActiveTab('executive');
    }
  };

  // KPI Management
  const addKpi = (kpiData: Omit<KpiDefinition, 'id'>) => {
    const id = `kpi-${Date.now().toString().slice(-6)}`;
    const newKpi: KpiDefinition = {
      ...kpiData,
      id
    };
    setKpis(prev => [...prev, newKpi]);
  };

  const updateKpi = (id: string, updates: Partial<KpiDefinition>, changeReason?: string) => {
    setKpis(prev => prev.map(k => {
      if (k.id !== id) return k;
      
      let updatedLog = k.targetChangeLog || [];
      if (updates.target !== undefined && updates.target !== k.target) {
        updatedLog = [
          ...updatedLog,
          {
            date: new Date().toISOString().slice(0, 10),
            oldTarget: k.target,
            newTarget: updates.target,
            reason: changeReason || 'Operational target adjustment',
            changedBy: 'Executive Administrator'
          }
        ];
      }

      return {
        ...k,
        ...updates,
        targetChangeLog: updatedLog
      };
    }));
  };

  const deleteKpi = (id: string) => {
    setKpis(prev => prev.filter(k => k.id !== id));
  };

  // Data Sources
  const addDataSource = (sourceData: Omit<DataSource, 'id' | 'lastSyncTime' | 'syncStatus'>) => {
    const id = `src-${Date.now().toString().slice(-6)}`;
    const newSource: DataSource = {
      ...sourceData,
      id,
      syncStatus: 'Synced',
      lastSyncTime: 'Just now'
    };
    setDataSources(prev => [...prev, newSource]);
  };

  const updateDataSource = (id: string, updates: Partial<DataSource>) => {
    setDataSources(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const syncDataSource = (id: string) => {
    setDataSources(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        syncStatus: 'Synced',
        lastSyncTime: 'Just now',
        validationHealthScore: Math.min(100, Math.max(85, s.validationHealthScore + 5)),
        recentError: undefined
      };
    }));
  };

  const deleteDataSource = (id: string) => {
    setDataSources(prev => prev.filter(s => s.id !== id));
  };

  // Reporting Submissions
  const submitCommitteeReport = (
    committeeId: string,
    kpiValues: { kpiId: string; value: number | null; isMissing: boolean }[],
    notes?: string
  ) => {
    const period = selectedPeriod;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    // Update KPIs values
    setKpis(prev => prev.map(k => {
      const match = kpiValues.find(v => v.kpiId === k.id);
      if (!match) return k;

      const newActual = match.isMissing ? null : match.value;
      const newHistory = [
        ...k.history.filter(h => h.period !== period),
        {
          period,
          actual: newActual,
          target: k.target,
          timestamp: new Date().toISOString().slice(0, 10)
        }
      ];

      return {
        ...k,
        currentValue: newActual,
        isMissingReport: match.isMissing,
        history: newHistory
      };
    }));

    // Update or add submission record
    const missingCount = kpiValues.filter(v => v.isMissing).length;
    const reportedCount = kpiValues.filter(v => !v.isMissing).length;
    const healthScore = kpiValues.length > 0 ? Math.round((reportedCount / kpiValues.length) * 100) : 100;

    setSubmissions(prev => {
      const filtered = prev.filter(s => !(s.committeeId === committeeId && s.period === period));
      const newSub: ReportingSubmission = {
        id: `sub-${Date.now()}`,
        committeeId,
        period,
        dueDate: '2026-10-11',
        submittedAt: now,
        status: missingCount === 0 ? 'On Time' : 'Pending',
        submittedBy: 'Authenticated Officer',
        notes: notes || 'Direct intelligence update recorded.',
        dataHealthScore: healthScore,
        kpisReportedCount: reportedCount,
        kpisMissingCount: missingCount
      };
      return [newSub, ...filtered];
    });

    // Update committee status
    setCommittees(prev => prev.map(c => {
      if (c.id !== committeeId) return c;
      return {
        ...c,
        status: missingCount > 0 ? 'Missing Report' : 'On Track'
      };
    }));
  };

  const sendReminderNotice = (committeeId: string) => {
    const committee = committees.find(c => c.id === committeeId);
    if (!committee) return { success: false, message: 'Committee not found' };
    
    return {
      success: true,
      message: `Executive leadership reminder dispatched to ${committee.leadName} (${committee.leadEmail}) for ${selectedPeriod} overdue reporting.`
    };
  };

  // Issues & Actions
  const addIssue = (issueData: Omit<OperationalIssue, 'id' | 'detectedAt' | 'isOverdue'>) => {
    const id = `iss-${Date.now().toString().slice(-6)}`;
    const newIssue: OperationalIssue = {
      ...issueData,
      id,
      detectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isOverdue: false
    };
    setIssues(prev => [newIssue, ...prev]);
  };

  const updateIssue = (id: string, updates: Partial<OperationalIssue>) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const resolveIssue = (id: string, rootCause: string, correctiveAction: string) => {
    setIssues(prev => prev.map(i => {
      if (i.id !== id) return i;
      return {
        ...i,
        status: 'Resolved',
        rootCause,
        correctiveAction,
        isOverdue: false
      };
    }));
  };

  const updateHealthWeights = (weights: OrganizationHealthWeights) => {
    setHealthWeights(weights);
  };

  const resetAllData = () => {
    localStorage.clear();
    setCommittees(INITIAL_COMMITTEES);
    setKpis(INITIAL_KPIS);
    setDataSources(INITIAL_DATA_SOURCES);
    setSubmissions(INITIAL_SUBMISSIONS);
    setIssues(INITIAL_ISSUES);
    setHealthWeights(INITIAL_WEIGHTS);
    setSelectedPeriod('Week 41, 2026');
    setSelectedCommitteeId(null);
    setActiveTab('executive');
  };

  // Computations
  const stats = useMemo(() => {
    const activeComms = committees.filter(c => !c.isArchived);
    const totalComms = activeComms.length;
    
    // Status counts
    const onTrackCount = activeComms.filter(c => c.status === 'On Track').length;
    const needsAttentionCount = activeComms.filter(c => c.status === 'Needs Attention').length;
    const criticalCount = activeComms.filter(c => c.status === 'Critical').length;
    const missingReportCount = activeComms.filter(c => c.status === 'Missing Report').length;

    // Reporting Compliance
    // Based on active submissions for current period
    const curSubmissions = submissions.filter(s => s.period === selectedPeriod);
    const onTimeSubs = curSubmissions.filter(s => s.status === 'On Time').length;
    const complianceRate = totalComms > 0 ? Math.round((onTimeSubs / totalComms) * 100) : 100;

    // KPI Attainment Rate
    // Count all active KPIs: target attainment %
    const validKpis = kpis.filter(k => !k.isMissingReport && k.currentValue !== null);
    let onTrackKpis = 0;
    validKpis.forEach(k => {
      if (k.currentValue === null) return;
      // Some metrics lower is better (variance, response time, incidents)
      if (k.id === 'kpi-pr-response-time' || k.id === 'kpi-med-turnaround' || k.id === 'kpi-trs-variance') {
        if (k.currentValue <= k.target) onTrackKpis++;
      } else if (k.id === 'kpi-chr-safety-incidents') {
        if (k.currentValue === 0) onTrackKpis++;
      } else {
        if (k.currentValue >= k.target * 0.9) onTrackKpis++;
      }
    });
    const kpiAttainmentRate = validKpis.length > 0 ? Math.round((onTrackKpis / validKpis.length) * 100) : 85;

    // Data Source Health Score
    const avgSourceHealth = dataSources.length > 0
      ? Math.round(dataSources.reduce((acc, s) => acc + s.validationHealthScore, 0) / dataSources.length)
      : 90;

    // Active Issues & Overdue
    const activeIssues = issues.filter(i => i.status !== 'Resolved');
    const overdueActions = activeIssues.filter(i => i.isOverdue || i.status === 'Open').length;

    // Milestone Execution (estimated from planning KPI or fixed baseline)
    const planningMilestoneKpi = kpis.find(k => k.id === 'kpi-pln-milestones');
    const milestoneRate = planningMilestoneKpi && planningMilestoneKpi.currentValue !== null
      ? planningMilestoneKpi.currentValue
      : 92;

    // Weighted Organization Health Index (OHI)
    // Formula: (Compliance * W1) + (Attainment * W2) + (SourceHealth * W3) + (Milestones * W4)
    const ohi = Math.round(
      (complianceRate * healthWeights.reportingComplianceWeight) +
      (kpiAttainmentRate * healthWeights.kpiAttainmentWeight) +
      (avgSourceHealth * healthWeights.dataSourceHealthWeight) +
      (milestoneRate * healthWeights.milestoneExecutionWeight)
    );

    const totalHeadcount = activeComms.reduce((acc, c) => acc + c.memberCount, 0);

    return {
      totalCommittees: committees.length,
      activeCommittees: totalComms,
      onTrackCommitteesCount: onTrackCount,
      needsAttentionCount,
      criticalCount,
      missingReportCount,
      overallComplianceRate: complianceRate,
      overallKpiAttainmentRate: kpiAttainmentRate,
      sourceHealthScore: avgSourceHealth,
      activeIssuesCount: activeIssues.length,
      overdueActionsCount: overdueActions,
      healthIndex: Math.min(100, Math.max(0, ohi)),
      totalHeadcount
    };
  }, [committees, kpis, submissions, dataSources, issues, healthWeights, selectedPeriod]);

  return (
    <IntelligenceContext.Provider
      value={{
        committees,
        kpis,
        dataSources,
        submissions,
        issues,
        healthWeights,
        selectedPeriod,
        setSelectedPeriod,
        activeTab,
        setActiveTab,
        selectedCommitteeId,
        setSelectedCommitteeId,
        drillDown,
        openDrillDown,
        closeDrillDown,
        navigateToCommittee,
        addCommittee,
        updateCommittee,
        archiveCommittee,
        deleteCommittee,
        addKpi,
        updateKpi,
        deleteKpi,
        addDataSource,
        updateDataSource,
        syncDataSource,
        deleteDataSource,
        submitCommitteeReport,
        sendReminderNotice,
        addIssue,
        updateIssue,
        resolveIssue,
        updateHealthWeights,
        resetAllData,
        stats
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
};

export const useIntelligence = () => {
  const context = useContext(IntelligenceContext);
  if (!context) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
};
