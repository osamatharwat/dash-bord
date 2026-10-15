import {
  Committee,
  KpiDefinition,
  DataSource,
  ReportingSubmission,
  OperationalIssue,
  OrganizationHealthWeights
} from '../types';

export const INITIAL_COMMITTEES: Committee[] = [
  {
    id: 'comm-planning',
    name: 'Planning',
    code: 'PLN',
    category: 'Strategy & Data',
    leadName: 'Layla Nabil',
    leadEmail: 'layla.nabil@aliens-activity.org',
    memberCount: 9,
    description: 'Master operational timelines, milestone governance, task tracking, and cross-committee alignment.',
    reportingCadence: 'Weekly',
    status: 'On Track',
    meetingDay: 'Sundays 18:00',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-data-analysis',
    name: 'Data Analysis',
    code: 'DAT',
    category: 'Strategy & Data',
    leadName: 'Zaid Al-Omari',
    leadEmail: 'zaid.omari@aliens-activity.org',
    memberCount: 6,
    description: 'Data ingestion completeness, reporting audit quality, intelligence validation, and analytical reports.',
    reportingCadence: 'Weekly',
    status: 'On Track',
    meetingDay: 'Mondays 19:30',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-pr',
    name: 'Public Relations (PR)',
    code: 'PR',
    category: 'Communications',
    leadName: 'Tariq Mansour',
    leadEmail: 'tariq.mansour@aliens-activity.org',
    memberCount: 10,
    description: 'Institutional relations, university stakeholder coordination, media press kits, and partner correspondence.',
    reportingCadence: 'Weekly',
    status: 'Needs Attention',
    meetingDay: 'Tuesdays 17:00',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-ir',
    name: 'International Relations (IR)',
    code: 'IR',
    category: 'Communications',
    leadName: 'Sarah Al-Hassan',
    leadEmail: 'sarah.hassan@aliens-activity.org',
    memberCount: 8,
    description: 'Cross-border youth delegations, international university tie-ups, guest speaker curation, and global outreach.',
    reportingCadence: 'Bi-Weekly',
    status: 'On Track',
    meetingDay: 'Wednesdays 20:00',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-marketing',
    name: 'Marketing',
    code: 'MKT',
    category: 'Communications',
    leadName: 'Maya Lin',
    leadEmail: 'maya.lin@aliens-activity.org',
    memberCount: 14,
    description: 'Audience reach, campaign execution, engagement analytics, digital channels, and recruitment drives.',
    reportingCadence: 'Weekly',
    status: 'On Track',
    meetingDay: 'Mondays 18:00',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-media',
    name: 'Media',
    code: 'MED',
    category: 'Communications',
    leadName: 'Omar Farouk',
    leadEmail: 'omar.farouk@aliens-activity.org',
    memberCount: 12,
    description: 'Video production pipelines, photography coverage, brand motion design, and post-production delivery schedules.',
    reportingCadence: 'Weekly',
    status: 'Needs Attention',
    meetingDay: 'Thursdays 18:30',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-secretary',
    name: 'Secretary',
    code: 'SEC',
    category: 'Operations',
    leadName: 'Nadine Samir',
    leadEmail: 'nadine.samir@aliens-activity.org',
    memberCount: 5,
    description: 'Official meeting documentation, leadership council quorum records, archives management, and internal notices.',
    reportingCadence: 'Weekly',
    status: 'Missing Report',
    meetingDay: 'Saturdays 16:00',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-magic-hand',
    name: 'Magic Hand',
    code: 'MGH',
    category: 'Logistics & Finance',
    leadName: 'Karim Mostafa',
    leadEmail: 'karim.mostafa@aliens-activity.org',
    memberCount: 16,
    description: 'Physical fabrication, event booth constructions, staging mechanics, venue installations, and equipment readiness.',
    reportingCadence: 'Weekly',
    status: 'On Track',
    meetingDay: 'Fridays 14:00',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-treasure',
    name: 'Treasure',
    code: 'TRS',
    category: 'Logistics & Finance',
    leadName: 'Hany El-Sayed',
    leadEmail: 'hany.elsayed@aliens-activity.org',
    memberCount: 4,
    description: 'Financial allocations, budget compliance, sponsorship income auditing, expenditure reconciliation, and receipts archiving.',
    reportingCadence: 'Weekly',
    status: 'Critical',
    meetingDay: 'Tuesdays 19:00',
    createdAt: '2026-01-10'
  },
  {
    id: 'comm-charity',
    name: 'Charity',
    code: 'CHR',
    category: 'Community',
    leadName: 'Yasmine Adel',
    leadEmail: 'yasmine.adel@aliens-activity.org',
    memberCount: 11,
    description: 'Social impact drives, aid distributions, beneficiary outreach, volunteer mobilization, and non-profit partner activations.',
    reportingCadence: 'Bi-Weekly',
    status: 'On Track',
    meetingDay: 'Saturdays 17:30',
    createdAt: '2026-01-10'
  }
];

