import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Calendar,
  Download,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  UserX,
  Key,
  Shield,
  FileCode,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  action: 'Login' | 'Invite Sent' | 'Role Change' | 'Suspension' | 'Product Assignment' | 'Invite Accepted' | 'Deactivation';
  affectedUser: string;
  details: string;
  ip: string;
  statusType?: 'success' | 'failed' | 'warning' | 'info';
  beforeState: Record<string, any>;
  afterState: Record<string, any>;
}

const AUDIT_DATA: AuditRecord[] = [
  {
    id: 'aud-1',
    timestamp: '2025-11-15 10:23:45',
    actor: 'Adeel D.',
    action: 'Login',
    affectedUser: 'Adeel D.',
    details: 'Success',
    ip: '192.168.1.1',
    statusType: 'success',
    beforeState: {
      session: null,
      last_login: '2025-11-14 18:45:10',
      active_tokens: 0,
    },
    afterState: {
      session: 'active_sess_89a02',
      auth_method: 'SAML_SSO_2FA',
      ip_address: '192.168.1.1',
      active_tokens: 1,
    },
  },
  {
    id: 'aud-2',
    timestamp: '2025-11-15 10:20:12',
    actor: 'Adeel D.',
    action: 'Invite Sent',
    affectedUser: 'alex@kobneti.com',
    details: 'Role: Engineer',
    ip: '—',
    statusType: 'info',
    beforeState: {
      invited: false,
      user_id: null,
      status: 'non_existent',
    },
    afterState: {
      invited: true,
      email: 'alex@kobneti.com',
      role: 'Engineer',
      team: 'Product Engineering',
      invited_by: 'Adeel D.',
      expires_in: '72h',
    },
  },
  {
    id: 'aud-3',
    timestamp: '2025-11-15 09:15:30',
    actor: 'Ibrahim M.',
    action: 'Role Change',
    affectedUser: 'John D.',
    details: 'Support → Manager',
    ip: '—',
    statusType: 'info',
    beforeState: {
      role: 'Support',
      status: 'active',
      rbac_tier: 'Tier_1',
      approval_authority: false,
    },
    afterState: {
      role: 'Manager',
      status: 'active',
      rbac_tier: 'Tier_2_Lead',
      approval_authority: true,
    },
  },
  {
    id: 'aud-4',
    timestamp: '2025-11-15 08:45:22',
    actor: 'Adeel D.',
    action: 'Suspension',
    affectedUser: 'Alex P.',
    details: 'Reason: Inactive',
    ip: '—',
    statusType: 'warning',
    beforeState: {
      status: 'active',
      account_locked: false,
      auth_tokens_revoked: false,
    },
    afterState: {
      status: 'suspended',
      account_locked: true,
      reason: 'Inactive > 90 days',
      auth_tokens_revoked: true,
    },
  },
  {
    id: 'aud-5',
    timestamp: '2025-11-14 16:30:10',
    actor: 'Leila H.',
    action: 'Login',
    affectedUser: 'Leila H.',
    details: 'Success',
    ip: '192.168.1.2',
    statusType: 'success',
    beforeState: {
      session: null,
      last_login: '2025-11-13 19:12:00',
    },
    afterState: {
      session: 'active_sess_33f91',
      auth_method: 'SAML_SSO',
      ip_address: '192.168.1.2',
    },
  },
  {
    id: 'aud-6',
    timestamp: '2025-11-14 14:20:45',
    actor: 'Adeel D.',
    action: 'Product Assignment',
    affectedUser: 'Sarah K.',
    details: 'Added: GaarX',
    ip: '—',
    statusType: 'info',
    beforeState: {
      assigned_products: ['MuuqWear', 'Salguri'],
      scope: 'restricted',
    },
    afterState: {
      assigned_products: ['MuuqWear', 'Salguri', 'GaarX'],
      scope: 'expanded',
    },
  },
  {
    id: 'aud-7',
    timestamp: '2025-11-14 11:05:33',
    actor: 'Ibrahim M.',
    action: 'Invite Accepted',
    affectedUser: 'lisa@kobneti.com',
    details: 'Role: Support',
    ip: '—',
    statusType: 'success',
    beforeState: {
      invite_status: 'pending',
      account_created: false,
    },
    afterState: {
      invite_status: 'accepted',
      account_created: true,
      role: 'Support',
      team: 'Customer Support',
      status: 'active',
    },
  },
  {
    id: 'aud-8',
    timestamp: '2025-11-14 09:00:15',
    actor: 'Mike C.',
    action: 'Login',
    affectedUser: 'Mike C.',
    details: 'Failed',
    ip: '192.168.1.3',
    statusType: 'failed',
    beforeState: {
      failed_mfa_attempts: 0,
      locked_until: null,
    },
    afterState: {
      failed_mfa_attempts: 1,
      error_code: 'ERR_INVALID_OTP_TOKEN',
      ip_address: '192.168.1.3',
      alert_triggered: false,
    },
  },
  {
    id: 'aud-9',
    timestamp: '2025-11-13 17:22:10',
    actor: 'Adeel D.',
    action: 'Deactivation',
    affectedUser: 'Emma W.',
    details: 'Reason: Resigned',
    ip: '—',
    statusType: 'warning',
    beforeState: {
      status: 'active',
      role: 'Support',
      employment_status: 'employed',
    },
    afterState: {
      status: 'deactivated',
      reason: 'Resigned',
      employment_status: 'terminated',
      access_keys_purged: true,
    },
  },
  {
    id: 'aud-10',
    timestamp: '2025-11-13 15:45:33',
    actor: 'Adeel D.',
    action: 'Role Change',
    affectedUser: 'Adeel D.',
    details: 'Admin → Admin (self)',
    ip: '—',
    statusType: 'info',
    beforeState: {
      role: 'Admin',
      self_audit_verification: false,
    },
    afterState: {
      role: 'Admin',
      self_audit_verification: true,
      verified_timestamp: '2025-11-13 15:45:33',
    },
  },
];

