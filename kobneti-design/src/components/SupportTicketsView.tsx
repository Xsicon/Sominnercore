import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  ArrowLeft,
  X,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { TicketDetailView } from './TicketDetailView';

export interface SupportTicketItem {
  id: string;
  number: string;
  subject: string;
  product: 'MuuqWear' | 'GaarX' | 'Salguri' | 'SomPay' | 'Dhaxal' | 'Ilays' | string;
  requester: string;
  status: 'New' | 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  assignee: {
    name: string;
    initials: string;
  };
  sla: {
    text: string;
    type: 'normal' | 'warning' | 'breached';
  };
  updated: string;
}

interface SupportTicketsViewProps {
  onNewTicket?: () => void;
  initialTicketId?: string | null;
}

export const SupportTicketsView: React.FC<SupportTicketsViewProps> = ({
  onNewTicket,
}) => {
  // Navigation / View mode: 'list' | 'detail'
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Quick filter tabs (Row 1)
  type QuickFilter = 'all' | 'assigned_to_me' | 'unassigned' | 'open' | 'resolved' | 'sla_breached';
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter>('all');

  // Filter Bar state (Row 2)
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New ticket modal
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newProduct, setNewProduct] = useState('MuuqWear');
  const [newRequester, setNewRequester] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newAssignee, setNewAssignee] = useState('Adeel D.');

  // Master ticket data strictly matching specifications
  const [tickets, setTickets] = useState<SupportTicketItem[]>([
    {
      id: '4210',
      number: '#4210',
      subject: 'Checkout failing on mobile',
      product: 'MuuqWear',
      requester: 'Sarah K.',
      status: 'Open',
      priority: 'High',
      assignee: { name: 'Adeel D.', initials: 'AD' },
      sla: { text: '2.4hrs left', type: 'normal' },
      updated: '2 min ago',
    },
    {
      id: '4209',
      number: '#4209',
      subject: 'API timeout on GaarX',
      product: 'GaarX',
      requester: 'Mike C.',
      status: 'In Progress',
      priority: 'Medium',
      assignee: { name: 'Leila H.', initials: 'LH' },
      sla: { text: '1.2hrs left', type: 'warning' },
      updated: '14 min ago',
    },
    {
      id: '4208',
      number: '#4208',
      subject: 'Invoice generation failing',
      product: 'Salguri',
      requester: 'John D.',
      status: 'New',
      priority: 'Medium',
      assignee: { name: 'Unassigned', initials: 'UN' },
      sla: { text: '3.8hrs left', type: 'normal' },
      updated: '1 hour ago',
    },
    {
      id: '4207',
      number: '#4207',
      subject: 'User role permissions bug',
      product: 'SomPay',
      requester: 'Emma W.',
      status: 'Open',
      priority: 'High',
      assignee: { name: 'Ibrahim M.', initials: 'IM' },
      sla: { text: 'Breached', type: 'breached' },
      updated: '2 hours ago',
    },
    {
      id: '4206',
      number: '#4206',
      subject: 'Account recovery not working',
      product: 'Dhaxal',
      requester: 'Alex P.',
      status: 'New',
      priority: 'Low',
      assignee: { name: 'Unassigned', initials: 'UN' },
      sla: { text: '5.2hrs left', type: 'normal' },
      updated: '3 hours ago',
    },
    {
      id: '4205',
      number: '#4205',
      subject: 'Payment gateway error',
      product: 'Ilays',
      requester: 'Lisa A.',
      status: 'In Progress',
      priority: 'High',
      assignee: { name: 'Adeel D.', initials: 'AD' },
      sla: { text: '0.8hrs left', type: 'warning' },
      updated: '4 hours ago',
    },
    {
      id: '4204',
      number: '#4204',
      subject: 'Password reset flow broken',
      product: 'MuuqWear',
      requester: 'James B.',
      status: 'Open',
      priority: 'Medium',
      assignee: { name: 'Sarah K.', initials: 'SK' },
      sla: { text: '3.1hrs left', type: 'normal' },
      updated: '5 hours ago',
    },
    {
      id: '4203',
      number: '#4203',
      subject: 'Missing order confirmation',
      product: 'Salguri',
      requester: 'Chris R.',
      status: 'In Progress',
      priority: 'Low',
      assignee: { name: 'Leila H.', initials: 'LH' },
      sla: { text: '6.4hrs left', type: 'normal' },
      updated: '6 hours ago',
    },
    {
      id: '4202',
      number: '#4202',
      subject: 'Dashboard loading slowly',
      product: 'GaarX',
      requester: 'Maria G.',
      status: 'Open',
      priority: 'Medium',
      assignee: { name: 'Unassigned', initials: 'UN' },
      sla: { text: '2.9hrs left', type: 'normal' },
      updated: '7 hours ago',
    },
    {
      id: '4201',
      number: '#4201',
      subject: 'Cannot update shipping address',
      product: 'MuuqWear',
      requester: 'Tom S.',
      status: 'Open',
      priority: 'Low',
      assignee: { name: 'Adeel D.', initials: 'AD' },
      sla: { text: '4.7hrs left', type: 'normal' },
      updated: '8 hours ago',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getProductDotColor = (product: string) => {
    switch (product) {
      case 'MuuqWear':
        return '#10B981';
      case 'GaarX':
        return '#3B82F6';
      case 'Salguri':
        return '#6366F1';
      case 'SomPay':
        return '#F59E0B';
      case 'Dhaxal':
        return '#8B5CF6';
      case 'Ilays':
        return '#06B6D4';
      default:
        return '#64748B';
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    productFilter !== 'All' ||
    priorityFilter !== 'All' ||
    statusFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setProductFilter('All');
    setPriorityFilter('All');
    setStatusFilter('All');
  };

  // Filter pipeline
  const filteredTickets = tickets.filter((t) => {
    // Quick filter evaluation
    if (activeQuickFilter === 'assigned_to_me' && t.assignee.name !== 'Adeel D.') return false;
    if (activeQuickFilter === 'unassigned' && t.assignee.name !== 'Unassigned') return false;
    if (activeQuickFilter === 'open' && t.status !== 'Open' && t.status !== 'New') return false;
    if (activeQuickFilter === 'resolved' && t.status !== 'Resolved') return false;
    if (activeQuickFilter === 'sla_breached' && t.sla.type !== 'breached') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.number.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q) ||
        t.requester.toLowerCase().includes(q) ||
        t.assignee.name.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Dropdown filters
    if (productFilter !== 'All' && t.product !== productFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;

    return true;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const nextId = `${4211 + Math.floor(Math.random() * 20)}`;
    const newTicket: SupportTicketItem = {
      id: nextId,
      number: `#${nextId}`,
      subject: newSubject.trim(),
      product: newProduct,
      requester: newRequester.trim() || 'Valued Customer',
      status: 'New',
      priority: newPriority,
      assignee: {
        name: newAssignee,
        initials: newAssignee
          .split(' ')
          .map((n) => n[0])
          .join(''),
      },
      sla: { text: '4.0hrs left', type: 'normal' },
      updated: 'Just now',
    };

    setTickets([newTicket, ...tickets]);
    setIsNewTicketModalOpen(false);
    setNewSubject('');
    setNewRequester('');
    showToast(`Created ticket #${nextId}`);
  };

  // If viewing details of a ticket (e.g. #4210)
  if (selectedTicketId) {
    return (
      <div className="w-full flex-1 flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTicketId(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[13px] font-medium text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] transition-colors cursor-pointer border border-[#E2E8F0]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all tickets</span>
          </button>
        </div>
        <TicketDetailView
          status="Open"
          onStatusChange={() => {}}
          assignee="Adeel D."
          onAssigneeChange={() => {}}
          priority="High"
          onPriorityChange={() => {}}
          onBackToTickets={() => setSelectedTicketId(null)}
        />
      </div>
    );
  }

  return (
    <div
      id="support-tickets-page"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-12 font-sans selection:bg-[#6366F1]/15"
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          id="toast-support-ticket-feedback"
          className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-[7px] shadow-lg border border-slate-700/60 flex items-center gap-2.5 text-[13px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <Check className="w-4 h-4 text-[#12B76A]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER: Left: Title & Subtext | Right: Single + New Ticket CTA        */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-semibold text-[#1A1A1A] tracking-[-0.015em] leading-tight">
            Support Tickets
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Manage and track all customer support requests.
          </p>
        </div>

        {/* Right side: Single + New Ticket button */}
        <div>
          <button
            id="btn-page-new-ticket"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="h-9 px-4 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[13px] font-medium flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer active:scale-98 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ New Ticket</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: Quick Filters (Horizontal scrollable pills, Attio-style)           */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* All (12) - Active state */}
        <button
          id="filter-chip-all"
          onClick={() => setActiveQuickFilter('all')}
          className={`h-8 px-3.5 rounded-[7px] text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeQuickFilter === 'all'
              ? 'bg-[#6366F1] text-white shadow-2xs'
              : 'bg-white text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] border border-[#E2E8F0]'
          }`}
        >
          All (12)
        </button>

        {/* Assigned to Me (8) */}
        <button
          id="filter-chip-assigned-me"
          onClick={() => setActiveQuickFilter('assigned_to_me')}
          className={`h-8 px-3.5 rounded-[7px] text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeQuickFilter === 'assigned_to_me'
              ? 'bg-[#6366F1] text-white shadow-2xs'
              : 'bg-white text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] border border-[#E2E8F0]'
          }`}
        >
          Assigned to Me (8)
        </button>

        {/* Unassigned (5) */}
        <button
          id="filter-chip-unassigned"
          onClick={() => setActiveQuickFilter('unassigned')}
          className={`h-8 px-3.5 rounded-[7px] text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeQuickFilter === 'unassigned'
              ? 'bg-[#6366F1] text-white shadow-2xs'
              : 'bg-white text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] border border-[#E2E8F0]'
          }`}
        >
          Unassigned (5)
        </button>

        {/* Open (34) */}
        <button
          id="filter-chip-open"
          onClick={() => setActiveQuickFilter('open')}
          className={`h-8 px-3.5 rounded-[7px] text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeQuickFilter === 'open'
              ? 'bg-[#6366F1] text-white shadow-2xs'
              : 'bg-white text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] border border-[#E2E8F0]'
          }`}
        >
          Open (34)
        </button>

        {/* Resolved (89) */}
        <button
          id="filter-chip-resolved"
          onClick={() => setActiveQuickFilter('resolved')}
          className={`h-8 px-3.5 rounded-[7px] text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeQuickFilter === 'resolved'
              ? 'bg-[#6366F1] text-white shadow-2xs'
              : 'bg-white text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] border border-[#E2E8F0]'
          }`}
        >
          Resolved (89)
        </button>

        {/* SLA Breached (7) - Tertiary tint */}
        <button
          id="filter-chip-sla-breached"
          onClick={() => setActiveQuickFilter('sla_breached')}
          className={`h-8 px-3.5 rounded-[7px] text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeQuickFilter === 'sla_breached'
              ? 'bg-[#B95F00] text-white shadow-2xs'
              : 'bg-[#FFFBEB] text-[#B95F00] hover:bg-[#FEF3C7] border border-[#FDE68A]'
          }`}
        >
          SLA Breached (7)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: Filter Bar (Compact, inline)                                       */}
      {/* ========================================================================= */}
      <div
        id="support-ticket-filters-bar"
        className="flex flex-wrap items-center gap-2 pt-1"
      >
        {/* Search: "Search tickets..." */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            id="input-search-tickets"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="h-8 pl-8 pr-3 bg-white border border-[#E2E8F0] rounded-[7px] text-[13px] text-[#1A1A1A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] w-44 sm:w-56 transition-all"
          />
        </div>

        {/* Dropdown: "All Products ▼" */}
        <div className="relative">
          <select
            id="select-filter-product"
            aria-label="Filter tickets by product"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="h-8 pl-2.5 pr-7 bg-white border border-[#E2E8F0] rounded-[7px] text-[13px] font-[500] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none"
          >
            <option value="All">All Products</option>
            <option value="MuuqWear">MuuqWear</option>
            <option value="GaarX">GaarX</option>
            <option value="Salguri">Salguri</option>
            <option value="SomPay">SomPay</option>
            <option value="Dhaxal">Dhaxal</option>
            <option value="Ilays">Ilays</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: "All Priorities ▼" */}
        <div className="relative">
          <select
            id="select-filter-priority"
            aria-label="Filter tickets by priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-8 pl-2.5 pr-7 bg-white border border-[#E2E8F0] rounded-[7px] text-[13px] font-[500] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: "All Statuses ▼" */}
        <div className="relative">
          <select
            id="select-filter-status"
            aria-label="Filter tickets by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 pl-2.5 pr-7 bg-white border border-[#E2E8F0] rounded-[7px] text-[13px] font-[500] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Clear filters link (muted grey, small) */}
        {hasActiveFilters && (
          <button
            id="btn-clear-ticket-filters"
            onClick={clearFilters}
            className="text-[13px] font-[500] text-[#64748B] hover:text-[#6366F1] hover:underline flex items-center gap-1 cursor-pointer pl-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: Ticket Table (Attio-style)                                         */}
      {/* ========================================================================= */}
      <div
        id="ticket-registry-card"
        className="bg-[#FFFFFF] rounded-[12px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(99,102,241,0.05)] overflow-hidden"
      >
        {/* Table Header: Left: "Open Tickets" | Right: "Showing 1-10 of 247 tickets" */}
        <div className="p-4 sm:px-5 sm:py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.015em]">
            Open Tickets
          </h2>
          <div className="text-[14px] font-[500] text-[#64748B]">
            Showing 1-10 of 247 tickets
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] font-[500] text-[13px]">
                <th className="py-3 px-4 w-[75px]">#</th>
                <th className="py-3 px-4 min-w-[220px]">Subject</th>
                <th className="py-3 px-4 w-[125px]">Product</th>
                <th className="py-3 px-4 w-[125px]">Requester</th>
                <th className="py-3 px-4 w-[115px]">Status</th>
                <th className="py-3 px-4 w-[100px]">Priority</th>
                <th className="py-3 px-4 w-[140px]">Assignee</th>
                <th className="py-3 px-4 w-[120px]">SLA</th>
                <th className="py-3 px-4 w-[110px]">Updated</th>
                <th className="py-3 px-4 w-[70px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-9 h-9 rounded-full bg-[#F8F9FA] border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                        <Check className="w-4 h-4 text-[#12B76A]" />
                      </div>
                      <div className="text-[14px] font-semibold text-[#1A1A1A]">
                        No matching tickets
                      </div>
                      <p className="text-[13px] text-[#64748B] max-w-xs">
                        No support tickets matched your current filter selection.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    id={`ticket-row-${ticket.id}`}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className="hover:bg-[#F8F9FA] transition-colors duration-150 cursor-pointer group"
                  >
                    {/* #: Semi-bold, clickable (Primary underline on hover) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#1A1A1A] group-hover:text-[#6366F1] group-hover:underline transition-colors">
                        {ticket.number}
                      </span>
                    </td>

                    {/* Subject: Regular weight, near-black */}
                    <td className="py-3 px-4 font-normal text-[#1A1A1A]">
                      {ticket.subject}
                    </td>

                    {/* Product: Small muted grey text with colored dot */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] font-[500]">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: getProductDotColor(ticket.product) }}
                        />
                        <span>{ticket.product}</span>
                      </div>
                    </td>

                    {/* Requester: Muted grey */}
                    <td className="py-3 px-4 whitespace-nowrap text-[#64748B] font-[500]">
                      {ticket.requester}
                    </td>

                    {/* Status: Small pill — New (Primary), Open (Secondary), In Progress (Tertiary), Resolved (Neutral) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {ticket.status === 'New' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#EEF2FF] text-[#6366F1] border border-[#E0E7FF]">
                          New
                        </span>
                      )}
                      {ticket.status === 'Open' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]/60">
                          Open
                        </span>
                      )}
                      {ticket.status === 'In Progress' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#FFFBEB] text-[#B95F00] border border-[#FDE68A]/60">
                          In Progress
                        </span>
                      )}
                      {ticket.status === 'Resolved' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                          Resolved
                        </span>
                      )}
                    </td>

                    {/* Priority: Small colored dot — High (Danger), Medium (Tertiary), Low (Secondary) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {ticket.priority === 'High' && (
                        <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#DC2626]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                          <span>High</span>
                        </div>
                      )}
                      {ticket.priority === 'Medium' && (
                        <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#B95F00]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B95F00]" />
                          <span>Medium</span>
                        </div>
                      )}
                      {ticket.priority === 'Low' && (
                        <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3B82F6]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                          <span>Low</span>
                        </div>
                      )}
                    </td>

                    {/* Assignee: Avatar + name */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#1A1A1A] font-semibold text-[10px] flex items-center justify-center shrink-0">
                          {ticket.assignee.initials}
                        </div>
                        <span className="text-[13px] font-[500] text-[#1A1A1A]">
                          {ticket.assignee.name}
                        </span>
                      </div>
                    </td>

                    {/* SLA: Time remaining — normal (muted), warning (Tertiary), breached (Danger) */}
                    <td className="py-3 px-4 whitespace-nowrap text-[13px] font-[500]">
                      {ticket.sla.type === 'normal' && (
                        <span className="text-[#64748B]">{ticket.sla.text}</span>
                      )}
                      {ticket.sla.type === 'warning' && (
                        <span className="text-[#B95F00] font-medium">{ticket.sla.text}</span>
                      )}
                      {ticket.sla.type === 'breached' && (
                        <span className="text-[#DC2626] font-medium">{ticket.sla.text}</span>
                      )}
                    </td>

                    {/* Updated: Relative time in muted grey */}
                    <td className="py-3 px-4 whitespace-nowrap text-[#64748B] text-[13px] font-[500]">
                      {ticket.updated}
                    </td>

                    {/* Table Action: Single "View" ghost link (text only, grey, turns Primary on hover) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        id={`btn-view-ticket-${ticket.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicketId(ticket.id);
                        }}
                        className="text-[13px] font-[500] text-[#64748B] hover:text-[#6366F1] transition-colors cursor-pointer bg-transparent border-0 p-0"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination: Bottom-right: "Showing 1-10 of 247 tickets" with Prev/Next links (ghost style) */}
        <div className="p-3.5 sm:px-5 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-[14px] text-[#64748B] font-[500]">
          <div>
            <span>Showing 1-10 of 247 tickets</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Navigated to Previous Page')}
              className="text-[13px] font-[500] text-[#64748B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-[#CBD5E1]">|</span>
            <button
              onClick={() => showToast('Navigated to Next Page')}
              className="text-[13px] font-[500] text-[#6366F1] hover:underline transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NEW TICKET MODAL                                                          */}
      {/* ========================================================================= */}
      {isNewTicketModalOpen && (
        <div
          id="new-ticket-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsNewTicketModalOpen(false)}
        >
          <div
            id="new-ticket-modal-card"
            className="bg-white rounded-[16px] max-w-md w-full border border-[#E2E8F0] shadow-[0_12px_32px_rgba(99,102,241,0.12)] p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.015em]">
                  Create Support Ticket
                </h3>
                <p className="text-[13px] text-[#64748B]">
                  Log incoming customer inquiry and assign team SLA.
                </p>
              </div>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="p-1 rounded-[7px] text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-[13px]">
              <div>
                <label className="block text-[#475569] font-medium mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cannot update shipping address"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full h-9 px-3 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Product</label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer"
                  >
                    <option value="MuuqWear">MuuqWear</option>
                    <option value="GaarX">GaarX</option>
                    <option value="Salguri">Salguri</option>
                    <option value="SomPay">SomPay</option>
                    <option value="Dhaxal">Dhaxal</option>
                    <option value="Ilays">Ilays</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#475569] font-medium mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">
                  Customer / Requester
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah K. (sarah@example.com)"
                  value={newRequester}
                  onChange={(e) => setNewRequester(e.target.value)}
                  className="w-full h-9 px-3 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">
                  Assignee
                </label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer"
                >
                  <option value="Adeel D.">Adeel D.</option>
                  <option value="Leila H.">Leila H.</option>
                  <option value="Ibrahim M.">Ibrahim M.</option>
                  <option value="Sarah K.">Sarah K.</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="h-9 px-3.5 rounded-[7px] border border-[#E2E8F0] hover:bg-[#F8F9FA] text-[#1A1A1A] text-[13px] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[13px] font-medium transition-colors cursor-pointer shadow-xs"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
