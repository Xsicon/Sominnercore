import React, { useState } from 'react';
import {
  Ticket,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  GitPullRequest,
  ShieldAlert,
  Plus,
  RefreshCw,
  Box,
  Layers,
  Activity,
  Check,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate?: (id: string, label: string) => void;
  onOpenTicketDetail?: (ticketId: string) => void;
  onOpenTaskDetail?: (taskId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenTicketDetail,
  onOpenTaskDetail,
}) => {
  const [lastUpdated] = useState('2 min ago');

  return (
    <div
      id="overview-dashboard-page"
      className="space-y-6 max-w-7xl w-full mx-auto animate-in fade-in duration-150"
    >
      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* Headline: "Good morning, Adeel." (InterDisplay, 28px, 600 weight, tight)  */}
      {/* Subtext: "Here's what's happening across your operations platform." (16px) */}
      {/* Right: A subtle "Last updated: 2 min ago" (12px, muted grey) - NO buttons */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h1
            className="text-[28px] font-[600] tracking-[-0.02em] text-[#1A1A1A] dark:text-[#F8FAFC] leading-tight"
            style={{
              fontFamily:
                'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Good morning, Adeel.
          </h1>
          <p
            className="text-[16px] font-[500] text-[#64748B] dark:text-[#94A3B8] mt-0.5 leading-normal"
            style={{
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Here's what's happening across your operations platform.
          </p>
        </div>
        <div className="text-[12px] font-[500] text-[#94A3B8] dark:text-[#64748B] shrink-0 self-start sm:self-center">
          Last updated: {lastUpdated}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: System Status & Welcome (Full width card, Attio-style)              */}
      {/* Left: 🟢 "All Systems Operational" (16px, 600 weight, Primary text)        */}
      {/* Subtext: "All 6 products are online and operating normally." (14px)        */}
      {/* Right: "View Status Page" ghost link                                      */}
      {/* Stats (4 compact inline metrics within the same card): 6 / 14 / 247 / 98.7%*/}
      {/* ========================================================================= */}
      <div
        id="card-system-status-welcome"
        className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-5 transition-all duration-150"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0 animate-pulse" />
            <div>
              <div className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#818CF8] flex items-center gap-2">
                <span>All Systems Operational</span>
              </div>
              <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] font-[450] mt-0.5">
                All 6 products are online and operating normally.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('product-registry', 'Product Registry')}
            className="text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer self-start md:self-center inline-flex items-center gap-1 group"
          >
            <span>View Status Page</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4 compact inline metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center sm:text-left">
          <div className="p-2 sm:pl-0 sm:pr-4 border-r border-transparent sm:border-[#E2E8F0] dark:sm:border-slate-800">
            <div className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              Active Products
            </div>
            <div className="text-[24px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] tracking-tight mt-0.5">
              6
            </div>
          </div>
          <div className="p-2 sm:pl-4 sm:pr-4 border-r border-transparent sm:border-[#E2E8F0] dark:sm:border-slate-800">
            <div className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              Online Agents
            </div>
            <div className="text-[24px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] tracking-tight mt-0.5">
              14
            </div>
          </div>
          <div className="p-2 sm:pl-4 sm:pr-4 border-r border-transparent sm:border-[#E2E8F0] dark:sm:border-slate-800">
            <div className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              Open Tickets
            </div>
            <div className="text-[24px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] tracking-tight mt-0.5">
              247
            </div>
          </div>
          <div className="p-2 sm:pl-4">
            <div className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              SLA Health
            </div>
            <div className="text-[24px] font-[600] text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
              98.7%
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: Key Metrics (4 cards, equal width)                                  */}
      {/* Card 1: Open Tickets (247, +12% ↑, 34 assigned to you · 8 unassigned, 68%)*/}
      {/* Card 2: Engineering Tasks (89, -4% ↓, 16 in review · 32 remaining, 54%)   */}
      {/* Card 3: SLA Compliance (98.7%, +2.1% ↑, 3 SLA breaches this week, 99%)     */}
      {/* Card 4: Pending Approvals (14, Requires attention, 8 waiting > 24h, 30%)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Open Tickets */}
        <div
          id="metric-card-open-tickets"
          className="bg-white dark:bg-[#1E293B] rounded-[12px] p-5 border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] transition-all duration-150 hover:border-slate-300 dark:hover:border-[#6366F1]/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              Open Tickets
            </span>
            <span className="text-[12px] font-[500] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              +12% ↑
            </span>
          </div>
          <div
            className="text-[36px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] tracking-tight mt-2 leading-none"
            style={{
              fontFamily:
                'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            247
          </div>
          <div className="text-[13px] font-[450] text-[#64748B] dark:text-[#94A3B8] mt-2 truncate">
            34 assigned to you · 8 unassigned
          </div>
          {/* Progress bar (68%) */}
          <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#6366F1] dark:bg-[#818CF8] h-full rounded-full transition-all duration-300"
              style={{ width: '68%' }}
            />
          </div>
        </div>

        {/* Card 2: Engineering Tasks */}
        <div
          id="metric-card-engineering-tasks"
          className="bg-white dark:bg-[#1E293B] rounded-[12px] p-5 border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] transition-all duration-150 hover:border-slate-300 dark:hover:border-[#6366F1]/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              Engineering Tasks
            </span>
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-0.5">
              -4% ↓
            </span>
          </div>
          <div
            className="text-[36px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] tracking-tight mt-2 leading-none"
            style={{
              fontFamily:
                'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            89
          </div>
          <div className="text-[13px] font-[450] text-[#64748B] dark:text-[#94A3B8] mt-2 truncate">
            16 in review · 32 remaining
          </div>
          {/* Progress bar (54%) */}
          <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#6366F1] dark:bg-[#818CF8] h-full rounded-full transition-all duration-300"
              style={{ width: '54%' }}
            />
          </div>
        </div>

        {/* Card 3: SLA Compliance */}
        <div
          id="metric-card-sla-compliance"
          className="bg-white dark:bg-[#1E293B] rounded-[12px] p-5 border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] transition-all duration-150 hover:border-slate-300 dark:hover:border-[#6366F1]/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              SLA Compliance
            </span>
            <span className="text-[12px] font-[500] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              +2.1% ↑
            </span>
          </div>
          <div
            className="text-[36px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] tracking-tight mt-2 leading-none"
            style={{
              fontFamily:
                'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            98.7%
          </div>
          <div className="text-[13px] font-[450] text-[#B95F00] dark:text-amber-400 mt-2 truncate">
            3 SLA breaches this week
          </div>
          {/* Progress bar (99%) */}
          <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#6366F1] dark:bg-[#818CF8] h-full rounded-full transition-all duration-300"
              style={{ width: '99%' }}
            />
          </div>
        </div>

        {/* Card 4: Pending Approvals */}
        <div
          id="metric-card-pending-approvals"
          className="bg-white dark:bg-[#1E293B] rounded-[12px] p-5 border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] transition-all duration-150 hover:border-slate-300 dark:hover:border-[#6366F1]/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              Pending Approvals
            </span>
            <span className="text-[12px] font-[500] text-[#B95F00] dark:text-amber-400 flex items-center gap-0.5">
              Requires attention
            </span>
          </div>
          <div
            className="text-[36px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] tracking-tight mt-2 leading-none"
            style={{
              fontFamily:
                'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            14
          </div>
          <div className="text-[13px] font-[450] text-[#64748B] dark:text-[#94A3B8] mt-2 truncate">
            8 waiting &gt; 24h
          </div>
          {/* Progress bar (30% Tertiary) */}
          <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#B95F00] dark:bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: '30%' }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: Work Overview (Two columns, 60% / 40%)                              */}
      {/* Left Card (60%): "Your Open Tickets"                                      */}
      {/* Right Card (40%): "Your Active Tasks"                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {/* Left Card (60% -> 6 cols): Your Open Tickets */}
        <div
          id="card-your-open-tickets"
          className="lg:col-span-6 bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-5 transition-all duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <h2
              className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]"
              style={{
                fontFamily:
                  'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Your Open Tickets
            </h2>
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              4 tickets assigned
            </span>
          </div>

          <div className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
            {/* 1. #4210 — Checkout failing on mobile */}
            <div className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                    #4210 — Checkout failing on mobile
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="font-medium text-[#6366F1] dark:text-[#818CF8]">
                    MuuqWear
                  </span>
                  <span>·</span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    High priority
                  </span>
                  <span>·</span>
                  <span>2.4hrs SLA remaining</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('support-tickets', 'Support Tickets');
                  onOpenTicketDetail?.('4210');
                }}
                className="px-2.5 py-1 text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer shrink-0"
              >
                View
              </button>
            </div>

            {/* 2. #4205 — Payment gateway error */}
            <div className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                    #4205 — Payment gateway error
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="font-medium text-[#6366F1] dark:text-[#818CF8]">
                    Ilays
                  </span>
                  <span>·</span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    High priority
                  </span>
                  <span>·</span>
                  <span className="text-[#B95F00] dark:text-amber-400 font-medium">
                    0.8hrs SLA remaining (warning)
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('support-tickets', 'Support Tickets');
                  onOpenTicketDetail?.('4205');
                }}
                className="px-2.5 py-1 text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer shrink-0"
              >
                View
              </button>
            </div>

            {/* 3. #4201 — Cannot update shipping address */}
            <div className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                    #4201 — Cannot update shipping address
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="font-medium text-[#6366F1] dark:text-[#818CF8]">
                    MuuqWear
                  </span>
                  <span>·</span>
                  <span>Low priority</span>
                  <span>·</span>
                  <span>4.7hrs SLA remaining</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('support-tickets', 'Support Tickets');
                  onOpenTicketDetail?.('4201');
                }}
                className="px-2.5 py-1 text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer shrink-0"
              >
                View
              </button>
            </div>

            {/* 4. #4198 — Order confirmation not sending */}
            <div className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                    #4198 — Order confirmation not sending
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="font-medium text-[#6366F1] dark:text-[#818CF8]">
                    Salguri
                  </span>
                  <span>·</span>
                  <span>Medium priority</span>
                  <span>·</span>
                  <span>6.2hrs SLA remaining</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('support-tickets', 'Support Tickets');
                  onOpenTicketDetail?.('4198');
                }}
                className="px-2.5 py-1 text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer shrink-0"
              >
                View
              </button>
            </div>
          </div>

          {/* "View All Tickets" ghost link */}
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
            <button
              id="btn-view-all-tickets-overview"
              onClick={() => onNavigate?.('support-tickets', 'Support Tickets')}
              className="text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer inline-flex items-center gap-1 group"
            >
              <span>View All Tickets</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Card (40% -> 4 cols): Your Active Tasks */}
        <div
          id="card-your-active-tasks"
          className="lg:col-span-4 bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-5 transition-all duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <h2
              className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]"
              style={{
                fontFamily:
                  'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Your Active Tasks
            </h2>
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              3 assigned
            </span>
          </div>

          <div className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
            {/* 1. ENG-35 — Payment gateway integration */}
            <div className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                  ENG-35 — Payment gateway integration
                </div>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-[#3B82F6] border border-blue-200 dark:border-blue-800">
                    In Progress
                  </span>
                  <span>·</span>
                  <span>8 pts</span>
                  <span>·</span>
                  <span>Due Nov 20</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('task-board', 'Task Board');
                  onOpenTaskDetail?.('ENG-35');
                }}
                className="px-2.5 py-1 text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer shrink-0"
              >
                View
              </button>
            </div>

            {/* 2. ENG-30 — 3DS verification fix */}
            <div className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                  ENG-30 — 3DS verification fix
                </div>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-[#B95F00] dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    In Review
                  </span>
                  <span>·</span>
                  <span>3 pts</span>
                  <span>·</span>
                  <span>Due Nov 18</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('task-board', 'Task Board');
                  onOpenTaskDetail?.('ENG-30');
                }}
                className="px-2.5 py-1 text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer shrink-0"
              >
                View
              </button>
            </div>

            {/* 3. ENG-25 — User profile update */}
            <div className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                  ENG-25 — User profile update
                </div>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Done
                  </span>
                  <span>·</span>
                  <span>3 pts</span>
                  <span>·</span>
                  <span>Completed Nov 14</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('task-board', 'Task Board');
                  onOpenTaskDetail?.('ENG-25');
                }}
                className="px-2.5 py-1 text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer shrink-0"
              >
                View
              </button>
            </div>
          </div>

          {/* "View All Tasks" ghost link */}
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
            <button
              id="btn-view-all-tasks-overview"
              onClick={() => onNavigate?.('task-board', 'Task Board')}
              className="text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer inline-flex items-center gap-1 group"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 4: Recent Activity & Quick Actions (Two columns, 50% / 50%)            */}
      {/* Left Card (50%): "Recent Activity" (5 events)                             */}
      {/* Right Card (50%): "Quick Actions & What's New"                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Card (50%): Recent Activity */}
        <div
          id="card-recent-activity-overview"
          className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-5 transition-all duration-150"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <h2
              className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]"
              style={{
                fontFamily:
                  'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Recent Activity
            </h2>
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
              Live event stream
            </span>
          </div>

          <div className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
            {/* Event 1 */}
            <div className="py-3 flex items-start gap-3 text-[13px]">
              <div className="w-2 h-2 rounded-full bg-[#6366F1] dark:bg-[#818CF8] mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Adeel D.
                </span>{' '}
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  closed ticket #4210 (MuuqWear)
                </span>
                <div className="text-[11px] text-[#94A3B8] dark:text-[#64748B] mt-0.5">
                  2 min ago
                </div>
              </div>
            </div>

            {/* Event 2 */}
            <div className="py-3 flex items-start gap-3 text-[13px]">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  System
                </span>{' '}
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  SLA breach warning for #3981 (Salguri)
                </span>
                <div className="text-[11px] text-[#94A3B8] dark:text-[#64748B] mt-0.5">
                  14 min ago
                </div>
              </div>
            </div>

            {/* Event 3 */}
            <div className="py-3 flex items-start gap-3 text-[13px]">
              <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Ibrahim M.
                </span>{' '}
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  escalated #4055 to Sev2
                </span>
                <div className="text-[11px] text-[#94A3B8] dark:text-[#64748B] mt-0.5">
                  1 hour ago
                </div>
              </div>
            </div>

            {/* Event 4 */}
            <div className="py-3 flex items-start gap-3 text-[13px]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Leila H.
                </span>{' '}
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  logged 2.5 hours on ENG-23
                </span>
                <div className="text-[11px] text-[#94A3B8] dark:text-[#64748B] mt-0.5">
                  2 hours ago
                </div>
              </div>
            </div>

            {/* Event 5 */}
            <div className="py-3 flex items-start gap-3 text-[13px]">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  GitHub Sync
                </span>{' '}
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  PR merged for ENG-30
                </span>
                <div className="text-[11px] text-[#94A3B8] dark:text-[#64748B] mt-0.5">
                  3 hours ago
                </div>
              </div>
            </div>
          </div>

          {/* "View All Activity" ghost link */}
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
            <button
              id="btn-view-all-activity-overview"
              onClick={() => onNavigate?.('audit-logs', 'Audit Logs')}
              className="text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer inline-flex items-center gap-1 group"
            >
              <span>View All Activity</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Card (50%): Quick Actions & What's New */}
        <div
          id="card-quick-actions-whats-new"
          className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-5 transition-all duration-150 flex flex-col justify-between"
        >
          <div>
            <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
              <h2
                className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]"
                style={{
                  fontFamily:
                    'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Quick Actions &amp; What's New
              </h2>
            </div>

            {/* What's New List */}
            <div className="py-3 space-y-2.5">
              <div className="text-[11px] font-[600] uppercase tracking-wider text-[#94A3B8]">
                What's New
              </div>
              <div className="space-y-2 text-[13px] text-[#64748B] dark:text-[#94A3B8]">
                <div className="flex items-start gap-2">
                  <span className="text-[14px]">🔄</span>
                  <span>3 engineering tasks are blocked on review</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[14px]">📝</span>
                  <span>Draft payroll for August is pending approval</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[14px]">🔗</span>
                  <span>GitHub integration sync completed 5 min ago</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[14px]">📦</span>
                  <span>New product "Ilays" added to the Registry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions (Ghost links, subtle, not filled buttons) */}
          <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800">
            <div className="text-[11px] font-[600] uppercase tracking-wider text-[#94A3B8] mb-2.5">
              Quick Actions
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-quick-action-create-ticket"
                onClick={() => onNavigate?.('support-tickets', 'Support Tickets')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer"
              >
                <span>🎫</span>
                <span>Create Ticket</span>
              </button>

              <button
                id="btn-quick-action-new-task"
                onClick={() => onNavigate?.('task-board', 'Task Board')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer"
              >
                <span>📋</span>
                <span>New Task</span>
              </button>

              <button
                id="btn-quick-action-log-time"
                onClick={() => onNavigate?.('time-tracking', 'Time Tracking')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer"
              >
                <span>⏱️</span>
                <span>Log Time</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 5: Product Health (Full width card)                                    */}
      {/* Mini table (compact): MuuqWear, GaarX, Salguri, SomPay, Dhaxal, Ilays       */}
      {/* "View All Products" ghost link                                            */}
      {/* ========================================================================= */}
      <div
        id="card-product-health-overview"
        className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-5 transition-all duration-150"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
          <h2
            className="text-[18px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]"
            style={{
              fontFamily:
                'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Product Health Overview
          </h2>
          <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
            6 products monitored
          </span>
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-[13px] border-collapse mt-2">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-slate-800 text-[11px] font-[600] uppercase tracking-wider text-[#94A3B8]">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Open Tickets</th>
                <th className="py-2.5 px-3">SLA Health</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800 font-[450] text-[#1A1A1A] dark:text-[#F8FAFC]">
              {/* MuuqWear */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-[600]">MuuqWear</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64748B] dark:text-[#94A3B8]">42</td>
                <td className="py-3 px-3 font-[600] text-emerald-600 dark:text-emerald-400">
                  99.2%
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onNavigate?.('product-registry', 'Product Registry')}
                    className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>

              {/* GaarX */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-[600]">GaarX</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64748B] dark:text-[#94A3B8]">38</td>
                <td className="py-3 px-3 font-[600] text-emerald-600 dark:text-emerald-400">
                  98.1%
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onNavigate?.('product-registry', 'Product Registry')}
                    className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>

              {/* Salguri */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-[600]">Salguri</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1.5 text-[#B95F00] dark:text-amber-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#B95F00] dark:bg-amber-400"></span>
                    Degraded
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64748B] dark:text-[#94A3B8]">25</td>
                <td className="py-3 px-3 font-[600] text-[#B95F00] dark:text-amber-400">
                  94.3%
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onNavigate?.('product-registry', 'Product Registry')}
                    className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>

              {/* SomPay */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-[600]">SomPay</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64748B] dark:text-[#94A3B8]">15</td>
                <td className="py-3 px-3 font-[600] text-emerald-600 dark:text-emerald-400">
                  99.9%
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onNavigate?.('product-registry', 'Product Registry')}
                    className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>

              {/* Dhaxal */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-[600]">Dhaxal</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64748B] dark:text-[#94A3B8]">8</td>
                <td className="py-3 px-3 font-[600] text-emerald-600 dark:text-emerald-400">
                  100%
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onNavigate?.('product-registry', 'Product Registry')}
                    className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>

              {/* Ilays */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-[600]">Ilays</td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Operational
                  </span>
                </td>
                <td className="py-3 px-3 text-[#64748B] dark:text-[#94A3B8]">2</td>
                <td className="py-3 px-3 font-[600] text-emerald-600 dark:text-emerald-400">
                  100%
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onNavigate?.('product-registry', 'Product Registry')}
                    className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* "View All Products" ghost link */}
        <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 mt-2">
          <button
            id="btn-view-all-products-overview"
            onClick={() => onNavigate?.('product-registry', 'Product Registry')}
            className="text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer inline-flex items-center gap-1 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
