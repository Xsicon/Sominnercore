import React from 'react';
import {
  History,
  Inbox,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';
import { ActivityItem } from '../types';

interface RecentActivityCardProps {
  activities: ActivityItem[];
  isEmpty?: boolean;
  onToggleEmptyState?: () => void;
  onSelectTicket?: (ticketId: string) => void;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  isEmpty = false,
  onToggleEmptyState,
  onSelectTicket,
}) => {
  return (
    <div
      id="recent-activity-card"
      className="bg-white rounded-[16px] p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#6366F1]" />
          <h2 className="text-base font-semibold text-[#0F172A]">
            Recent Activity
          </h2>
        </div>
        {onToggleEmptyState && (
          <button
            onClick={onToggleEmptyState}
            className="text-[11px] font-medium text-[#64748B] hover:text-[#0F172A] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Toggle empty state view"
          >
            {isEmpty ? 'Show Feed' : 'Simulate Empty'}
          </button>
        )}
      </div>

      {/* Content Feed or Empty State */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-[#64748B] flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[#0F172A] mb-1">
            No recent activity
          </h3>
          <p className="text-xs text-[#64748B] max-w-xs leading-relaxed">
            Operations and event streams are currently quiet. New ticket updates,
            approvals, and escalations will stream here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5 divide-y divide-slate-100/80">
          {activities.map((item, idx) => {
            const isSystem = item.actorType === 'system';
            return (
              <div
                key={item.id}
                className={`pt-3 first:pt-0 flex items-start gap-3 group transition-colors rounded-lg p-1.5 hover:bg-slate-50`}
              >
                {/* Actor Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs ${
                    item.avatarBg || 'bg-[#6366F1]'
                  }`}
                >
                  {isSystem ? 'SY' : item.actor.split(' ').map((n) => n[0]).join('')}
                </div>

                {/* Activity Detail */}
                <div className="flex-1 min-w-0 text-xs">
                  <p className="text-[#0F172A] leading-snug">
                    <span className="font-semibold text-slate-900">
                      [{item.actor}]
                    </span>{' '}
                    <span className="text-slate-600">{item.action}</span>{' '}
                    <button
                      onClick={() => onSelectTicket && onSelectTicket(item.target)}
                      className="font-semibold text-[#6366F1] hover:underline inline-flex items-center"
                    >
                      {item.target}
                    </button>
                    {item.productTag && (
                      <span className="text-slate-500 ml-1">
                        ({item.productTag})
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.timeAgo}</span>
                  </div>
                </div>

                {/* Action arrow */}
                <button
                  onClick={() => onSelectTicket && onSelectTicket(item.target)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-700"
                  title="View activity item"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
        <span>Audit Trail Logging: Active</span>
        <button className="text-[#6366F1] font-medium hover:underline text-[11px]">
          View Full Audit Log →
        </button>
      </div>
    </div>
  );
};
