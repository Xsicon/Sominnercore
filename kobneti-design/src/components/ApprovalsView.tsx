import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  User,
  Calendar,
  Check,
  X,
  ChevronRight,
  ArrowRight,
  Filter,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  MessageSquare,
  Building,
  CreditCard,
  History,
} from 'lucide-react';

export type ApprovalType = 'time-edit' | 'payroll' | 'budget';

export interface PendingApprovalItem {
  id: string;
  type: ApprovalType;
  typeLabel: string;
  requester: string;
  requesterRole: string;
  summary: string;
  requestedTime: string;
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
  details?: {
    originalDuration?: string;
    newDuration?: string;
    itemCode?: string;
    itemTitle?: string;
    department?: string;
    amount?: string;
    note?: string;
  };
}

export interface ApprovalHistoryItem {
  id: string;
  date: string;
  type: string;
  requester: string;
  decision: 'Approved' | 'Rejected';
  approver: string;
  comment?: string;
}

const INITIAL_PENDING_APPROVALS: PendingApprovalItem[] = [
  {
    id: 'appr-1',
    type: 'time-edit',
    typeLabel: 'Time Edit Request',
    requester: 'Leila H.',
    requesterRole: 'Senior Frontend Engineer',
    summary: 'Duration change: 2.0hrs → 3.5hrs on Task ENG-35',
    requestedTime: '2 hours ago',
    currentStep: 1,
    totalSteps: 2,
    stepDescription: 'Manager → Finance',
    details: {
      originalDuration: '2.0 hrs',
      newDuration: '3.5 hrs',
      itemCode: 'ENG-35',
      itemTitle: 'Payment gateway multi-currency handling',
      department: 'Engineering',
      note: 'Added offline testing on sandbox sandbox webhooks and edge-case replay validation.',
    },
  },
  {
    id: 'appr-2',
    type: 'time-edit',
    typeLabel: 'Time Edit Request',
    requester: 'Mike C.',
    requesterRole: 'Backend Engineer',
    summary: 'Duration change: 1.5hrs → 2.0hrs on #4205',
    requestedTime: '4 hours ago',
    currentStep: 2,
    totalSteps: 2,
    stepDescription: 'Finance',
    details: {
      originalDuration: '1.5 hrs',
      newDuration: '2.0 hrs',
      itemCode: '#4205',
      itemTitle: 'Payment error 3DS verification modal failure',
      department: 'Engineering',
      note: 'Resolved additional CORS header mismatch on callback verification endpoint.',
    },
  },
  {
    id: 'appr-3',
    type: 'payroll',
    typeLabel: 'Payroll Run',
    requester: 'Adeel D.',
    requesterRole: 'Head of Operations',
    summary: 'Payroll Run — November 1-15 (14 employees)',
    requestedTime: '6 hours ago',
    currentStep: 1,
    totalSteps: 2,
    stepDescription: 'Manager → Finance',
    details: {
      department: 'Executive / Operations',
      amount: '$48,650.00',
      note: 'Semi-monthly standard contractor and full-time payroll disbursement across US and Remote teams.',
    },
  },
  {
    id: 'appr-4',
    type: 'budget',
    typeLabel: 'Budget Approval',
    requester: 'Ibrahim M.',
    requesterRole: 'DevOps Lead',
    summary: 'New laptop purchase — $2,400',
    requestedTime: '1 day ago',
    currentStep: 2,
    totalSteps: 2,
    stepDescription: 'Finance',
    details: {
      department: 'Infrastructure / DevOps',
      amount: '$2,400.00',
      note: 'M3 Max MacBook Pro replacement hardware for build cluster telemetry pipeline maintenance.',
    },
  },
  {
    id: 'appr-5',
    type: 'time-edit',
    typeLabel: 'Time Edit Request',
    requester: 'Sarah K.',
    requesterRole: 'Fullstack Engineer',
    summary: 'Duration change: 4.0hrs → 5.0hrs on #4207',
    requestedTime: '1 day ago',
    currentStep: 1,
    totalSteps: 2,
    stepDescription: 'Manager',
    details: {
      originalDuration: '4.0 hrs',
      newDuration: '5.0 hrs',
      itemCode: '#4207',
      itemTitle: 'User roles bug token claim cache invalidation',
      department: 'Engineering',
      note: 'Required manual migration script testing on staging replica database before releasing.',
    },
  },
];

const INITIAL_HISTORY: ApprovalHistoryItem[] = [
  {
    id: 'hist-1',
    date: 'Nov 14',
    type: 'Time Edit',
    requester: 'John D.',
    decision: 'Approved',
    approver: 'Adeel D.',
  },
  {
    id: 'hist-2',
    date: 'Nov 14',
    type: 'Payroll',
    requester: 'Leila H.',
    decision: 'Approved',
    approver: 'Adeel D.',
  },
  {
    id: 'hist-3',
    date: 'Nov 13',
    type: 'Time Edit',
    requester: 'Mike C.',
    decision: 'Rejected',
    approver: 'Ibrahim M.',
    comment: 'Exceeds maximum single sprint cap without prior lead sign-off.',
  },
  {
    id: 'hist-4',
    date: 'Nov 13',
    type: 'Budget',
    requester: 'Sarah K.',
    decision: 'Approved',
    approver: 'Adeel D.',
  },
];

