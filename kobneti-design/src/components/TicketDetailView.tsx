import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Send,
  BookOpen,
  Zap,
  Lock,
  MessageSquare,
  Plus,
  X,
  Check,
  ShieldAlert,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  User,
  AlertTriangle,
} from 'lucide-react';

export interface TimelineEntry {
  id: string;
  type: 'customer' | 'agent' | 'internal_note' | 'system';
  author: {
    name: string;
    role?: string;
    avatar?: string;
    initials: string;
  };
  timestamp: string;
  content: string;
  badge?: string;
}

export interface SuggestedKB {
  id: string;
  title: string;
  product: string;
  snippet: string;
  updated: string;
}

export interface LinkedTask {
  id: string;
  key: string;
  title: string;
  status: 'In Progress' | 'Backlog' | 'Done';
}

interface TicketDetailViewProps {
  status?: 'New' | 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  onStatusChange?: (status: 'New' | 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed') => void;
  assignee?: string;
  onAssigneeChange?: (assignee: string) => void;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  onPriorityChange?: (priority: 'Low' | 'Medium' | 'High' | 'Critical') => void;
  onEscalate?: () => void;
  onBackToTickets?: () => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  status: initialStatus = 'Open',
  onStatusChange,
  assignee: initialAssignee = 'Adeel D.',
  onAssigneeChange,
  priority: initialPriority = 'High',
  onPriorityChange,
  onEscalate,
  onBackToTickets,
}) => {
  const [currentStatus, setCurrentStatus] = useState<'New' | 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed'>(initialStatus);
  const [currentAssignee, setCurrentAssignee] = useState<string>(initialAssignee);
  const [currentPriority, setCurrentPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>(initialPriority);

  const status = currentStatus;
  const setStatus = (st: any) => {
    setCurrentStatus(st);
    onStatusChange?.(st);
  };

  const assignee = currentAssignee;
  const setAssignee = (asg: string) => {
    setCurrentAssignee(asg);
    onAssigneeChange?.(asg);
  };

  const priority = currentPriority;
  const setPriority = (pr: any) => {
    setCurrentPriority(pr);
    onPriorityChange?.(pr);
  };

  // Composer tab: 'replies' | 'notes' - Defaults to 'notes' (Internal Notes) per Attio spec
  const [composerMode, setComposerMode] = useState<'replies' | 'notes'>('notes');
  const [composerText, setComposerText] = useState('');
  const [isComposerHovered, setIsComposerHovered] = useState(false);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [showMacrosMenu, setShowMacrosMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal for linking tasks
  const [isLinkTaskModalOpen, setIsLinkTaskModalOpen] = useState(false);
  const [newTaskKey, setNewTaskKey] = useState('ENG-');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Linked Tasks list
  const [linkedTasks, setLinkedTasks] = useState<LinkedTask[]>([
    {
      id: 'task-1',
      key: 'ENG-23',
      title: 'Fix 3DS verification timeout',
      status: 'In Progress',
    },
  ]);

  // Suggested KB Articles
  const [suggestedKBs] = useState<SuggestedKB[]>([
    {
      id: 'kb-1',
      title: '3DS Verification Errors',
      product: 'MuuqWear',
      snippet: 'How to troubleshoot 3DS timeout issues on mobile checkout and gateway handshakes...',
      updated: 'Updated 2 days ago',
    },
    {
      id: 'kb-2',
      title: 'Checkout Flow Troubleshooting',
      product: 'MuuqWear',
      snippet: 'Common checkout issues, webhook retries, and browser cookie compatibility fixes...',
      updated: 'Updated 1 week ago',
    },
  ]);

  // Timeline entries strictly matched to specification
  const [timeline, setTimeline] = useState<TimelineEntry[]>([
    {
      id: 'entry-1',
      type: 'customer',
      author: {
        name: 'Sarah K.',
        role: 'Customer',
        initials: 'SK',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      },
      timestamp: '2 min ago',
      content:
        "Hi, I'm trying to checkout on MuuqWear but the payment screen just spins indefinitely. Using Chrome on Android.",
    },
    {
      id: 'entry-2',
      type: 'agent',
      author: {
        name: 'Adeel D.',
        role: 'Support Lead',
        initials: 'AD',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      },
      timestamp: '1 min ago',
      content: 'Thanks for reporting this, Sarah. Let me check the payment gateway logs.',
    },
    {
      id: 'entry-3',
      type: 'internal_note',
      author: {
        name: 'Adeel D.',
        role: 'Support Lead',
        initials: 'AD',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      },
      timestamp: '45 sec ago',
      content: 'Checked Stripe logs — seems like a 3DS verification timeout. Escalating to engineering.',
      badge: 'INTERNAL NOTE',
    },
    {
      id: 'entry-4',
      type: 'system',
      author: {
        name: 'System',
        initials: 'SYS',
      },
      timestamp: '30 sec ago',
      content: 'Ticket escalated to Engineering Team · Severity: High',
    },
    {
      id: 'entry-5',
      type: 'agent',
      author: {
        name: 'Leila H.',
        role: 'Sr. Support Engineer',
        initials: 'LH',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      },
      timestamp: 'Just now',
      content:
        "Hi Sarah, we've identified the issue — it's a 3DS verification timeout on certain Android versions. We're deploying a fix now.",
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSend = () => {
    if (!composerText.trim()) return;

    if (composerMode === 'replies') {
      const newEntry: TimelineEntry = {
        id: `entry-${Date.now()}`,
        type: 'agent',
        author: {
          name: assignee || 'Adeel D.',
          role: 'Support Agent',
          initials: (assignee || 'AD')
            .split(' ')
            .map((n) => n[0])
            .join(''),
        },
        timestamp: 'Just now',
        content: composerText,
      };
      setTimeline([...timeline, newEntry]);
      showToast('Reply dispatched to customer.');
    } else {
      const newEntry: TimelineEntry = {
        id: `entry-${Date.now()}`,
        type: 'internal_note',
        author: {
          name: assignee || 'Adeel D.',
          role: 'Support Agent',
          initials: (assignee || 'AD')
            .split(' ')
            .map((n) => n[0])
            .join(''),
        },
        timestamp: 'Just now',
        content: composerText,
        badge: 'INTERNAL NOTE',
      };
      setTimeline([...timeline, newEntry]);
      showToast('Internal note recorded.');
    }

    setComposerText('');
  };

  const handleAttachKB = (kb: SuggestedKB) => {
    setComposerMode('replies');
    setComposerText((prev) => {
      const snippetToInsert = `\n\nReferenced Solution (${kb.title}):\n${kb.snippet}`;
      return prev ? prev + snippetToInsert : `Hi Sarah,\n${snippetToInsert}`;
    });
    showToast(`Attached article "${kb.title}" to reply composer.`);
  };

  const handleMacroSelect = (macroText: string) => {
    setComposerText(macroText);
    setShowMacrosMenu(false);
    showToast('Applied macro template.');
  };

  const handleAddLinkedTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: LinkedTask = {
      id: `task-${Date.now()}`,
      key: newTaskKey.trim() || `ENG-${Math.floor(100 + Math.random() * 900)}`,
      title: newTaskTitle,
      status: 'In Progress',
    };

    setLinkedTasks([...linkedTasks, newTask]);
    setIsLinkTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskKey('ENG-');
    showToast(`Linked engineering task ${newTask.key}`);
  };

  const handleEscalateClick = () => {
    if (onEscalate) {
      onEscalate();
    } else {
      showToast('Escalated ticket #4210 to Tier 2 Engineering.');
      const escalationEntry: TimelineEntry = {
        id: `entry-${Date.now()}`,
        type: 'system',
        author: { name: 'System', initials: 'SYS' },
        timestamp: 'Just now',
        content: 'Ticket escalated to Tier 2 Engineering Incident Response',
      };
      setTimeline((prev) => [...prev, escalationEntry]);
    }
  };

  return (
    <div id="ticket-detail-view-root" className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="detail-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white p-1 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* Breadcrumb: "Tickets / MuuqWear / #4210" (muted grey, 14px)                */}
      {/* Headline: "Checkout failing on mobile devices" (InterDisplay, 28px, 600)  */}
      {/* Subtext: "Ticket #4210 · Created Nov 15, 2025 · Updated 2 min ago" (16px) */}
      {/* Right: Status dropdown + Assign dropdown + "Escalate" ghost link (Tertiary)*/}
      {/* ========================================================================= */}
      <div className="flex flex-col space-y-2 pb-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[14px] text-[#64748B] font-medium">
          {onBackToTickets && (
            <button
              onClick={onBackToTickets}
              className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#6366F1] transition-colors mr-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <span
            className="hover:text-[#0F172A] cursor-pointer transition-colors"
            onClick={onBackToTickets}
          >
            Tickets
          </span>
          <span>/</span>
          <span className="hover:text-[#0F172A] cursor-pointer transition-colors">
            MuuqWear
          </span>
          <span>/</span>
          <span className="font-mono font-medium text-[#64748B]">#4210</span>
        </div>

        {/* Headline, Subtext & Right Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <h1
              className="text-[28px] font-[600] tracking-[-0.015em] text-[#0F172A] leading-tight"
              style={{ fontFamily: 'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              Checkout failing on mobile devices
            </h1>
            <p
              className="text-[16px] font-[500] text-[#64748B] leading-normal"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              Ticket #4210 · Created Nov 15, 2025 · Updated 2 min ago
            </p>
          </div>

          {/* Right Header Controls: Status dropdown + Assign dropdown + "Escalate" ghost link (Tertiary text) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            {/* Status dropdown */}
            <div className="relative">
              <select
                id="header-select-status"
                value={status}
                onChange={(e) => {
                  const newSt = e.target.value as any;
                  setStatus(newSt);
                  showToast(`Status updated to ${newSt}`);
                }}
                className="appearance-none pl-3 pr-8 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-[#E2E8F0] rounded-[7px] text-xs font-semibold text-[#0F172A] focus:outline-none cursor-pointer transition-colors shadow-2xs"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="New">New</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-2 pointer-events-none" />
            </div>

            {/* Assign dropdown */}
            <div className="relative">
              <select
                id="header-select-assignee"
                value={assignee}
                onChange={(e) => {
                  setAssignee(e.target.value);
                  showToast(`Assigned to ${e.target.value}`);
                }}
                className="appearance-none pl-3 pr-8 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-[#E2E8F0] rounded-[7px] text-xs font-semibold text-[#0F172A] focus:outline-none cursor-pointer transition-colors shadow-2xs"
              >
                <option value="Adeel D.">Adeel D.</option>
                <option value="Leila H.">Leila H.</option>
                <option value="Mike C.">Mike C.</option>
                <option value="Sarah K.">Sarah K.</option>
                <option value="Ibrahim M.">Ibrahim M.</option>
                <option value="Unassigned">Unassigned</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-2 pointer-events-none" />
            </div>

            {/* "Escalate" ghost link (Tertiary text #B95F00) */}
            <button
              id="btn-header-escalate-ghost"
              onClick={handleEscalateClick}
              className="px-3 py-1.5 text-xs font-semibold text-[#B95F00] hover:text-[#924B00] hover:bg-amber-50 rounded-[7px] transition-colors cursor-pointer"
            >
              Escalate
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TWO-COLUMN LAYOUT (Left 70% / Right 30%)                                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">

        {/* ========================================================================= */}
        {/* LEFT COLUMN (70% - 7 cols) — Conversation & Timeline                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col space-y-6">

          {/* Dimming background overlay when composer is expanded/focused */}
          {(isComposerHovered || isComposerFocused) && (
            <div
              className="fixed inset-0 bg-slate-900/10 dark:bg-[#0F172A]/50 backdrop-blur-[1px] pointer-events-none z-10 transition-opacity duration-150"
              aria-hidden="true"
            />
          )}

          {/* ======================================================================= */}
          {/* COMPOSER (Hover/Focus to expand with 150ms smooth transition)           */}
          {/* Segmented toggle: "Internal Notes" (default) | "Replies"                 */}
          {/* Textarea: "Write an internal note..." / "Write a reply..."              */}
          {/* Right: "Attach KB" ghost link + "Macros" ghost link + "Send" (Primary)  */}
          {/* ======================================================================= */}
          <div
            id="ticket-composer-card"
            onMouseEnter={() => setIsComposerHovered(true)}
            onMouseLeave={() => setIsComposerHovered(false)}
            onFocus={() => setIsComposerFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsComposerFocused(false);
              }
            }}
            className={`relative z-20 bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-xs overflow-hidden transition-all duration-150 ${
              isComposerHovered || isComposerFocused
                ? 'shadow-lg border-[#6366F1]/50 ring-2 ring-[#6366F1]/20'
                : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Segmented Toggle: "Internal Notes" (default active) | "Replies" */}
            <div className="px-4 py-2.5 border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
              <div className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-900/60 rounded-[7px] border border-[#E2E8F0] dark:border-slate-800">
                <button
                  id="tab-composer-notes"
                  onClick={() => setComposerMode('notes')}
                  className={`px-3 py-1 rounded-[5px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    composerMode === 'notes'
                      ? 'bg-white dark:bg-slate-800 text-[#B95F00] dark:text-amber-400 shadow-xs font-bold'
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#B95F00] dark:text-amber-400" />
                  <span>Internal Notes</span>
                </button>

                <button
                  id="tab-composer-replies"
                  onClick={() => setComposerMode('replies')}
                  className={`px-3 py-1 rounded-[5px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    composerMode === 'replies'
                      ? 'bg-white dark:bg-slate-800 text-[#0F172A] dark:text-[#F8FAFC] shadow-xs font-bold'
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#6366F1] dark:text-[#818CF8]" />
                  <span>Replies</span>
                </button>
              </div>

              {composerMode === 'notes' ? (
                <span className="text-[11px] font-medium text-[#B95F00] dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-[5px] border border-amber-200/80 dark:border-amber-800/50">
                  Visible only to internal staff
                </span>
              ) : (
                <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                  Replying to Sarah K.
                </span>
              )}
            </div>

            {/* Textarea with smooth height transition */}
            <div className={`p-4 transition-colors duration-150 ${composerMode === 'notes' ? 'bg-amber-50/20 dark:bg-amber-950/10' : 'bg-white dark:bg-[#1E293B]'}`}>
              <textarea
                id="composer-textarea"
                rows={isComposerHovered || isComposerFocused || composerText.length > 0 ? 4 : 2}
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder={
                  composerMode === 'notes'
                    ? 'Write an internal note...'
                    : 'Write a reply...'
                }
                className="w-full text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] bg-transparent resize-none focus:outline-none leading-relaxed transition-all duration-150"
              />
            </div>

            {/* Composer Footer Actions */}
            <div className="px-4 py-2.5 bg-slate-50/60 dark:bg-slate-800/40 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <button
                  type="button"
                  onClick={() => showToast('Attachment picker opened')}
                  className="p-1 hover:text-slate-600 dark:hover:text-slate-300 rounded-[5px] transition-colors cursor-pointer"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 relative">
                {/* "Attach KB" ghost link */}
                <button
                  id="btn-composer-attach-kb-ghost"
                  type="button"
                  onClick={() => handleAttachKB(suggestedKBs[0])}
                  className="px-2.5 py-1.5 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer"
                >
                  Attach KB
                </button>

                {/* "Macros" ghost link */}
                <div className="relative">
                  <button
                    id="btn-composer-macros-ghost"
                    type="button"
                    onClick={() => setShowMacrosMenu(!showMacrosMenu)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Macros</span>
                    <ChevronDown className="w-3 h-3 text-[#64748B] dark:text-[#94A3B8]" />
                  </button>

                  {/* Macros Menu dropdown */}
                  {showMacrosMenu && (
                    <div
                      id="composer-macros-dropdown"
                      className="absolute right-0 bottom-full mb-2 w-72 bg-white dark:bg-[#1E293B] rounded-[10px] shadow-xl border border-[#E2E8F0] dark:border-slate-700 p-1.5 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                        Canned Responses
                      </div>
                      <button
                        onClick={() =>
                          handleMacroSelect(
                            "Hi Sarah,\n\nWe've identified the issue — it's a 3DS verification timeout on certain Android versions. We're deploying a fix now."
                          )
                        }
                        className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[6px] text-xs transition-colors cursor-pointer"
                      >
                        <div className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">3DS Android Hotfix</div>
                        <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">Notify customer of in-flight patch</div>
                      </button>
                      <button
                        onClick={() =>
                          handleMacroSelect(
                            "Hi Sarah,\n\nThanks for reporting this. Let me check the payment gateway logs."
                          )
                        }
                        className="w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[6px] text-xs transition-colors cursor-pointer"
                      >
                        <div className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Initial Triage Response</div>
                        <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">Acknowledge and inspect logs</div>
                      </button>
                    </div>
                  )}
                </div>

                {/* "Send" (Primary filled #6366F1 / #818CF8, 7px radius) */}
                <button
                  id="btn-composer-send"
                  onClick={handleSend}
                  disabled={!composerText.trim()}
                  className="px-4 py-1.5 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-40 active:scale-98"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* TIMELINE (Scrollable)                                                   */}
          {/* ======================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Timeline
              </h3>
              <span className="text-[11px] text-[#64748B]">Live Conversation</span>
            </div>

            <div className="space-y-4">
              {timeline.map((entry) => {
                // Customer entry
                if (entry.type === 'customer') {
                  return (
                    <div
                      key={entry.id}
                      id={`timeline-entry-${entry.id}`}
                      className="bg-white rounded-[12px] border border-[#E2E8F0] p-4 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-[10px] text-slate-700">
                            {entry.author.avatar ? (
                              <img
                                src={entry.author.avatar}
                                alt={entry.author.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              entry.author.initials
                            )}
                          </div>
                          <span className="font-bold text-[#0F172A]">{entry.author.name}</span>
                          <span className="text-[11px] text-[#64748B]">(Customer)</span>
                        </div>
                        <span className="text-[11px] text-[#64748B] font-medium">{entry.timestamp}</span>
                      </div>

                      <div className="text-xs text-[#0F172A] leading-relaxed pl-8 font-normal">
                        "{entry.content}"
                      </div>
                    </div>
                  );
                }

                // Agent entry
                if (entry.type === 'agent') {
                  return (
                    <div
                      key={entry.id}
                      id={`timeline-entry-${entry.id}`}
                      className="bg-white rounded-[12px] border border-[#E2E8F0] p-4 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-[10px] text-[#6366F1]">
                            {entry.author.avatar ? (
                              <img
                                src={entry.author.avatar}
                                alt={entry.author.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              entry.author.initials
                            )}
                          </div>
                          <span className="font-bold text-[#0F172A]">{entry.author.name}</span>
                          <span className="text-[11px] text-[#6366F1] font-semibold">(Agent)</span>
                        </div>
                        <span className="text-[11px] text-[#64748B] font-medium">{entry.timestamp}</span>
                      </div>

                      <div className="text-xs text-[#0F172A] leading-relaxed pl-8 font-normal">
                        "{entry.content}"
                      </div>
                    </div>
                  );
                }

                // [INTERNAL NOTE] entry (Adeel D. — 45 sec ago)
                if (entry.type === 'internal_note') {
                  return (
                    <div
                      key={entry.id}
                      id={`timeline-entry-${entry.id}`}
                      className="bg-amber-50/50 rounded-[12px] border border-amber-200 p-4 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#B95F00] bg-amber-100 px-2 py-0.5 rounded-[4px] border border-amber-200">
                            [INTERNAL NOTE]
                          </span>
                          <span className="font-bold text-[#0F172A]">{entry.author.name}</span>
                        </div>
                        <span className="text-[11px] text-[#B95F00] font-medium">{entry.timestamp}</span>
                      </div>

                      <div className="text-xs text-slate-800 leading-relaxed font-normal">
                        "{entry.content}"
                      </div>
                    </div>
                  );
                }

                // System entry (System — 30 sec ago)
                if (entry.type === 'system') {
                  return (
                    <div
                      key={entry.id}
                      id={`timeline-entry-${entry.id}`}
                      className="flex items-center justify-center my-1"
                    >
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[7px] bg-slate-100 border border-[#E2E8F0] text-slate-600 text-xs font-medium">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        <span>{entry.content}</span>
                        <span className="text-[11px] text-[#64748B]">· {entry.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (30% - 3 cols) — Ticket Details (Attio-style, clean, compact) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col space-y-5 lg:sticky lg:top-4">

          {/* ======================================================================= */}
          {/* STATUS CARD                                                             */}
          {/* - Status: Open (dropdown)                                               */}
          {/* - Priority: High (dropdown)                                             */}
          {/* - Assignee: Adeel D. (avatar + dropdown)                                */}
          {/* - SLA: 2.4hrs left (warning state if under 1hr)                         */}
          {/* ======================================================================= */}
          <div
            id="ticket-status-card"
            className="bg-white rounded-[12px] p-5 border border-[#E2E8F0] shadow-xs space-y-4 text-xs"
          >
            <div className="border-b border-[#E2E8F0] pb-2">
              <h3 className="font-semibold text-xs text-[#0F172A]">Status</h3>
            </div>

            {/* Status dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#64748B]">Status</label>
              <div className="relative">
                <select
                  id="side-select-status"
                  value={status}
                  onChange={(e) => {
                    const newSt = e.target.value as any;
                    setStatus(newSt);
                    showToast(`Status set to ${newSt}`);
                  }}
                  className="w-full pl-3 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] focus:border-[#6366F1] rounded-[7px] text-xs font-semibold text-[#0F172A] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                  <option value="New">New</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2 text-[#64748B] pointer-events-none" />
              </div>
            </div>

            {/* Priority dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#64748B]">Priority</label>
              <div className="relative">
                <select
                  id="side-select-priority"
                  value={priority}
                  onChange={(e) => {
                    const newPr = e.target.value as any;
                    setPriority(newPr);
                    showToast(`Priority set to ${newPr}`);
                  }}
                  className="w-full pl-3 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] focus:border-[#6366F1] rounded-[7px] text-xs font-semibold text-[#0F172A] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2 text-[#64748B] pointer-events-none" />
              </div>
            </div>

            {/* Assignee: avatar + dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#64748B]">Assignee</label>
              <div className="relative flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[10px] font-bold absolute left-2 pointer-events-none">
                  AD
                </div>
                <select
                  id="side-select-assignee"
                  value={assignee}
                  onChange={(e) => {
                    setAssignee(e.target.value);
                    showToast(`Assigned to ${e.target.value}`);
                  }}
                  className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] focus:border-[#6366F1] rounded-[7px] text-xs font-semibold text-[#0F172A] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Adeel D.">Adeel D.</option>
                  <option value="Leila H.">Leila H.</option>
                  <option value="Mike C.">Mike C.</option>
                  <option value="Sarah K.">Sarah K.</option>
                  <option value="Ibrahim M.">Ibrahim M.</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2 text-[#64748B] pointer-events-none" />
              </div>
            </div>

            {/* SLA: 2.4hrs left (warning state if under 1hr) */}
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[#64748B] font-medium">SLA:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#0F172A] bg-slate-100 px-2 py-0.5 rounded-[5px]">
                <Clock className="w-3 h-3 text-[#64748B]" />
                <span>2.4hrs left</span>
              </span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* METADATA CARD                                                           */}
          {/* - Product: MuuqWear                                                     */}
          {/* - Source: Web Form                                                      */}
          {/* - Requester: Sarah K. (email: sarah@example.com)                        */}
          {/* - Created: Nov 15, 2025 10:23 AM                                        */}
          {/* ======================================================================= */}
          <div
            id="ticket-metadata-card"
            className="bg-white rounded-[12px] p-5 border border-[#E2E8F0] shadow-xs space-y-3 text-xs"
          >
            <div className="border-b border-[#E2E8F0] pb-2">
              <h3 className="font-semibold text-xs text-[#0F172A]">Metadata</h3>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Product:</span>
              <span className="font-semibold text-[#0F172A]">MuuqWear</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Source:</span>
              <span className="font-semibold text-[#0F172A]">Web Form</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-[#64748B]">Requester:</span>
              <div className="text-right">
                <div className="font-semibold text-[#0F172A]">Sarah K.</div>
                <div className="text-[11px] text-[#64748B]">sarah@example.com</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Created:</span>
              <span className="font-medium text-[#0F172A]">Nov 15, 2025 10:23 AM</span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* LINKED TASKS                                                            */}
          {/* - ENG-23 — Fix 3DS verification timeout — In Progress                   */}
          {/* - "+ Link Task" ghost link                                              */}
          {/* ======================================================================= */}
          <div
            id="ticket-linked-tasks-card"
            className="bg-white rounded-[12px] p-5 border border-[#E2E8F0] shadow-xs space-y-3 text-xs"
          >
            <div className="border-b border-[#E2E8F0] pb-2 flex items-center justify-between">
              <h3 className="font-semibold text-xs text-[#0F172A]">Linked Tasks</h3>
            </div>

            <div className="space-y-2">
              {linkedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 rounded-[8px] border border-[#E2E8F0] bg-slate-50/60 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-[#0F172A] truncate">
                      {task.key} — {task.title}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-blue-50 text-[#3B82F6] border border-blue-200 shrink-0">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>

            {/* "+ Link Task" ghost link */}
            <button
              id="btn-link-task-ghost"
              onClick={() => setIsLinkTaskModalOpen(true)}
              className="w-full py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-[7px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Link Task</span>
            </button>
          </div>

          {/* ======================================================================= */}
          {/* SUGGESTED KB ARTICLES                                                   */}
          {/* - "3DS Verification Errors" — MuuqWear (Updated 2 days ago) — Attach    */}
          {/* - "Checkout Flow Troubleshooting" — MuuqWear (Updated 1 week ago)       */}
          {/* ======================================================================= */}
          <div
            id="ticket-suggested-kb-card"
            className="bg-white rounded-[12px] p-5 border border-[#E2E8F0] shadow-xs space-y-3.5 text-xs"
          >
            <div className="border-b border-[#E2E8F0] pb-2">
              <h3 className="font-semibold text-xs text-[#0F172A]">Suggested KB Articles</h3>
            </div>

            <div className="space-y-3">
              {suggestedKBs.map((kb) => (
                <div
                  key={kb.id}
                  className="p-2.5 rounded-[8px] border border-[#E2E8F0] bg-slate-50/40 hover:bg-slate-50 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-[#0F172A] leading-snug">{kb.title}</h4>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {kb.product} · {kb.updated}
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    {/* Attach ghost link */}
                    <button
                      id={`btn-attach-kb-${kb.id}`}
                      onClick={() => handleAttachKB(kb)}
                      className="px-2 py-0.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-[5px] transition-colors cursor-pointer"
                    >
                      Attach
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: LINK TASK                                                          */}
      {/* ========================================================================= */}
      {isLinkTaskModalOpen && (
        <div
          id="link-task-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsLinkTaskModalOpen(false)}
        >
          <div
            id="link-task-modal-container"
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E2E8F0] p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#0F172A]">Link Engineering Task</h3>
              <button
                onClick={() => setIsLinkTaskModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLinkedTask} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Task Key</label>
                <input
                  type="text"
                  required
                  value={newTaskKey}
                  onChange={(e) => setNewTaskKey(e.target.value)}
                  placeholder="e.g. ENG-24"
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[7px] focus:border-[#6366F1] outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Upgrade 3DS mobile SDK"
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[7px] focus:border-[#6366F1] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsLinkTaskModalOpen(false)}
                  className="px-3 py-1.5 border border-[#E2E8F0] rounded-[7px] text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-[7px] shadow-xs cursor-pointer"
                >
                  Link Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
