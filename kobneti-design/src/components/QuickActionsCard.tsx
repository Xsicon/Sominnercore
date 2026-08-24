import React, { useState } from 'react';
import {
  RotateCw,
  FileText,
  Link2,
  Package,
  ArrowRight,
  Check,
  Zap,
} from 'lucide-react';
import { QuickActionItem } from '../types';
import { QUICK_ACTIONS } from '../data/mockData';

interface QuickActionsCardProps {
  onActionClick?: (item: QuickActionItem) => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onActionClick,
}) => {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const handleAction = (item: QuickActionItem) => {
    if (onActionClick) {
      onActionClick(item);
    } else {
      setCompletedActions((prev) => ({
        ...prev,
        [item.id]: true,
      }));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <RotateCw className="w-4 h-4 text-[#3B82F6]" />;
      case 'approval':
        return <FileText className="w-4 h-4 text-[#B95F00]" />;
      case 'sync':
        return <Link2 className="w-4 h-4 text-[#6366F1]" />;
      case 'product':
        return <Package className="w-4 h-4 text-[#059669]" />;
      default:
        return <Zap className="w-4 h-4 text-[#6366F1]" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'review':
        return 'bg-blue-50 text-[#3B82F6] border-blue-200/50';
      case 'approval':
        return 'bg-amber-50 text-[#B95F00] border-amber-200/50';
      case 'sync':
        return 'bg-indigo-50 text-[#6366F1] border-indigo-200/50';
      case 'product':
        return 'bg-emerald-50 text-[#059669] border-emerald-200/50';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id="quick-actions-card"
      className="bg-white rounded-[16px] p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#B95F00]" />
          <h2 className="text-base font-semibold text-[#0F172A]">
            Quick Actions & Updates
          </h2>
        </div>
        <span className="text-[11px] font-medium text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-full">
          4 Actions
        </span>
      </div>

      {/* Action Items */}
      <div className="space-y-3">
        {QUICK_ACTIONS.map((item) => {
          const isDone = completedActions[item.id];

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                  : 'bg-slate-50/60 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${getBadgeStyle(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-medium truncate ${
                      isDone ? 'line-through text-slate-400' : 'text-[#0F172A]'
                    }`}
                  >
                    {item.text}
                  </p>
                </div>
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={() => handleAction(item)}
                disabled={isDone}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-white hover:bg-[#6366F1] text-[#0F172A] hover:text-white border border-[#E2E8F0] shadow-2xs'
                }`}
              >
                {isDone ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-[#64748B] flex items-center justify-between">
        <span>Assigned Queue: 0 blockers</span>
        <button
          onClick={() => setCompletedActions({})}
          className="text-slate-400 hover:text-slate-600 text-[11px]"
        >
          Reset Statuses
        </button>
      </div>
    </div>
  );
};
