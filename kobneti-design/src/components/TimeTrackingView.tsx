import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Square,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronDown,
  Edit3,
  Check,
  X,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  History,
} from 'lucide-react';

export interface TimeEntry {
  id: string;
  date: string;
  ticketOrTask: string;
  type: 'ticket' | 'task';
  code: string;
  title: string;
  duration: number; // in hours, e.g. 2.5
  status: 'Approved' | 'Pending Approval';
  description?: string;
  requestedDuration?: number;
  editReason?: string;
}

const INITIAL_TIME_ENTRIES: TimeEntry[] = [
  {
    id: 'te-1',
    date: 'Nov 15',
    ticketOrTask: '#4210 — Checkout failing',
    type: 'ticket',
    code: '#4210',
    title: 'Checkout failing',
    duration: 2.5,
    status: 'Approved',
    description: 'Investigated stripe webhook signature failure and payment timeout handler.',
  },
  {
    id: 'te-2',
    date: 'Nov 15',
    ticketOrTask: 'ENG-35 — Payment gateway',
    type: 'task',
    code: 'ENG-35',
    title: 'Payment gateway',
    duration: 3.0,
    status: 'Pending Approval',
    description: 'Integrated multi-currency idempotency keys and error handling.',
  },
  {
    id: 'te-3',
    date: 'Nov 14',
    ticketOrTask: '#4205 — Payment error',
    type: 'ticket',
    code: '#4205',
    title: 'Payment error',
    duration: 1.5,
    status: 'Approved',
    description: 'Hotfixed 3DS modal redirect URL encoding in production checkout flow.',
  },
  {
    id: 'te-4',
    date: 'Nov 14',
    ticketOrTask: 'ENG-30 — 3DS verification',
    type: 'task',
    code: 'ENG-30',
    title: '3DS verification',
    duration: 2.0,
    status: 'Approved',
    description: 'Implemented frictionless 3D Secure fallback mechanism for European cards.',
  },
  {
    id: 'te-5',
    date: 'Nov 13',
    ticketOrTask: '#4207 — User roles bug',
    type: 'ticket',
    code: '#4207',
    title: 'User roles bug',
    duration: 4.0,
    status: 'Pending Approval',
    description: 'Audited RBAC middleware and resolved token claim caching invalidation.',
  },
];

const AVAILABLE_TASKS_TICKETS = [
  { code: '#4210', title: 'Checkout failing', type: 'ticket' },
  { code: 'ENG-35', title: 'Payment gateway', type: 'task' },
  { code: '#4205', title: 'Payment error', type: 'ticket' },
  { code: 'ENG-30', title: '3DS verification', type: 'task' },
  { code: '#4207', title: 'User roles bug', type: 'ticket' },
  { code: '#4215', title: 'GaarX GPS telemetry sync delay', type: 'ticket' },
  { code: 'ENG-42', title: 'MuuqWear Mobile biometric auth', type: 'task' },
  { code: 'ENG-51', title: 'SomPay International remittance rate engine', type: 'task' },
];

interface TimeTrackingViewProps {
  isClockedIn: boolean;
  clockedInSeconds: number;
  onToggleClock: () => void;
}

