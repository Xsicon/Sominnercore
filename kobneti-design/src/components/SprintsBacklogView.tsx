import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  MoveRight,
  GripVertical,
  Check,
  ChevronRight,
  Sparkles,
  Bug,
  ClipboardList,
  AlertCircle,
  TrendingUp,
  X,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';

export type TaskType = 'Feature' | 'Bug' | 'Chore';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface BacklogTask {
  id: string;
  code: string;
  title: string;
  type: TaskType;
  priority: TaskPriority;
  estimate: string;
  estimatePoints: number;
  product: string;
  assignee: string;
  sprint?: string;
}

export interface SprintSummary {
  id: string;
  name: string;
  period: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  tasksDone: number;
  totalTasks: number;
  pointsCompleted: number;
  totalPoints: number;
  goal?: string;
}

const INITIAL_BACKLOG_TASKS: BacklogTask[] = [
  {
    id: 'task-55',
    code: 'ENG-55',
    title: 'Refactor notification service',
    type: 'Chore',
    priority: 'Low',
    estimate: '5 pts',
    estimatePoints: 5,
    product: 'MuuqWear',
    assignee: 'Unassigned',
  },
  {
    id: 'task-54',
    code: 'ENG-54',
    title: 'Update API rate limiting',
    type: 'Feature',
    priority: 'Medium',
    estimate: '8 pts',
    estimatePoints: 8,
    product: 'GaarX',
    assignee: 'Leila H.',
  },
  {
    id: 'task-53',
    code: 'ENG-53',
    title: 'Fix CORS issues on mobile',
    type: 'Bug',
    priority: 'High',
    estimate: '3 pts',
    estimatePoints: 3,
    product: 'MuuqWear',
    assignee: 'Mike C.',
  },
  {
    id: 'task-52',
    code: 'ENG-52',
    title: 'Database indexing optimization',
    type: 'Chore',
    priority: 'Medium',
    estimate: '13 pts',
    estimatePoints: 13,
    product: 'SomPay',
    assignee: 'Unassigned',
  },
  {
    id: 'task-51',
    code: 'ENG-51',
    title: 'User profile UI redesign',
    type: 'Feature',
    priority: 'Low',
    estimate: '8 pts',
    estimatePoints: 8,
    product: 'GaarX',
    assignee: 'Sarah K.',
  },
  {
    id: 'task-50',
    code: 'ENG-50',
    title: 'Payment webhook retry logic',
    type: 'Bug',
    priority: 'High',
    estimate: '5 pts',
    estimatePoints: 5,
    product: 'Salguri',
    assignee: 'Adeel D.',
  },
  {
    id: 'task-49',
    code: 'ENG-49',
    title: 'Email template localization',
    type: 'Chore',
    priority: 'Low',
    estimate: '3 pts',
    estimatePoints: 3,
    product: 'Ilays',
    assignee: 'Unassigned',
  },
  {
    id: 'task-48',
    code: 'ENG-48',
    title: 'Mobile app deep linking',
    type: 'Feature',
    priority: 'Medium',
    estimate: '8 pts',
    estimatePoints: 8,
    product: 'SomPay',
    assignee: 'Alex P.',
  },
  {
    id: 'task-47',
    code: 'ENG-47',
    title: 'Admin dashboard widgets',
    type: 'Feature',
    priority: 'Low',
    estimate: '5 pts',
    estimatePoints: 5,
    product: 'Dhaxal',
    assignee: 'Unassigned',
  },
  {
    id: 'task-46',
    code: 'ENG-46',
    title: 'Security audit fixes',
    type: 'Bug',
    priority: 'High',
    estimate: '13 pts',
    estimatePoints: 13,
    product: 'All',
    assignee: 'Adeel D.',
  },
  {
    id: 'task-45',
    code: 'ENG-45',
    title: 'Logging infrastructure',
    type: 'Chore',
    priority: 'Medium',
    estimate: '5 pts',
    estimatePoints: 5,
    product: 'GaarX',
    assignee: 'Leila H.',
  },
  {
    id: 'task-44',
    code: 'ENG-44',
    title: '3DS verification handler',
    type: 'Feature',
    priority: 'High',
    estimate: '8 pts',
    estimatePoints: 8,
    product: 'MuuqWear',
    assignee: 'Mike C.',
  },
  {
    id: 'task-43',
    code: 'ENG-43',
    title: 'Automated invoice PDF generation',
    type: 'Feature',
    priority: 'Medium',
    estimate: '5 pts',
    estimatePoints: 5,
    product: 'SomPay',
    assignee: 'Leila H.',
  },
  {
    id: 'task-42',
    code: 'ENG-42',
    title: 'Redis cluster cache invalidation',
    type: 'Chore',
    priority: 'High',
    estimate: '8 pts',
    estimatePoints: 8,
    product: 'GaarX',
    assignee: 'Adeel D.',
  },
  {
    id: 'task-41',
    code: 'ENG-41',
    title: 'Mobile push notification throttle',
    type: 'Bug',
    priority: 'Low',
    estimate: '3 pts',
    estimatePoints: 3,
    product: 'MuuqWear',
    assignee: 'Mike C.',
  },
  {
    id: 'task-40',
    code: 'ENG-40',
    title: 'CSV Export for Transaction Ledger',
    type: 'Feature',
    priority: 'Low',
    estimate: '5 pts',
    estimatePoints: 5,
    product: 'SomPay',
    assignee: 'Sarah K.',
  },
  {
    id: 'task-39',
    code: 'ENG-39',
    title: 'OAuth session refresh token bug',
    type: 'Bug',
    priority: 'High',
    estimate: '5 pts',
    estimatePoints: 5,
    product: 'All',
    assignee: 'Adeel D.',
  },
  {
    id: 'task-38',
    code: 'ENG-38',
    title: 'Dark mode theme tokens consistency',
    type: 'Chore',
    priority: 'Low',
    estimate: '2 pts',
    estimatePoints: 2,
    product: 'Ilays',
    assignee: 'Unassigned',
  },
];

