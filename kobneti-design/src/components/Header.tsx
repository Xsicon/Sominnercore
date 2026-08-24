import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  Mail,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  User,
  Settings,
  LogOut,
  Sparkles,
  SlidersHorizontal,
  Globe,
} from 'lucide-react';

interface HeaderProps {
  activeNav?: string;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  isLoadingState: boolean;
  onToggleLoadingState: () => void;
  isEmptyActivityState: boolean;
  onToggleEmptyActivityState: () => void;
  onNewReport?: () => void;
  onCloseChat?: () => void;
  onEscalate?: () => void;
  onNewArticle?: () => void;
  onNewTicket?: () => void;
  onNewIncident?: () => void;
  onNewTask?: () => void;
  viewMode?: 'board' | 'list';
  onViewModeChange?: (mode: 'board' | 'list') => void;
  ticketStatus?: 'New' | 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  onTicketStatusChange?: (status: 'New' | 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed') => void;
  ticketAssignee?: string;
  onTicketAssigneeChange?: (assignee: string) => void;
  taskStatus?: 'Backlog' | 'To Do' | 'In Progress' | 'Review' | 'Done';
  onTaskStatusChange?: (status: 'Backlog' | 'To Do' | 'In Progress' | 'Review' | 'Done') => void;
  taskAssignee?: string;
  onTaskAssigneeChange?: (assignee: string) => void;
  taskPriority?: 'High' | 'Medium' | 'Low' | 'Urgent';
  onTaskPriorityChange?: (priority: 'High' | 'Medium' | 'Low' | 'Urgent') => void;
  roadmapTimeframe?: 'week' | 'month' | 'quarter';
  onRoadmapTimeframeChange?: (tf: 'week' | 'month' | 'quarter') => void;
  onNewMilestone?: () => void;
  githubProductFilter?: string;
  onGithubProductFilterChange?: (product: string) => void;
  githubRepoFilter?: string;
  onGithubRepoFilterChange?: (repo: string) => void;
  isClockedIn?: boolean;
  clockedInSeconds?: number;
  onToggleClock?: () => void;
  approvalsFilter?: 'all' | 'pending' | 'approved' | 'rejected';
  onApprovalsFilterChange?: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void;
  selectedPayPeriod?: string;
  onSelectPayPeriod?: (period: string) => void;
  onGeneratePayrollRun?: () => void;
  onInviteUser?: () => void;
  onNewTeam?: () => void;
  onNewInvite?: () => void;
  onExportAuditCsv?: () => void;
  onNewProduct?: () => void;
  onLinkRepo?: () => void;
  repoProductFilter?: string;
  onRepoProductFilterChange?: (product: string) => void;
  onNewChannel?: () => void;
  calendarViewMode?: 'month' | 'week' | 'day';
  onCalendarViewModeChange?: (mode: 'month' | 'week' | 'day') => void;
  onNewEvent?: () => void;
  onCalendarToday?: () => void;
  fileViewMode?: 'grid' | 'list';
  onFileViewModeChange?: (mode: 'grid' | 'list') => void;
  onUploadFile?: () => void;
  onNewAsset?: () => void;
  onNewSprint?: () => void;
  sprintFilter?: string;
  onSprintFilterChange?: (sprint: string) => void;
  sprintProductFilter?: string;
  onSprintProductFilterChange?: (product: string) => void;
  onOpenPublicWebsite?: () => void;
  onSignOut?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onNavigate?: (id: string, label: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav = 'support-tickets',
  onToggleSidebar,
  onOpenSearch,
  isLoadingState,
  onToggleLoadingState,
  isEmptyActivityState,
  onToggleEmptyActivityState,
  onNewReport,
  onCloseChat,
  onEscalate,
  onNewArticle,
  onNewTicket,
  onNewIncident,
  onNewTask,
  viewMode = 'board',
  onViewModeChange,
  ticketStatus = 'Open',
  onTicketStatusChange,
  ticketAssignee = 'Adeel D.',
  onTicketAssigneeChange,
  taskStatus = 'In Progress',
  onTaskStatusChange,
  taskAssignee = 'Adeel D.',
  onTaskAssigneeChange,
  taskPriority = 'High',
  onTaskPriorityChange,
  roadmapTimeframe = 'quarter',
  onRoadmapTimeframeChange,
  onNewMilestone,
  githubProductFilter = 'all',
  onGithubProductFilterChange,
  githubRepoFilter = 'all',
  onGithubRepoFilterChange,
  isClockedIn = true,
  clockedInSeconds = 9252, // 02:34:12
  onToggleClock,
  approvalsFilter = 'all',
  onApprovalsFilterChange,
  selectedPayPeriod = 'Nov 1 – Nov 15, 2025',
  onSelectPayPeriod,
  onGeneratePayrollRun,
  onInviteUser,
  onNewTeam,
  onNewInvite,
  onExportAuditCsv,
  onNewProduct,
  onLinkRepo,
  repoProductFilter = 'all',
  onRepoProductFilterChange,
  onNewChannel,
  calendarViewMode = 'month',
  onCalendarViewModeChange,
  onNewEvent,
  onCalendarToday,
  fileViewMode = 'grid',
  onFileViewModeChange,
  onUploadFile,
  onNewAsset,
  onNewSprint,
  sprintFilter = 'Sprint 23',
  onSprintFilterChange,
  sprintProductFilter = 'all',
  onSprintProductFilterChange,
  onOpenPublicWebsite,
  onSignOut,
  darkMode = false,
  onToggleDarkMode,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDevControls, setShowDevControls] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(darkMode ? 'dark' : 'light');

  useEffect(() => {
    setThemeMode(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (msgRef.current && !msgRef.current.contains(e.target as Node)) {
        setShowMessages(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          id="toggle-sidebar-btn"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30"
          title="Toggle Sidebar"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input field */}
        <div className="relative w-[340px] sm:w-[400px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="global-search-input"
            onClick={onOpenSearch}
            placeholder="Search tickets, tasks, users, products..."
            className="w-full pl-10 pr-12 py-2 bg-slate-50 hover:bg-slate-100/70 border border-[#E2E8F0] focus:border-[#6366F1] rounded-full text-sm text-[#0F172A] placeholder-[#64748B] transition-all focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 cursor-pointer"
            readOnly
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Center/Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* State Simulator Dropdown / Controls */}
        <div className="relative">
          <button
            onClick={() => setShowDevControls(!showDevControls)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#64748B] bg-slate-100 hover:bg-slate-200/80 hover:text-[#0F172A] transition-colors border border-slate-200"
            title="Inspect interface states (Skeleton / Empty state)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>State Controls</span>
            {(isLoadingState || isEmptyActivityState) && (
              <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
            )}
          </button>

          {showDevControls && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="font-semibold text-slate-900 mb-2 pb-1 border-b border-slate-100 flex items-center justify-between">
                <span>UI State Simulator</span>
                <span className="text-[10px] text-slate-400 font-normal">States Spec</span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-medium text-slate-800">Skeleton Loading</div>
                    <div className="text-[11px] text-slate-500">Pulsing gray metric cards</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isLoadingState}
                    onChange={onToggleLoadingState}
                    className="w-4 h-4 text-[#6366F1] rounded border-slate-300 focus:ring-[#6366F1]"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-medium text-slate-800">Empty Activity Feed</div>
                    <div className="text-[11px] text-slate-500">No recent activity state</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmptyActivityState}
                    onChange={onToggleEmptyActivityState}
                    className="w-4 h-4 text-[#6366F1] rounded border-slate-300 focus:ring-[#6366F1]"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Public Website Frontend Link */}
        {onOpenPublicWebsite && (
          <button
            id="admin-header-open-public-website-btn"
            onClick={onOpenPublicWebsite}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-[#4338CA] text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Open KobNeti Public Website"
          >
            <Globe className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Public Website</span>
          </button>
        )}

        {/* Theme toggle */}
        <button
          id="theme-toggle-btn"
          onClick={() => {
            if (onToggleDarkMode) {
              onToggleDarkMode();
            } else {
              setThemeMode(themeMode === 'light' ? 'dark' : 'light');
            }
          }}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {themeMode === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
        </button>

        {/* Notification Bell (Badge "3") */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessages(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors relative"
            title="Notifications (3 unread)"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="font-semibold text-sm text-[#0F172A]">Notifications</div>
                <span className="text-xs bg-indigo-50 text-[#6366F1] font-medium px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                <div className="py-2.5 flex gap-3 items-start hover:bg-slate-50 px-2 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#B95F00] flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-xs flex-1">
                    <p className="font-medium text-slate-800">
                      SLA Warning for #3981 (Salguri)
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Response window ending in 15 minutes.
                    </p>
                    <span className="text-[10px] text-slate-400">14 min ago</span>
                  </div>
                </div>
                <div className="py-2.5 flex gap-3 items-start hover:bg-slate-50 px-2 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#6366F1] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs flex-1">
                    <p className="font-medium text-slate-800">
                      GitHub sync completed successfully
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      12 pull requests updated across 5 repos.
                    </p>
                    <span className="text-[10px] text-slate-400">5 min ago</span>
                  </div>
                </div>
                <div className="py-2.5 flex gap-3 items-start hover:bg-slate-50 px-2 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs flex-1">
                    <p className="font-medium text-slate-800">
                      New product "Ilays" added to Registry
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Awaiting endpoint mapping & team permissions.
                    </p>
                    <span className="text-[10px] text-slate-400">22 min ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages / Inbox (Badge "2") */}
        <div className="relative" ref={msgRef}>
          <button
            id="messages-btn"
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors relative"
            title="Messages (2 unread)"
          >
            <Mail className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
              2
            </span>
          </button>

          {/* Messages Dropdown */}
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="font-semibold text-sm text-[#0F172A]">Direct Messages</div>
                <span className="text-xs bg-indigo-50 text-[#6366F1] font-medium px-2 py-0.5 rounded-full">
                  2 Pending
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="py-2.5 flex items-center gap-3 hover:bg-slate-50 px-2 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-bold text-xs">
                    IM
                  </div>
                  <div className="text-xs flex-1 truncate">
                    <p className="font-medium text-slate-800">Ibrahim M.</p>
                    <p className="text-slate-500 truncate text-[11px]">
                      Can you approve the Sev2 escalation for #4055?
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">1h</span>
                </div>
                <div className="py-2.5 flex items-center gap-3 hover:bg-slate-50 px-2 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-xs">
                    LH
                  </div>
                  <div className="text-xs flex-1 truncate">
                    <p className="font-medium text-slate-800">Leila H.</p>
                    <p className="text-slate-500 truncate text-[11px]">
                      Submitted time log for August payroll run.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">2h</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User avatar with initials "AD" and dropdown chevron */}
        <div className="relative pl-1" ref={userRef}>
          <button
            id="user-profile-menu-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowMessages(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              AD
            </div>
            <div className="hidden lg:block text-left text-xs">
              <span className="block font-semibold text-[#0F172A]">Adeel D.</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {/* User Profile Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-[#0F172A]">Adeel D.</p>
                <p className="text-xs text-[#64748B]">Administrator</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Full Access
                </div>
              </div>
              <div className="py-1">
                <button
                  id="header-menu-profile-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate?.('profile', 'Profile');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Account Settings
                </button>
                <button
                  id="header-menu-settings-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate?.('settings', 'Settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Platform Preferences
                </button>
                <button
                  id="header-sign-out-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onSignOut) onSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
