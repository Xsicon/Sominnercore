import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  User,
  Tag,
  Building2,
  Calendar,
  X,
  MessageSquare,
  Paperclip,
  Send,
  MoreVertical,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown,
  Check,
  Sparkles,
} from 'lucide-react';

export interface TicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  product: 'MuuqWear' | 'GaarX' | 'Salguri' | 'SomPay' | 'Dhaxal' | 'Ilays';
  requester: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: 'New' | 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: {
    name: string;
    isUnassigned?: boolean;
  };
  sla: {
    text: string;
    type: 'normal' | 'warning' | 'breached';
  };
  updated: string;
  created: string;
  description?: string;
  tags?: string[];
  conversation?: {
    id: string;
    sender: string;
    role: 'customer' | 'agent' | 'system';
    time: string;
    message: string;
  }[];
}

export const INITIAL_TICKETS: TicketItem[] = [
  {
    id: 't-4210',
    ticketNumber: '#4210',
    subject: 'Checkout failing on mobile',
    product: 'MuuqWear',
    requester: { name: 'Sarah K.', email: 'sarah.k@example.com' },
    status: 'Open',
    priority: 'High',
    assignee: { name: 'Adeel D.' },
    sla: { text: '2.4hrs left', type: 'normal' },
    updated: '2 min ago',
    created: 'Today at 08:30 AM',
    description: 'Customers on iOS Safari report cart abandonment when tapping Apple Pay checkout button. Error 502 Bad Gateway logged on payment edge proxy.',
    tags: ['mobile', 'checkout', 'ios', 'payment'],
    conversation: [
      {
        id: 'c1',
        sender: 'Sarah K.',
        role: 'customer',
        time: 'Today at 08:30 AM',
        message: 'Whenever I try to complete my checkout on my iPhone, the screen freezes after biometric validation and returns a blank screen.',
      },
      {
        id: 'c2',
        sender: 'Adeel D.',
        role: 'agent',
        time: 'Today at 08:45 AM',
        message: 'Hello Sarah, we are currently investigating the Apple Pay mobile gateway timeout. I have pulled the gateway logs and escalated to payment engineering.',
      },
    ],
  },
  {
    id: 't-4209',
    ticketNumber: '#4209',
    subject: 'API timeout on GaarX',
    product: 'GaarX',
    requester: { name: 'Mike C.', email: 'mike.c@fleetops.net' },
    status: 'In Progress',
    priority: 'Medium',
    assignee: { name: 'Leila H.' },
    sla: { text: '1.2hrs left', type: 'normal' },
    updated: '14 min ago',
    created: 'Today at 07:15 AM',
    description: 'Telemetry ingest endpoint /v2/telemetry/stream experiencing 504 timeouts for batch sizes > 500 records.',
    tags: ['api', 'telemetry', 'timeout'],
    conversation: [
      {
        id: 'c1',
        sender: 'Mike C.',
        role: 'customer',
        time: 'Today at 07:15 AM',
        message: 'Our fleet vehicles lost real-time tracking sync due to repeated 504 Gateway Timeouts from the API.',
      },
    ],
  },
  {
    id: 't-4208',
    ticketNumber: '#4208',
    subject: 'Invoice generation failing',
    product: 'Salguri',
    requester: { name: 'John D.', email: 'john.d@enterprise.co' },
    status: 'New',
    priority: 'Medium',
    assignee: { name: 'Unassigned', isUnassigned: true },
    sla: { text: '3.8hrs left', type: 'normal' },
    updated: '1 hour ago',
    created: 'Today at 06:00 AM',
    description: 'Monthly automated PDF invoice generation script terminated unexpectedly with invalid tax rate parsing exception.',
    tags: ['billing', 'invoices', 'pdf'],
  },
  {
    id: 't-4207',
    ticketNumber: '#4207',
    subject: 'User role permissions bug',
    product: 'SomPay',
    requester: { name: 'Emma W.', email: 'emma.w@fintechcorp.org' },
    status: 'Open',
    priority: 'High',
    assignee: { name: 'Ibrahim M.' },
    sla: { text: 'Breached', type: 'breached' },
    updated: '2 hours ago',
    created: 'Yesterday at 04:00 PM',
    description: 'Finance managers cannot access transaction reconciliation dashboard despite having explicit ADMIN_FINANCE permission grants.',
    tags: ['rbac', 'permissions', 'auth'],
  },
  {
    id: 't-4206',
    ticketNumber: '#4206',
    subject: 'Account recovery not working',
    product: 'Dhaxal',
    requester: { name: 'Alex P.', email: 'alex.p@trustheritage.io' },
    status: 'New',
    priority: 'Low',
    assignee: { name: 'Unassigned', isUnassigned: true },
    sla: { text: '5.2hrs left', type: 'normal' },
    updated: '3 hours ago',
    created: 'Today at 04:10 AM',
    description: 'Customer did not receive the SMS OTP verification token for 2FA password recovery.',
    tags: ['auth', '2fa', 'recovery'],
  },
  {
    id: 't-4205',
    ticketNumber: '#4205',
    subject: 'Payment gateway error',
    product: 'Ilays',
    requester: { name: 'Lisa A.', email: 'lisa.a@solartech.com' },
    status: 'In Progress',
    priority: 'High',
    assignee: { name: 'Adeel D.' },
    sla: { text: '0.8hrs left', type: 'warning' },
    updated: '4 hours ago',
    created: 'Today at 03:00 AM',
    description: 'Direct debit subscriptions failing with card declined code 3001 on merchant settlement account.',
    tags: ['payments', 'gateway', 'billing'],
  },
  {
    id: 't-4204',
    ticketNumber: '#4204',
    subject: 'Password reset flow broken',
    product: 'MuuqWear',
    requester: { name: 'James B.', email: 'james.b@retailstore.com' },
    status: 'Open',
    priority: 'Medium',
    assignee: { name: 'Sarah K.' },
    sla: { text: '3.1hrs left', type: 'normal' },
    updated: '5 hours ago',
    created: 'Today at 02:00 AM',
    description: 'Magic links delivered via email produce token mismatch on second tap within mobile app browser context.',
    tags: ['auth', 'password', 'email'],
  },
  {
    id: 't-4203',
    ticketNumber: '#4203',
    subject: 'Missing order confirmation email',
    product: 'Salguri',
    requester: { name: 'Chris R.', email: 'chris.r@marketgroup.com' },
    status: 'In Progress',
    priority: 'Low',
    assignee: { name: 'Leila H.' },
    sla: { text: '6.4hrs left', type: 'normal' },
    updated: '6 hours ago',
    created: 'Yesterday at 11:30 PM',
    description: 'Order confirmation webhooks triggering but SMTP outbound relay dropping emails destined for Microsoft Outlook servers.',
    tags: ['email', 'notifications', 'orders'],
  },
  {
    id: 't-4202',
    ticketNumber: '#4202',
    subject: 'Dashboard loading slowly',
    product: 'GaarX',
    requester: { name: 'Maria G.', email: 'maria.g@logistics.net' },
    status: 'Open',
    priority: 'Medium',
    assignee: { name: 'Unassigned', isUnassigned: true },
    sla: { text: '2.9hrs left', type: 'normal' },
    updated: '7 hours ago',
    created: 'Yesterday at 10:15 PM',
    description: 'Live map overview takes > 12 seconds to render due to unpaginated vehicle coordinates query.',
    tags: ['performance', 'ui', 'latency'],
  },
  {
    id: 't-4201',
    ticketNumber: '#4201',
    subject: 'Cannot update shipping address',
    product: 'MuuqWear',
    requester: { name: 'Tom S.', email: 'tom.s@customer.org' },
    status: 'Open',
    priority: 'Low',
    assignee: { name: 'Adeel D.' },
    sla: { text: '4.7hrs left', type: 'normal' },
    updated: '8 hours ago',
    created: 'Yesterday at 09:00 PM',
    description: 'Address modification form rejects international postal codes with non-numeric alpha characters.',
    tags: ['orders', 'shipping', 'forms'],
  },
];