interface ApprovalsViewProps {
  filter?: 'all' | 'pending' | 'approved' | 'rejected';
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({ filter = 'all' }) => {
  const [pendingList, setPendingList] = useState<PendingApprovalItem[]>(INITIAL_PENDING_APPROVALS);
  const [historyList, setHistoryList] = useState<ApprovalHistoryItem[]>(INITIAL_HISTORY);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reject inline form state: maps pending item ID to open state and reason text
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Selected item for modal detail view
  const [detailItem, setDetailItem] = useState<PendingApprovalItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (item: PendingApprovalItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPendingList((prev) => prev.filter((p) => p.id !== item.id));
    
    // Add to history
    const newHist: ApprovalHistoryItem = {
      id: `hist-${Date.now()}`,
      date: 'Today',
      type: item.typeLabel.replace(' Request', ''),
      requester: item.requester,
      decision: 'Approved',
      approver: 'Adeel D. (You)',
    };
    setHistoryList((prev) => [newHist, ...prev]);
    showToast(`Approved ${item.typeLabel} for ${item.requester}`);
    if (detailItem?.id === item.id) setDetailItem(null);
  };

  const handleStartReject = (item: PendingApprovalItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRejectingId(item.id);
    setRejectReason('');
  };

  const handleConfirmReject = (item: PendingApprovalItem, e?: React.FormEvent) => {
    e?.preventDefault();
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejecting the request');
      return;
    }

    setPendingList((prev) => prev.filter((p) => p.id !== item.id));
    const newHist: ApprovalHistoryItem = {
      id: `hist-${Date.now()}`,
      date: 'Today',
      type: item.typeLabel.replace(' Request', ''),
      requester: item.requester,
      decision: 'Rejected',
      approver: 'Adeel D. (You)',
      comment: rejectReason,
    };
    setHistoryList((prev) => [newHist, ...prev]);
    showToast(`Rejected ${item.typeLabel} with feedback sent to ${item.requester}`);
    setRejectingId(null);
    setRejectReason('');
    if (detailItem?.id === item.id) setDetailItem(null);
  };

  // Filter application
  const showPendingSection = filter === 'all' || filter === 'pending';
  const showHistorySection = filter === 'all' || filter === 'approved' || filter === 'rejected';

  const filteredHistory = historyList.filter((h) => {
    if (filter === 'approved') return h.decision === 'Approved';
    if (filter === 'rejected') return h.decision === 'Rejected';
    return true;
  });

