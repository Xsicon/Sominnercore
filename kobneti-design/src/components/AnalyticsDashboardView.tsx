import React, { useState } from 'react';
import {
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  FileText,
  Filter,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  tickets: number;
  trend: string;
  trendType: 'up' | 'down' | 'new';
  accent: 'primary' | 'secondary' | 'tertiary';
}

const TOP_PRODUCTS: ProductItem[] = [
  {
    id: 'muuqwear',
    name: 'MuuqWear',
    tickets: 142,
    trend: '+12% ↑',
    trendType: 'up',
    accent: 'primary',
  },
  {
    id: 'gaarx',
    name: 'GaarX',
    tickets: 98,
    trend: '+8% ↑',
    trendType: 'up',
    accent: 'secondary',
  },
  {
    id: 'salguri',
    name: 'Salguri',
    tickets: 67,
    trend: '-3% ↓',
    trendType: 'down',
    accent: 'tertiary',
  },
  {
    id: 'sompay',
    name: 'SomPay',
    tickets: 45,
    trend: '+18% ↑',
    trendType: 'up',
    accent: 'tertiary',
  },
  {
    id: 'dhaxal',
    name: 'Dhaxal',
    tickets: 23,
    trend: '+5% ↑',
    trendType: 'up',
    accent: 'tertiary',
  },
  {
    id: 'ilays',
    name: 'Ilays',
    tickets: 12,
    trend: 'New',
    trendType: 'new',
    accent: 'tertiary',
  },
];

interface UrgentTicket {
  id: string;
  code: string;
  title: string;
  priority: 'High' | 'Medium';
  product: string;
  pic: string;
}

const URGENT_TICKETS: UrgentTicket[] = [
  {
    id: 't1',
    code: '#BK-123456',
    title: 'Checkout failing on mobile',
    priority: 'High',
    product: 'MuuqWear',
    pic: 'Sarah K.',
  },
  {
    id: 't2',
    code: '#EN-234567',
    title: 'API timeout on GaarX',
    priority: 'High',
    product: 'GaarX',
    pic: 'Mike C.',
  },
  {
    id: 't3',
    code: '#CL-345678',
    title: 'Invoice generation failing',
    priority: 'Medium',
    product: 'Salguri',
    pic: 'Leila H.',
  },
  {
    id: 't4',
    code: '#AH-891234',
    title: 'User role permissions bug',
    priority: 'Medium',
    product: 'SomPay',
    pic: 'Adeel D.',
  },
];

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  category: string;
  type?: 'event' | 'highlight';
}

const TODAY_SCHEDULE: ScheduleItem[] = [
  { id: 's1', time: '09:00 AM', title: 'Daily Standup', category: 'Team Meeting' },
  { id: 's2', time: '10:00 AM', title: 'Sprint Planning', category: 'Engineering' },
  { id: 's3', time: '11:30 AM', title: 'Client Sync', category: 'MuuqWear Support' },
  { id: 's4', time: '01:00 PM', title: 'Lunch Break', category: 'Personal / Break' },
  { id: 's5', time: '02:00 PM', title: 'Payroll Approval Review', category: 'Operations' },
];

const HISTORICAL_MONTHS = [
  { month: 'Jul', count: 180 },
  { month: 'Aug', count: 210 },
  { month: 'Sep', count: 245 },
  { month: 'Oct', count: 230 },
  { month: 'Nov', count: 290 },
  { month: 'Dec', count: 310 },
];

const TICKETS_BY_PRODUCT_DATA = [
  { name: 'MuuqWear', pct: 42, color: '#6366F1' },
  { name: 'GaarX', pct: 38, color: '#3B82F6' },
  { name: 'Salguri', pct: 25, color: '#B95F00' },
  { name: 'SomPay', pct: 15, color: '#10B981' },
  { name: 'Dhaxal', pct: 8, color: '#8B5CF6' },
];

const TICKETS_BY_STATUS_DATA = [
  { name: 'New', pct: 12, color: '#6366F1', labelColor: 'text-[#6366F1]' },
  { name: 'Open', pct: 34, color: '#3B82F6', labelColor: 'text-[#3B82F6]' },
  { name: 'In Progress', pct: 28, color: '#B95F00', labelColor: 'text-[#B95F00]' },
  { name: 'Resolved', pct: 22, color: '#64748B', labelColor: 'text-[#64748B]' },
  { name: 'Closed', pct: 4, color: '#94A3B8', labelColor: 'text-[#94A3B8]' },
];

