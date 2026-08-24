import React from 'react';
import {
  Ticket,
  Code2,
  Clock,
  Shield,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { ACCESS_ITEMS } from '../data/mockData';

export const AccessSummaryCard: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ticket':
        return <Ticket className="w-4 h-4 text-[#6366F1]" />;
      case 'Code2':
        return <Code2 className="w-4 h-4 text-[#3B82F6]" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-[#059669]" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-[#8B5CF6]" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-[#6366F1]" />;
    }
  };

  return (
    <div
      id="access-summary-card"
      className="bg-white rounded-[16px] p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">
            Your Access Summary
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Role: Administrator (AD)
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      {/* Access Rows */}
      <div className="space-y-3">
        {ACCESS_ITEMS.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/80 hover:bg-slate-50 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bgColor}`}
            >
              {getIcon(item.icon)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#0F172A] leading-tight">
                {item.title}
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                {item.permission}
              </div>
            </div>
            <span className="text-emerald-600 shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#64748B] flex items-center justify-between">
        <span>SSO Authentication: Enforced</span>
        <span className="text-[#6366F1] font-medium cursor-pointer hover:underline">
          Request Elevation
        </span>
      </div>
    </div>
  );
};
