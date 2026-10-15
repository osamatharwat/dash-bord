export type CommitteeCategory = 
  | 'Operations'
  | 'Communications'
  | 'Strategy & Data'
  | 'Logistics & Finance'
  | 'Community';

export type CommitteeStatus = 'On Track' | 'Needs Attention' | 'Critical' | 'Missing Report';

export type ReportingCadence = 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Per Event';

export type AggregationMethod = 'SUM' | 'AVG' | 'LATEST' | 'MAX' | 'MIN' | 'RATIO';

export type MetricUnit = 'count' | 'percentage' | 'currency' | 'hours' | 'days' | 'ratio' | 'score';

export interface Committee {
  id: string;
  name: string;
  code: string;
  category: CommitteeCategory;
  leadName: string;
  leadEmail: string;
  memberCount: number;
  description: string;
  reportingCadence: ReportingCadence;
  status: CommitteeStatus;
  isArchived?: boolean;
  meetingDay: string;
  createdAt: string;
}

export interface KpiDefinition {
  id: string;
  committeeId: string; // can be 'org-wide' or specific committee id
  code: string;
  title: string;
  description: string;
  unit: MetricUnit;
  aggregationMethod: AggregationMethod;
  reportingCadence: ReportingCadence;
  target: number;
  currentValue: number | null; // null represents missing report, 0 is genuine zero!
  isMissingReport: boolean;
  history: {
    period: string;
    actual: number | null;
    target: number;
    timestamp: string;
  }[];
  thresholds: {
    criticalBelow: number;
    warningBelow: number;
    onTrackMin: number;
  };
  connectedSourceId?: string;
  formulaDescription?: string;
  targetChangeLog?: {
    date: string;
    oldTarget: number;
    newTarget: number;
    reason: string;
    changedBy: string;
  }[];
}

export type SourceType = 'Google Sheets' | 'Google Forms' | 'CSV / Direct Feed';
export type SyncStatus = 'Synced' | 'Syncing' | 'Warning' | 'Error';

export interface ColumnMapping {
  sourceColumn: string;
  targetKpiId: string;
  dataType: 'number' | 'date' | 'string';
  aggregation: AggregationMethod;
}

export interface DataSource {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  sheetName?: string;
  assignedCommitteeIds: string[];
  syncStatus: SyncStatus;
  lastSyncTime: string;
  rowCount: number;
  validationHealthScore: number; // 0 - 100
  columns: string[];
  mappings: ColumnMapping[];
  validationRules: {
    rule: string;
    severity: 'Warning' | 'Error';
  }[];
  recentError?: string;
  sampleRows?: Record<string, any>[];
}

export interface ReportingSubmission {
  id: string;
  committeeId: string;
  period: string; // e.g. "Week 41, 2026" or "October 2026"
  dueDate: string;
  submittedAt: string | null; // null = missing/overdue
  status: 'On Time' | 'Late' | 'Pending' | 'Overdue';
  submittedBy?: string;
  notes?: string;
  dataHealthScore: number; // 0-100%
  kpisReportedCount: number;
  kpisMissingCount: number;
}

export interface OperationalIssue {
  id: string;
  committeeId: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Overdue Report' | 'Target Miss' | 'Data Quality' | 'Operational Bottleneck' | 'Budget Variance';
  description: string;
  detectedAt: string;
  status: 'Open' | 'Under Review' | 'In Progress' | 'Resolved';
  assignedTo: string;
  deadline: string;
  isOverdue: boolean;
  rootCause?: string;
  correctiveAction?: string;
  supportingKpiId?: string;
  supportingSourceId?: string;
}

export interface OrganizationHealthWeights {
  reportingComplianceWeight: number; // e.g. 0.35
  kpiAttainmentWeight: number;       // e.g. 0.35
  dataSourceHealthWeight: number;    // e.g. 0.15
  milestoneExecutionWeight: number;  // e.g. 0.15
}

export interface FilterState {
  period: string;
  committeeId: string; // 'all' or specific id
  statusFilter: string; // 'all', 'on-track', 'critical', 'missing'
  searchQuery: string;
}