  return (
    <div
      id="approvals-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast notification */}
      {toastMessage && (
        <div
          id="approvals-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
            Approvals
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Review and manage pending approval requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <select
              id="approvals-header-filter-select"
              value={filter}
              onChange={(e) => {
                const val = e.target.value;
                const headerSelect = document.getElementById('header-approvals-filter-select') as HTMLSelectElement | null;
                if (headerSelect) {
                  headerSelect.value = val;
                  headerSelect.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }}
              className="appearance-none pl-3.5 pr-9 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none rotate-90" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: APPROVAL SUMMARY (3 cards, equal width)                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Pending Approvals */}
        <div
          id="summary-card-pending"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Pending Approvals</span>
              <span className="p-1.5 rounded-lg bg-amber-50 text-[#B95F00] border border-amber-100">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0F172A] font-mono">8</span>
              <span className="text-xs font-semibold text-[#B95F00] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>3 waiting over 24h</span>
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] font-medium text-[#64748B]">
              Time edits: <strong className="text-slate-800">5</strong> · Payroll: <strong className="text-slate-800">2</strong> · Budget: <strong className="text-slate-800">1</strong>
            </p>
          </div>
        </div>

        {/* Card 2: Approved (This Week) */}
        <div
          id="summary-card-approved"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Approved (This Week)</span>
              <span className="p-1.5 rounded-lg bg-indigo-50 text-[#6366F1] border border-indigo-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0F172A] font-mono">14</span>
              <span className="text-xs font-semibold text-[#6366F1] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+4 vs last week</span>
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] font-medium text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>All processed within SLA</span>
            </p>
          </div>
        </div>

        {/* Card 3: Rejected (This Week) */}
        <div
          id="summary-card-rejected"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Rejected (This Week)</span>
              <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                <XCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0F172A] font-mono">3</span>
              <span className="text-xs font-semibold text-[#6366F1] flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>-2 vs last week</span>
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] font-medium text-[#64748B]">
              2 pending resubmission
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: PENDING APPROVALS LIST                                             */}
      {/* ========================================================================= */}
      {showPendingSection && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
              <h2 className="text-base font-bold text-[#0F172A]">
                Pending Approvals ({pendingList.length})
              </h2>
            </div>
            <span className="text-xs text-slate-400">Click card for detailed breakdown</span>
          </div>

          {pendingList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">All caught up!</p>
              <p className="text-xs text-slate-500">There are no pending requests awaiting your sign-off.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingList.map((item) => {
                const isRejecting = rejectingId === item.id;

                return (
                  <div
                    key={item.id}
                    id={`approval-card-${item.id}`}
                    onClick={() => setDetailItem(item)}
                    className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#6366F1]/50 p-5 shadow-xs transition-all duration-150 cursor-pointer group hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Requester & Info */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1] shrink-0 font-bold text-xs">
                          {item.type === 'payroll' ? (
                            <CreditCard className="w-4 h-4" />
                          ) : item.type === 'budget' ? (
                            <DollarSign className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                              {item.typeLabel}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {item.requester}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              • {item.requestedTime}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-slate-800">
                            {item.summary}
                          </p>

                          {/* Multi-step indicator */}
                          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              <span>Step {item.currentStep} of {item.totalSteps}</span>
                              <span className="text-slate-400">({item.stepDescription})</span>
                            </span>
                            <span className="text-[11px] text-indigo-600 font-medium group-hover:underline flex items-center gap-0.5">
                              View details <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div
                        className="flex items-center gap-2.5 shrink-0 self-end md:self-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          id={`btn-approve-${item.id}`}
                          onClick={(e) => handleApprove(item, e)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          id={`btn-reject-${item.id}`}
                          onClick={(e) => (isRejecting ? setRejectingId(null) : handleStartReject(item, e))}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer active:scale-95"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{isRejecting ? 'Cancel' : 'Reject'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Expandable Reject Reason Input */}
                    {isRejecting && (
                      <form
                        onSubmit={(e) => handleConfirmReject(item, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 pt-4 border-t border-rose-100 bg-rose-50/50 -mx-5 -mb-5 p-5 rounded-b-2xl space-y-3 animate-in fade-in duration-150"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                          <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                          <span>Specify rejection reason (mandatory feedback for {item.requester}):</span>
                        </div>
                        <input
                          type="text"
                          required
                          autoFocus
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="e.g., Exceeds agreed sprint allotment; please consult engineering lead..."
                          className="w-full px-3.5 py-2 bg-white border border-rose-300 focus:border-rose-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none shadow-2xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason('');
                            }}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-white rounded-lg font-semibold"
                          >
                            Dismiss
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs"
                          >
                            Confirm Rejection
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROW 3: APPROVED/REJECTED HISTORY (Compact Table)                          */}
      {/* ========================================================================= */}
      {showHistorySection && (
        <div
          id="card-approval-history"
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
        >
          <div className="p-4 sm:px-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#6366F1]" />
              <h3 className="text-sm font-bold text-[#0F172A]">Approved / Rejected History</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing recent decision records
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold">Type</th>
                  <th className="py-3.5 px-4 font-bold">Requester</th>
                  <th className="py-3.5 px-4 font-bold">Decision</th>
                  <th className="py-3.5 px-4 font-bold text-right">Approver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No records match the selected decision filter.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {row.date}
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                          {row.type}
                        </span>
                      </td>

                      {/* Requester */}
                      <td className="py-3 px-4 text-slate-800 whitespace-nowrap font-semibold">
                        {row.requester}
                      </td>

                      {/* Decision */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {row.decision === 'Approved' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                            <span>✅</span>
                            <span>Approved</span>
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 w-fit">
                              <span>❌</span>
                              <span>Rejected</span>
                            </span>
                            {row.comment && (
                              <span className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate font-normal">
                                "{row.comment}"
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Approver */}
                      <td className="py-3 px-4 text-right text-slate-700 font-medium whitespace-nowrap">
                        {row.approver}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APPROVAL DETAIL VIEW                                               */}
      {/* ========================================================================= */}
      {detailItem && (
        <div
          id="modal-approval-detail-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setDetailItem(null)}
        >
          <div
            id="modal-approval-detail-container"
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[#6366F1]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{detailItem.typeLabel}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Requested by {detailItem.requester} ({detailItem.requesterRole})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Request Summary
                </span>
                <p className="text-sm font-semibold text-slate-900">{detailItem.summary}</p>
                {detailItem.details?.note && (
                  <p className="text-xs text-slate-600 italic">"{detailItem.details.note}"</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold">APPROVAL PIPELINE</span>
                  <span className="text-xs font-semibold text-slate-800">
                    Step {detailItem.currentStep} of {detailItem.totalSteps} ({detailItem.stepDescription})
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold">SUBMITTED</span>
                  <span className="text-xs font-semibold text-slate-800">{detailItem.requestedTime}</span>
                </div>
              </div>

              {detailItem.details?.amount && (
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">Total Requested Amount:</span>
                  <span className="text-base font-extrabold text-[#6366F1] font-mono">
                    {detailItem.details.amount}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handleStartReject(detailItem, e);
                  setDetailItem(null);
                }}
                className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold rounded-xl text-xs"
              >
                Reject Request
              </button>
              <button
                type="button"
                onClick={(e) => handleApprove(detailItem, e)}
                className="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