const PAST_SPRINTS: SprintSummary[] = [
  {
    id: 'sprint-22',
    name: 'Sprint 22',
    period: 'Nov 1–14, 2025',
    status: 'Completed',
    tasksDone: 22,
    totalTasks: 22,
    pointsCompleted: 48,
    totalPoints: 48,
    goal: 'Ship multi-currency payment checkout and tax calculations.',
  },
  {
    id: 'sprint-21',
    name: 'Sprint 21',
    period: 'Oct 15–31, 2025',
    status: 'Completed',
    tasksDone: 18,
    totalTasks: 18,
    pointsCompleted: 42,
    totalPoints: 42,
    goal: 'GaarX fleet tracking websocket updates and driver dispatch.',
  },
  {
    id: 'sprint-20',
    name: 'Sprint 20',
    period: 'Oct 1–14, 2025',
    status: 'Completed',
    tasksDone: 20,
    totalTasks: 20,
    pointsCompleted: 45,
    totalPoints: 45,
    goal: 'SomPay merchant onboarding workflow and KYC document upload.',
  },
];

const TEAM_AVATARS = [
  { name: 'Adeel D.', initials: 'AD', bg: 'bg-indigo-600', text: 'text-white' },
  { name: 'Leila H.', initials: 'LH', bg: 'bg-purple-600', text: 'text-white' },
  { name: 'Mike C.', initials: 'MC', bg: 'bg-blue-600', text: 'text-white' },
  { name: 'Sarah K.', initials: 'SK', bg: 'bg-emerald-600', text: 'text-white' },
  { name: 'Alex P.', initials: 'AP', bg: 'bg-amber-600', text: 'text-white' },
];

interface SprintsBacklogViewProps {
  onNewSprintModal?: () => void;
}

