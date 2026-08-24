import {
  NavItem,
  MetricItem,
  ProductTicket,
  AccessItem,
  PerformanceRow,
  ActivityItem,
  QuickActionItem,
} from '../types';

export const NAVIGATION_DATA: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    iconName: 'LayoutDashboard',
  },
  {
    id: 'tickets-support',
    label: 'Tickets & Support',
    iconName: 'Ticket',
    badge: '12',
    badgeType: 'primary',
    subItems: [
      { id: 'support-tickets', label: 'Support Tickets', badge: '8', badgeType: 'neutral' },
      { id: 'live-chat', label: 'Live Chat', badge: '4', badgeType: 'primary' },
      { id: 'escalations', label: 'Escalations & Incidents', badge: '2', badgeType: 'danger' },
      { id: 'knowledge-base', label: 'Knowledge Base' },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    iconName: 'Code2',
    badge: '4',
    badgeType: 'tertiary',
    subItems: [
      { id: 'task-board', label: 'Task Board', badge: '4', badgeType: 'tertiary' },
      { id: 'sprints-backlog', label: 'Sprints & Backlog' },
      { id: 'project-roadmap', label: 'Project Roadmap' },
      { id: 'github-activity', label: 'GitHub Activity' },
    ],
  },
  {
    id: 'time-payroll',
    label: 'Time & Payroll',
    iconName: 'Clock',
    badge: '3',
    badgeType: 'tertiary',
    subItems: [
      { id: 'time-tracking', label: 'Time Tracking' },
      { id: 'approvals', label: 'Approvals', badge: '3', badgeType: 'tertiary' },
      { id: 'payroll-runs', label: 'Payroll Runs' },
      { id: 'my-pay', label: 'My Pay' },
    ],
  },
  {
    id: 'people-teams',
    label: 'People & Teams',
    iconName: 'Users',
    badge: '2',
    badgeType: 'neutral',
    subItems: [
      { id: 'users', label: 'Users' },
      { id: 'teams', label: 'Teams' },
      { id: 'pending-invites', label: 'Pending Invites', badge: '2', badgeType: 'tertiary' },
      { id: 'access-audit', label: 'Access Audit Trail' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    iconName: 'Box',
    subItems: [
      { id: 'product-registry', label: 'Product Registry' },
      { id: 'linked-repos', label: 'Linked Repositories' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    iconName: 'MessageSquare',
    badge: '5',
    badgeType: 'tertiary',
    subItems: [
      { id: 'internal-chat', label: 'Internal Chat', badge: '5', badgeType: 'tertiary' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'notification-prefs', label: 'Notification Preferences' },
    ],
  },
  {
    id: 'resources-files',
    label: 'Resources & Files',
    iconName: 'Folder',
    subItems: [
      { id: 'file-management', label: 'File Management' },
      { id: 'resource-management', label: 'Resource Management' },
      { id: 'help-center', label: 'Help Center' },
    ],
  },
  {
    id: 'system-analytics',
    label: 'System & Analytics',
    iconName: 'BarChart3',
    subItems: [
      { id: 'audit-logs', label: 'Audit Logs' },
      { id: 'analytics-reports', label: 'Analytics & Reports' },
      { id: 'integrations-hub', label: 'Integrations Hub' },
    ],
  },
];

export const METRIC_ITEMS: MetricItem[] = [
  {
    id: 'open-tickets',
    title: 'Open Tickets',
    value: '247',
    trend: '+12% ↑ vs last week',
    trendDirection: 'up',
    trendType: 'primary',
    subtext: '3 nearing SLA breach',
    icon: 'Ticket',
    alert: true,
  },
  {
    id: 'active-tasks',
    title: 'Active Engineering Tasks',
    value: '89',
    trend: '-4% ↓ vs last week',
    trendDirection: 'down',
    trendType: 'neutral',
    subtext: '16 in Review',
    icon: 'CheckCircle2',
  },
  {
    id: 'sla-compliance',
    title: 'SLA Compliance',
    value: '98.7%',
    trend: '+2.1% ↑ vs last week',
    trendDirection: 'up',
    trendType: 'primary',
    subtext: 'Across all products',
    icon: 'ShieldCheck',
  },
  {
    id: 'pending-approvals',
    title: 'Pending Approvals',
    value: '14',
    trend: 'Requires action',
    trendDirection: 'warning',
    trendType: 'tertiary',
    subtext: '8 waiting over 24h',
    icon: 'AlertCircle',
    alert: true,
  },
];

export const PRODUCT_TICKETS: ProductTicket[] = [
  { name: 'MuuqWear', tickets: 42, maxTickets: 50, openCount: 18, slaStatus: 'Healthy' },
  { name: 'GaarX', tickets: 38, maxTickets: 50, openCount: 14, slaStatus: 'Healthy' },
  { name: 'Salguri', tickets: 25, maxTickets: 50, openCount: 9, slaStatus: 'At Risk' },
  { name: 'SomPay', tickets: 15, maxTickets: 50, openCount: 4, slaStatus: 'Healthy' },
  { name: 'Dhaxal', tickets: 8, maxTickets: 50, openCount: 2, slaStatus: 'Healthy' },
];

export const ACCESS_ITEMS: AccessItem[] = [
  {
    icon: 'Ticket',
    title: 'Tickets & Support',
    permission: 'Full management',
    tagColor: 'text-[#6366F1]',
    bgColor: 'bg-[#EEF2FF]',
  },
  {
    icon: 'Code2',
    title: 'Engineering',
    permission: 'Create & view, read-only GitHub',
    tagColor: 'text-[#3B82F6]',
    bgColor: 'bg-[#EFF6FF]',
  },
  {
    icon: 'Clock',
    title: 'Time & Payroll',
    permission: 'View own pay, approve team edits',
    tagColor: 'text-[#059669]',
    bgColor: 'bg-[#ECFDF5]',
  },
  {
    icon: 'Shield',
    title: 'System',
    permission: 'Full admin access',
    tagColor: 'text-[#8B5CF6]',
    bgColor: 'bg-[#F5F3FF]',
  },
];

export const PERFORMANCE_DATA: PerformanceRow[] = [
  {
    metric: 'Avg. Resolution Time',
    current: '4.2hrs',
    previous: '5.1hrs',
    change: '-17%',
    changeType: 'positive',
    status: 'Healthy',
  },
  {
    metric: 'Task Completion Rate',
    current: '88%',
    previous: '82%',
    change: '+6%',
    changeType: 'positive',
    status: 'Healthy',
  },
  {
    metric: 'SLA Breaches (This Week)',
    current: '12',
    previous: '8',
    change: '+50%',
    changeType: 'negative',
    status: 'Warning',
  },
  {
    metric: 'Ticket Backlog',
    current: '34',
    previous: '41',
    change: '-17%',
    changeType: 'positive',
    status: 'Healthy',
  },
  {
    metric: 'Active Incidents',
    current: '0',
    previous: '2',
    change: '-100%',
    changeType: 'positive',
    status: 'Operational',
  },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    actor: 'Adeel D.',
    actorType: 'user',
    action: 'closed ticket',
    target: '#4210',
    productTag: 'MuuqWear',
    timeAgo: '2 min ago',
    avatarBg: 'bg-[#6366F1]',
  },
  {
    id: 'act-2',
    actor: 'System',
    actorType: 'system',
    action: 'SLA breach warning for',
    target: '#3981',
    productTag: 'Salguri',
    timeAgo: '14 min ago',
    avatarBg: 'bg-[#B95F00]',
  },
  {
    id: 'act-3',
    actor: 'Ibrahim M.',
    actorType: 'user',
    action: 'escalated',
    target: '#4055 to Sev2',
    timeAgo: '1 hour ago',
    avatarBg: 'bg-[#3B82F6]',
  },
  {
    id: 'act-4',
    actor: 'Leila H.',
    actorType: 'user',
    action: 'logged 2.5hrs on',
    target: 'ENG-23',
    timeAgo: '2 hours ago',
    avatarBg: 'bg-[#10B981]',
  },
];

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'qa-1',
    icon: 'RotateCw',
    text: '3 engineering tasks blocked on review',
    actionText: 'Review Tasks',
    type: 'review',
  },
  {
    id: 'qa-2',
    icon: 'FileText',
    text: 'Draft payroll for August pending approval',
    actionText: 'Approve Payroll',
    type: 'approval',
  },
  {
    id: 'qa-3',
    icon: 'Link',
    text: 'GitHub sync completed 5 min ago',
    actionText: 'View Sync Logs',
    type: 'sync',
  },
  {
    id: 'qa-4',
    icon: 'Package',
    text: 'New product "Ilays" added to Registry',
    actionText: 'Configure',
    type: 'product',
  },
];
