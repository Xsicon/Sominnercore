import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Building,
  ShieldCheck,
  FileText,
  Lock,
  Wallet,
  Receipt,
  Percent,
} from 'lucide-react';

export interface PayHistoryRecord {
  id: string;
  payPeriod: string;
  hours: number;
  grossPay: number;
  netPay: number;
  status: 'Processing' | 'Finalized';
  rate: number;
  regularHours: number;
  overtimeHours: number;
  deductions: number;
  payDate?: string;
  breakdown?: {
    federalTax: number;
    stateTax: number;
    medicare: number;
    socialSecurity: number;
    benefits: number;
  };
}

const PAY_HISTORY_RECORDS: PayHistoryRecord[] = [
  {
    id: 'pay-1',
    payPeriod: 'Nov 1 – Nov 15, 2025',
    hours: 80.0,
    grossPay: 3600.0,
    netPay: 2880.0,
    status: 'Processing',
    rate: 45.0,
    regularHours: 80.0,
    overtimeHours: 0.0,
    deductions: 720.0,
    payDate: 'Estimated: Nov 20, 2025',
    breakdown: {
      federalTax: 396.0,
      stateTax: 144.0,
      socialSecurity: 108.0,
      medicare: 36.0,
      benefits: 36.0,
    },
  },
  {
    id: 'pay-2',
    payPeriod: 'Oct 16 – Oct 31, 2025',
    hours: 76.5,
    grossPay: 3442.5,
    netPay: 2754.0,
    status: 'Finalized',
    rate: 45.0,
    regularHours: 76.5,
    overtimeHours: 0.0,
    deductions: 688.5,
    payDate: 'Paid: Nov 05, 2025',
    breakdown: {
      federalTax: 378.0,
      stateTax: 138.0,
      socialSecurity: 103.5,
      medicare: 34.5,
      benefits: 34.5,
    },
  },
  {
    id: 'pay-3',
    payPeriod: 'Oct 1 – Oct 15, 2025',
    hours: 78.0,
    grossPay: 3510.0,
    netPay: 2808.0,
    status: 'Finalized',
    rate: 45.0,
    regularHours: 78.0,
    overtimeHours: 0.0,
    deductions: 702.0,
    payDate: 'Paid: Oct 20, 2025',
    breakdown: {
      federalTax: 386.0,
      stateTax: 140.0,
      socialSecurity: 105.0,
      medicare: 35.5,
      benefits: 35.5,
    },
  },
  {
    id: 'pay-4',
    payPeriod: 'Sep 16 – Sep 30, 2025',
    hours: 74.0,
    grossPay: 3330.0,
    netPay: 2664.0,
    status: 'Finalized',
    rate: 45.0,
    regularHours: 74.0,
    overtimeHours: 0.0,
    deductions: 666.0,
    payDate: 'Paid: Oct 05, 2025',
    breakdown: {
      federalTax: 366.0,
      stateTax: 133.0,
      socialSecurity: 100.0,
      medicare: 33.5,
      benefits: 33.5,
    },
  },
  {
    id: 'pay-5',
    payPeriod: 'Sep 1 – Sep 15, 2025',
    hours: 80.0,
    grossPay: 3600.0,
    netPay: 2880.0,
    status: 'Finalized',
    rate: 45.0,
    regularHours: 80.0,
    overtimeHours: 0.0,
    deductions: 720.0,
    payDate: 'Paid: Sep 20, 2025',
    breakdown: {
      federalTax: 396.0,
      stateTax: 144.0,
      socialSecurity: 108.0,
      medicare: 36.0,
      benefits: 36.0,
    },
  },
  {
    id: 'pay-6',
    payPeriod: 'Aug 16 – Aug 31, 2025',
    hours: 76.0,
    grossPay: 3420.0,
    netPay: 2736.0,
    status: 'Finalized',
    rate: 45.0,
    regularHours: 76.0,
    overtimeHours: 0.0,
    deductions: 684.0,
    payDate: 'Paid: Sep 05, 2025',
    breakdown: {
      federalTax: 376.0,
      stateTax: 137.0,
      socialSecurity: 102.5,
      medicare: 34.25,
      benefits: 34.25,
    },
  },
];

interface MyPayViewProps {
  selectedPayPeriodFilter?: string;
}