interface AnalyticsDashboardViewProps {
  onNewReportClick?: () => void;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  onNewReportClick,
}) => {
  const [dateRangeDropdownOpen, setDateRangeDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Nov 1 – Nov 30, 2025');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  // SVG Chart calculation parameters
  const chartWidth = 900;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const maxVal = 350;
  const minVal = 150;

  const points = HISTORICAL_MONTHS.map((item, idx) => {
    const x = paddingX + (idx / (HISTORICAL_MONTHS.length - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      ((item.count - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    // smooth curve
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${
    points[0].x
  },${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-tight">
            Good Morning, Adeel.
          </h1>
          <p className="text-sm font-normal text-[#64748B] mt-1">
            Here&apos;s what&apos;s happening across your entire operations platform today.
          </p>
        </div>

        {/* Right Date Range Pill */}
        <div className="relative self-start sm:self-center">
          <button
            id="date-range-filter-btn"
            onClick={() => setDateRangeDropdownOpen(!dateRangeDropdownOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-xs font-semibold text-[#0F172A] border border-[#E2E8F0] shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {dateRangeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-1.5 z-40 text-xs animate-in fade-in">
              {['Nov 1 – Nov 30, 2025', 'Oct 1 – Oct 31, 2025', 'Last 7 Days', 'Year to Date (2025)'].map(
                (range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setDateRangeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      selectedRange === range
                        ? 'bg-indigo-50 text-[#6366F1] font-semibold'
                        : 'text-[#0F172A] hover:bg-slate-50'
                    }`}
                  >
                    {range}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ROW 1: Top Active Products (Full width card, horizontal scroll/list) */}
      <section
        id="top-active-products-card"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs"
        aria-label="Top Active Products"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-base font-semibold text-[#0F172A]">Top Active Products</h2>
          </div>
          <span className="text-xs text-[#64748B] font-medium">Monthly Ticket Distribution</span>
        </div>

        {/* Horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {TOP_PRODUCTS.map((prod) => {
            const accentClass =
              prod.accent === 'primary'
                ? 'bg-[#6366F1]'
                : prod.accent === 'secondary'
                ? 'bg-[#3B82F6]'
                : 'bg-[#B95F00]';

            return (
              <div
                key={prod.id}
                id={`product-card-${prod.id}`}
                className="min-w-[190px] flex-1 bg-slate-50/70 hover:bg-slate-50 transition-all rounded-xl border border-slate-200/80 p-3.5 relative overflow-hidden flex flex-col justify-between group cursor-pointer"
              >
                {/* Accent bar at the top */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${accentClass}`} />

                <div className="pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#0F172A] group-hover:text-[#6366F1] transition-colors">
                      {prod.name}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        prod.trendType === 'up'
                          ? 'bg-emerald-50 text-emerald-700'
                          : prod.trendType === 'down'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-indigo-50 text-[#6366F1]'
                      }`}
                    >
                      {prod.trend}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xl font-bold text-[#0F172A] tracking-tight">
                      {prod.tickets}{' '}
                      <span className="text-xs font-normal text-[#64748B]">tickets</span>
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">this month</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROW 2: Performance Metrics (3 cards, equal width) */}
      <section
        id="performance-metrics-row"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        aria-label="Performance Metrics"
      >
        {/* Card 1: Tickets Resolved */}
        <div
          id="metric-tickets-resolved"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#64748B]">Tickets Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#0F172A] tracking-tight">1,247</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center text-xs font-semibold text-[#6366F1]">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +18.2% vs last week
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5 pt-2 border-t border-slate-100">
              Avg. response time: <span className="font-semibold text-slate-700">2.4hrs</span>
            </p>
          </div>
        </div>

        {/* Card 2: Tasks Completed */}
        <div
          id="metric-tasks-completed"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#64748B]">Tasks Completed</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#0F172A] tracking-tight">89</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center text-xs font-semibold text-[#6366F1]">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +6% vs last week
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700">16 tasks</span> still in review
            </p>
          </div>
        </div>

        {/* Card 3: Upcoming Deadlines */}
        <div
          id="metric-upcoming-deadlines"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#64748B]">Upcoming Deadlines</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#B95F00] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#0F172A] tracking-tight">7</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center text-xs font-semibold text-[#64748B]">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                -2.3% vs last week
              </span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                fewer is better
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5 pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-700">2 projects</span> due before Friday
            </p>
          </div>
        </div>
      </section>

      {/* ROW 3: Upcoming Deadlines / Tickets (Left 6 cols / Right 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Ticket Queue – Urgent */}
        <div
          id="ticket-queue-urgent-card"
          className="lg:col-span-6 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                <h3 className="text-base font-semibold text-[#0F172A]">Ticket Queue – Urgent</h3>
              </div>
              <span className="text-xs bg-red-50 text-[#DC2626] font-semibold px-2 py-0.5 rounded-full">
                4 Action Items
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {URGENT_TICKETS.map((ticket) => {
                const isHigh = ticket.priority === 'High';
                return (
                  <div
                    key={ticket.id}
                    id={`urgent-ticket-${ticket.id}`}
                    className="py-3 px-2 rounded-xl hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3 cursor-pointer group"
                    onClick={() => alert(`Opening urgent ticket: ${ticket.code}`)}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Priority Dot */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                          isHigh ? 'bg-[#DC2626]' : 'bg-[#B95F00]'
                        }`}
                        title={`${ticket.priority} Priority`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#6366F1] font-mono group-hover:underline">
                            {ticket.code}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-[#0F172A] truncate">
                            {ticket.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#64748B] mt-1">
                          <span>
                            Priority:{' '}
                            <strong className={isHigh ? 'text-[#DC2626]' : 'text-[#B95F00]'}>
                              {ticket.priority}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Product: <span className="font-medium text-slate-700">{ticket.product}</span>
                          </span>
                          <span>•</span>
                          <span>
                            PIC: <span className="font-medium text-slate-700">{ticket.pic}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
            <span>Sorted by SLA urgency</span>
            <button
              onClick={() => alert('Viewing full urgent queue')}
              className="text-[#6366F1] font-semibold hover:underline"
            >
              View all tickets →
            </button>
          </div>
        </div>

        {/* Right Card: Today's Schedule / Activity */}
        <div
          id="todays-schedule-card"
          className="lg:col-span-6 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6366F1]" />
                <h3 className="text-base font-semibold text-[#0F172A]">Today&apos;s Schedule / Activity</h3>
              </div>
              <span className="text-xs bg-indigo-50 text-[#6366F1] font-semibold px-2 py-0.5 rounded-full">
                Nov 30, 2025
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {TODAY_SCHEDULE.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-[#6366F1] bg-indigo-50 px-2 py-1 rounded-lg">
                      {item.time}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-[#0F172A]">{item.title}</div>
                      <div className="text-[10px] text-[#64748B]">{item.category}</div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Footer Note */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/80">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B95F00]" />
              <span className="text-xs font-medium text-slate-800">
                <strong className="text-[#B95F00]">Two deadlines this week:</strong> 2 projects due
                before Friday
              </span>
            </div>
            <button
              onClick={() => alert('Opening schedule calendar')}
              className="text-xs text-[#6366F1] font-semibold hover:underline"
            >
              Open Calendar
            </button>
          </div>
        </div>
      </div>

      {/* ROW 4: Historical Trend Chart (Full width) */}
      <section
        id="ticket-volume-trend-card"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs"
        aria-label="Ticket Volume Trend"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Ticket Volume Trend (Last 6 Months)
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Monthly cross-product ticket submissions and resolution volumes
            </p>
          </div>

          {/* Top-Right Annotation */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold self-start sm:self-auto">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.3% growth vs. last quarter</span>
          </div>
        </div>

        {/* Clean Responsive SVG Chart */}
        <div className="relative w-full overflow-hidden pt-2">
          <div className="w-full aspect-[21/6] min-h-[220px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="ticketTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[150, 200, 250, 300, 350].map((val) => {
                const y =
                  chartHeight -
                  paddingY -
                  ((val - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="#94A3B8"
                      className="font-mono font-medium"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              <path d={areaD} fill="url(#ticketTrendGrad)" />

              {/* Primary Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#6366F1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & X Labels */}
              {points.map((p, idx) => {
                const isHovered = hoveredDataPoint === idx;
                return (
                  <g
                    key={p.month}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDataPoint(idx)}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  >
                    {/* Circle */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? '7' : '4.5'}
                      fill="#FFFFFF"
                      stroke="#6366F1"
                      strokeWidth={isHovered ? '3.5' : '2.5'}
                      className="transition-all duration-150"
                    />

                    {/* Value Tooltip Label on Hover / Active */}
                    {isHovered && (
                      <g transform={`translate(${p.x}, ${p.y - 14})`}>
                        <rect
                          x="-24"
                          y="-20"
                          width="48"
                          height="20"
                          rx="6"
                          fill="#0F172A"
                        />
                        <text
                          x="0"
                          y="-6"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="11"
                          fontWeight="bold"
                          className="font-mono"
                        >
                          {p.count}
                        </text>
                      </g>
                    )}

                    {/* X-axis Label */}
                    <text
                      x={p.x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="500"
                      fill="#64748B"
                    >
                      {p.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* ROW 5: Breakdown (2 columns, equal width 6/6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Tickets by Product */}
        <div
          id="tickets-by-product-breakdown-card"
          className="lg:col-span-6 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-semibold text-[#0F172A]">Tickets by Product</h3>
            <span className="text-xs text-[#64748B]">Relative Distribution</span>
          </div>

          <div className="space-y-4 mt-4">
            {TICKETS_BY_PRODUCT_DATA.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#0F172A]">{item.name}</span>
                  <span className="font-mono text-slate-700">{item.pct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Tickets by Status */}
        <div
          id="tickets-by-status-card"
          className="lg:col-span-6 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-[#0F172A]">Tickets by Status</h3>
              <span className="text-xs text-[#64748B]">Lifecycle Breakdown</span>
            </div>

            {/* Segmented Stacked Progress Bar */}
            <div className="mt-4">
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                {TICKETS_BY_STATUS_DATA.map((item) => (
                  <div
                    key={item.name}
                    className="h-full transition-all duration-300 hover:opacity-90"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.color,
                    }}
                    title={`${item.name}: ${item.pct}%`}
                  />
                ))}
              </div>
            </div>

            {/* Detailed Legend and Metrics List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              {TICKETS_BY_STATUS_DATA.map((item) => (
                <div
                  key={item.name}
                  className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-[#64748B]">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold text-[#0F172A] mt-1 font-mono">
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
            <span>Active cycle: Nov 2025</span>
            <span className="font-semibold text-slate-700">100% Total Audited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