const ALL_ACTORS = ['All Actors', 'Adeel D.', 'Ibrahim M.', 'Leila H.', 'Mike C.'];
const ALL_ACTION_TYPES = [
  'All',
  'Login',
  'Invite',
  'Role Change',
  'Suspension',
  'Product Assignment',
  'Deactivation',
];

interface AccessAuditTrailViewProps {
  onExportCsv?: () => void;
}

export const AccessAuditTrailView: React.FC<AccessAuditTrailViewProps> = ({ onExportCsv }) => {
  const [records] = useState<AuditRecord[]>(AUDIT_DATA);
  const [selectedActor, setSelectedActor] = useState('All Actors');
  const [selectedActionType, setSelectedActionType] = useState('All');
  const [dateFrom, setDateFrom] = useState('2025-11-13');
  const [dateTo, setDateTo] = useState('2025-11-15');
  const [searchActorQuery, setSearchActorQuery] = useState('');

  // Applied Filter States
  const [appliedActor, setAppliedActor] = useState('All Actors');
  const [appliedActionType, setAppliedActionType] = useState('All');
  const [appliedDateFrom, setAppliedDateFrom] = useState('2025-11-13');
  const [appliedDateTo, setAppliedDateTo] = useState('2025-11-15');

  // Expanded Rows Map for Diff View
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'aud-3': true, // Default expand one to demonstrate diff view visually
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleApplyFilters = () => {
    setAppliedActor(selectedActor);
    setAppliedActionType(selectedActionType);
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    showToast('Applied audit filters.');
  };

  const handleClearFilters = () => {
    setSelectedActor('All Actors');
    setSelectedActionType('All');
    setDateFrom('2025-11-13');
    setDateTo('2025-11-15');
    setSearchActorQuery('');
    setAppliedActor('All Actors');
    setAppliedActionType('All');
    setAppliedDateFrom('2025-11-13');
    setAppliedDateTo('2025-11-15');
    showToast('Cleared audit filters.');
  };

  const handleExport = () => {
    if (onExportCsv) {
      onExportCsv();
      return;
    }
    const headers = ['Timestamp', 'Actor', 'Action', 'Affected User', 'Details', 'IP'];
    const rows = filteredRecords.map((r) => [
      `"${r.timestamp}"`,
      `"${r.actor}"`,
      `"${r.action}"`,
      `"${r.affectedUser}"`,
      `"${r.details}"`,
      `"${r.ip}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `access_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded audit trail CSV.');
  };

  // Filter evaluation
  const filteredRecords = records.filter((r) => {
    // Actor filter
    if (appliedActor !== 'All Actors' && r.actor !== appliedActor) {
      return false;
    }
    // Action Type filter
    if (appliedActionType !== 'All') {
      if (appliedActionType === 'Invite') {
        if (!r.action.toLowerCase().includes('invite')) return false;
      } else if (r.action !== appliedActionType) {
        return false;
      }
    }
    // Date filter
    const rowDate = r.timestamp.split(' ')[0];
    if (appliedDateFrom && rowDate < appliedDateFrom) return false;
    if (appliedDateTo && rowDate > appliedDateTo) return false;

    return true;
  });

  return (
    <div
      id="access-audit-trail-root"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
            Access Audit Trail
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Complete log of all access events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="audit-export-csv-btn"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] hover:underline cursor-pointer transition-colors bg-transparent border-0"
          >
            <Download className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: FILTER BAR                                                         */}
      {/* ========================================================================= */}
      <div
        id="card-audit-filter-bar"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-4.5 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Actor Search Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Actor
            </label>
            <select
              value={selectedActor}
              onChange={(e) => setSelectedActor(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer shadow-2xs"
            >
              {ALL_ACTORS.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>

          {/* Action Type Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Action Type
            </label>
            <select
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer shadow-2xs"
            >
              {ALL_ACTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Action Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range: From / To */}
          <div className="lg:col-span-1">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Date Range (From – To)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] shadow-2xs"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] shadow-2xs"
              />
            </div>
          </div>

          {/* Buttons: Apply Filters + Clear */}
          <div className="flex items-end gap-2">
            <button
              id="audit-apply-filters-btn"
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
            <button
              id="audit-clear-filters-btn"
              onClick={handleClearFilters}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-95"
              title="Clear all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: AUDIT TABLE (Full width) + ROW 3: EXPANDABLE DIFF VIEW             */}
      {/* ========================================================================= */}
      <div
        id="card-audit-table"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Shield className="w-4 h-4 text-[#6366F1]" />
            <span>Audit Log Entries ({filteredRecords.length})</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Click any row to inspect immutable before/after state diff
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-10 text-center">#</th>
                <th className="py-3.5 px-4 font-bold font-mono">Timestamp</th>
                <th className="py-3.5 px-4 font-bold">Actor</th>
                <th className="py-3.5 px-4 font-bold">Action</th>
                <th className="py-3.5 px-4 font-bold">Affected User</th>
                <th className="py-3.5 px-4 font-bold">Details</th>
                <th className="py-3.5 px-4 font-bold font-mono">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No audit records match the selected filter criteria.</p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-2 text-xs text-[#6366F1] font-bold hover:underline"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => {
                  const isExpanded = !!expandedRows[record.id];

                  return (
                    <React.Fragment key={record.id}>
                      {/* Main Table Row */}
                      <tr
                        id={`audit-row-${record.id}`}
                        onClick={() => toggleRow(record.id)}
                        className={`cursor-pointer transition-colors group ${
                          isExpanded ? 'bg-indigo-50/40' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Expand toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="p-1 rounded-md text-slate-400 group-hover:text-[#6366F1] transition-colors">
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-[#6366F1]" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap text-[11px]">
                          {record.timestamp}
                        </td>

                        {/* Actor */}
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                              {record.actor.slice(0, 2).toUpperCase()}
                            </span>
                            <span>{record.actor}</span>
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                              record.action === 'Login'
                                ? record.details === 'Failed'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : record.action === 'Role Change'
                                ? 'bg-indigo-50 text-[#6366F1] border-indigo-200'
                                : record.action === 'Suspension' || record.action === 'Deactivation'
                                ? 'bg-amber-50 text-[#B95F00] border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {record.action}
                          </span>
                        </td>

                        {/* Affected User */}
                        <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                          {record.affectedUser}
                        </td>

                        {/* Details */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              record.details === 'Failed'
                                ? 'bg-rose-100 text-rose-800 font-bold'
                                : record.details === 'Success'
                                ? 'bg-emerald-100 text-emerald-800 font-bold'
                                : 'bg-slate-100 text-slate-800 font-medium'
                            }`}
                          >
                            {record.details}
                          </span>
                        </td>

                        {/* IP Address */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {record.ip}
                        </td>
                      </tr>

                      {/* ========================================================================= */}
                      {/* ROW 3: EXPANDABLE DIFF VIEW                                               */}
                      {/* ========================================================================= */}
                      {isExpanded && (
                        <tr className="bg-slate-900 text-white">
                          <td colSpan={7} className="p-4 sm:p-5 border-y border-slate-800">
                            <div className="space-y-3">
                              {/* Diff Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
                                <div className="flex items-center gap-2">
                                  <FileCode className="w-4 h-4 text-[#6366F1]" />
                                  <span className="font-bold text-slate-200">State Mutation Snapshot</span>
                                  <span className="font-mono text-[11px] text-slate-400">
                                    [ID: {record.id}]
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                                  <span>Actor: <strong className="text-white">{record.actor}</strong></span>
                                  <span>•</span>
                                  <span>Action: <strong className="text-white">{record.action}</strong></span>
                                  <span>•</span>
                                  <span>Timestamp: <strong className="text-white">{record.timestamp}</strong></span>
                                </div>
                              </div>

                              {/* Before / After Columns */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                {/* Before State */}
                                <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-xs">
                                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px] font-bold">
                                    <span className="flex items-center gap-1.5 text-rose-400">
                                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                                      Before State
                                    </span>
                                    <span>JSON</span>
                                  </div>
                                  <pre className="text-rose-200/90 overflow-x-auto text-[11px] leading-relaxed custom-scrollbar whitespace-pre-wrap">
                                    {JSON.stringify(record.beforeState, null, 2)}
                                  </pre>
                                </div>

                                {/* After State */}
                                <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-xs">
                                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px] font-bold">
                                    <span className="flex items-center gap-1.5 text-emerald-400">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                      After State
                                    </span>
                                    <span>JSON</span>
                                  </div>
                                  <pre className="text-emerald-200/90 overflow-x-auto text-[11px] leading-relaxed custom-scrollbar whitespace-pre-wrap">
                                    {JSON.stringify(record.afterState, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
