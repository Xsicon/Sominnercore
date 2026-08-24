import React from 'react';
import {
  Ticket,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import { MetricItem } from '../types';

interface MetricCardsProps {
  metrics: MetricItem[];
  isLoading?: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  isLoading = false,
}) => {
  const getIcon = (iconName: string, id: string) => {
    switch (id) {
      case 'open-tickets':
        return <Ticket className="w-5 h-5 text-[#6366F1]" />;
      case 'active-tasks':
        return <CheckCircle2 className="w-5 h-5 text-[#3B82F6]" />;
      case 'sla-compliance':
        return <ShieldCheck className="w-5 h-5 text-[#6366F1]" />;
      case 'pending-approvals':
        return <AlertCircle className="w-5 h-5 text-[#B95F00]" />;
      default:
        return <Ticket className="w-5 h-5 text-[#6366F1]" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-white rounded-[16px] p-5 border border-[#E2E8F0] shadow-xs animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-slate-200 rounded-md w-28"></div>
              <div className="w-9 h-9 bg-slate-100 rounded-xl"></div>
            </div>
            <div className="h-9 bg-slate-200 rounded-lg w-24 mb-3"></div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 bg-slate-200 rounded-full w-20"></div>
            </div>
            <div className="h-3 bg-slate-100 rounded w-32 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric) => {
        const isPrimaryMetric = metric.id === 'open-tickets';
        const isApprovalMetric = metric.id === 'pending-approvals';

        return (
          <div
            key={metric.id}
            id={`metric-card-${metric.id}`}
            className={`bg-white rounded-[16px] p-5 border transition-all duration-200 hover:shadow-md hover:border-slate-300 relative group ${
              isApprovalMetric
                ? 'border-l-4 border-l-[#B95F00] border-[#E2E8F0]'
                : 'border-[#E2E8F0]'
            }`}
          >
            {/* Top row: Label and Icon */}
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-[#64748B]">
                {metric.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isApprovalMetric
                    ? 'bg-amber-50 text-[#B95F00]'
                    : metric.id === 'active-tasks'
                    ? 'bg-blue-50 text-[#3B82F6]'
                    : 'bg-indigo-50 text-[#6366F1]'
                }`}
              >
                {getIcon(metric.icon, metric.id)}
              </div>
            </div>

            {/* Middle row: Big Number (36px) */}
            <div className="mt-2 mb-3">
              <div
                className={`text-[36px] font-semibold leading-tight tracking-tight ${
                  isPrimaryMetric ? 'text-[#6366F1]' : 'text-[#0F172A]'
                }`}
              >
                {metric.value}
              </div>
            </div>

            {/* Bottom row: Trend & Subtext */}
            <div className="space-y-1.5 pt-1 border-t border-slate-50">
              <div className="flex items-center gap-1.5">
                {metric.id === 'pending-approvals' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#B95F00] border border-amber-200/60">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {metric.trend}
                  </span>
                ) : metric.trendDirection === 'up' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366F1]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {metric.trend}
                  </span>
                ) : metric.trendDirection === 'down' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#64748B]">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {metric.trend}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[#64748B]">
                    {metric.trend}
                  </span>
                )}
              </div>
              <div className="text-xs text-[#64748B] flex items-center justify-between">
                <span>{metric.subtext}</span>
                {metric.id === 'open-tickets' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    SLA Alert
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
