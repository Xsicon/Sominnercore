import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowDown,
  ArrowUp,
  X,
  Radio,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Check,
  Flame,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export interface IncidentItem {
  id: string;
  incNumber: string;
  severity: 'Sev1' | 'Sev2' | 'Sev3';
  title: string;
  product: 'Salguri' | 'GaarX' | 'MuuqWear' | 'SomPay' | 'Dhaxal' | 'Ilays' | string;
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
  commander: {
    name: string;
    initials: string;
    avatar?: string;
  };
  escalatedTime: string;
  summary?: string;
  impact?: string;
  mitigation?: string;
}

interface EscalationsViewProps {
  onNewIncident?: () => void;
}

export const EscalationsView: React.FC<EscalationsViewProps> = () => {
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter States (Row 2 Compact Filter Bar)
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Sev1' | 'Sev2' | 'Sev3'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved'>('All');
  const [productFilter, setProductFilter] = useState<string>('All');

  // Selected incident for detail view / modal
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null);

  // New Incident Modal state
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState<'Sev1' | 'Sev2' | 'Sev3'>('Sev1');
  const [newProduct, setNewProduct] = useState('Salguri');
  const [newCommander, setNewCommander] = useState('Adeel D.');
  const [newSummary, setNewSummary] = useState('');

  // Primary dataset strictly matching specification
  const [incidents, setIncidents] = useState<IncidentItem[]>([
    {
      id: 'inc-0042',
      incNumber: '#INC-0042',
      severity: 'Sev1',
      title: 'Payment gateway down',
      product: 'Salguri',
      status: 'Investigating',
      commander: {
        name: 'Adeel D.',
        initials: 'AD',
      },
      escalatedTime: '2 min ago',
      summary: 'High error rate spikes (502 Bad Gateway) detected across primary Salguri checkout gateway. Credit card transactions failing.',
      impact: '100% of Salguri payment authorizations degraded',
      mitigation: 'Flipping traffic to secondary gateway instance; database connection pool resized.',
    },
    {
      id: 'inc-0041',
      incNumber: '#INC-0041',
      severity: 'Sev2',
      title: 'API timeout on GaarX',
      product: 'GaarX',
      status: 'Identified',
      commander: {
        name: 'Leila H.',
        initials: 'LH',
      },
      escalatedTime: '14 min ago',
      summary: 'Fleet telemetry ingestion endpoint experiencing 12s latency spikes due to high query volume on unindexed ride events.',
      impact: 'Vehicle tracking updates delayed by 45-60 seconds',
      mitigation: 'Adding composite index on telemetry table & flushing Redis buffer queue.',
    },
    {
      id: 'inc-0040',
      incNumber: '#INC-0040',
      severity: 'Sev2',
      title: 'Checkout failing on mobile',
      product: 'MuuqWear',
      status: 'Monitoring',
      commander: {
        name: 'Ibrahim M.',
        initials: 'IM',
      },
      escalatedTime: '1 hour ago',
      summary: 'Android Chrome users experiencing 3DS verification timeout on checkout handshakes.',
      impact: 'Roughly 18% of mobile shoppers on Android 14 affected',
      mitigation: 'Patched 3DS callback SDK handler. Monitoring error drops.',
    },
    {
      id: 'inc-0039',
      incNumber: '#INC-0039',
      severity: 'Sev3',
      title: 'Invoice generation bug',
      product: 'SomPay',
      status: 'Resolved',
      commander: {
        name: 'Sarah K.',
        initials: 'SK',
      },
      escalatedTime: '3 hours ago',
      summary: 'Monthly recurring invoices failing PDF generation due to missing tax jurisdiction parameter in SomPay billing worker.',
      impact: 'Delayed 142 enterprise invoices',
      mitigation: 'Fallback tax rate applied and batch cron job re-executed successfully.',
    },
    {
      id: 'inc-0038',
      incNumber: '#INC-0038',
      severity: 'Sev3',
      title: 'User role permissions',
      product: 'Dhaxal',
      status: 'Resolved',
      commander: {
        name: 'Mike C.',
        initials: 'MC',
      },
      escalatedTime: '5 hours ago',
      summary: 'Estate executors unable to edit inventory items due to cached RBAC token mismatch on Dhaxal cloud service.',
      impact: '12 executor accounts affected',
      mitigation: 'Invalidated stale RBAC session caches across region clusters.',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter evaluation
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    severityFilter !== 'All' ||
    statusFilter !== 'All' ||
    productFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('All');
    setStatusFilter('All');
    setProductFilter('All');
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      inc.incNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.commander.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
    const matchesProduct = productFilter === 'All' || inc.product === productFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesProduct;
  });

  // Handle New Incident Creation
  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const nextIncNum = `#INC-00${43 + Math.floor(Math.random() * 10)}`;
    const newInc: IncidentItem = {
      id: `inc-${Date.now()}`,
      incNumber: nextIncNum,
      severity: newSeverity,
      title: newTitle.trim(),
      product: newProduct,
      status: 'Investigating',
      commander: {
        name: newCommander,
        initials: newCommander
          .split(' ')
          .map((n) => n[0])
          .join(''),
      },
      escalatedTime: 'Just now',
      summary: newSummary.trim() || 'Incident initiated from operational control center.',
      impact: 'Active impact assessment underway.',
      mitigation: 'Primary mitigation steps scheduled.',
    };

    setIncidents([newInc, ...incidents]);
    setIsNewIncidentModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    showToast(`Declared ${newSeverity} incident ${nextIncNum}`);
  };

  // Product color dot mapping (subtle product dot)
  const getProductDotColor = (product: string) => {
    switch (product) {
      case 'Salguri':
        return '#6366F1';
      case 'GaarX':
        return '#3B82F6';
      case 'MuuqWear':
        return '#10B981';
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

  return (
    <div
      id="escalations-incidents-page"
      className="w-full flex-1 flex flex-col space-y-7 max-w-7xl mx-auto pb-12 font-sans selection:bg-[#6366F1]/15"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-escalations-feedback"
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
      {/* PAGE HEADER: Left: Headline & Subtext | Right: Single + New Incident CTA  */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-semibold text-[#1A1A1A] tracking-[-0.015em] leading-tight">
            Escalations & Incidents
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Track and manage critical issues that require immediate attention.
          </p>
        </div>

        {/* Right side: Single + New Incident primary button on entire page */}
        <div>
          <button
            id="btn-new-incident"
            onClick={() => setIsNewIncidentModalOpen(true)}
            className="h-9 px-4 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[13px] font-medium flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer active:scale-98 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ New Incident</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: Summary Cards (3 cards, equal width)                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Active Incidents */}
        <div
          id="card-active-incidents"
          className="bg-[#FFFFFF] rounded-[12px] p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(99,102,241,0.05)] hover:shadow-[0_4px_12px_rgba(99,102,241,0.08)] transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="text-[13px] font-[500] text-[#64748B]">Active Incidents</div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-[36px] font-semibold text-[#1A1A1A] tracking-[-0.02em] leading-none">
                3
              </span>
              <div className="flex items-center gap-1 text-[14px] font-[500] text-[#64748B]">
                <ArrowDown className="w-3.5 h-3.5 text-[#64748B]" />
                <span>–2 vs last week</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-1.5">
            {/* Small chips */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]/60">
              1 Sev1
            </span>
            <span className="text-[#64748B] text-[12px]">·</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#FFFBEB] text-[#B95F00] border border-[#FDE68A]/60">
              2 Sev2
            </span>
          </div>
        </div>

        {/* Card 2: Escalated Tickets */}
        <div
          id="card-escalated-tickets"
          className="bg-[#FFFFFF] rounded-[12px] p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(99,102,241,0.05)] hover:shadow-[0_4px_12px_rgba(99,102,241,0.08)] transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="text-[13px] font-[500] text-[#64748B]">Escalated Tickets</div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-[36px] font-semibold text-[#1A1A1A] tracking-[-0.02em] leading-none">
                12
              </span>
              <div className="flex items-center gap-1 text-[14px] font-[500] text-[#64748B]">
                <ArrowUp className="w-3.5 h-3.5 text-[#64748B]" />
                <span>+3 vs last week</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center">
            <span className="text-[13px] font-[500] text-[#64748B]">
              8 awaiting assignment
            </span>
          </div>
        </div>

        {/* Card 3: SLA Breaches */}
        <div
          id="card-sla-breaches"
          className="bg-[#FFFFFF] rounded-[12px] p-5 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(99,102,241,0.05)] hover:shadow-[0_4px_12px_rgba(99,102,241,0.08)] transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="text-[13px] font-[500] text-[#64748B]">SLA Breaches</div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-[36px] font-semibold text-[#1A1A1A] tracking-[-0.02em] leading-none">
                7
              </span>
              <div className="flex items-center gap-1 text-[14px] font-[500] text-[#64748B]">
                <ArrowDown className="w-3.5 h-3.5 text-[#64748B]" />
                <span>–4 vs last week</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center">
            <span className="text-[13px] font-[500] text-[#64748B]">
              3 critical, 4 non-critical
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: Incident Registry Table (Full width)                               */}
      {/* ========================================================================= */}
      <div
        id="incident-registry-card"
        className="bg-[#FFFFFF] rounded-[12px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(99,102,241,0.05)] overflow-hidden"
      >
        {/* Table Header with Title, Subtitle, and Compact Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.015em]">
              Incident Registry
            </h2>
            <p className="text-[14px] font-[500] text-[#64748B]">
              Production incidents across portfolio products
            </p>
          </div>

          {/* Compact Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input: "Search incidents..." */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="search-incidents-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents..."
                className="h-8 pl-8 pr-3 bg-white border border-[#E2E8F0] rounded-[7px] text-[13px] text-[#1A1A1A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] w-40 sm:w-48 transition-all"
              />
            </div>

            {/* Severity Filter Dropdown */}
            <div className="relative">
              <select
                id="filter-severity-select"
                aria-label="Filter incidents by severity"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="h-8 pl-2.5 pr-7 bg-white border border-[#E2E8F0] rounded-[7px] text-[13px] font-[500] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none"
              >
                <option value="All">All Severities</option>
                <option value="Sev1">Sev1</option>
                <option value="Sev2">Sev2</option>
                <option value="Sev3">Sev3</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                id="filter-status-select"
                aria-label="Filter incidents by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-8 pl-2.5 pr-7 bg-white border border-[#E2E8F0] rounded-[7px] text-[13px] font-[500] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Investigating">Investigating</option>
                <option value="Identified">Identified</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Resolved">Resolved</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Product Filter Dropdown */}
            <div className="relative">
              <select
                id="filter-product-select"
                aria-label="Filter incidents by product"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="h-8 pl-2.5 pr-7 bg-white border border-[#E2E8F0] rounded-[7px] text-[13px] font-[500] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer appearance-none"
              >
                <option value="All">All Products</option>
                <option value="Salguri">Salguri</option>
                <option value="GaarX">GaarX</option>
                <option value="MuuqWear">MuuqWear</option>
                <option value="SomPay">SomPay</option>
                <option value="Dhaxal">Dhaxal</option>
                <option value="Ilays">Ilays</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filtered State: Clear Filters Link */}
            {hasActiveFilters && (
              <button
                id="btn-clear-filters"
                onClick={clearFilters}
                className="h-8 px-2.5 text-[13px] font-[500] text-[#6366F1] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Content (Hairline borders, no zebra, hover to #F8F9FA) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] font-[500] text-[13px]">
                <th className="py-3 px-4 w-[110px]">Severity</th>
                <th className="py-3 px-4 w-[110px]">ID</th>
                <th className="py-3 px-4 min-w-[220px]">Title</th>
                <th className="py-3 px-4 w-[130px]">Product</th>
                <th className="py-3 px-4 w-[140px]">Status</th>
                <th className="py-3 px-4 w-[150px]">Commander</th>
                <th className="py-3 px-4 w-[120px]">Escalated</th>
                <th className="py-3 px-4 w-[80px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredIncidents.length === 0 ? (
                /* Empty State Card - no duplicate button */
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-9 h-9 rounded-full bg-[#F8F9FA] border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                        <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
                      </div>
                      <div className="text-[14px] font-semibold text-[#1A1A1A]">
                        No active incidents
                      </div>
                      <p className="text-[13px] text-[#64748B] max-w-xs">
                        All systems operational. No production incidents match your filter parameters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    id={`incident-row-${inc.id}`}
                    onClick={() => setSelectedIncident(inc)}
                    className="hover:bg-[#F8F9FA] transition-colors duration-150 cursor-pointer group"
                  >
                    {/* Severity Column: Small colored dot + text */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {inc.severity === 'Sev1' && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[7px] bg-[#FEF2F2] border border-[#FECACA]/60 text-[12px] font-semibold text-[#DC2626]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                          <span>Sev1</span>
                        </div>
                      )}
                      {inc.severity === 'Sev2' && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[7px] bg-[#FFFBEB] border border-[#FDE68A]/60 text-[12px] font-semibold text-[#B95F00]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B95F00]" />
                          <span>Sev2</span>
                        </div>
                      )}
                      {inc.severity === 'Sev3' && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[7px] bg-[#EFF6FF] border border-[#BFDBFE]/60 text-[12px] font-semibold text-[#3B82F6]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                          <span>Sev3</span>
                        </div>
                      )}
                    </td>

                    {/* ID Column: Semi-bold font, clickable link (blue underline on hover) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#1A1A1A] group-hover:text-[#6366F1] group-hover:underline transition-colors">
                        {inc.incNumber}
                      </span>
                    </td>

                    {/* Title: Regular weight, near-black */}
                    <td className="py-3 px-4 font-normal text-[#1A1A1A]">
                      {inc.title}
                    </td>

                    {/* Product: Small muted grey text with a subtle product color dot */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] font-[500]">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: getProductDotColor(inc.product) }}
                        />
                        <span>{inc.product}</span>
                      </div>
                    </td>

                    {/* Status: Small pill with status color */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {inc.status === 'Investigating' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]/60">
                          Investigating
                        </span>
                      )}
                      {inc.status === 'Identified' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#FFFBEB] text-[#B95F00] border border-[#FDE68A]/60">
                          Identified
                        </span>
                      )}
                      {inc.status === 'Monitoring' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]/60">
                          Monitoring
                        </span>
                      )}
                      {inc.status === 'Resolved' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] text-[12px] font-medium bg-[#EEF2FF] text-[#6366F1] border border-[#E0E7FF]">
                          Resolved
                        </span>
                      )}
                    </td>

                    {/* Commander: Avatar (small circle with initials) + name */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#1A1A1A] font-semibold text-[10px] flex items-center justify-center shrink-0">
                          {inc.commander.initials}
                        </div>
                        <span className="text-[13px] font-[500] text-[#1A1A1A]">
                          {inc.commander.name}
                        </span>
                      </div>
                    </td>

                    {/* Escalated: Relative time in muted grey */}
                    <td className="py-3 px-4 text-[#64748B] text-[13px] font-[500] whitespace-nowrap">
                      {inc.escalatedTime}
                    </td>

                    {/* Action: Single "View" ghost link style (no background, subtle grey text that turns Primary on hover) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        id={`btn-view-${inc.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncident(inc);
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

        {/* Table Footer: Pagination */}
        <div className="p-3 sm:px-5 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-[14px] text-[#64748B] font-[500]">
          <div></div>
          <div className="text-[14px] text-[#64748B] font-[500]">
            Showing {filteredIncidents.length} of {incidents.length} incidents
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: Status Legend (Compact, inline)                                    */}
      {/* ========================================================================= */}
      <div
        id="system-status-legend-footnote"
        className="flex flex-wrap items-center gap-3 text-[13px] font-[500] text-[#64748B] px-1"
      >
        <span className="text-[13px] font-medium text-[#1A1A1A]">Status Legend:</span>
        <div className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
          <span>Investigating</span>
        </div>
        <span className="text-[#94A3B8]">·</span>
        <div className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#B95F00]" />
          <span>Identified</span>
        </div>
        <span className="text-[#94A3B8]">·</span>
        <div className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          <span>Monitoring</span>
        </div>
        <span className="text-[#94A3B8]">·</span>
        <div className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span>Resolved</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INCIDENT DETAIL MODAL                                                     */}
      {/* ========================================================================= */}
      {selectedIncident && (
        <div
          id="incident-detail-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedIncident(null)}
        >
          <div
            id="incident-detail-modal-card"
            className="bg-white rounded-[16px] max-w-xl w-full border border-[#E2E8F0] shadow-[0_12px_32px_rgba(99,102,241,0.12)] p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
                    {selectedIncident.incNumber}
                  </span>
                  {selectedIncident.severity === 'Sev1' && (
                    <span className="px-2 py-0.5 rounded-[7px] text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                      Sev1
                    </span>
                  )}
                  {selectedIncident.severity === 'Sev2' && (
                    <span className="px-2 py-0.5 rounded-[7px] text-xs font-semibold bg-[#FFFBEB] text-[#B95F00] border border-[#FDE68A]">
                      Sev2
                    </span>
                  )}
                  {selectedIncident.severity === 'Sev3' && (
                    <span className="px-2 py-0.5 rounded-[7px] text-xs font-semibold bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]">
                      Sev3
                    </span>
                  )}
                  <span className="text-xs text-[#64748B]">·</span>
                  <span className="text-xs text-[#64748B] font-medium">
                    {selectedIncident.product}
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold text-[#1A1A1A]">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-[7px] text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-[12px] bg-[#F8F9FA] border border-[#E2E8F0] text-[13px]">
              <div>
                <div className="text-[#64748B] font-medium text-[11px] uppercase tracking-wider">Status</div>
                <div className="font-semibold text-[#1A1A1A] mt-0.5">{selectedIncident.status}</div>
              </div>
              <div>
                <div className="text-[#64748B] font-medium text-[11px] uppercase tracking-wider">Commander</div>
                <div className="font-semibold text-[#1A1A1A] mt-0.5">{selectedIncident.commander.name}</div>
              </div>
              <div>
                <div className="text-[#64748B] font-medium text-[11px] uppercase tracking-wider">Escalated</div>
                <div className="font-semibold text-[#1A1A1A] mt-0.5">{selectedIncident.escalatedTime}</div>
              </div>
            </div>

            {/* Diagnostics & Summary */}
            <div className="space-y-1.5 text-[13px]">
              <div className="text-[#64748B] font-semibold text-[12px]">Incident Summary</div>
              <p className="text-[#1A1A1A] leading-relaxed p-3.5 rounded-[8px] border border-[#E2E8F0] bg-white">
                {selectedIncident.summary}
              </p>
            </div>

            {/* Impact & Mitigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div className="p-3 rounded-[8px] bg-[#FEF2F2]/50 border border-[#FECACA]/60 space-y-1">
                <div className="text-[#DC2626] font-semibold text-[11px] uppercase tracking-wider">
                  Service Impact
                </div>
                <div className="text-[#1A1A1A]">{selectedIncident.impact}</div>
              </div>

              <div className="p-3 rounded-[8px] bg-[#F0FDF4]/50 border border-[#BBF7D0]/60 space-y-1">
                <div className="text-[#12B76A] font-semibold text-[11px] uppercase tracking-wider">
                  Mitigation Action
                </div>
                <div className="text-[#1A1A1A]">{selectedIncident.mitigation}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => {
                  setSelectedIncident(null);
                  showToast(`Connected to Incident Voice Bridge for ${selectedIncident.incNumber}`);
                }}
                className="h-9 px-3.5 rounded-[7px] border border-[#E2E8F0] hover:bg-[#F8F9FA] text-[#1A1A1A] text-[13px] font-medium transition-colors cursor-pointer"
              >
                Join Bridge
              </button>
              <button
                type="button"
                onClick={() => {
                  setIncidents((prev) =>
                    prev.map((i) =>
                      i.id === selectedIncident.id ? { ...i, status: 'Resolved' } : i
                    )
                  );
                  setSelectedIncident(null);
                  showToast(`${selectedIncident.incNumber} status updated to Resolved`);
                }}
                className="h-9 px-4 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[13px] font-medium transition-colors cursor-pointer shadow-xs"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEW INCIDENT MODAL                                                        */}
      {/* ========================================================================= */}
      {isNewIncidentModalOpen && (
        <div
          id="new-incident-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsNewIncidentModalOpen(false)}
        >
          <div
            id="new-incident-modal-card"
            className="bg-white rounded-[16px] max-w-md w-full border border-[#E2E8F0] shadow-[0_12px_32px_rgba(99,102,241,0.12)] p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.015em]">
                  Declare New Incident
                </h3>
                <p className="text-[13px] text-[#64748B]">
                  Initialize rapid response protocols and notify team leads.
                </p>
              </div>
              <button
                onClick={() => setIsNewIncidentModalOpen(false)}
                className="p-1 rounded-[7px] text-[#64748B] hover:text-[#1A1A1A] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3.5 text-[13px]">
              <div>
                <label className="block text-[#475569] font-medium mb-1">
                  Incident Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Redis cluster memory exhaustion"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#475569] font-medium mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer"
                  >
                    <option value="Sev1">Sev1 (Critical)</option>
                    <option value="Sev2">Sev2 (Major)</option>
                    <option value="Sev3">Sev3 (Moderate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#475569] font-medium mb-1">Product</label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1] cursor-pointer"
                  >
                    <option value="Salguri">Salguri</option>
                    <option value="GaarX">GaarX</option>
                    <option value="MuuqWear">MuuqWear</option>
                    <option value="SomPay">SomPay</option>
                    <option value="Dhaxal">Dhaxal</option>
                    <option value="Ilays">Ilays</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">
                  Incident Commander
                </label>
                <input
                  type="text"
                  value={newCommander}
                  onChange={(e) => setNewCommander(e.target.value)}
                  className="w-full h-9 px-3 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">
                  Summary & Diagnostics
                </label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe initial trigger, log signatures, or error rate..."
                  className="w-full p-2.5 rounded-[7px] border border-[#E2E8F0] text-[#1A1A1A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsNewIncidentModalOpen(false)}
                  className="h-9 px-3.5 rounded-[7px] border border-[#E2E8F0] hover:bg-[#F8F9FA] text-[#1A1A1A] text-[13px] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[13px] font-medium transition-colors cursor-pointer shadow-xs"
                >
                  Declare Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
