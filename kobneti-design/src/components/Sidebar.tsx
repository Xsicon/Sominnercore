import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Ticket,
  Code2,
  Clock,
  Users,
  Box,
  MessageSquare,
  Folder,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Layers,
  User,
  Settings,
} from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  collapsed: boolean;
  activeNav: string;
  onSelectNav: (id: string, label: string) => void;
  onToggleCollapse: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Ticket,
  Code2,
  Clock,
  Users,
  Box,
  MessageSquare,
  Folder,
  BarChart3,
  User,
  Settings,
};

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  activeNav,
  onSelectNav,
}) => {
  // Category expanded state - Engineering expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'tickets-support': false,
    'engineering': false,
    'time-payroll': true,
    'people-teams': false,
    'products': false,
    'communication': false,
    'resources-files': false,
    'system-analytics': false,
  });

  // Auto-expand category containing activeNav
  useEffect(() => {
    navItems.forEach((cat) => {
      if (cat.subItems?.some((sub) => sub.id === activeNav)) {
        setExpandedCategories((prev) => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [activeNav]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      iconName: 'LayoutDashboard',
    },
    {
      id: 'tickets-support',
      label: 'Tickets & Support',
      iconName: 'Ticket',
      badge: '12',
      badgeType: 'primary',
      subItems: [
        { id: 'support-tickets', label: 'Support Tickets', badge: '8', badgeType: 'neutral' },
        { id: 'live-chat', label: 'Live Chat', badge: '4', badgeType: 'primary' },
        { id: 'escalations', label: 'Escalations & Incidents', badge: '2', badgeType: 'danger' },
        { id: 'knowledge-base', label: 'Knowledge Base' },
      ],
    },
    {
      id: 'engineering',
      label: 'Engineering',
      iconName: 'Code2',
      badge: '4',
      badgeType: 'tertiary',
      subItems: [
        { id: 'task-board', label: 'Task Board', badge: '4', badgeType: 'tertiary' },
        { id: 'sprints-backlog', label: 'Sprints & Backlog' },
        { id: 'project-roadmap', label: 'Project Roadmap' },
        { id: 'github-activity', label: 'GitHub Activity' },
      ],
    },
    {
      id: 'time-payroll',
      label: 'Time & Payroll',
      iconName: 'Clock',
      badge: '3',
      badgeType: 'tertiary',
      subItems: [
        { id: 'time-tracking', label: 'Time Tracking' },
        { id: 'approvals', label: 'Approvals', badge: '3', badgeType: 'tertiary' },
        { id: 'payroll-runs', label: 'Payroll Runs' },
        { id: 'my-pay', label: 'My Pay' },
      ],
    },
    {
      id: 'people-teams',
      label: 'People & Teams',
      iconName: 'Users',
      badge: '2',
      badgeType: 'neutral',
      subItems: [
        { id: 'users', label: 'Users' },
        { id: 'teams', label: 'Teams' },
        { id: 'pending-invites', label: 'Pending Invites', badge: '2', badgeType: 'tertiary' },
        { id: 'access-audit', label: 'Access Audit Trail' },
      ],
    },
    {
      id: 'products',
      label: 'Products',
      iconName: 'Box',
      subItems: [
        { id: 'product-registry', label: 'Product Registry' },
        { id: 'linked-repos', label: 'Linked Repositories' },
      ],
    },
    {
      id: 'communication',
      label: 'Communication',
      iconName: 'MessageSquare',
      badge: '5',
      badgeType: 'tertiary',
      subItems: [
        { id: 'internal-chat', label: 'Internal Chat', badge: '5', badgeType: 'tertiary' },
        { id: 'calendar', label: 'Calendar' },
        { id: 'notification-prefs', label: 'Notification Preferences' },
      ],
    },
    {
      id: 'resources-files',
      label: 'Resources & Files',
      iconName: 'Folder',
      subItems: [
        { id: 'file-management', label: 'File Management' },
        { id: 'resource-management', label: 'Resource Management' },
        { id: 'help-center', label: 'Help Center' },
      ],
    },
    {
      id: 'system-analytics',
      label: 'System & Analytics',
      iconName: 'BarChart3',
      subItems: [
        { id: 'audit-logs', label: 'Audit Logs' },
        { id: 'analytics-reports', label: 'Analytics & Reports' },
        { id: 'integrations-hub', label: 'Integrations Hub' },
      ],
    },
    {
      id: 'account-settings',
      label: 'Personal & Settings',
      iconName: 'Settings',
      subItems: [
        { id: 'profile', label: 'My Profile' },
        { id: 'settings', label: 'Settings & Preferences' },
      ],
    },
  ];

  const getBadgeClass = (type?: string) => {
    switch (type) {
      case 'primary':
        return 'bg-[#6366F1] text-white';
      case 'tertiary':
        return 'bg-[#B95F00] text-white';
      case 'danger':
        return 'bg-[#DC2626] text-white';
      case 'neutral':
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <aside
      id="main-sidebar"
      className={`bg-[#0F172A] text-white h-screen sticky top-0 flex flex-col transition-all duration-300 z-30 shrink-0 select-none border-r border-slate-800 ${
        collapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      {/* Top Section */}
      <div className="p-6 pb-2 flex items-center justify-between">
        {!collapsed ? (
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">KobNeti</h1>
            <p className="text-[10px] text-[#94A3B8] font-semibold tracking-wider uppercase mt-1">
              Operations Platform
            </p>
          </div>
        ) : (
          <div className="mx-auto w-10 h-10 rounded-xl bg-[#6366F1] flex items-center justify-center font-bold text-white shadow-xs">
            K
          </div>
        )}
      </div>

      {/* User Profile Card */}
      <div className="mx-4 my-3">
        {!collapsed ? (
          <div
            id="sidebar-user-card"
            onClick={() => onSelectNav('profile', 'Profile')}
            className={`p-3 rounded-xl flex items-center gap-3 border transition-colors cursor-pointer ${
              activeNav === 'profile'
                ? 'bg-[#6366F1]/20 border-[#6366F1]/50 text-white'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            title="View My Profile"
          >
            <div className="w-10 h-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate flex items-center justify-between">
                <span>Adeel D.</span>
                <span className="text-[10px] text-emerald-400 font-normal">Online</span>
              </div>
              <div className="text-xs text-[#94A3B8] truncate">Administrator</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <button
              id="sidebar-user-card-collapsed"
              onClick={() => onSelectNav('profile', 'Profile')}
              className={`w-10 h-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-all ${
                activeNav === 'profile' ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:opacity-90'
              }`}
              title="Adeel D. (Administrator) - View Profile"
            >
              AD
            </button>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar text-sm space-y-1 py-2">
        {navItems.map((item) => {
          const IconComponent = iconMap[item.iconName] || LayoutDashboard;
          const isOverview = item.id === 'overview';
          const isCategoryExpanded = expandedCategories[item.id];
          const isItemActive =
            activeNav === item.id ||
            item.subItems?.some((sub) => sub.id === activeNav);

          if (isOverview) {
            // Overview active only when activeNav is overview
            const isOverviewActive = activeNav === 'overview';
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectNav('overview', 'Overview')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                  isOverviewActive
                    ? 'bg-[#6366F1]/20 text-white font-medium'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="font-medium text-left flex-1">{item.label}</span>}
              </button>
            );
          }

          return (
            <div key={item.id} className="space-y-1">
              {/* Category Header Button */}
              <button
                id={`nav-category-${item.id}`}
                onClick={() => {
                  if (collapsed) {
                    onSelectNav(item.id, item.label);
                  } else {
                    toggleCategory(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  isItemActive && !isCategoryExpanded && !collapsed
                    ? 'bg-white/10 text-white'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconComponent className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] text-white rounded font-bold ${
                          item.badgeType === 'tertiary'
                            ? 'bg-[#B95F00]'
                            : item.badgeType === 'danger'
                            ? 'bg-[#DC2626]'
                            : item.badgeType === 'neutral'
                            ? 'bg-gray-600'
                            : 'bg-[#6366F1]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.subItems && (
                      <span className="text-[#94A3B8]">
                        {isCategoryExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Sub-items (expanded state) */}
              {!collapsed && isCategoryExpanded && item.subItems && (
                <div className="pl-9 pr-1 space-y-1 pb-2">
                  {item.subItems.map((sub) => {
                    const isSubActive = activeNav === sub.id;
                    return (
                      <button
                        key={sub.id}
                        id={`nav-sub-${sub.id}`}
                        onClick={() => onSelectNav(sub.id, sub.label)}
                        className={`w-full flex justify-between items-center text-xs transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg ${
                          isSubActive
                            ? 'bg-[#1E293B] text-white font-semibold border-l-2 border-[#6366F1] pl-2 shadow-2xs'
                            : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {sub.badge && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                              sub.badgeType === 'primary'
                                ? 'bg-[#6366F1] text-white'
                                : sub.badgeType === 'danger'
                                ? 'bg-[#DC2626] text-white'
                                : sub.badgeType === 'tertiary'
                                ? 'bg-[#B95F00] text-white'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Status Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        {!collapsed ? (
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">System Status: Online</span>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        ) : (
          <div className="flex justify-center" title="System Status: Online">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