export const SprintsBacklogView: React.FC<SprintsBacklogViewProps> = () => {
  const [viewScope, setViewScope] = useState<'active' | 'all'>('active');
  const [tasks, setTasks] = useState<BacklogTask[]>(INITIAL_BACKLOG_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isNewSprintModalOpen, setIsNewSprintModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSprintDetails, setSelectedSprintDetails] = useState<SprintSummary | null>(null);

  // New Sprint Form State
  const [newSprintName, setNewSprintName] = useState('Sprint 24');
  const [newSprintPeriod, setNewSprintPeriod] = useState('Nov 30 – Dec 14, 2025');
  const [newSprintGoal, setNewSprintGoal] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Move task to sprint
  const handleMoveToSprint = (taskId: string, targetSprint: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (targetSprint === 'backlog') {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, sprint: undefined } : t))
      );
      showToast(`Moved ${task.code} to Backlog`);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, sprint: targetSprint } : t))
      );
      showToast(`Moved ${task.code} to ${targetSprint}`);
    }
  };

  // Drag & Reorder (Simulated simple swap/move)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...tasks];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setTasks(updated);
    setDraggedIndex(null);
    showToast(`Reordered ${moved.code} priority`);
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    if (productFilter !== 'all' && t.product.toLowerCase() !== productFilter.toLowerCase()) {
      return false;
    }
    if (typeFilter !== 'all' && t.type.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    if (priorityFilter !== 'all' && t.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.code.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handle New Sprint Form Submit
  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewSprintModalOpen(false);
    showToast(`Created ${newSprintName} successfully!`);
  };

  // Type Badges & Icons
  const getTypeBadge = (type: TaskType) => {
    if (type === 'Bug') {
      return (
        <span
          id="badge-type-bug"
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-[#DC2626] border border-rose-200"
        >
          <span className="text-[13px]">🐛</span>
          <span>Bug</span>
        </span>
      );
    }
    if (type === 'Feature') {
      return (
        <span
          id="badge-type-feature"
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200"
        >
          <span className="text-[13px]">✨</span>
          <span>Feature</span>
        </span>
      );
    }
    return (
      <span
        id="badge-type-chore"
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
      >
        <span className="text-[13px]">📝</span>
        <span>Chore</span>
      </span>
    );
  };

  // Priority Badges
  const getPriorityBadge = (priority: TaskPriority) => {
    if (priority === 'High') {
      return (
        <span
          id="badge-priority-high"
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-[#DC2626] border border-rose-200"
        >
          <span>🔴</span>
          <span>High</span>
        </span>
      );
    }
    if (priority === 'Medium') {
      return (
        <span
          id="badge-priority-medium"
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#B95F00] border border-amber-200"
        >
          <span>🟠</span>
          <span>Medium</span>
        </span>
      );
    }
    return (
      <span
        id="badge-priority-low"
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#3B82F6] border border-blue-200"
      >
        <span>🟢</span>
        <span>Low</span>
      </span>
    );
  };

  return (
    <div
      id="sprints-backlog-view-root"
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
            Sprints & Backlog
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B] mt-1">
            Plan and manage engineering sprints.
          </p>
        </div>

        {/* Right Controls: Sprint dropdown + Product filter + "+ New Sprint" */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sprint Dropdown */}
          <div className="relative">
            <select
              id="page-sprint-filter-select"
              value={newSprintName === 'Sprint 23' ? 'Sprint 23' : 'Sprint 23'}
              onChange={() => {}}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#6366F1] cursor-pointer shadow-2xs"
            >
              <option value="Sprint 23">Sprint 23 (Current)</option>
              <option value="Sprint 24">Sprint 24 (Upcoming)</option>
              <option value="Sprint 22">Sprint 22 (Past)</option>
              <option value="Sprint 21">Sprint 21 (Past)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Product Filter */}
          <div className="relative">
            <select
              id="page-product-filter-select"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#6366F1] cursor-pointer shadow-2xs"
            >
              <option value="all">All Products</option>
              <option value="muuqwear">MuuqWear</option>
              <option value="gaarx">GaarX</option>
              <option value="sompay">SomPay</option>
              <option value="salguri">Salguri</option>
              <option value="ilays">Ilays</option>
              <option value="dhaxal">Dhaxal</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* + New Sprint (Primary filled #6366F1) */}
          <button
            id="btn-new-sprint-header"
            onClick={() => setIsNewSprintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ New Sprint</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: ACTIVE SPRINT OVERVIEW (Full Width Card)                           */}
      {/* ========================================================================= */}
      <div
        id="card-active-sprint-overview"
        className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-5"
      >
        {/* Top Header of Sprint Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                Active Sprint
              </span>
              <h2 className="text-lg md:text-xl font-bold text-[#0F172A]">
                Sprint 23 — Nov 15 – Nov 29, 2025
              </h2>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <span className="font-semibold text-slate-800">Sprint Goal:</span>
              <span className="italic text-slate-600">
                "Complete payment gateway integration and 3DS verification for MuuqWear."
              </span>
            </p>
          </div>

          {/* Team Members Avatar Stack */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">
              Team:
            </span>
            <div className="flex items-center -space-x-2">
              {TEAM_AVATARS.map((m, idx) => (
                <div
                  key={idx}
                  title={m.name}
                  className={`w-8 h-8 rounded-full border-2 border-white ${m.bg} ${m.text} flex items-center justify-center text-[10px] font-bold shadow-2xs`}
                >
                  {m.initials}
                </div>
              ))}
              <div
                title="Ibrahim M., Lisa T."
                className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shadow-2xs"
              >
                +2
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar & Countdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A] text-sm">65% Complete</span>
              <span className="text-slate-400 font-medium">·</span>
              <span className="text-slate-600 font-medium">14 of 24 tasks completed</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#6366F1] bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              <Clock className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>8 days remaining</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] rounded-full transition-all duration-500"
              style={{ width: '65%' }}
            />
          </div>
        </div>

        {/* Stats: 4 Compact Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </span>
            <span className="text-2xl font-bold text-[#0F172A] mt-1">24</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#6366F1] uppercase tracking-wider">
              Completed
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-[#0F172A]">14</span>
              <span className="text-xs font-semibold text-emerald-600">58%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-wider">
              In Progress
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-[#0F172A]">8</span>
              <span className="text-xs font-semibold text-blue-600">33%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#B95F00] uppercase tracking-wider">
              Remaining Points
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-[#0F172A]">32 pts</span>
              <span className="text-xs text-slate-500">/ 80 total</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: BACKLOG (Full Width Card)                                          */}
      {/* ========================================================================= */}
      <div
        id="card-backlog-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        {/* Card Header */}
        <div className="p-4 md:p-5 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-[#0F172A]">Backlog (18)</h3>
          </div>

          {/* Filter / Search Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[220px] flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-backlog-input"
                type="text"
                placeholder="Search backlog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
              />
            </div>

            {/* Product Filter */}
            <div className="relative">
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Products</option>
                <option value="muuqwear">MuuqWear</option>
                <option value="gaarx">GaarX</option>
                <option value="sompay">SomPay</option>
                <option value="salguri">Salguri</option>
                <option value="ilays">Ilays</option>
                <option value="dhaxal">Dhaxal</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="feature">✨ Feature</option>
                <option value="bug">🐛 Bug</option>
                <option value="chore">📝 Chore</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Backlog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3 w-10 text-center"></th>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Estimate</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Assignee</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTasks.map((task, idx) => {
                return (
                  <tr
                    key={task.id}
                    id={`backlog-row-${task.code}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-default"
                  >
                    {/* Drag Handle */}
                    <td className="py-3 px-3 text-center text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4 mx-auto" />
                    </td>

                    {/* # Code */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 group-hover:bg-indigo-50 group-hover:text-[#6366F1] px-2 py-0.5 rounded border border-slate-200 transition-colors">
                        {task.code}
                      </span>
                    </td>

                    {/* Task Title */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <span className="hover:text-[#6366F1] cursor-pointer">
                        {task.title}
                      </span>
                      {task.sprint && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                          {task.sprint}
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getTypeBadge(task.type)}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getPriorityBadge(task.priority)}
                    </td>

                    {/* Estimate */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-slate-700 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {task.estimate}
                      </span>
                    </td>

                    {/* Product */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {task.product}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {task.assignee === 'Unassigned' ? (
                        <span className="text-slate-400 italic">Unassigned</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[9px] text-slate-700">
                            {task.assignee.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900">{task.assignee}</span>
                        </div>
                      )}
                    </td>

                    {/* Move to Sprint Action (Ghost Link) */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end">
                        <div className="relative group/sprintSelect inline-flex items-center">
                          <select
                            id={`select-move-sprint-${task.code}`}
                            value={task.sprint || 'backlog'}
                            onChange={(e) => handleMoveToSprint(task.id, e.target.value)}
                            className="appearance-none pl-2 pr-5 py-1 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] hover:underline bg-transparent border-0 cursor-pointer focus:outline-none transition-colors"
                          >
                            <option value="backlog">Move to Sprint</option>
                            <option value="Sprint 23">Sprint 23 (Current)</option>
                            <option value="Sprint 24">Sprint 24 (Next)</option>
                            <option value="Sprint 25">Sprint 25</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-[#6366F1] pointer-events-none -ml-3" />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-sm">No backlog tasks match filters</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try clearing your search query or selecting "All Products"
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: PAST SPRINTS (Horizontal cards, Attio-style)                       */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
              Past Sprints
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              (Completed cycles)
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            3 previous sprints archived
          </span>
        </div>

        {/* 3 Horizontal Cards (Attio-style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAST_SPRINTS.map((sprint) => (
            <div
              key={sprint.id}
              id={`card-past-${sprint.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      {sprint.name}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      — {sprint.period}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Completed</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 font-medium text-[11px]">Tasks</span>
                  <p className="font-bold text-slate-900">{sprint.tasksDone} tasks</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 font-medium text-[11px]">Points</span>
                  <p className="font-bold text-[#6366F1]">{sprint.pointsCompleted} pts</p>
                </div>
              </div>

              <button
                id={`btn-view-details-${sprint.id}`}
                onClick={() => {
                  setSelectedSprintDetails(sprint);
                  setIsDetailsModalOpen(true);
                }}
                className="w-full py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer text-center"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: NEW SPRINT                                                         */}
      {/* ========================================================================= */}
      {isNewSprintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create New Sprint</h3>
                <p className="text-xs text-slate-500">Plan next engineering milestone.</p>
              </div>
              <button
                onClick={() => setIsNewSprintModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSprint} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sprint Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sprint Dates *
                </label>
                <input
                  type="text"
                  required
                  value={newSprintPeriod}
                  onChange={(e) => setNewSprintPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sprint Goal
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Deliver core merchant dashboard and KYC verification..."
                  value={newSprintGoal}
                  onChange={(e) => setNewSprintGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewSprintModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SPRINT DETAILS                                                     */}
      {/* ========================================================================= */}
      {isDetailsModalOpen && selectedSprintDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedSprintDetails.name} Summary
                </h3>
                <p className="text-xs text-slate-500">{selectedSprintDetails.period}</p>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                <span className="font-bold text-[#6366F1] text-[11px] uppercase tracking-wider">
                  Completed Goal
                </span>
                <p className="text-slate-800 font-medium italic">
                  "{selectedSprintDetails.goal}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold block text-[11px]">Tasks Done:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedSprintDetails.tasksDone} / {selectedSprintDetails.totalTasks}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold block text-[11px]">Velocity:</span>
                  <span className="font-bold text-[#6366F1] text-sm">
                    {selectedSprintDetails.pointsCompleted} story points
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