export const INITIAL_KPIS: KpiDefinition[] = [
  // --- PLANNING KPIS ---
  {
    id: 'kpi-pln-milestones',
    committeeId: 'comm-planning',
    code: 'PLN-01',
    title: 'Master Milestones On-Time Rate',
    description: 'Percentage of planned strategic organizational milestones achieved on or before committed deadline.',
    unit: 'percentage',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 90,
    currentValue: 92.5,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 88, target: 90, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 91, target: 90, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 94, target: 90, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 92.5, target: 90, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 75, warningBelow: 85, onTrackMin: 85 },
    connectedSourceId: 'src-planning-gantt',
    formulaDescription: '(Completed On-Time Milestones / Total Due Milestones) * 100'
  },
  {
    id: 'kpi-pln-tasks',
    committeeId: 'comm-planning',
    code: 'PLN-02',
    title: 'Cross-Committee Task Velocity',
    description: 'Total operational sprint tasks completed and verified across all committee workstreams.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Weekly',
    target: 120,
    currentValue: 134,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 115, target: 120, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 128, target: 120, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 140, target: 120, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 134, target: 120, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 80, warningBelow: 100, onTrackMin: 110 },
    connectedSourceId: 'src-planning-gantt'
  },

  // --- DATA ANALYSIS KPIS ---
  {
    id: 'kpi-dat-completeness',
    committeeId: 'comm-data-analysis',
    code: 'DAT-01',
    title: 'Whole-Team Data Completeness',
    description: 'Completeness ratio of required operational log entries verified across all committees.',
    unit: 'percentage',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 95,
    currentValue: 91.8,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 86.5, target: 95, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 89.2, target: 95, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 93.4, target: 95, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 91.8, target: 95, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 80, warningBelow: 90, onTrackMin: 90 },
    connectedSourceId: 'src-data-audit',
    formulaDescription: '(Valid Ingested Records / Total Required Submissions) * 100'
  },
  {
    id: 'kpi-dat-turnaround',
    committeeId: 'comm-data-analysis',
    code: 'DAT-02',
    title: 'Analysis Brief Turnaround Time',
    description: 'Average hours taken to process raw committee logs into executive intelligence briefings.',
    unit: 'hours',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 24,
    currentValue: 19.5,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 26.0, target: 24, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 22.5, target: 24, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 18.0, target: 24, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 19.5, target: 24, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 36, warningBelow: 28, onTrackMin: 24 },
    connectedSourceId: 'src-data-audit'
  },

  // --- PUBLIC RELATIONS (PR) KPIS ---
  {
    id: 'kpi-pr-response-time',
    committeeId: 'comm-pr',
    code: 'PR-01',
    title: 'Stakeholder Inbound Response Time',
    description: 'Average turnaround hours to reply to university deans, corporate partners, and institutional sponsors.',
    unit: 'hours',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 8.0,
    currentValue: 14.2,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 9.1, target: 8.0, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 11.4, target: 8.0, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 12.0, target: 8.0, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 14.2, target: 8.0, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 16.0, warningBelow: 10.0, onTrackMin: 8.0 },
    connectedSourceId: 'src-pr-inbound',
    formulaDescription: 'Total Response Latency / Total Inbound Inquiries'
  },
  {
    id: 'kpi-pr-active-outreach',
    committeeId: 'comm-pr',
    code: 'PR-02',
    title: 'Partner Outreach Follow-ups',
    description: 'Active institutional partner meetings, campus permissions, and formal outreach touchpoints logged.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Weekly',
    target: 25,
    currentValue: 18,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 24, target: 25, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 21, target: 25, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 20, target: 25, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 18, target: 25, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 12, warningBelow: 20, onTrackMin: 22 },
    connectedSourceId: 'src-pr-inbound'
  },

  // --- INTERNATIONAL RELATIONS (IR) KPIS ---
  {
    id: 'kpi-ir-partnerships',
    committeeId: 'comm-ir',
    code: 'IR-01',
    title: 'International Student Org Partnerships',
    description: 'Active bilateral cooperation agreements and mutual exchange programs with regional and foreign student clubs.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Bi-Weekly',
    target: 6,
    currentValue: 7,
    isMissingReport: false,
    history: [
      { period: 'Week 37-38', actual: 4, target: 5, timestamp: '2026-09-20' },
      { period: 'Week 39-40', actual: 6, target: 6, timestamp: '2026-10-04' },
      { period: 'Week 41-42', actual: 7, target: 6, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 3, warningBelow: 5, onTrackMin: 6 },
    connectedSourceId: 'src-ir-partnerships'
  },
  {
    id: 'kpi-ir-speaker-outreach',
    committeeId: 'comm-ir',
    code: 'IR-02',
    title: 'International Guest Speakers Confirmed',
    description: 'Confirmed international keynote experts for upcoming ALIENS symposium.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Bi-Weekly',
    target: 4,
    currentValue: 5,
    isMissingReport: false,
    history: [
      { period: 'Week 37-38', actual: 2, target: 3, timestamp: '2026-09-20' },
      { period: 'Week 39-40', actual: 4, target: 4, timestamp: '2026-10-04' },
      { period: 'Week 41-42', actual: 5, target: 4, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 2, warningBelow: 3, onTrackMin: 4 },
    connectedSourceId: 'src-ir-partnerships'
  },

  // --- MARKETING KPIS ---
  {
    id: 'kpi-mkt-interactions',
    committeeId: 'comm-marketing',
    code: 'MKT-01',
    title: 'Monthly Audience Interactions',
    description: 'Total user interactions (likes, comments, shares, saves, form clicks) across official ALIENS social channels.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Weekly',
    target: 5000,
    currentValue: 5420,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 4890, target: 5000, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 5120, target: 5000, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 5680, target: 5000, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 5420, target: 5000, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 3500, warningBelow: 4500, onTrackMin: 4800 },
    connectedSourceId: 'src-marketing-sheets',
    formulaDescription: 'Sum of Instagram + LinkedIn + Facebook + TikTok public engagements'
  },
  {
    id: 'kpi-mkt-reach',
    committeeId: 'comm-marketing',
    code: 'MKT-02',
    title: 'Unique Campaign Reach',
    description: 'Verified unique student and faculty reach generated through official digital and on-campus activations.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Weekly',
    target: 40000,
    currentValue: 46800,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 38200, target: 40000, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 41500, target: 40000, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 49100, target: 40000, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 46800, target: 40000, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 28000, warningBelow: 36000, onTrackMin: 38000 },
    connectedSourceId: 'src-marketing-sheets'
  },
  {
    id: 'kpi-mkt-content-output',
    committeeId: 'comm-marketing',
    code: 'MKT-03',
    title: 'Weekly Content Output Published',
    description: 'Published reels, carousels, announcement posts, and campus teaser flyers.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Weekly',
    target: 12,
    currentValue: 13,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 11, target: 12, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 12, target: 12, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 14, target: 12, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 13, target: 12, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 8, warningBelow: 10, onTrackMin: 11 },
    connectedSourceId: 'src-marketing-sheets'
  },

  // --- MEDIA KPIS ---
  {
    id: 'kpi-med-turnaround',
    committeeId: 'comm-media',
    code: 'MED-01',
    title: 'Post-Event Media Turnaround',
    description: 'Hours to color-grade, edit, and deliver full photo & recap video packs following an ALIENS event.',
    unit: 'hours',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 36,
    currentValue: 48.5,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 34.0, target: 36, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 42.0, target: 36, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 46.0, target: 36, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 48.5, target: 36, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 52, warningBelow: 40, onTrackMin: 36 },
    connectedSourceId: 'src-media-pipeline',
    formulaDescription: 'Sum of delivery timestamps - event wrap timestamp'
  },
  {
    id: 'kpi-med-asset-output',
    committeeId: 'comm-media',
    code: 'MED-02',
    title: 'Approved Media Assets Delivered',
    description: 'High-res photos, branded motion graphics, teaser edits, and sound-mixed videos delivered to review stage.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Weekly',
    target: 30,
    currentValue: 26,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 29, target: 30, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 27, target: 30, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 32, target: 30, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 26, target: 30, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 18, warningBelow: 25, onTrackMin: 28 },
    connectedSourceId: 'src-media-pipeline'
  },

  // --- SECRETARY KPIS ---
  {
    id: 'kpi-sec-doc-rate',
    committeeId: 'comm-secretary',
    code: 'SEC-01',
    title: 'Meeting Minutes Filing Compliance',
    description: 'Official meeting records, action items, and executive summaries archived within 24 hours of meeting adjourn.',
    unit: 'percentage',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 100,
    currentValue: null, // Critical: Missing report for current cycle!
    isMissingReport: true,
    history: [
      { period: 'Week 38', actual: 100, target: 100, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 100, target: 100, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 80, target: 100, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: null, target: 100, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 70, warningBelow: 90, onTrackMin: 95 },
    connectedSourceId: 'src-secretary-docs',
    formulaDescription: '(Minutes Filed On Time / Total Scheduled Meetings) * 100'
  },
  {
    id: 'kpi-sec-attendance',
    committeeId: 'comm-secretary',
    code: 'SEC-02',
    title: 'General Assembly & Board Attendance Rate',
    description: 'Attendance percentage across all committee leads and core officers in formal weekly coordination sessions.',
    unit: 'percentage',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 85,
    currentValue: null, // Critical: Missing report!
    isMissingReport: true,
    history: [
      { period: 'Week 38', actual: 88, target: 85, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 84, target: 85, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 81, target: 85, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: null, target: 85, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 70, warningBelow: 80, onTrackMin: 85 },
    connectedSourceId: 'src-secretary-docs'
  },

  // --- MAGIC HAND KPIS ---
  {
    id: 'kpi-mgh-readiness',
    committeeId: 'comm-magic-hand',
    code: 'MGH-01',
    title: 'Venue Setup & Fabrication Readiness',
    description: 'Physical stage props, decorative structures, and lighting installations ready 3 hours prior to event doors.',
    unit: 'percentage',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 95,
    currentValue: 98.0,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 92, target: 95, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 96, target: 95, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 97, target: 95, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 98.0, target: 95, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 80, warningBelow: 90, onTrackMin: 92 },
    connectedSourceId: 'src-magichand-builds'
  },
  {
    id: 'kpi-mgh-inventory',
    committeeId: 'comm-magic-hand',
    code: 'MGH-02',
    title: 'Equipment & Tool Return Verification',
    description: 'Percentage of borrowed electrical, acoustic, and stage building assets audited back into inventory without loss.',
    unit: 'percentage',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 98,
    currentValue: 100.0,
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 97, target: 98, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 98, target: 98, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 99, target: 98, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 100.0, target: 98, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 90, warningBelow: 95, onTrackMin: 98 },
    connectedSourceId: 'src-magichand-builds'
  },

  // --- TREASURE KPIS ---
  {
    id: 'kpi-trs-variance',
    committeeId: 'comm-treasure',
    code: 'TRS-01',
    title: 'Budget Variance Rate',
    description: 'Absolute deviation percentage between approved committee expenditure limits and actual disbursements.',
    unit: 'percentage',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 5.0, // <= 5% target variance
    currentValue: 16.4, // high deviation = critical issue
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 4.2, target: 5.0, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 7.8, target: 5.0, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 12.1, target: 5.0, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 16.4, target: 5.0, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 15.0, warningBelow: 8.0, onTrackMin: 5.0 },
    connectedSourceId: 'src-treasure-ledger',
    formulaDescription: 'abs(Disbursed - Budgeted) / Budgeted * 100'
  },
  {
    id: 'kpi-trs-receipt-audit',
    committeeId: 'comm-treasure',
    code: 'TRS-02',
    title: 'Audited Invoices & Receipts Cleared',
    description: 'Percentage of reimbursement claims backed by verified tax receipts and sign-offs.',
    unit: 'percentage',
    aggregationMethod: 'AVG',
    reportingCadence: 'Weekly',
    target: 95,
    currentValue: 64.0, // Critical backlog
    isMissingReport: false,
    history: [
      { period: 'Week 38', actual: 92, target: 95, timestamp: '2026-09-20' },
      { period: 'Week 39', actual: 82, target: 95, timestamp: '2026-09-27' },
      { period: 'Week 40', actual: 71, target: 95, timestamp: '2026-10-04' },
      { period: 'Week 41', actual: 64.0, target: 95, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 75, warningBelow: 88, onTrackMin: 90 },
    connectedSourceId: 'src-treasure-ledger'
  },

  // --- CHARITY KPIS ---
  {
    id: 'kpi-chr-beneficiaries',
    committeeId: 'comm-charity',
    code: 'CHR-01',
    title: 'Beneficiaries Supported to Date',
    description: 'Total underprivileged families, children, and hospital patients aided through official ALIENS drives.',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Bi-Weekly',
    target: 600,
    currentValue: 740,
    isMissingReport: false,
    history: [
      { period: 'Week 37-38', actual: 480, target: 500, timestamp: '2026-09-20' },
      { period: 'Week 39-40', actual: 610, target: 550, timestamp: '2026-10-04' },
      { period: 'Week 41-42', actual: 740, target: 600, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 450, warningBelow: 550, onTrackMin: 580 },
    connectedSourceId: 'src-charity-aid'
  },
  {
    id: 'kpi-chr-safety-incidents',
    committeeId: 'comm-charity',
    code: 'CHR-02',
    title: 'Off-Campus Safety Incidents',
    description: 'Documented field hazards or safety violations during convoy trips (genuine zero indicates safe operations).',
    unit: 'count',
    aggregationMethod: 'SUM',
    reportingCadence: 'Bi-Weekly',
    target: 0,
    currentValue: 0, // CRITICAL: Genuine zero! Must not be confused with missing report
    isMissingReport: false,
    history: [
      { period: 'Week 37-38', actual: 0, target: 0, timestamp: '2026-09-20' },
      { period: 'Week 39-40', actual: 0, target: 0, timestamp: '2026-10-04' },
      { period: 'Week 41-42', actual: 0, target: 0, timestamp: '2026-10-11' }
    ],
    thresholds: { criticalBelow: 2, warningBelow: 1, onTrackMin: 0 },
    connectedSourceId: 'src-charity-aid'
  }
];

export const INITIAL_DATA_SOURCES: DataSource[] = [
  {
    id: 'src-planning-gantt',
    name: 'ALIENS Master Planning & Sprint Gantt',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0',
    sheetName: 'Milestones_Q4_2026',
    assignedCommitteeIds: ['comm-planning'],
    syncStatus: 'Synced',
    lastSyncTime: '12 minutes ago',
    rowCount: 248,
    validationHealthScore: 98,
    columns: ['Sprint_ID', 'Milestone_Name', 'Owner_Committee', 'Due_Date', 'Status', 'Completion_Pct', 'Signoff_Lead'],
    mappings: [
      { sourceColumn: 'Completion_Pct', targetKpiId: 'kpi-pln-milestones', dataType: 'number', aggregation: 'AVG' },
      { sourceColumn: 'Status', targetKpiId: 'kpi-pln-tasks', dataType: 'string', aggregation: 'SUM' }
    ],
    validationRules: [
      { rule: 'Due_Date must be valid ISO format', severity: 'Warning' },
      { rule: 'Completion_Pct must be between 0 and 100', severity: 'Error' }
    ],
    sampleRows: [
      { Sprint_ID: 'SPR-41', Milestone_Name: 'Stage Truss Safety Load Test', Owner_Committee: 'Magic Hand', Due_Date: '2026-10-10', Status: 'Completed', Completion_Pct: 100, Signoff_Lead: 'Layla Nabil' },
      { Sprint_ID: 'SPR-41', Milestone_Name: 'University Dean Clearance Letter', Owner_Committee: 'PR', Due_Date: '2026-10-12', Status: 'Delayed', Completion_Pct: 60, Signoff_Lead: 'Tariq Mansour' },
      { Sprint_ID: 'SPR-41', Milestone_Name: 'Teaser Reel v2 Export', Owner_Committee: 'Media', Due_Date: '2026-10-11', Status: 'Completed', Completion_Pct: 100, Signoff_Lead: 'Omar Farouk' },
      { Sprint_ID: 'SPR-41', Milestone_Name: 'Food Pack Sourcing Audit', Owner_Committee: 'Charity', Due_Date: '2026-10-10', Status: 'Completed', Completion_Pct: 100, Signoff_Lead: 'Yasmine Adel' }
    ]
  },
  {
    id: 'src-marketing-sheets',
    name: 'Marketing Performance & Ads Tracker',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1X8pL902kmZ_yA_marketing_aliens_2026/edit#gid=102',
    sheetName: 'Weekly_Aggregates',
    assignedCommitteeIds: ['comm-marketing'],
    syncStatus: 'Synced',
    lastSyncTime: '25 minutes ago',
    rowCount: 412,
    validationHealthScore: 100,
    columns: ['Week_Period', 'Platform', 'Total_Interactions', 'Impressions', 'Reach', 'Content_Units', 'Logged_By'],
    mappings: [
      { sourceColumn: 'Total_Interactions', targetKpiId: 'kpi-mkt-interactions', dataType: 'number', aggregation: 'SUM' },
      { sourceColumn: 'Reach', targetKpiId: 'kpi-mkt-reach', dataType: 'number', aggregation: 'SUM' },
      { sourceColumn: 'Content_Units', targetKpiId: 'kpi-mkt-content-output', dataType: 'number', aggregation: 'SUM' }
    ],
    validationRules: [
      { rule: 'Interactions must be non-negative integer', severity: 'Error' },
      { rule: 'Platform must match recognized channels', severity: 'Warning' }
    ],
    sampleRows: [
      { Week_Period: 'Week 41', Platform: 'Instagram', Total_Interactions: 3200, Impressions: 42000, Reach: 28400, Content_Units: 7, Logged_By: 'Maya Lin' },
      { Week_Period: 'Week 41', Platform: 'LinkedIn', Total_Interactions: 1120, Impressions: 18500, Reach: 11200, Content_Units: 3, Logged_By: 'Karim Zaki' },
      { Week_Period: 'Week 41', Platform: 'TikTok', Total_Interactions: 1100, Impressions: 14000, Reach: 7200, Content_Units: 3, Logged_By: 'Salma Sherif' }
    ]
  },
  {
    id: 'src-treasure-ledger',
    name: 'ALIENS Central Treasury Ledger & Receipts',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1Tr3asure_Ledger_ALIENS_Student_Activity_2026/edit',
    sheetName: 'Expenses_Audit',
    assignedCommitteeIds: ['comm-treasure'],
    syncStatus: 'Warning',
    lastSyncTime: '3 hours ago',
    rowCount: 184,
    validationHealthScore: 78,
    recentError: '28 pending expense line items are missing verified invoice images or auditor signatures.',
    columns: ['Voucher_ID', 'Requesting_Committee', 'Category', 'Allocated_Budget', 'Disbursed_Amount', 'Receipt_Attached', 'Audit_Approved'],
    mappings: [
      { sourceColumn: 'Disbursed_Amount', targetKpiId: 'kpi-trs-variance', dataType: 'number', aggregation: 'AVG' },
      { sourceColumn: 'Receipt_Attached', targetKpiId: 'kpi-trs-receipt-audit', dataType: 'string', aggregation: 'AVG' }
    ],
    validationRules: [
      { rule: 'Allocated_Budget >= Disbursed_Amount', severity: 'Warning' },
      { rule: 'Voucher_ID must be unique', severity: 'Error' }
    ],
    sampleRows: [
      { Voucher_ID: 'VCH-901', Requesting_Committee: 'Magic Hand', Category: 'Timber & Acrylic', Allocated_Budget: 1500, Disbursed_Amount: 1820, Receipt_Attached: 'YES', Audit_Approved: 'YES' },
      { Voucher_ID: 'VCH-902', Requesting_Committee: 'Media', Category: 'SD Cards & Lens Rental', Allocated_Budget: 800, Disbursed_Amount: 1150, Receipt_Attached: 'NO', Audit_Approved: 'NO' },
      { Voucher_ID: 'VCH-903', Requesting_Committee: 'PR', Category: 'Institutional Coffee Catering', Allocated_Budget: 600, Disbursed_Amount: 900, Receipt_Attached: 'NO', Audit_Approved: 'NO' }
    ]
  },
  {
    id: 'src-pr-inbound',
    name: 'PR External Communications & Dispatch Log',
    type: 'Google Forms',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScPR_ALIENS_Dispatch_Form_2026/viewform',
    assignedCommitteeIds: ['comm-pr'],
    syncStatus: 'Synced',
    lastSyncTime: '45 minutes ago',
    rowCount: 96,
    validationHealthScore: 92,
    columns: ['Timestamp', 'Organization_Name', 'Contact_Person', 'Channel', 'Turnaround_Hours', 'Status', 'Assigned_Officer'],
    mappings: [
      { sourceColumn: 'Turnaround_Hours', targetKpiId: 'kpi-pr-response-time', dataType: 'number', aggregation: 'AVG' },
      { sourceColumn: 'Status', targetKpiId: 'kpi-pr-active-outreach', dataType: 'string', aggregation: 'SUM' }
    ],
    validationRules: [
      { rule: 'Turnaround_Hours must be positive float', severity: 'Error' }
    ],
    sampleRows: [
      { Timestamp: '2026-10-14 11:20', Organization_Name: 'Faculty of Engineering Student Union', Contact_Person: 'Eng. Amr', Channel: 'Email', Turnaround_Hours: 12.5, Status: 'Follow-up Sent', Assigned_Officer: 'Tariq Mansour' },
      { Timestamp: '2026-10-13 14:05', Organization_Name: 'Red Bull Campus Team', Contact_Person: 'Nouran K.', Channel: 'WhatsApp Official', Turnaround_Hours: 16.0, Status: 'Meeting Booked', Assigned_Officer: 'Heba Adel' }
    ]
  },
  {
    id: 'src-secretary-docs',
    name: 'Secretary Council Minutes & Quorum Archives',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1Sec_Archives_Minutes_ALIENS_2026/edit',
    sheetName: 'Meeting_Records',
    assignedCommitteeIds: ['comm-secretary'],
    syncStatus: 'Error',
    lastSyncTime: '6 days ago',
    rowCount: 42,
    validationHealthScore: 60,
    recentError: 'No submission received for Week 41 council meeting. Source data is stale.',
    columns: ['Session_Date', 'Meeting_Type', 'Minutes_Uploaded_Within_24h', 'Total_Invited', 'Total_Attended', 'Secretary_Signoff'],
    mappings: [
      { sourceColumn: 'Minutes_Uploaded_Within_24h', targetKpiId: 'kpi-sec-doc-rate', dataType: 'string', aggregation: 'AVG' },
      { sourceColumn: 'Total_Attended', targetKpiId: 'kpi-sec-attendance', dataType: 'number', aggregation: 'AVG' }
    ],
    validationRules: [
      { rule: 'Weekly log must be recorded by Sunday 23:59', severity: 'Error' }
    ],
    sampleRows: [
      { Session_Date: '2026-10-03', Meeting_Type: 'Executive Council', Minutes_Uploaded_Within_24h: 'YES', Total_Invited: 12, Total_Attended: 10, Secretary_Signoff: 'Nadine Samir' },
      { Session_Date: '2026-09-26', Meeting_Type: 'General Committee Sync', Minutes_Uploaded_Within_24h: 'YES', Total_Invited: 20, Total_Attended: 17, Secretary_Signoff: 'Nadine Samir' }
    ]
  },
  {
    id: 'src-magichand-builds',
    name: 'Magic Hand Material & Construction Tracker',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1MagicHand_Workshop_Logistics_ALIENS_2026/edit',
    sheetName: 'Workshop_Builds',
    assignedCommitteeIds: ['comm-magic-hand'],
    syncStatus: 'Synced',
    lastSyncTime: '1 hour ago',
    rowCount: 85,
    validationHealthScore: 96,
    columns: ['Structure_ID', 'Event_Target', 'Build_Completion_Pct', 'Tool_Audit_Pass', 'Safety_Clearance', 'Lead_Craftsman'],
    mappings: [
      { sourceColumn: 'Build_Completion_Pct', targetKpiId: 'kpi-mgh-readiness', dataType: 'number', aggregation: 'AVG' },
      { sourceColumn: 'Tool_Audit_Pass', targetKpiId: 'kpi-mgh-inventory', dataType: 'string', aggregation: 'AVG' }
    ],
    validationRules: [
      { rule: 'Build_Completion_Pct between 0 and 100', severity: 'Error' }
    ]
  },
  {
    id: 'src-charity-aid',
    name: 'Charity Impact & Field Mission CRM',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1Charity_Community_Impact_ALIENS_2026/edit',
    sheetName: 'Aid_Convoys',
    assignedCommitteeIds: ['comm-charity'],
    syncStatus: 'Synced',
    lastSyncTime: '2 hours ago',
    rowCount: 130,
    validationHealthScore: 100,
    columns: ['Convoy_Date', 'District', 'Families_Aided', 'Field_Volunteers', 'Incidents_Logged', 'Field_Coordinator'],
    mappings: [
      { sourceColumn: 'Families_Aided', targetKpiId: 'kpi-chr-beneficiaries', dataType: 'number', aggregation: 'SUM' },
      { sourceColumn: 'Incidents_Logged', targetKpiId: 'kpi-chr-safety-incidents', dataType: 'number', aggregation: 'SUM' }
    ],
    validationRules: [
      { rule: 'Families_Aided >= 0', severity: 'Error' }
    ]
  },
  {
    id: 'src-media-pipeline',
    name: 'Media Studio Render & Export Pipeline',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1Media_Render_Queue_ALIENS_2026/edit',
    sheetName: 'Exports_Q4',
    assignedCommitteeIds: ['comm-media'],
    syncStatus: 'Synced',
    lastSyncTime: '50 minutes ago',
    rowCount: 160,
    validationHealthScore: 90,
    columns: ['Project_Code', 'Editor_Name', 'Turnaround_Hours', 'Asset_Count', 'QA_Approved', 'Delivery_Status'],
    mappings: [
      { sourceColumn: 'Turnaround_Hours', targetKpiId: 'kpi-med-turnaround', dataType: 'number', aggregation: 'AVG' },
      { sourceColumn: 'Asset_Count', targetKpiId: 'kpi-med-asset-output', dataType: 'number', aggregation: 'SUM' }
    ],
    validationRules: [
      { rule: 'Turnaround_Hours <= 72', severity: 'Warning' }
    ]
  },
  {
    id: 'src-ir-partnerships',
    name: 'IR International Network & Delegations',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1IR_International_Partnerships_ALIENS_2026/edit',
    sheetName: 'Global_Partners',
    assignedCommitteeIds: ['comm-ir'],
    syncStatus: 'Synced',
    lastSyncTime: '4 hours ago',
    rowCount: 54,
    validationHealthScore: 95,
    columns: ['Partner_Institution', 'Country', 'Partnership_Status', 'Confirmed_Speakers', 'Lead_Ambassador'],
    mappings: [
      { sourceColumn: 'Partnership_Status', targetKpiId: 'kpi-ir-partnerships', dataType: 'string', aggregation: 'SUM' },
      { sourceColumn: 'Confirmed_Speakers', targetKpiId: 'kpi-ir-speaker-outreach', dataType: 'number', aggregation: 'SUM' }
    ],
    validationRules: [
      { rule: 'Country must be valid ISO code', severity: 'Warning' }
    ]
  },
  {
    id: 'src-data-audit',
    name: 'Data Analysis Ingestion & Quality Ledger',
    type: 'Google Sheets',
    url: 'https://docs.google.com/spreadsheets/d/1DataAnalysis_Quality_Audit_ALIENS_2026/edit',
    sheetName: 'Audit_Runs',
    assignedCommitteeIds: ['comm-data-analysis'],
    syncStatus: 'Synced',
    lastSyncTime: '10 minutes ago',
    rowCount: 210,
    validationHealthScore: 99,
    columns: ['Audit_Date', 'Committee_Audited', 'Completeness_Pct', 'Turnaround_Hours', 'Data_Anomalies_Flagged', 'Auditor'],
    mappings: [
      { sourceColumn: 'Completeness_Pct', targetKpiId: 'kpi-dat-completeness', dataType: 'number', aggregation: 'AVG' },
      { sourceColumn: 'Turnaround_Hours', targetKpiId: 'kpi-dat-turnaround', dataType: 'number', aggregation: 'AVG' }
    ],
    validationRules: [
      { rule: 'Completeness_Pct <= 100', severity: 'Error' }
    ]
  }
];

export const INITIAL_SUBMISSIONS: ReportingSubmission[] = [
  // Week 41 (Current)
  { id: 'sub-41-pln', committeeId: 'comm-planning', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-11 17:30', status: 'On Time', submittedBy: 'Layla Nabil', dataHealthScore: 98, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-41-dat', committeeId: 'comm-data-analysis', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-11 19:15', status: 'On Time', submittedBy: 'Zaid Al-Omari', dataHealthScore: 99, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-41-mkt', committeeId: 'comm-marketing', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-11 18:00', status: 'On Time', submittedBy: 'Maya Lin', dataHealthScore: 100, kpisReportedCount: 3, kpisMissingCount: 0 },
  { id: 'sub-41-mgh', committeeId: 'comm-magic-hand', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-11 15:40', status: 'On Time', submittedBy: 'Karim Mostafa', dataHealthScore: 96, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-41-ir', committeeId: 'comm-ir', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-11 20:10', status: 'On Time', submittedBy: 'Sarah Al-Hassan', dataHealthScore: 95, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-41-chr', committeeId: 'comm-charity', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-11 16:50', status: 'On Time', submittedBy: 'Yasmine Adel', dataHealthScore: 100, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-41-pr', committeeId: 'comm-pr', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-12 04:15', status: 'Late', submittedBy: 'Tariq Mansour', notes: 'Delayed due to pending confirmation from Faculty Dean office.', dataHealthScore: 92, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-41-med', committeeId: 'comm-media', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-12 02:00', status: 'Late', submittedBy: 'Omar Farouk', notes: 'Render farm bottlenecks delayed video export timestamp logs.', dataHealthScore: 90, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-41-trs', committeeId: 'comm-treasure', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: '2026-10-11 23:30', status: 'On Time', submittedBy: 'Hany El-Sayed', notes: 'Severe receipt backlog flagged across multiple committees.', dataHealthScore: 78, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-41-sec', committeeId: 'comm-secretary', period: 'Week 41, 2026', dueDate: '2026-10-11', submittedAt: null, status: 'Overdue', notes: 'No report filed. Council minutes from Oct 10 pending submission.', dataHealthScore: 0, kpisReportedCount: 0, kpisMissingCount: 2 },

  // Week 40
  { id: 'sub-40-pln', committeeId: 'comm-planning', period: 'Week 40, 2026', dueDate: '2026-10-04', submittedAt: '2026-10-04 18:00', status: 'On Time', submittedBy: 'Layla Nabil', dataHealthScore: 97, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-40-dat', committeeId: 'comm-data-analysis', period: 'Week 40, 2026', dueDate: '2026-10-04', submittedAt: '2026-10-04 19:00', status: 'On Time', submittedBy: 'Zaid Al-Omari', dataHealthScore: 98, kpisReportedCount: 2, kpisMissingCount: 0 },
  { id: 'sub-40-mkt', committeeId: 'comm-marketing', period: 'Week 40, 2026', dueDate: '2026-10-04', submittedAt: '2026-10-04 18:20', status: 'On Time', submittedBy: 'Maya Lin', dataHealthScore: 100, kpisReportedCount: 3, kpisMissingCount: 0 },
  { id: 'sub-40-sec', committeeId: 'comm-secretary', period: 'Week 40, 2026', dueDate: '2026-10-04', submittedAt: '2026-10-05 08:30', status: 'Late', submittedBy: 'Nadine Samir', dataHealthScore: 80, kpisReportedCount: 2, kpisMissingCount: 0 }
];

export const INITIAL_ISSUES: OperationalIssue[] = [
  {
    id: 'iss-01',
    committeeId: 'comm-secretary',
    title: 'Overdue Weekly Governance Report & Minutes Filing',
    severity: 'Critical',
    category: 'Overdue Report',
    description: 'Secretary committee has not submitted the Week 41 report. Council meeting minutes from October 10 are unfiled.',
    detectedAt: '2026-10-12 00:01',
    status: 'Open',
    assignedTo: 'Nadine Samir',
    deadline: '2026-10-13 18:00',
    isOverdue: true,
    rootCause: 'Exam period workload conflict among secretary recording officers.',
    correctiveAction: 'Assign secondary recording secretary backup officer and mandate draft filing within 12 hours.',
    supportingKpiId: 'kpi-sec-doc-rate',
    supportingSourceId: 'src-secretary-docs'
  },
  {
    id: 'iss-02',
    committeeId: 'comm-treasure',
    title: 'Severe Unaudited Receipt Backlog (36% Missing Receipts)',
    severity: 'Critical',
    category: 'Budget Variance',
    description: '28 vouchers disbursed totaling $4,200 lack verified fiscal receipts. Budget variance climbed to 16.4% above approved threshold.',
    detectedAt: '2026-10-11 23:45',
    status: 'In Progress',
    assignedTo: 'Hany El-Sayed',
    deadline: '2026-10-14 20:00',
    isOverdue: true,
    rootCause: 'On-ground procurement officers from Media and Magic Hand failed to upload physical receipt scans immediately.',
    correctiveAction: 'Freeze subsequent cash disbursement advances to defaulting committees until past receipts are reconciled.',
    supportingKpiId: 'kpi-trs-receipt-audit',
    supportingSourceId: 'src-treasure-ledger'
  },
  {
    id: 'iss-03',
    committeeId: 'comm-pr',
    title: 'Institutional Response Time Exceeded 14 Hours',
    severity: 'High',
    category: 'Target Miss',
    description: 'Inbound university dean clearance inquiries took an average of 14.2 hours to answer, violating the 8-hour target.',
    detectedAt: '2026-10-12 09:30',
    status: 'In Progress',
    assignedTo: 'Tariq Mansour',
    deadline: '2026-10-15 12:00',
    isOverdue: false,
    rootCause: 'Lack of automated dispatch alerts for official email inbox during lecture hours.',
    correctiveAction: 'Configure rotating shift dispatch with instant mobile ping to designated PR shift manager.',
    supportingKpiId: 'kpi-pr-response-time',
    supportingSourceId: 'src-pr-inbound'
  },
  {
    id: 'iss-04',
    committeeId: 'comm-media',
    title: 'Post-Production Turnaround Stalled at 48.5h',
    severity: 'Medium',
    category: 'Operational Bottleneck',
    description: 'Event photo packets delivered past the 36-hour deadline, causing delayed campaign recaps.',
    detectedAt: '2026-10-12 10:15',
    status: 'Open',
    assignedTo: 'Omar Farouk',
    deadline: '2026-10-16 18:00',
    isOverdue: false,
    rootCause: 'Single editor workstation bottleneck for 4K color grading.',
    correctiveAction: 'Establish lightweight proxy editing workflow and distribute batch coloring across 3 junior editors.',
    supportingKpiId: 'kpi-med-turnaround',
    supportingSourceId: 'src-media-pipeline'
  }
];

export const INITIAL_WEIGHTS: OrganizationHealthWeights = {
  reportingComplianceWeight: 0.35,
  kpiAttainmentWeight: 0.35,
  dataSourceHealthWeight: 0.15,
  milestoneExecutionWeight: 0.15
};