export const MyPayView: React.FC<MyPayViewProps> = ({
  selectedPayPeriodFilter = 'all',
}) => {
  // Expandable row state: tracks set of expanded row IDs (defaulting row 1 to open for instant delight)
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({
    'pay-1': true,
  });

  const toggleRow = (id: string) => {
    setExpandedRowIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredRecords = PAY_HISTORY_RECORDS.filter((rec) => {
    if (selectedPayPeriodFilter === 'all') return true;
    return rec.payPeriod === selectedPayPeriodFilter;
  });

  return (
    <div
      id="my-pay-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              My Pay
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Read-Only</span>
            </span>
          </div>
          <p className="text-xs text-[#64748B] font-medium">
            View your earnings and pay history.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-[#E2E8F0] shadow-2xs text-xs font-medium text-slate-700">
          <Wallet className="w-3.5 h-3.5 text-[#6366F1]" />
          <span>Pay Rate: <strong className="text-slate-900 font-mono">$45.00/hr</strong> (Semi-monthly ACH)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: CURRENT PAY SUMMARY (3 cards, equal width)                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: This Period */}
        <div
          id="my-pay-card-this-period"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                This Period
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#B95F00] border border-amber-200">
                <span>🟡</span>
                <span>Processing</span>
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-[#0F172A]">Nov 1 – Nov 15, 2025</h3>
              <p className="text-3xl font-extrabold text-[#0F172A] font-mono">$3,600.00</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Hours: <strong className="text-slate-800 font-bold font-mono">80.0</strong></span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Net: $2,880.00</span>
          </div>
        </div>

        {/* Card 2: Previous Period */}
        <div
          id="my-pay-card-prev-period"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Previous Period
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                <span>✅</span>
                <span>Finalized</span>
              </span>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-[#0F172A]">Oct 16 – Oct 31, 2025</h3>
              <p className="text-3xl font-extrabold text-[#0F172A] font-mono">$3,442.50</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Hours: <strong className="text-slate-800 font-bold font-mono">76.5</strong></span>
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Paid Nov 05
            </span>
          </div>
        </div>

        {/* Card 3: YTD Summary */}
        <div
          id="my-pay-card-ytd"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                YTD Summary
              </span>
              <span className="p-1 rounded-md bg-indigo-50 text-[#6366F1]">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-500">Total Gross</span>
              <p className="text-3xl font-extrabold text-[#0F172A] font-mono">$54,022.50</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">
              Total Hours: <strong className="text-slate-800 font-bold font-mono">1,200.5</strong>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Avg/Period: <strong className="text-slate-800">$3,371.25</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2 & 3: PAY HISTORY (Full width table with expandable details)          */}
      {/* ========================================================================= */}
      <div
        id="card-pay-history-table"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        <div className="p-4 sm:px-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#6366F1]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Pay History</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Click any row to expand gross pay breakdown & deduction details
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Pay Period</th>
                <th className="py-3.5 px-4 font-bold text-right">Hours</th>
                <th className="py-3.5 px-4 font-bold text-right">Gross Pay</th>
                <th className="py-3.5 px-4 font-bold text-right">Net Pay</th>
                <th className="py-3.5 px-4 font-bold text-center">Status</th>
                <th className="py-3.5 px-4 font-bold text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((row) => {
                const isExpanded = !!expandedRowIds[row.id];
                const isFinalized = row.status === 'Finalized';

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      id={`pay-history-row-${row.id}`}
                      onClick={() => toggleRow(row.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer select-none group ${
                        isExpanded ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      {/* Pay Period */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6366F1] transition-colors" />
                          <span>{row.payPeriod}</span>
                        </div>
                      </td>

                      {/* Hours */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-right whitespace-nowrap">
                        {row.hours.toFixed(1)}
                      </td>

                      {/* Gross Pay */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right whitespace-nowrap">
                        ${row.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Net Pay */}
                      <td className="py-3.5 px-4 font-mono font-extrabold text-[#0F172A] text-right whitespace-nowrap">
                        ${row.netPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isFinalized ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                            <span>✅</span>
                            <span>Finalized</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#B95F00] border border-amber-200">
                            <span>🟡</span>
                            <span>Processing</span>
                          </span>
                        )}
                      </td>

                      {/* Expand/Collapse Chevron */}
                      <td className="py-3.5 px-4 text-center text-slate-400 group-hover:text-slate-600 transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </td>
                    </tr>

                    {/* ROW 3: PAY DETAILS (Accordion expanded view) */}
                    {isExpanded && (
                      <tr id={`pay-details-expanded-${row.id}`} className="bg-slate-50/90 border-b border-slate-200">
                        <td colSpan={6} className="p-4 sm:p-5">
                          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#6366F1]" />
                                <span className="text-xs font-bold text-slate-900">
                                  Pay Statement Details — {row.payPeriod}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {row.payDate}
                              </span>
                            </div>

                            {/* Key Pay Detail Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Rate
                                </span>
                                <span className="text-xs font-bold text-slate-900 font-mono">
                                  ${row.rate.toFixed(2)}/hr
                                </span>
                              </div>

                              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Regular Hours
                                </span>
                                <span className="text-xs font-bold text-slate-900 font-mono">
                                  {row.regularHours.toFixed(1)} hrs
                                </span>
                              </div>

                              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                  Overtime
                                </span>
                                <span className="text-xs font-bold text-slate-900 font-mono">
                                  {row.overtimeHours.toFixed(1)} hrs
                                </span>
                              </div>

                              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-100">
                                <span className="text-[10px] uppercase font-bold text-rose-500 block">
                                  Deductions
                                </span>
                                <span className="text-xs font-bold text-rose-700 font-mono">
                                  -${row.deductions.toFixed(2)}
                                </span>
                              </div>

                              <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 col-span-2 sm:col-span-1">
                                <span className="text-[10px] uppercase font-bold text-[#6366F1] block">
                                  Net Pay
                                </span>
                                <span className="text-sm font-extrabold text-[#0F172A] font-mono">
                                  ${row.netPay.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Additional Line-Item Tax/Deduction Breakdown */}
                            {row.breakdown && (
                              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-y-1">
                                <span>Federal Tax: <strong className="text-slate-700 font-mono">${row.breakdown.federalTax.toFixed(2)}</strong></span>
                                <span>State Tax: <strong className="text-slate-700 font-mono">${row.breakdown.stateTax.toFixed(2)}</strong></span>
                                <span>Social Security: <strong className="text-slate-700 font-mono">${row.breakdown.socialSecurity.toFixed(2)}</strong></span>
                                <span>Medicare: <strong className="text-slate-700 font-mono">${row.breakdown.medicare.toFixed(2)}</strong></span>
                                <span>Benefits & Insurance: <strong className="text-slate-700 font-mono">${row.breakdown.benefits.toFixed(2)}</strong></span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
