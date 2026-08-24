import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  User,
  Shield,
  Clock,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Eye,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorAvatar?: string;
  action: string;
  ref: string;
  refType: 'User' | 'Ticket' | 'Task' | 'Incident' | 'Product' | 'Payroll' | 'Integration' | 'Auth';
  before: string;
  after: string;
  relativeTime: string;
  ip: string;
  userAgent?: string;
  sessionId?: string;
  details?: {
    rawPayload?: Record<string, any>;
    eventDescription?: string;
    changedFields?: { field: string; from: string; to: string }[];
  };
}

const INITIAL_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2025-11-15 10:23:45',
    actor: 'Adeel D.',
    action: 'ticket.status_changed',
    ref: '#4210',
    refType: 'Ticket',
    before: 'Open',
    after: 'Resolved',
    relativeTime: '2 min ago',
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    sessionId: 'sess_9938f02a',
    details: {
      eventDescription: 'Ticket #4210 status changed from Open to Resolved by primary handler.',
      changedFields: [
        { field: 'status', from: 'Open', to: 'Resolved' },
        { field: 'resolutionNotes', from: 'None', to: 'Identified corrupted database indexing in cache replica. Hotfix applied and validated.' },
        { field: 'resolvedAt', from: 'null', to: '2025-11-15T10:23:45Z' },
      ],
      rawPayload: {
        ticketId: 4210,
        actorId: 'usr_adeel_01',
        previousState: { status: 'open', assignedTo: 'Adeel D.' },
        newState: { status: 'resolved', resolutionCode: 'HOTFIX_APPLIED' },
      },
    },
  },
  {
    id: 'log-2',
    timestamp: '2025-11-15 10:20:12',
    actor: 'Adeel D.',
    action: 'invite.sent',
    ref: 'alex@kobneti.com',
    refType: 'User',
    before: '—',
    after: '—',
    relativeTime: '5 min ago',
    ip: '—',
    userAgent: 'KobNeti Backend Worker / Cron Relay',
    sessionId: 'sess_internal_system',
    details: {
      eventDescription: 'Organization member onboarding invite email dispatched to alex@kobneti.com.',
      changedFields: [
        { field: 'inviteStatus', from: 'null', to: 'Pending' },
        { field: 'assignedRole', from: 'null', to: 'Product Specialist' },
        { field: 'expiryDate', from: 'null', to: '2025-11-22T10:20:12Z' },
      ],
      rawPayload: {
        recipientEmail: 'alex@kobneti.com',
        role: 'support_specialist',
        invitedBy: 'usr_adeel_01',
        sentVia: 'AWS SES Inbound/Outbound',
      },
    },
  },
  {
    id: 'log-3',
    timestamp: '2025-11-15 09:15:30',
    actor: 'Ibrahim M.',
    action: 'user.roles_changed',
    ref: 'John D.',
    refType: 'User',
    before: 'Support',
    after: 'Manager',
    relativeTime: '1 hour ago',
    ip: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    sessionId: 'sess_ibrahim_8812',
    details: {
      eventDescription: 'Administrative role escalation for member John D. from Support tier to Manager tier.',
      changedFields: [
        { field: 'role', from: 'Support', to: 'Manager' },
        { field: 'canApprovePayroll', from: 'false', to: 'true' },
        { field: 'canManageTeams', from: 'false', to: 'true' },
      ],
      rawPayload: {
        targetUserId: 'usr_johnd_14',
        modifiedBy: 'usr_ibrahim_02',
        tier: 'manager_admin',
      },
    },
  },
  {
    id: 'log-4',
    timestamp: '2025-11-15 08:45:22',
    actor: 'Adeel D.',
    action: 'user.suspended',
    ref: 'Alex P.',
    refType: 'User',
    before: 'Active',
    after: 'Suspended',
    relativeTime: '2 hours ago',
    ip: '—',
    userAgent: 'Automated Security Rule / Manual Trigger',
    sessionId: 'sess_9938f02a',
    details: {
      eventDescription: 'User account Alex P. placed into suspended state pending internal audit review.',
      changedFields: [
        { field: 'accountStatus', from: 'Active', to: 'Suspended' },
        { field: 'oauthTokensRevoked', from: 'false', to: 'true' },
      ],
      rawPayload: {
        targetUserId: 'usr_alexp_09',
        reason: 'Temporary compliance hold',
        actor: 'Adeel D.',
      },
    },
  },
  {
    id: 'log-5',
    timestamp: '2025-11-14 16:30:10',
    actor: 'Leila H.',
    action: 'time.edit_requested',
    ref: 'Time Entry #1024',
    refType: 'Task',
    before: '2.0',
    after: '3.5hrs',
    relativeTime: '1 day ago',
    ip: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15',
    sessionId: 'sess_leila_mobile_77',
    details: {
      eventDescription: 'Timesheet correction request submitted for retroactive shift modification.',
      changedFields: [
        { field: 'loggedHours', from: '2.0 hrs', to: '3.5 hrs' },
        { field: 'approvalStatus', from: 'Approved', to: 'Pending Approval' },
        { field: 'correctionReason', from: 'None', to: 'Forgot clock-in during emergency server incident triage.' },
      ],
      rawPayload: {
        timeEntryId: 1024,
        date: '2025-11-14',
        originalStartTime: '14:00',
        requestedStartTime: '12:30',
        endTime: '16:00',
      },
    },
  },
  {
    id: 'log-6',
    timestamp: '2025-11-14 14:20:45',
    actor: 'Adeel D.',
    action: 'product.created',
    ref: 'Ilays',
    refType: 'Product',
    before: '—',
    after: '—',
    relativeTime: '1 day ago',
    ip: '—',
    userAgent: 'KobNeti Executive Client v2.4.0',
    sessionId: 'sess_9938f02a',
    details: {
      eventDescription: 'New product line "Ilays" created in system directory.',
      changedFields: [
        { field: 'productName', from: 'null', to: 'Ilays' },
        { field: 'leadSquad', from: 'null', to: 'Core Engineering' },
        { field: 'status', from: 'null', to: 'Active' },
      ],
      rawPayload: {
        productSlug: 'ilays',
        createdBy: 'Adeel D.',
        initialBudget: 45000,
      },
    },
  },
  {
    id: 'log-7',
    timestamp: '2025-11-14 11:05:33',
    actor: 'Ibrahim M.',
    action: 'invite.accepted',
    ref: 'lisa@kobneti.com',
    refType: 'User',
    before: '—',
    after: '—',
    relativeTime: '1 day ago',
    ip: '192.168.1.4',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 Safari/537.36',
    sessionId: 'sess_lisa_welcome_01',
    details: {
      eventDescription: 'User lisa@kobneti.com accepted organization invitation and completed password registration.',
      changedFields: [
        { field: 'inviteStatus', from: 'Pending', to: 'Accepted' },
        { field: 'mfaConfigured', from: 'false', to: 'true' },
      ],
      rawPayload: {
        email: 'lisa@kobneti.com',
        registeredAt: '2025-11-14T11:05:33Z',
      },
    },
  },
  {
    id: 'log-8',
    timestamp: '2025-11-14 09:00:15',
    actor: 'Mike C.',
    action: 'auth.failed',
    ref: '—',
    refType: 'Auth',
    before: '—',
    after: '—',
    relativeTime: '1 day ago',
    ip: '192.168.1.5',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/130.0',
    sessionId: 'sess_unauthorized_probe',
    details: {
      eventDescription: 'Failed authentication attempt: invalid credentials provided.',
      changedFields: [
        { field: 'failedAttempts', from: '0', to: '1' },
        { field: 'authResult', from: 'None', to: 'INVALID_CREDENTIALS' },
      ],
      rawPayload: {
        attemptedLogin: 'mike.c@kobneti.com',
        ipAddress: '192.168.1.5',
        warningLevel: 'LOW',
      },
    },
  },
  {
    id: 'log-9',
    timestamp: '2025-11-13 17:22:10',
    actor: 'Adeel D.',
    action: 'payroll.finalized',
    ref: 'Run #24',
    refType: 'Payroll',
    before: 'Draft',
    after: 'Finalized',
    relativeTime: '2 days ago',
    ip: '—',
    userAgent: 'KobNeti Executive Client v2.4.0',
    sessionId: 'sess_9938f02a',
    details: {
      eventDescription: 'Bi-weekly payroll Run #24 finalized and locked for disbursement.',
      changedFields: [
        { field: 'runStatus', from: 'Draft', to: 'Finalized' },
        { field: 'totalDisbursement', from: 'Draft Estimate', to: '$84,520.00' },
        { field: 'employeeCount', from: '18', to: '18' },
      ],
      rawPayload: {
        runId: 24,
        period: 'Nov 1 - Nov 15, 2025',
        finalizedBy: 'Adeel D.',
      },
    },
  },
  {
    id: 'log-10',
    timestamp: '2025-11-13 15:45:33',
    actor: 'Adeel D.',
    action: 'integration.connected',
    ref: 'GitHub',
    refType: 'Integration',
    before: '—',
    after: '—',
    relativeTime: '2 days ago',
    ip: '—',
    userAgent: 'KobNeti Executive Client v2.4.0',
    sessionId: 'sess_9938f02a',
    details: {
      eventDescription: 'GitHub organization integration OAuth bridge connected with 7 linked repositories.',
      changedFields: [
        { field: 'integrationStatus', from: 'Not Connected', to: 'Connected' },
        { field: 'syncedRepos', from: '0', to: '7' },
      ],
      rawPayload: {
        provider: 'github',
        orgName: 'KobNeti-Tech',
        authorizedScopes: ['repo', 'read:org', 'admin:repo_hook'],
      },
    },
  },
];