export const TimeTrackingView: React.FC<TimeTrackingViewProps> = ({
  isClockedIn,
  clockedInSeconds,
  onToggleClock,
}) => {
  const [entries, setEntries] = useState<TimeEntry[]>(INITIAL_TIME_ENTRIES);

  // Manual Log Time form state
  const [selectedTaskCode, setSelectedTaskCode] = useState('#4210 — Checkout failing');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState<number>(2.5);
  const [manualDate, setManualDate] = useState('2025-11-15');
  const [manualDescription, setManualDescription] = useState('Worked on checkout timeout fix');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Request Modal state
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [editDuration, setEditDuration] = useState<number>(2.5);
  const [editReason, setEditReason] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Format seconds into HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Duration helpers
  const incrementDuration = () => {
    setManualDuration((prev) => +(prev + 0.5).toFixed(1));
  };

  const decrementDuration = () => {
    setManualDuration((prev) => (prev > 0.5 ? +(prev - 0.5).toFixed(1) : 0.5));
  };

  const handleManualLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskCode) return;

    const formattedDateString = 'Nov 15'; // Or dynamic from manualDate
    const newEntry: TimeEntry = {
      id: `te-${Date.now()}`,
      date: formattedDateString,
      ticketOrTask: selectedTaskCode,
      type: selectedTaskCode.startsWith('#') ? 'ticket' : 'task',
      code: selectedTaskCode.split(' — ')[0] || selectedTaskCode,
      title: selectedTaskCode.split(' — ')[1] || selectedTaskCode,
      duration: manualDuration,
      status: 'Pending Approval',
      description: manualDescription,
    };

    setEntries([newEntry, ...entries]);
    showToast(`Logged ${manualDuration} hrs on ${selectedTaskCode} (Pending Approval)`);
    setManualDescription('');
  };

  const handleOpenEditModal = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setEditDuration(entry.duration);
    setEditReason('');
  };

  const handleSubmitEditRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    setEntries((prev) =>
      prev.map((item) =>
        item.id === editingEntry.id
          ? {
              ...item,
              duration: editDuration,
              status: 'Pending Approval',
              editReason: editReason || 'Adjusted logged duration by contributor.',
            }
          : item
      )
    );

    showToast(`Edit request for ${editingEntry.code} submitted for manager approval`);
    setEditingEntry(null);
  };

  const filteredTaskOptions = AVAILABLE_TASKS_TICKETS.filter((t) =>
    `${t.code} — ${t.title}`.toLowerCase().includes(taskSearchQuery.toLowerCase())
  );

  return (
    <div
      id="time-tracking-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="time-tracking-toast"
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
            Time Tracking
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Log and track your work hours.
          </p>
        </div>

        {/* Quick Shift summary pill */}
        <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-[#E2E8F0] shadow-2xs text-xs font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
          <span>Pay Period: <strong className="text-slate-900">Nov 01 – Nov 15, 2025</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: CLOCK IN/OUT + TODAY'S SUMMARY (2 columns, Attio-style)            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Clock In/Out */}
        <div
          id="card-clock-in-out"
          className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group"
        >
          {/* Subtle background decoration */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isClockedIn ? 'bg-[#6366F1] animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Shift Tracker
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Started at <strong className="text-slate-800 font-semibold">09:00 AM</strong>
              </span>
            </div>

            {/* Timer display */}
            <div className="py-2 flex items-center gap-3">
              <span
                id="live-timer-display"
                className="text-4xl sm:text-5xl font-extrabold font-mono text-[#0F172A] tracking-tight flex items-center gap-2"
              >
                <span>⏱️</span>
                <span>{isClockedIn ? formatTimer(clockedInSeconds) : '00:00:00'}</span>
              </span>
            </div>

            <p className="text-xs text-[#64748B] max-w-xl">
              Automatic time capture syncs across your assigned engineering sprints, GitHub pull requests, and support escalations.
            </p>
          </div>

          {/* Action Button: Clock In / Clock Out */}
          <div className="pt-6 relative z-10 flex flex-wrap items-center gap-4">
            {isClockedIn ? (
              <button
                id="btn-clock-out-main"
                onClick={onToggleClock}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border-2 border-rose-500 hover:bg-rose-50 text-rose-600 font-bold text-xs shadow-xs transition-all duration-150 cursor-pointer active:scale-[0.98]"
              >
                <Square className="w-3.5 h-3.5 fill-rose-600" />
                <span>Clock Out</span>
              </button>
            ) : (
              <button
                id="btn-clock-in-main"
                onClick={onToggleClock}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs shadow-md transition-all duration-150 cursor-pointer active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Clock In</span>
              </button>
            )}

            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Location: Remote (US-West)</span>
            </div>
          </div>
        </div>

        {/* Right Card: Today's Summary */}
        <div
          id="card-todays-summary"
          className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#6366F1]" />
                <span>Today's Summary</span>
              </h3>
              <div
                id="summary-status-badge"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700"
              >
                <span className="text-slate-500">Status:</span>
                {isClockedIn ? (
                  <span className="inline-flex items-center gap-1.5 text-[#6366F1] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
                    <span>Clocked In</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-slate-500 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Clocked Out</span>
                  </span>
                )}
              </div>
            </div>

            {/* Metric counters */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Total hours</span>
                <span className="text-base font-bold text-[#0F172A] font-mono">6.5</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Tasks worked</span>
                <span className="text-base font-bold text-[#0F172A] font-mono">3</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600 font-medium">Tickets handled</span>
                <span className="text-base font-bold text-[#0F172A] font-mono">2</span>
              </div>
            </div>
          </div>

          {/* Progress bar towards 8h target */}
          <div className="pt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Daily Target (8.0 hrs)</span>
              <span className="text-[#6366F1]">81%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#6366F1] h-full rounded-full transition-all duration-500"
                style={{ width: '81.25%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: LOG TIME MANUALLY (Full width card)                                */}
      {/* ========================================================================= */}
      <div
        id="card-log-time-manually"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[#6366F1]">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Log Time Manually</h3>
              <p className="text-[11px] text-[#64748B]">
                Allocate completed project hours directly to tickets, tasks, or bugs.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleManualLogTime} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Ticket / Task picker with search dropdown (6 cols) */}
            <div className="md:col-span-6 relative">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ticket / Task *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="input-task-picker"
                  value={selectedTaskCode}
                  onChange={(e) => {
                    setSelectedTaskCode(e.target.value);
                    setTaskSearchQuery(e.target.value);
                    setIsTaskDropdownOpen(true);
                  }}
                  onFocus={() => setIsTaskDropdownOpen(true)}
                  placeholder="Search ticket or task..."
                  className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setIsTaskDropdownOpen(!isTaskDropdownOpen)}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {isTaskDropdownOpen && (
                <div
                  id="task-picker-dropdown"
                  className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100"
                >
                  {filteredTaskOptions.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setSelectedTaskCode(`${item.code} — ${item.title}`);
                        setIsTaskDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            item.type === 'task'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {item.code}
                        </span>
                        <span className="font-medium text-slate-700 group-hover:text-[#6366F1]">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Duration with +/- stepper (3 cols) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Duration (Hours) *
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  id="btn-decrement-duration"
                  onClick={decrementDuration}
                  className="w-10 h-10 rounded-l-xl bg-slate-100 hover:bg-slate-200 border border-r-0 border-[#E2E8F0] flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  id="input-manual-duration"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(parseFloat(e.target.value) || 0.5)}
                  className="w-full h-10 text-center bg-white border-y border-[#E2E8F0] text-xs font-bold text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  id="btn-increment-duration"
                  onClick={incrementDuration}
                  className="w-10 h-10 rounded-r-xl bg-slate-100 hover:bg-slate-200 border border-l-0 border-[#E2E8F0] flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Date picker (3 cols) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="input-manual-date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none shadow-2xs"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Description (Full width) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description / Work Breakdown
            </label>
            <textarea
              rows={2}
              id="input-manual-description"
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              placeholder="e.g., Worked on checkout timeout fix and reviewed payment logs"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none shadow-2xs"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              id="btn-submit-log-time"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Time</span>
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: RECENT TIME ENTRIES (Full width table)                             */}
      {/* ========================================================================= */}
      <div
        id="card-recent-time-entries"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        <div className="p-4 sm:px-6 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#6366F1]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Recent Time Entries</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {entries.length} entries for current period
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Ticket / Task</th>
                <th className="py-3.5 px-4 font-bold">Duration</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => {
                const isApproved = entry.status === 'Approved';

                return (
                  <tr
                    key={entry.id}
                    id={`time-entry-row-${entry.id}`}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {entry.date}
                    </td>

                    {/* Ticket / Task */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            entry.type === 'task'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {entry.code}
                        </span>
                        <span>{entry.title}</span>
                      </div>
                      {entry.description && (
                        <p className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                          {entry.description}
                        </p>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {entry.duration.toFixed(1)}hrs
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#B95F00] border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B95F00]" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                    </td>

                    {/* Action [Edit Ghost Link] */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        id={`btn-edit-entry-${entry.id}`}
                        onClick={() => handleOpenEditModal(entry)}
                        className="inline-flex items-center text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] hover:underline cursor-pointer bg-transparent border-0 transition-colors"
                      >
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EDIT TIME ENTRY REQUEST                                            */}
      {/* ========================================================================= */}
      {editingEntry && (
        <div
          id="modal-edit-time-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setEditingEntry(null)}
        >
          <div
            id="modal-edit-time-container"
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#6366F1]" />
                  <span>Request Time Entry Edit</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  {editingEntry.ticketOrTask} ({editingEntry.date})
                </span>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEditRequest} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-[#B95F00]" />
                  <span>Manager Approval Required</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Editing a logged entry will transition its status to <strong>Pending Approval</strong> until verified by Adeel D. (Administrator).
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  New Duration (Hours) *
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setEditDuration((prev) => (prev > 0.5 ? +(prev - 0.5).toFixed(1) : 0.5))}
                    className="w-10 h-10 rounded-l-xl bg-slate-100 hover:bg-slate-200 border border-r-0 border-[#E2E8F0] flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={editDuration}
                    onChange={(e) => setEditDuration(parseFloat(e.target.value) || 0.5)}
                    className="w-full h-10 text-center bg-white border-y border-[#E2E8F0] text-xs font-bold text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setEditDuration((prev) => +(prev + 0.5).toFixed(1))}
                    className="w-10 h-10 rounded-r-xl bg-slate-100 hover:bg-slate-200 border border-l-0 border-[#E2E8F0] flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Reason for Edit *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="Explain why the duration is being adjusted (e.g., missed logging offline review time)..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs text-slate-800 focus:outline-none resize-none shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-xl text-xs shadow-xs"
                >
                  Submit Edit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