const PRODUCT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  MuuqWear: { bg: 'bg-indigo-50', text: 'text-[#6366F1]', border: 'border-indigo-200' },
  GaarX: { bg: 'bg-amber-50', text: 'text-[#B95F00]', border: 'border-amber-200' },
  Salguri: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  SomPay: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Dhaxal: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Ilays: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

interface TicketListViewProps {
  onNewTicketClick?: () => void;
}

export const TicketListView: React.FC<TicketListViewProps> = ({ onNewTicketClick }) => {
  const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);
  const [activeFilterPill, setActiveFilterPill] = useState<string>('All');
  
  // Advanced Filter states
  const [productFilter, setProductFilter] = useState<string>('All Products');
  const [priorityFilter, setPriorityFilter] = useState<string>('All Priorities');
  const [dateRange, setDateRange] = useState<string>('Nov 1 – Nov 30');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Active selected ticket for drawer/modal
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalTicketsCount = 247;

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState('');
  const [newProduct, setNewProduct] = useState<TicketItem['product']>('MuuqWear');
  const [newRequesterName, setNewRequesterName] = useState('');
  const [newRequesterEmail, setNewRequesterEmail] = useState('');
  const [newPriority, setNewPriority] = useState<TicketItem['priority']>('Medium');
  const [newAssignee, setNewAssignee] = useState('Adeel D.');
  const [newDescription, setNewDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick Filter Pills definitions
  const quickFilters = [
    { label: 'All', count: undefined, key: 'All', isPrimary: true },
    { label: 'Assigned to Me', count: 12, key: 'Assigned to Me' },
    { label: 'Unassigned', count: 8, key: 'Unassigned' },
    { label: 'New', count: 5, key: 'New' },
    { label: 'Open', count: 34, key: 'Open' },
    { label: 'Pending', count: 12, key: 'Pending' },
    { label: 'Resolved', count: 89, key: 'Resolved' },
    { label: 'Closed', count: 45, key: 'Closed' },
    { label: 'Escalated', count: 3, key: 'Escalated' },
    { label: 'SLA Breached', count: 7, key: 'SLA Breached', isTertiary: true },
  ];

  // Filter logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Quick filter pill
      if (activeFilterPill === 'Assigned to Me' && ticket.assignee.name !== 'Adeel D.') return false;
      if (activeFilterPill === 'Unassigned' && !ticket.assignee.isUnassigned) return false;
      if (activeFilterPill === 'New' && ticket.status !== 'New') return false;
      if (activeFilterPill === 'Open' && ticket.status !== 'Open') return false;
      if (activeFilterPill === 'Pending' && ticket.status !== 'Pending') return false;
      if (activeFilterPill === 'Resolved' && ticket.status !== 'Resolved') return false;
      if (activeFilterPill === 'Closed' && ticket.status !== 'Closed') return false;
      if (activeFilterPill === 'SLA Breached' && ticket.sla.type !== 'breached') return false;

      // Advanced filters
      if (productFilter !== 'All Products' && ticket.product !== productFilter) return false;
      if (priorityFilter !== 'All Priorities' && ticket.priority !== priorityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = ticket.subject.toLowerCase().includes(q);
        const matchNumber = ticket.ticketNumber.toLowerCase().includes(q);
        const matchRequester = ticket.requester.name.toLowerCase().includes(q);
        const matchProduct = ticket.product.toLowerCase().includes(q);
        const matchAssignee = ticket.assignee.name.toLowerCase().includes(q);
        if (!matchSubject && !matchNumber && !matchRequester && !matchProduct && !matchAssignee) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, activeFilterPill, productFilter, priorityFilter, searchQuery]);

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Ticket #', 'Subject', 'Product', 'Requester', 'Status', 'Priority', 'Assignee', 'SLA', 'Updated'];
    const rows = filteredTickets.map((t) => [
      t.ticketNumber,
      `"${t.subject.replace(/"/g, '""')}"`,
      t.product,
      `"${t.requester.name}"`,
      t.status,
      t.priority,
      t.assignee.name,
      t.sla.text,
      t.updated,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kobneti_support_tickets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported tickets list as CSV.');
  };

  // Create Ticket Handler
  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newRequesterName.trim()) return;

    const newTicketItem: TicketItem = {
      id: `t-${Date.now()}`,
      ticketNumber: `#${Math.floor(4211 + Math.random() * 500)}`,
      subject: newSubject,
      product: newProduct,
      requester: {
        name: newRequesterName,
        email: newRequesterEmail || `${newRequesterName.toLowerCase().replace(/\s+/g, '.')}@customer.com`,
      },
      status: 'New',
      priority: newPriority,
      assignee: {
        name: newAssignee,
        isUnassigned: newAssignee === 'Unassigned',
      },
      sla: {
        text: '4.0hrs left',
        type: 'normal',
      },
      updated: 'Just now',
      created: 'Just now',
      description: newDescription || 'Newly logged customer support ticket awaiting initial triage.',
      tags: ['support', newProduct.toLowerCase()],
      conversation: [
        {
          id: `conv-${Date.now()}`,
          sender: newRequesterName,
          role: 'customer',
          time: 'Just now',
          message: newDescription || newSubject,
        },
      ],
    };

    setTickets([newTicketItem, ...tickets]);
    setIsNewTicketModalOpen(false);
    setNewSubject('');
    setNewRequesterName('');
    setNewRequesterEmail('');
    setNewDescription('');
    showToast(`Created ticket ${newTicketItem.ticketNumber}: ${newTicketItem.subject}`);
  };

  // Status Badge Renderer according to specification:
  // 🔵 New = Primary (#6366F1)
  // 🟡 Open = Secondary (#3B82F6)
  // 🟢 In Progress = Tertiary (#B95F00)
  // 🟣 Resolved = Neutral (#94A3B8)
  // ⚪ Closed = Muted (#E2E8F0)
  const renderStatusBadge = (status: TicketItem['status']) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            <span>New</span>
          </span>
        );
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#3B82F6] border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
            <span>Open</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#B95F00] border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B95F00]"></span>
            <span>In Progress</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            <span>Pending</span>
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#64748B] border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span>
            <span>Resolved</span>
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-400 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span>Closed</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  // Priority Badge Renderer
  const renderPriorityBadge = (priority: TicketItem['priority']) => {
    switch (priority) {
      case 'Critical':
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>{priority}</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-[#B95F00] border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B95F00]"></span>
            <span>Medium</span>
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Low</span>
          </span>
        );
    }
  };

  // SLA Indicator Renderer:
  // Normal: ⏱️ [time] left — Neutral
  // Warning (under 1hr): ⏱️ [time] left — Tertiary (#B95F00)
  // Breached: ⚠️ Breached — Danger (#DC2626)
  const renderSLA = (sla: TicketItem['sla']) => {
    if (sla.type === 'breached') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Breached</span>
        </span>
      );
    }
    if (sla.type === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B95F00] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          <span>{sla.text}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>{sla.text}</span>
      </span>
    );
  };

  return (
    <div id="ticket-list-view-root" className="w-full flex-1 flex flex-col space-y-5 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="ticket-toast-notification"
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

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#0F172A] leading-tight">
            Support Tickets
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage and track all customer support requests across your products.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Export CSV (Outlined button) */}
          <button
            id="btn-export-tickets-csv"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-[#E2E8F0] hover:border-slate-300 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* + New Ticket (Primary button) */}
          <button
            id="btn-create-ticket-page-header"
            onClick={() => {
              if (onNewTicketClick) {
                onNewTicketClick();
              } else {
                setIsNewTicketModalOpen(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Ticket</span>
          </button>
        </div>
      </div>

      {/* ROW 1: QUICK FILTERS (Carousel / Horizontal scrollable pills) */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 pt-1">
        {quickFilters.map((filter) => {
          const isActive = activeFilterPill === filter.key;
          let activeClasses = 'bg-[#6366F1] text-white shadow-xs';
          let inactiveClasses = 'bg-white hover:bg-slate-100/80 text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]';

          if (filter.isTertiary) {
            if (isActive) {
              activeClasses = 'bg-[#B95F00] text-white shadow-xs';
            } else {
              inactiveClasses = 'bg-amber-50/70 hover:bg-amber-100/70 text-[#B95F00] border border-amber-200';
            }
          }

          return (
            <button
              key={filter.key}
              id={`quick-filter-pill-${filter.key.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveFilterPill(filter.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                isActive ? activeClasses : inactiveClasses
              }`}
            >
              <span>{filter.label}</span>
              {filter.count !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : filter.isTertiary
                      ? 'bg-amber-200/70 text-[#B95F00]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {filter.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ROW 2: ADVANCED FILTERS (Collapsible bar) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-wrap items-center gap-3">
        {/* Product dropdown */}
        <div className="relative min-w-[150px] flex-1 sm:flex-initial">
          <select
            id="filter-dropdown-product"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/15 appearance-none cursor-pointer"
          >
            <option value="All Products">All Products ▼</option>
            <option value="MuuqWear">MuuqWear</option>
            <option value="GaarX">GaarX</option>
            <option value="Salguri">Salguri</option>
            <option value="SomPay">SomPay</option>
            <option value="Dhaxal">Dhaxal</option>
            <option value="Ilays">Ilays</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Priority dropdown */}
        <div className="relative min-w-[140px] flex-1 sm:flex-initial">
          <select
            id="filter-dropdown-priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/15 appearance-none cursor-pointer"
          >
            <option value="All Priorities">All Priorities ▼</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Date range picker: "Nov 1 – Nov 30" */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#0F172A] min-w-[150px]">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            id="filter-date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent focus:outline-none w-28 text-xs font-medium"
            placeholder="Nov 1 – Nov 30"
          />
        </div>

        {/* Search input: "Search tickets..." */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="filter-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs text-[#0F172A] placeholder-[#64748B] transition-all focus:outline-none focus:ring-2 focus:ring-[#6366F1]/15"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Apply Filters button (Primary) */}
        <button
          id="btn-apply-filters"
          onClick={() => {
            showToast('Applied ticket filters.');
          }}
          className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          Apply Filters
        </button>
      </div>

      {/* ROW 3: TICKET TABLE (Full width, clean, human-readable) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-16">#</th>
                <th className="py-3.5 px-4 min-w-[240px]">Subject</th>
                <th className="py-3.5 px-4 w-28">Product</th>
                <th className="py-3.5 px-4 w-32">Requester</th>
                <th className="py-3.5 px-4 w-28">Status</th>
                <th className="py-3.5 px-4 w-24">Priority</th>
                <th className="py-3.5 px-4 w-32">Assignee</th>
                <th className="py-3.5 px-4 w-28">SLA</th>
                <th className="py-3.5 px-4 w-28 text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-700">No tickets found</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting search criteria or switching filter tab.</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const prodStyle = PRODUCT_STYLES[ticket.product] || PRODUCT_STYLES.MuuqWear;

                  return (
                    <tr
                      key={ticket.id}
                      id={`ticket-row-${ticket.id}`}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* Ticket Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#6366F1] group-hover:underline">
                        {ticket.ticketNumber}
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0F172A] group-hover:text-[#6366F1] transition-colors leading-snug">
                          {ticket.subject}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${prodStyle.bg} ${prodStyle.text} ${prodStyle.border}`}
                        >
                          {ticket.product}
                        </span>
                      </td>

                      {/* Requester */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {ticket.requester.name}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(ticket.status)}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        {renderPriorityBadge(ticket.priority)}
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4">
                        {ticket.assignee.isUnassigned ? (
                          <span className="text-slate-400 italic">Unassigned</span>
                        ) : (
                          <span className="text-slate-800 font-medium">{ticket.assignee.name}</span>
                        )}
                      </td>

                      {/* SLA */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderSLA(ticket.sla)}
                      </td>

                      {/* Updated */}
                      <td className="py-3.5 px-4 text-right text-slate-400 font-medium whitespace-nowrap">
                        {ticket.updated}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination at bottom: "Showing 1-10 of 247 tickets" with Prev/Next buttons */}
        <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="font-medium">
            Showing <span className="font-bold text-[#0F172A]">1-10</span> of{' '}
            <span className="font-bold text-[#0F172A]">{totalTicketsCount}</span> tickets
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-pagination-prev"
              onClick={() => {
                if (currentPage > 1) setCurrentPage(currentPage - 1);
                showToast(`Page ${Math.max(1, currentPage - 1)} loaded.`);
              }}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg">
              {currentPage}
            </span>

            <button
              id="btn-pagination-next"
              onClick={() => {
                setCurrentPage(currentPage + 1);
                showToast(`Page ${currentPage + 1} loaded.`);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ROW 4: QUICK STATS (4 small cards below table) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets */}
        <div id="stat-total-tickets" className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Tickets</div>
          <div className="text-2xl font-bold text-[#0F172A] mt-1">247</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">↑ +8% from last week</div>
        </div>

        {/* Open */}
        <div id="stat-open-tickets" className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Open</div>
          <div className="text-2xl font-bold text-[#3B82F6] mt-1">34</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">12 assigned to you</div>
        </div>

        {/* Resolved Today */}
        <div id="stat-resolved-today" className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Resolved Today</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">18</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Target: 25 / day</div>
        </div>

        {/* Avg. Response */}
        <div id="stat-avg-response" className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Avg. Response</div>
          <div className="text-2xl font-bold text-[#B95F00] mt-1">2.4hrs</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">↓ 18m faster than SLA target</div>
        </div>
      </div>

      {/* TICKET DETAIL MODAL / DRAWER (Opened on Row Click) */}
      {selectedTicket && (
        <div
          id="ticket-detail-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            id="ticket-detail-container"
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#6366F1]">
                  {selectedTicket.ticketNumber}
                </span>
                <span className="text-slate-300">•</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    PRODUCT_STYLES[selectedTicket.product]?.bg
                  } ${PRODUCT_STYLES[selectedTicket.product]?.text} ${
                    PRODUCT_STYLES[selectedTicket.product]?.border
                  }`}
                >
                  {selectedTicket.product}
                </span>
                <span className="text-slate-300">•</span>
                {renderStatusBadge(selectedTicket.status)}
              </div>

              <div className="flex items-center gap-2">
                {renderPriorityBadge(selectedTicket.priority)}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* Title & Metadata */}
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">{selectedTicket.subject}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <div>
                    Requester:{' '}
                    <span className="font-semibold text-slate-800">
                      {selectedTicket.requester.name}
                    </span>{' '}
                    ({selectedTicket.requester.email})
                  </div>
                  <div>•</div>
                  <div>
                    Assignee:{' '}
                    <span className="font-semibold text-slate-800">
                      {selectedTicket.assignee.name}
                    </span>
                  </div>
                  <div>•</div>
                  <div>Created: {selectedTicket.created}</div>
                </div>
              </div>

              {/* SLA & Status Summary banner */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 font-medium">SLA Resolution Target:</span>
                  {renderSLA(selectedTicket.sla)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Quick Update Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as TicketItem['status'];
                      setSelectedTicket({ ...selectedTicket, status: newStatus });
                      setTickets(
                        tickets.map((t) => (t.id === selectedTicket.id ? { ...t, status: newStatus } : t))
                      );
                      showToast(`Updated status to ${newStatus}`);
                    }}
                    className="bg-white border border-slate-200 text-xs rounded-lg px-2 py-1 font-semibold"
                  >
                    <option value="New">New</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              {selectedTicket.description && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Issue Description</h4>
                  <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                    {selectedTicket.description}
                  </div>
                </div>
              )}

              {/* Conversation Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversation & Audit Log</h4>
                <div className="space-y-3">
                  {selectedTicket.conversation && selectedTicket.conversation.length > 0 ? (
                    selectedTicket.conversation.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                          conv.role === 'customer'
                            ? 'bg-white border-slate-200'
                            : 'bg-indigo-50/50 border-indigo-100'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <span>{conv.sender}</span>
                            <span className="text-[10px] font-normal px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {conv.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{conv.time}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{conv.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 italic">
                      No customer replies logged yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Reply Input */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Post Reply</h4>
                <textarea
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response to the customer..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/15 resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach logs, screenshots, or KB links</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!replyMessage.trim()) return;
                      const newConv = {
                        id: `c-${Date.now()}`,
                        sender: 'Adeel D.',
                        role: 'agent' as const,
                        time: 'Just now',
                        message: replyMessage,
                      };
                      const updated = {
                        ...selectedTicket,
                        conversation: [...(selectedTicket.conversation || []), newConv],
                        status: 'In Progress' as const,
                      };
                      setSelectedTicket(updated);
                      setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)));
                      setReplyMessage('');
                      showToast('Reply dispatched to customer.');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TICKET MODAL */}
      {isNewTicketModalOpen && (
        <div
          id="create-ticket-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsNewTicketModalOpen(false)}
        >
          <div
            id="create-ticket-container"
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Create New Support Ticket</h3>
                <p className="text-xs text-[#64748B]">Log an inbound customer ticket across products</p>
              </div>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Subject *</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Card payment declining on checkout"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 outline-none text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Product *</label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value as TicketItem['product'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 outline-none text-slate-900 text-xs bg-white"
                  >
                    <option value="MuuqWear">MuuqWear</option>
                    <option value="GaarX">GaarX</option>
                    <option value="Salguri">Salguri</option>
                    <option value="SomPay">SomPay</option>
                    <option value="Dhaxal">Dhaxal</option>
                    <option value="Ilays">Ilays</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Priority *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketItem['priority'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 outline-none text-slate-900 text-xs bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Requester Name *</label>
                  <input
                    type="text"
                    required
                    value={newRequesterName}
                    onChange={(e) => setNewRequesterName(e.target.value)}
                    placeholder="e.g. Sarah K."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 outline-none text-slate-900 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Assignee</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 outline-none text-slate-900 text-xs bg-white"
                  >
                    <option value="Adeel D.">Adeel D. (You)</option>
                    <option value="Leila H.">Leila H.</option>
                    <option value="Ibrahim M.">Ibrahim M.</option>
                    <option value="Sarah K.">Sarah K.</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed description of customer issue, reproduction steps, or error logs..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 outline-none text-slate-900 text-xs custom-scrollbar"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-xl text-xs shadow-xs cursor-pointer"
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