const ACTION_TYPES = [
  'All',
  'Login',
  'Invite',
  'Role Change',
  'Ticket',
  'Time',
  'Payroll',
] as const;

const REF_TYPES = [
  'All',
  'User',
  'Ticket',
  'Task',
  'Incident',
  'Product',
] as const;

export const IntegrationsHubViewOrAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
  const [expandedLogId, setExpandedLogId] = useState<string | null>('log-1'); // log-1 expanded by default to show Row 3 Diff View

  // Filter Bar State
  const [actorSearch, setActorSearch] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('All');
  const [refTypeFilter, setRefTypeFilter] = useState<string>('All');
  const [fromDate, setFromDate] = useState('2025-11-01');
  const [toDate, setToDate] = useState('2025-11-15');

  // Active Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    actor: '',
    actionType: 'All',
    refType: 'All',
    from: '2025-11-01',
    to: '2025-11-15',
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      actor: actorSearch,
      actionType: actionTypeFilter,
      refType: refTypeFilter,
      from: fromDate,
      to: toDate,
    });
    showToast('Filters applied successfully.');
  };

  const handleClearFilters = () => {
    setActorSearch('');
    setActionTypeFilter('All');
    setRefTypeFilter('All');
    setFromDate('2025-11-01');
    setToDate('2025-11-15');
    setAppliedFilters({
      actor: '',
      actionType: 'All',
      refType: 'All',
      from: '2025-11-01',
      to: '2025-11-15',
    });
    showToast('Filters reset to default.');
  };

  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Actor', 'Action', 'Ref', 'Before', 'After', 'IP', 'Relative Time'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.action}"`,
      `"${l.ref}"`,
      `"${l.before}"`,
      `"${l.after}"`,
      `"${l.ip}"`,
      `"${l.relativeTime}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kobneti_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported audit logs to CSV.');
  };

  const handleCopyRaw = (text: string, id: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedId(id);
    showToast('Copied payload to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = logs.filter((log) => {
    if (appliedFilters.actor) {
      const matchActor = log.actor.toLowerCase().includes(appliedFilters.actor.toLowerCase());
      if (!matchActor) return false;
    }

    if (appliedFilters.actionType !== 'All') {
      const act = appliedFilters.actionType.toLowerCase();
      if (act === 'login' && !log.action.includes('auth')) return false;
      if (act === 'invite' && !log.action.includes('invite')) return false;
      if (act === 'role change' && !log.action.includes('roles')) return false;
      if (act === 'ticket' && !log.action.includes('ticket')) return false;
      if (act === 'time' && !log.action.includes('time')) return false;
      if (act === 'payroll' && !log.action.includes('payroll')) return false;
    }

    if (appliedFilters.refType !== 'All') {
      if (log.refType !== appliedFilters.refType) return false;
    }

    return true;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('auth.failed') || action.includes('suspended')) {
      return 'bg-rose-50 border-rose-200 text-rose-700';
    }
    if (action.includes('resolved') || action.includes('accepted') || action.includes('finalized')) {
      return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
    if (action.includes('edit_requested') || action.includes('roles_changed')) {
      return 'bg-amber-50 border-amber-200 text-amber-800';
    }
    return 'bg-indigo-50 border-indigo-100 text-[#6366F1]';
  };

  return (
    <div
      id="audit-logs-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#6366F1]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            <span>Audit Logs</span>
          </h1>
          <p className="text-xs text-[#64748B] font-medium">
            Complete, immutable log of all system events.
          </p>
        </div>

        {/* Action Button: Export CSV (matches contextual slot or direct click) */}
        <button
          id="btn-export-audit-csv-header"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: FILTER BAR                                                         */}
      {/* ========================================================================= */}
      <div
        id="audit-filter-bar"
        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Actor Search */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Actor
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="filter-actor-input"
                type="text"
                placeholder="Search actor..."
                value={actorSearch}
                onChange={(e) => setActorSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
              />
            </div>
          </div>

          {/* Action Type Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Action Type
            </label>
            <div className="relative">
              <select
                id="filter-action-type-select"
                value={actionTypeFilter}
                onChange={(e) => setActionTypeFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer"
              >
                {ACTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Action Types' : type}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Ref Type Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Ref Type
            </label>
            <div className="relative">
              <select
                id="filter-ref-type-select"
                value={refTypeFilter}
                onChange={(e) => setRefTypeFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer"
              >
                {REF_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Ref Types' : type}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Range: From / To Pickers */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Date Range
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id="filter-from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
              />
              <span className="text-slate-400 text-xs font-semibold">to</span>
              <input
                id="filter-to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-1/2 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
              />
            </div>
          </div>
        </div>

        {/* Buttons: Apply Filters + Clear */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredLogs.length}</span> audit event records
          </div>

          <div className="flex items-center gap-2">
            <button
              id="clear-filters-btn"
              onClick={handleClearFilters}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              id="apply-filters-btn"
              onClick={handleApplyFilters}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: AUDIT TABLE (Full width, monospace-friendly) & ROW 3: EXPANDABLE DIFF */}
      {/* ========================================================================= */}
      <div
        id="audit-table-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4 font-mono">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Before</th>
                <th className="py-3 px-4">After</th>
                <th className="py-3 px-4 font-mono text-right">IP</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;

                return (
                  <React.Fragment key={log.id}>
                    {/* Primary Row */}
                    <tr
                      id={`audit-row-${log.id}`}
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                        isExpanded ? 'bg-indigo-50/20' : ''
                      }`}
                    >
                      {/* Chevron Toggle */}
                      <td className="py-3.5 px-4 text-slate-400 group-hover:text-slate-700">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#6366F1]" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 text-[11px] whitespace-nowrap">
                        <div>{log.timestamp}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{log.relativeTime}</div>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                            {log.actor.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900">{log.actor}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Ref */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-slate-800 font-semibold">{log.ref}</span>
                      </td>

                      {/* Before */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.before === '—' ? (
                          <span className="text-slate-300 font-mono">—</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                            {log.before}
                          </span>
                        )}
                      </td>

                      {/* After */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.after === '—' ? (
                          <span className="text-slate-300 font-mono">—</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-[#6366F1] font-mono text-[11px] font-bold border border-indigo-100">
                            {log.after}
                          </span>
                        )}
                      </td>

                      {/* IP */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-right text-[11px] whitespace-nowrap">
                        {log.ip === '—' ? (
                          <span className="text-slate-300">—</span>
                        ) : (
                          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                            {log.ip}
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* ========================================================================= */}
                    {/* ROW 3: EXPANDABLE DIFF VIEW                                               */}
                    {/* ========================================================================= */}
                    {isExpanded && (
                      <tr id={`audit-diff-row-${log.id}`} className="bg-slate-50/60 border-t border-b border-indigo-100">
                        <td colSpan={8} className="p-4 sm:p-6">
                          <div className="space-y-4 animate-in fade-in duration-150">
                            {/* Diff Top Banner */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded bg-indigo-50 border border-indigo-100 text-[#6366F1] text-xs font-mono font-bold">
                                  Event ID: {log.id}
                                </span>
                                <span className="text-xs text-slate-600 font-semibold">
                                  {log.details?.eventDescription || 'Detailed telemetry snapshot'}
                                </span>
                              </div>

                              <button
                                onClick={() =>
                                  handleCopyRaw(
                                    JSON.stringify(log.details?.rawPayload || log, null, 2),
                                    log.id
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                              >
                                {copiedId === log.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Copy JSON</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Two-Column Breakdown: State Diff vs Raw Metadata */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {/* Left: Structured Changed Fields / Visual Diff */}
                              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                  <Shield className="w-3.5 h-3.5 text-[#6366F1]" />
                                  <span>State Transitions & Modified Fields</span>
                                </h4>

                                <div className="space-y-2">
                                  {log.details?.changedFields?.map((cf, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                                    >
                                      <div className="font-mono font-bold text-slate-800 text-[11px]">
                                        {cf.field}
                                      </div>
                                      <div className="flex items-center gap-2 font-mono text-[11px]">
                                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 line-through">
                                          {cf.from}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                          {cf.to}
                                        </span>
                                      </div>
                                    </div>
                                  )) || (
                                    <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-xs">
                                      No direct field mutations logged for this audit event.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right: Raw JSON & Client Telemetry */}
                              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Client Telemetry & Session Origin</span>
                                </h4>

                                <div className="space-y-2 text-[11px] text-slate-600">
                                  <div className="flex items-start justify-between gap-2 p-2 bg-slate-50 rounded-lg">
                                    <span className="font-semibold text-slate-500 shrink-0">IP Address:</span>
                                    <span className="font-mono text-slate-800">{log.ip}</span>
                                  </div>

                                  <div className="flex items-start justify-between gap-2 p-2 bg-slate-50 rounded-lg">
                                    <span className="font-semibold text-slate-500 shrink-0">Session ID:</span>
                                    <span className="font-mono text-slate-800">{log.sessionId || 'sess_anonymous'}</span>
                                  </div>

                                  <div className="p-2 bg-slate-50 rounded-lg space-y-1">
                                    <span className="font-semibold text-slate-500 block">User-Agent:</span>
                                    <span className="font-mono text-[10px] text-slate-700 break-all leading-tight block">
                                      {log.userAgent || 'Unknown client / Internal System Relay'}
                                    </span>
                                  </div>
                                </div>

                                {/* Raw JSON Payload Block */}
                                <div className="pt-2">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Raw Event Payload
                                  </div>
                                  <pre className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-32 custom-scrollbar">
                                    {JSON.stringify(log.details?.rawPayload || {}, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-sm">No audit logs matching current filters</p>
                      <button
                        onClick={handleClearFilters}
                        className="text-xs text-[#6366F1] font-bold hover:underline"
                      >
                        Reset filters to view all entries
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
