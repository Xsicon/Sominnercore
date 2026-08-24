import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Send,
  Paperclip,
  AtSign,
  CheckCircle2,
  Clock,
  GitPullRequest,
  GitCommit,
  GitBranch,
  ExternalLink,
  Plus,
  X,
  FileText,
  AlertCircle,
  Flame,
  User,
  Sparkles,
  Check,
  Calendar,
  Share2,
  Copy,
  SlidersHorizontal,
  Link as LinkIcon,
  Tag,
  FolderGit2,
} from 'lucide-react';

export interface TaskDetailViewProps {
  taskStatus: 'Backlog' | 'To Do' | 'In Progress' | 'Review' | 'Done';
  onTaskStatusChange: (status: 'Backlog' | 'To Do' | 'In Progress' | 'Review' | 'Done') => void;
  taskPriority: 'High' | 'Medium' | 'Low' | 'Urgent';
  onTaskPriorityChange: (priority: 'High' | 'Medium' | 'Low' | 'Urgent') => void;
  taskAssignee: string;
  onTaskAssigneeChange: (assignee: string) => void;
  onBackToBoard?: () => void;
}

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  role?: string;
  timestamp: string;
  content: string;
  isSystem?: boolean;
  attachment?: {
    name: string;
    size: string;
  };
}

interface LinkedTicket {
  id: string;
  ticketNumber: string;
  title: string;
  product: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    author: 'System',
    timestamp: '3 hours ago',
    content: 'Status changed from To Do → In Progress',
    isSystem: true,
  },
  {
    id: 'c-2',
    author: 'Leila H.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    role: 'Backend Engineer',
    timestamp: '1 hour ago',
    content: 'Attached webhook documentation and endpoint retry policies for Stripe events.',
    attachment: {
      name: 'muuqwear-stripe-webhooks-v2.pdf',
      size: '1.2 MB',
    },
  },
  {
    id: 'c-3',
    author: 'Adeel D.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Lead Full-Stack Engineer',
    timestamp: '2 min ago',
    content: 'Started working on this. Need to review webhook configuration and verify idempotency tokens with MuuqWear mobile checkout flow.',
  },
];

const INITIAL_LINKED_TICKETS: LinkedTicket[] = [
  {
    id: 'lt-1',
    ticketNumber: '#4210',
    title: 'Checkout failing on mobile',
    product: 'MuuqWear',
    status: 'Open',
  },
  {
    id: 'lt-2',
    ticketNumber: '#4205',
    title: 'Payment gateway error',
    product: 'Ilays',
    status: 'In Progress',
  },
];

