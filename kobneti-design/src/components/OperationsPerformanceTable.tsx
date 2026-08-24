import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { PerformanceRow } from '../types';
import { PERFORMANCE_DATA } from '../data/mockData';

export const OperationsPerformanceTable: React.FC = () => {
  const [data, setData] = useState<PerformanceRow[]>(PERFORMANCE_DATA);
  const [sortField, setSortField] = useState<keyof PerformanceRow | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [timeframe, setTimeframe] = useState('This Week');

  const handleSort = (field: keyof PerformanceRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }

    const sorted = [...data].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    setData(sorted);
  };

  const getStatusBadge = (status: 'Healthy' | 'Warning' | 'Operational') => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#6366F1] border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
            Healthy
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#B95F00] border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B95F00]"></span>
            Warning
          </span>
        );
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Operational
          </span>
        );
    }
  };

  return (
    <div
      id="operations-performance-card"
      className="bg-white rounded-[16px] p-5 border border-[#E2E8F0] shadow-xs"
    >
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">
            Operations Performance
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Key SLA, velocity, and incident benchmarks compared to preceding cycle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-medium text-slate-600">
            {['This Week', 'Last 30 Days', 'Quarterly'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeframe === t
                    ? 'bg-white text-[#0F172A] shadow-2xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => alert('Exporting full Operations Performance report...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#0F172A] hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#64748B]" />
            <span>View Report</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase bg-slate-50/60">
              <th
                onClick={() => handleSort('metric')}
                className="py-3 px-4 rounded-l-xl cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>METRIC</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('current')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>CURRENT</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('previous')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>PREVIOUS</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('change')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  <span>CHANGE</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 rounded-r-xl text-right">
                <span>STATUS</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((row, index) => {
              const isBreachRow = row.metric.includes('SLA Breaches');
              const isPositiveGreen =
                (row.change.startsWith('-') && (row.metric.includes('Resolution') || row.metric.includes('Backlog') || row.metric.includes('Incidents'))) ||
                (row.change.startsWith('+') && row.metric.includes('Rate'));

              return (
                <tr
                  key={index}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-medium text-[#0F172A] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#6366F1] transition-colors"></span>
                    <span>{row.metric}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                    {row.current}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">
                    {row.previous}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      {isBreachRow ? (
                        <span className="inline-flex items-center text-xs font-semibold text-[#DC2626]">
                          <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          {row.change}
                        </span>
                      ) : isPositiveGreen ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                          {row.change.startsWith('-') ? (
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          ) : (
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          )}
                          {row.change}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-[#64748B]">
                          {row.change}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {getStatusBadge(row.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