export const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  taskStatus,
  onTaskStatusChange,
  taskPriority,
  onTaskPriorityChange,
  taskAssignee,
  onTaskAssigneeChange,
  onBackToBoard,
}) => {
  // Local states
  const [estimatePoints, setEstimatePoints] = useState<number>(8);
  const [selectedSprint, setSelectedSprint] = useState<string>('Sprint 23');
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [linkedTickets, setLinkedTickets] = useState<LinkedTicket[]>(INITIAL_LINKED_TICKETS);
  
  // Modals & toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLinkTicketModalOpen, setIsLinkTicketModalOpen] = useState(false);
  const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
  const [timeLoggedTotal, setTimeLoggedTotal] = useState<number>(4.5);
  const [timeLogged7Days, setTimeLogged7Days] = useState<number>(2.5);
  const [newHoursInput, setNewHoursInput] = useState<string>('1.0');
  const [timeLogNote, setTimeLogNote] = useState<string>('');

  // Link Ticket search/selection
  const [availableTickets] = useState<LinkedTicket[]>([
    { id: 'lt-3', ticketNumber: '#4198', title: '3DS authentication loop on safari', product: 'MuuqWear', status: 'Open' },
    { id: 'lt-4', ticketNumber: '#4201', title: 'Webhook signature mismatch on capture', product: 'SomPay', status: 'Pending' },
    { id: 'lt-5', ticketNumber: '#4215', title: 'Missing receipt email trigger', product: 'GaarX', status: 'Open' },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Comment Submission
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() && attachedFiles.length === 0) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: 'Adeel D.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'Lead Full-Stack Engineer',
      timestamp: 'Just now',
      content: newCommentText.trim(),
      attachment: attachedFiles.length > 0 ? { name: attachedFiles[0], size: '420 KB' } : undefined,
    };

    setComments((prev) => [...prev, newComment]);
    setNewCommentText('');
    setAttachedFiles([]);
    showToast('Comment posted successfully');
  };

  // Handle Logging Time
  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(newHoursInput);
    if (isNaN(hours) || hours <= 0) return;

    setTimeLoggedTotal((prev) => parseFloat((prev + hours).toFixed(1)));
    setTimeLogged7Days((prev) => parseFloat((prev + hours).toFixed(1)));
    setIsLogTimeModalOpen(false);
    setNewHoursInput('1.0');
    setTimeLogNote('');
    showToast(`Logged ${hours}h towards ENG-35`);
  };

  // Handle Linking Ticket
  const handleLinkTicket = (ticket: LinkedTicket) => {
    if (linkedTickets.some((t) => t.id === ticket.id)) {
      showToast(`Ticket ${ticket.ticketNumber} is already linked`);
      return;
    }
    setLinkedTickets((prev) => [...prev, ticket]);
    setIsLinkTicketModalOpen(false);
    showToast(`Linked ticket ${ticket.ticketNumber}`);
  };

  // Handle Unlinking Ticket
  const handleUnlinkTicket = (ticketId: string) => {
    setLinkedTickets((prev) => prev.filter((t) => t.id !== ticketId));
    showToast('Unlinked support ticket');
  };

  return (
    <div id="task-detail-view-root" className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="task-detail-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER & BREADCRUMBS                                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1.5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <button
              onClick={onBackToBoard}
              className="hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[#6366F1] font-semibold"
            >
              <span>Engineering</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={onBackToBoard}
              className="hover:text-slate-800 transition-colors cursor-pointer text-[#6366F1] font-semibold"
            >
              Task Board
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
              ENG-35
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
              Payment gateway integration
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
              ✨ Feature
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              MuuqWear
            </span>
          </div>

          {/* Subtext */}
          <p className="text-xs text-[#64748B] font-medium flex items-center gap-2">
            <span>Task ENG-35</span>
            <span className="text-slate-300">•</span>
            <span>Created Nov 12, 2025</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">Updated 2 min ago</span>
          </p>
        </div>

        {/* Right: Status dropdown + Assign dropdown + Priority dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Status dropdown */}
          <div className="relative">
            <select
              id="page-header-task-status-select"
              value={taskStatus}
              onChange={(e) => onTaskStatusChange(e.target.value as any)}
              className="appearance-none pl-6 pr-7 py-1.5 bg-white hover:bg-slate-50 border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
            >
              <option value="In Progress">In Progress</option>
              <option value="To Do">To Do</option>
              <option value="Backlog">Backlog</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
            <span
              className={`absolute left-2.5 top-2.5 w-2 h-2 rounded-full pointer-events-none ${
                taskStatus === 'In Progress'
                  ? 'bg-emerald-500'
                  : taskStatus === 'Review'
                  ? 'bg-purple-500'
                  : taskStatus === 'Done'
                  ? 'bg-blue-500'
                  : taskStatus === 'To Do'
                  ? 'bg-indigo-500'
                  : 'bg-slate-400'
              }`}
            />
          </div>

          {/* Assignee dropdown */}
          <div className="relative flex items-center">
            <select
              id="page-header-task-assignee-select"
              value={taskAssignee}
              onChange={(e) => onTaskAssigneeChange(e.target.value)}
              className="appearance-none pl-7 pr-7 py-1.5 bg-white hover:bg-slate-50 border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
            >
              <option value="Adeel D.">Adeel D.</option>
              <option value="Leila H.">Leila H.</option>
              <option value="Mike C.">Mike C.</option>
              <option value="Sarah K.">Sarah K.</option>
              <option value="Unassigned">Unassigned</option>
            </select>
            <div className="w-4 h-4 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[9px] font-bold absolute left-2 top-2 pointer-events-none">
              {taskAssignee === 'Unassigned' ? '?' : taskAssignee.substring(0, 2)}
            </div>
          </div>

          {/* Priority dropdown */}
          <div className="relative">
            <select
              id="page-header-task-priority-select"
              value={taskPriority}
              onChange={(e) => onTaskPriorityChange(e.target.value as any)}
              className="appearance-none pl-6 pr-7 py-1.5 bg-white hover:bg-slate-50 border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
            >
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <span
              className={`absolute left-2.5 top-2.5 w-2 h-2 rounded-full pointer-events-none ${
                taskPriority === 'Urgent'
                  ? 'bg-rose-600'
                  : taskPriority === 'High'
                  ? 'bg-amber-500'
                  : taskPriority === 'Medium'
                  ? 'bg-blue-500'
                  : 'bg-slate-400'
              }`}
            />
          </div>

          {/* Back button */}
          {onBackToBoard && (
            <button
              onClick={onBackToBoard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer ml-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Board</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TWO-COLUMN LAYOUT (Left 70% / Right 30%)                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN (70% - lg:col-span-7) — Task Content                        */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Description Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6366F1]" />
                <span>Description</span>
              </h2>
              <span className="text-xs font-medium text-slate-400">Markdown format</span>
            </div>

            <p className="text-sm leading-relaxed text-slate-800 font-normal">
              Integrate Stripe payment gateway with MuuqWear checkout flow. Handle 3DS verification, webhook events, and error handling.
            </p>

            {/* Scope details & technical checklist */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Technical Deliverables & Acceptance Criteria
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 w-4 h-4 rounded text-[#6366F1] focus:ring-[#6366F1] border-slate-300 accent-[#6366F1]"
                  />
                  <span className="group-hover:text-slate-900 leading-snug">
                    Implement Stripe PaymentIntents API with automatic confirmation handler for mobile web.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 w-4 h-4 rounded text-[#6366F1] focus:ring-[#6366F1] border-slate-300 accent-[#6366F1]"
                  />
                  <span className="group-hover:text-slate-900 leading-snug">
                    Handle 3DS 2.0 frictionless & challenge fallback modals on iOS and Android viewports.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 w-4 h-4 rounded text-[#6366F1] focus:ring-[#6366F1] border-slate-300 accent-[#6366F1]"
                  />
                  <span className="group-hover:text-slate-900 leading-snug">
                    Validate incoming webhook signatures (`payment_intent.succeeded`, `payment_intent.payment_failed`).
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded text-[#6366F1] focus:ring-[#6366F1] border-slate-300 accent-[#6366F1]"
                  />
                  <span className="group-hover:text-slate-900 leading-snug">
                    Integrate exponential retry backoff with idempotency tokens for dropped webhook transactions.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 2. Activity / Comments Thread */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Activity & Comments
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {comments.length}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Newest at bottom</span>
            </div>

            {/* Comment Stream */}
            <div className="space-y-4">
              {comments.map((comment) => {
                if (comment.isSystem) {
                  return (
                    <div
                      key={comment.id}
                      className="flex items-center gap-3 py-2 px-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium"
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                        <SlidersHorizontal className="w-3 h-3" />
                      </div>
                      <div className="flex-1 flex items-center justify-between gap-2 flex-wrap">
                        <span>
                          <strong className="text-slate-900 font-semibold">{comment.author}</strong> —{' '}
                          {comment.content}
                        </span>
                        <span className="text-slate-400 text-[11px] font-normal">{comment.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-colors shadow-2xs"
                  >
                    {/* Author Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#6366F1] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-slate-200">
                      {comment.avatar ? (
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        comment.author.substring(0, 2).toUpperCase()
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{comment.author}</span>
                          {comment.role && (
                            <span className="text-[11px] font-medium text-slate-400">
                              {comment.role}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                          {comment.timestamp}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line font-normal">
                        {comment.content}
                      </p>

                      {/* Attachment if present */}
                      {comment.attachment && (
                        <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer group">
                          <FileText className="w-3.5 h-3.5 text-[#6366F1]" />
                          <span className="font-medium group-hover:text-[#6366F1] transition-colors">
                            {comment.attachment.name}
                          </span>
                          <span className="text-slate-400 text-[10px]">({comment.attachment.size})</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Comment Composer */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-100 space-y-3">
              <div className="relative rounded-xl border border-slate-200 focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/10 bg-white transition-all overflow-hidden">
                <textarea
                  id="task-comment-textarea"
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none bg-transparent"
                />

                {/* Attached files chips */}
                {attachedFiles.length > 0 && (
                  <div className="px-3.5 pb-2 flex flex-wrap gap-2">
                    {attachedFiles.map((file, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-[#6366F1] text-[11px] font-semibold rounded-md border border-indigo-200"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{file}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                          className="hover:text-indigo-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Composer Footer Actions */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/75 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {/* Attach file button */}
                    <button
                      type="button"
                      id="btn-attach-file"
                      onClick={() => {
                        const filename = prompt('Enter filename to attach (or select from system):', 'stripe-event-payload.json');
                        if (filename) {
                          setAttachedFiles([...attachedFiles, filename]);
                          showToast(`Attached ${filename}`);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Attach File</span>
                    </button>

                    {/* Mention button */}
                    <button
                      type="button"
                      id="btn-mention-user"
                      onClick={() => {
                        setNewCommentText((prev) => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + '@Leila H. ');
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Mention team member"
                    >
                      <AtSign className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mention</span>
                    </button>
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    id="btn-send-comment"
                    disabled={!newCommentText.trim() && attachedFiles.length === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (30% - lg:col-span-3) — Task Details                       */}
        {/* ======================================================================= */}
        <div className="lg:col-span-3 space-y-5">
          {/* 1. Status Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
              Task Attributes
            </h2>

            <div className="space-y-3.5 text-xs">
              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  id="task-detail-status-select"
                  value={taskStatus}
                  onChange={(e) => onTaskStatusChange(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
                >
                  <option value="Backlog">⚪ Backlog</option>
                  <option value="To Do">🔵 To Do</option>
                  <option value="In Progress">🟢 In Progress</option>
                  <option value="Review">🟣 Review</option>
                  <option value="Done">✅ Done</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  id="task-detail-priority-select"
                  value={taskPriority}
                  onChange={(e) => onTaskPriorityChange(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
                >
                  <option value="Urgent">⚡ Urgent</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🔵 Low</option>
                </select>
              </div>

              {/* Estimate points */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Estimate (Story Points)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="task-detail-estimate-input"
                    min={1}
                    max={34}
                    value={estimatePoints}
                    onChange={(e) => setEstimatePoints(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-bold text-slate-800 focus:outline-none transition-colors shadow-2xs"
                  />
                  <span className="text-xs font-medium text-slate-400 shrink-0">pts</span>
                </div>
              </div>

              {/* Sprint */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Sprint
                </label>
                <select
                  id="task-detail-sprint-select"
                  value={selectedSprint}
                  onChange={(e) => setSelectedSprint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
                >
                  <option value="Sprint 23">Sprint 23 (Current: Nov 15–29)</option>
                  <option value="Sprint 24">Sprint 24 (Next: Nov 30–Dec 14)</option>
                  <option value="Sprint 22">Sprint 22 (Completed)</option>
                  <option value="Backlog">Future Backlog</option>
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Assignee
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#6366F1] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt={taskAssignee}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <select
                    id="task-detail-assignee-select"
                    value={taskAssignee}
                    onChange={(e) => onTaskAssigneeChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
                  >
                    <option value="Adeel D.">Adeel D. (Lead)</option>
                    <option value="Leila H.">Leila H. (Backend)</option>
                    <option value="Mike C.">Mike C. (Mobile)</option>
                    <option value="Sarah K.">Sarah K. (DevOps)</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Linked Tickets Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Linked Tickets ({linkedTickets.length})</span>
              </h2>
            </div>

            <div className="space-y-2">
              {linkedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#6366F1]">
                      {ticket.ticketNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        ticket.status === 'Open'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <span>{ticket.status === 'Open' ? '🟡 Open' : '🟢 In Progress'}</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {ticket.title}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>{ticket.product}</span>
                    <button
                      onClick={() => handleUnlinkTicket(ticket.id)}
                      className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 text-[10px] font-medium transition-opacity"
                    >
                      Unlink
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* [+ Link Ticket] button */}
            <button
              type="button"
              id="btn-open-link-ticket-modal"
              onClick={() => setIsLinkTicketModalOpen(true)}
              className="w-full py-2 rounded-xl border border-dashed border-slate-300 hover:border-[#6366F1] hover:bg-indigo-50/40 text-slate-600 hover:text-[#6366F1] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Link Ticket</span>
            </button>
          </div>

          {/* 3. Linked Pull Requests Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Linked Pull Requests</span>
              </h2>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              {/* PR Title & Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span className="font-bold text-slate-900">#42</span>
                  <span className="text-slate-600 font-medium truncate max-w-[130px]">
                    Fix/payment-gateway
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🟢 Open
                </span>
              </div>

              {/* Branch */}
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-mono bg-white p-2 rounded-lg border border-slate-200">
                <GitBranch className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">fix/payment-gateway-integration</span>
              </div>

              {/* Commit info */}
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <GitCommit className="w-3 h-3 text-slate-400" />
                  <span>Last commit:</span>
                  <span className="font-mono text-slate-700 font-bold">a1b2c3d</span>
                </div>
                <p className="text-slate-700 italic pl-4">"Update webhook handlers"</p>
                <div className="text-[10px] text-slate-400 pl-4">Committed 2 min ago</div>
              </div>

              {/* View on GitHub link */}
              <div className="pt-2 border-t border-slate-200/80">
                <a
                  href="https://github.com/kobneti/muuqwear/pull/42"
                  target="_blank"
                  rel="noreferrer"
                  id="link-view-on-github"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Opening GitHub Pull Request #42 in browser...');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 4. Time Logged Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>Time Logged</span>
              </h2>
            </div>

            {/* Time stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block">Total</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {timeLoggedTotal} hours
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block">Last 7 days</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {timeLogged7Days} hours
                </span>
              </div>
            </div>

            {/* Visual progress vs estimate */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Progress of 8h estimate</span>
                <span className="font-bold text-slate-800">
                  {Math.round((timeLoggedTotal / 8) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#6366F1] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (timeLoggedTotal / 8) * 100)}%` }}
                />
              </div>
            </div>

            {/* [+ Log Time] button */}
            <button
              type="button"
              id="btn-open-log-time-modal"
              onClick={() => setIsLogTimeModalOpen(true)}
              className="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>+ Log Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: LINK TICKET                                                        */}
      {/* ========================================================================= */}
      {isLinkTicketModalOpen && (
        <div
          id="modal-link-ticket-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsLinkTicketModalOpen(false)}
        >
          <div
            id="modal-link-ticket-container"
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#6366F1]" />
                <span>Link Support Ticket</span>
              </h3>
              <button
                onClick={() => setIsLinkTicketModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select an open support ticket to link with engineering task <strong>ENG-35</strong>:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {availableTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => handleLinkTicket(ticket)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#6366F1] hover:bg-indigo-50/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#6366F1]">
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600">
                        {ticket.product}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{ticket.title}</p>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 hover:text-[#6366F1]" />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsLinkTicketModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LOG TIME                                                           */}
      {/* ========================================================================= */}
      {isLogTimeModalOpen && (
        <div
          id="modal-log-time-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsLogTimeModalOpen(false)}
        >
          <div
            id="modal-log-time-container"
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6366F1]" />
                <span>Log Working Hours</span>
              </h3>
              <button
                onClick={() => setIsLogTimeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogTime} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Time Spent (hours) *
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="24"
                  required
                  value={newHoursInput}
                  onChange={(e) => setNewHoursInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs text-slate-800 font-bold focus:outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3.5 py-2 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs text-slate-800 focus:outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Work Description / Note
                </label>
                <textarea
                  rows={2}
                  value={timeLogNote}
                  onChange={(e) => setTimeLogNote(e.target.value)}
                  placeholder="e.g., Reviewed Stripe 3DS webhook documentation and added retry handler"
                  className="w-full px-3.5 py-2 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs text-slate-800 focus:outline-none resize-none shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogTimeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-xl text-xs shadow-xs"
                >
                  Save Time Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
