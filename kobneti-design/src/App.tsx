import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { TicketsByProductCard } from './components/TicketsByProductCard';
import { AccessSummaryCard } from './components/AccessSummaryCard';
import { OperationsPerformanceTable } from './components/OperationsPerformanceTable';
import { RecentActivityCard } from './components/RecentActivityCard';
import { QuickActionsCard } from './components/QuickActionsCard';
import { SearchModal } from './components/SearchModal';
import { ViewAllProductsModal } from './components/ViewAllProductsModal';
import { SubPageView } from './components/SubPageView';
import { OverviewView } from './components/OverviewView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { LiveChatView } from './components/LiveChatView';
import { KnowledgeBaseView, KBArticle } from './components/KnowledgeBaseView';
import { TicketListView } from './components/TicketListView';
import { TicketDetailView } from './components/TicketDetailView';
import { SupportTicketsView } from './components/SupportTicketsView';
import { EscalationsView } from './components/EscalationsView';
import { TaskBoardView } from './components/TaskBoardView';
import { TaskDetailView } from './components/TaskDetailView';
import { ProjectRoadmapView } from './components/ProjectRoadmapView';
import { GitHubActivityView } from './components/GitHubActivityView';
import { SprintsBacklogView } from './components/SprintsBacklogView';
import { TimeTrackingView } from './components/TimeTrackingView';
import { ApprovalsView } from './components/ApprovalsView';
import { PayrollRunsView } from './components/PayrollRunsView';
import { MyPayView } from './components/MyPayView';
import { UsersView } from './components/UsersView';
import { TeamsView } from './components/TeamsView';
import { PendingInvitesView } from './components/PendingInvitesView';
import { AccessAuditTrailView } from './components/AccessAuditTrailView';
import { ProductRegistryView } from './components/ProductRegistryView';
import { LinkedRepositoriesView } from './components/LinkedRepositoriesView';
import { InternalChatView } from './components/InternalChatView';
import { CalendarView, CalendarViewType } from './components/CalendarView';
import { NotificationPreferencesView } from './components/NotificationPreferencesView';
import { FileManagementView } from './components/FileManagementView';
import { HelpCenterView } from './components/HelpCenterView';
import { IntegrationsHubView } from './components/IntegrationsHubView';
import { IntegrationsHubViewOrAuditLogs as AuditLogsView } from './components/AuditLogsView';
import { ResourceManagementView } from './components/ResourceManagementView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { PublicWebsiteRoot } from './components/public/PublicWebsiteRoot';
import { LoginPage } from './components/LoginPage';
import {
  METRIC_ITEMS,
  PRODUCT_TICKETS,
  RECENT_ACTIVITIES,
} from './data/mockData';
import { CheckCircle2, Sparkles, RefreshCw, X, ShieldAlert } from 'lucide-react';

export default function App() {
  const [viewPlatform, setViewPlatform] = useState<'login' | 'admin' | 'website'>('admin');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('settings');
  const [activeNavTitle, setActiveNavTitle] = useState('Settings & Preferences');
  const [impersonatedUser, setImpersonatedUser] = useState<any | null>(null);
  const [ticketDisplayMode, setTicketDisplayMode] = useState<'detail' | 'list'>('detail');
  const [taskBoardViewMode, setTaskBoardViewMode] = useState<'board' | 'list'>('board');
  const [taskDisplayMode, setTaskDisplayMode] = useState<'detail' | 'board'>('detail');
  const [fileViewMode, setFileViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
  const [roadmapTimeframe, setRoadmapTimeframe] = useState<'week' | 'month' | 'quarter'>('quarter');
  const [githubProductFilter, setGithubProductFilter] = useState('all');
  const [githubRepoFilter, setGithubRepoFilter] = useState('all');
  const [sprintFilter, setSprintFilter] = useState('Sprint 23');
  const [sprintProductFilter, setSprintProductFilter] = useState('all');
  const [approvalsFilter, setApprovalsFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('Nov 1 – Nov 15, 2025');
  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  const [isNewInviteModalOpen, setIsNewInviteModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isLinkRepoModalOpen, setIsLinkRepoModalOpen] = useState(false);
  const [repoProductFilter, setRepoProductFilter] = useState('all');
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewType>('month');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  // Live Timer / Clock in state synced across header and main view
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockedInSeconds, setClockedInSeconds] = useState(9252); // 02:34:12

  useEffect(() => {
    let timer: any = null;
    if (isClockedIn) {
      timer = setInterval(() => {
        setClockedInSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isClockedIn]);

  const handleToggleClock = () => {
    setIsClockedIn((prev) => !prev);
  };

  // Task ENG-35 state synced with Header contextual slot
  const [taskStatus, setTaskStatus] = useState<
    'Backlog' | 'To Do' | 'In Progress' | 'Review' | 'Done'
  >('In Progress');
  const [taskAssignee, setTaskAssignee] = useState('Adeel D.');
  const [taskPriority, setTaskPriority] = useState<
    'High' | 'Medium' | 'Low' | 'Urgent'
  >('High');

  // Ticket #4210 state synced with Header contextual slot
  const [ticketStatus, setTicketStatus] = useState<
    'New' | 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Closed'
  >('Open');
  const [ticketAssignee, setTicketAssignee] = useState('Adeel D.');
  const [ticketPriority, setTicketPriority] = useState<
    'Low' | 'Medium' | 'High' | 'Critical'
  >('High');

  // Interface state toggles for specification requirements
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [isEmptyActivity, setIsEmptyActivity] = useState(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isViewAllProductsOpen, setIsViewAllProductsOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState('3DS verification timeout blocking checkout on Android');

  const handleSelectNav = (id: string, label: string) => {
    setActiveNav(id);
    setActiveNavTitle(label);
  };

  const handleSearchResultSelect = (category: string, title: string) => {
    alert(`Selected ${category}: "${title}"`);
  };

  if (viewPlatform === 'login') {
    return (
      <LoginPage
        onLoginSuccess={() => setViewPlatform('admin')}
        onBackToWebsite={() => setViewPlatform('website')}
      />
    );
  }

  if (viewPlatform === 'website') {
    return (
      <PublicWebsiteRoot
        onOpenAdmin={() => setViewPlatform('admin')}
        onOpenLogin={() => setViewPlatform('login')}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] flex flex-row antialiased font-sans">
      {/* 1. LEFT SIDEBAR (280px wide, collapsible) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* 2. TOP HEADER BAR */}
        <Header
          activeNav={activeNav}
          onOpenPublicWebsite={() => setViewPlatform('website')}
          onSignOut={() => setViewPlatform('login')}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onNavigate={handleSelectNav}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenSearch={() => setIsSearchOpen(true)}
          isLoadingState={isLoadingMetrics}
          onToggleLoadingState={() => setIsLoadingMetrics(!isLoadingMetrics)}
          isEmptyActivityState={isEmptyActivity}
          onToggleEmptyActivityState={() => setIsEmptyActivity(!isEmptyActivity)}
          onNewReport={() => alert('Opening New Report Generator modal')}
          onCloseChat={() => alert('Chat session ended for current customer.')}
          onEscalate={() => setIsEscalationModalOpen(true)}
          ticketStatus={ticketStatus}
          onTicketStatusChange={setTicketStatus}
          ticketAssignee={ticketAssignee}
          onTicketAssigneeChange={setTicketAssignee}
          taskStatus={taskStatus}
          onTaskStatusChange={setTaskStatus}
          taskAssignee={taskAssignee}
          onTaskAssigneeChange={setTaskAssignee}
          taskPriority={taskPriority}
          onTaskPriorityChange={setTaskPriority}
          roadmapTimeframe={roadmapTimeframe}
          onRoadmapTimeframeChange={setRoadmapTimeframe}
          onNewMilestone={() => {
            const btn = document.getElementById('btn-create-milestone-page');
            if (btn) btn.click();
          }}
          githubProductFilter={githubProductFilter}
          onGithubProductFilterChange={setGithubProductFilter}
          githubRepoFilter={githubRepoFilter}
          onGithubRepoFilterChange={setGithubRepoFilter}
          isClockedIn={isClockedIn}
          clockedInSeconds={clockedInSeconds}
          onToggleClock={handleToggleClock}
          approvalsFilter={approvalsFilter}
          onApprovalsFilterChange={setApprovalsFilter}
          selectedPayPeriod={selectedPayPeriod}
          onSelectPayPeriod={setSelectedPayPeriod}
          onGeneratePayrollRun={() => {
            alert('Opening Generate Payroll Run wizard for ' + selectedPayPeriod);
          }}
          onInviteUser={() => setIsInviteUserModalOpen(true)}
          onNewTeam={() => setIsNewTeamModalOpen(true)}
          onNewInvite={() => setIsNewInviteModalOpen(true)}
          onExportAuditCsv={() => {
            const btn = document.getElementById('btn-export-audit-csv-header') || document.getElementById('audit-export-csv-btn');
            if (btn) btn.click();
          }}
          onNewProduct={() => setIsNewProductModalOpen(true)}
          onLinkRepo={() => setIsLinkRepoModalOpen(true)}
          repoProductFilter={repoProductFilter}
          onRepoProductFilterChange={setRepoProductFilter}
          onNewChannel={() => setIsNewChannelModalOpen(true)}
          calendarViewMode={calendarViewMode}
          onCalendarViewModeChange={setCalendarViewMode}
          onNewEvent={() => setIsNewEventModalOpen(true)}
          onCalendarToday={() => {
            const cell = document.getElementById('calendar-cell-day-14');
            if (cell) cell.click();
          }}
          fileViewMode={fileViewMode}
          onFileViewModeChange={setFileViewMode}
          onUploadFile={() => setIsUploadFileModalOpen(true)}
          onNewAsset={() => {
            const btn = document.getElementById('btn-new-asset-header');
            if (btn) btn.click();
          }}
          onNewSprint={() => {
            const btn = document.getElementById('btn-new-sprint-header');
            if (btn) btn.click();
          }}
          sprintFilter={sprintFilter}
          onSprintFilterChange={setSprintFilter}
          sprintProductFilter={sprintProductFilter}
          onSprintProductFilterChange={setSprintProductFilter}
          viewMode={taskBoardViewMode}
          onViewModeChange={setTaskBoardViewMode}
          onNewTask={() => {
            const btn = document.getElementById('btn-create-task-page');
            if (btn) btn.click();
          }}
          onNewTicket={() => {
            alert('Opening new support ticket composer');
          }}
          onNewArticle={() => setIsNewArticleModalOpen(true)}
        />

        {/* Impersonation Mode Banner */}
        {impersonatedUser && (
          <div
            id="impersonation-alert-banner"
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md z-30 shrink-0"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>
                Active Session Impersonation: You are testing access permissions as <b>{impersonatedUser.name}</b> ({impersonatedUser.roles?.join(', ') || 'Admin'}).
              </span>
            </div>
            <button
              onClick={() => setImpersonatedUser(null)}
              className="px-3 py-1 bg-white text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-50 transition-colors cursor-pointer shadow-xs"
            >
              Revert to Super Admin
            </button>
          </div>
        )}

        {/* 3. DASHBOARD MAIN CONTENT AREA */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 w-full mx-auto flex flex-col custom-scrollbar">
          {activeNav === 'overview' ? (
            <OverviewView
              onNavigate={(id, label) => handleSelectNav(id, label)}
              onOpenTicketDetail={(ticketId) => {
                setActiveNav('support-tickets');
                setActiveNavTitle('Support Tickets');
                setTicketDisplayMode('detail');
              }}
              onOpenTaskDetail={(taskId) => {
                setActiveNav('task-board');
                setActiveNavTitle('Task Board');
                setTaskDisplayMode('detail');
              }}
            />
          ) : activeNav === 'resource-management' ? (
            <ResourceManagementView />
          ) : activeNav === 'audit-logs' ? (
            <AuditLogsView />
          ) : activeNav === 'integrations-hub' ? (
            <IntegrationsHubView />
          ) : activeNav === 'help-center' ? (
            <HelpCenterView
              isNewArticleModalOpen={isNewArticleModalOpen}
              onOpenNewArticleModal={() => setIsNewArticleModalOpen(true)}
              onCloseNewArticleModal={() => setIsNewArticleModalOpen(false)}
            />
          ) : activeNav === 'file-management' ? (
            <FileManagementView
              viewMode={fileViewMode}
              onViewModeChange={setFileViewMode}
              isUploadModalOpen={isUploadFileModalOpen}
              onOpenUploadModal={() => setIsUploadFileModalOpen(true)}
              onCloseUploadModal={() => setIsUploadFileModalOpen(false)}
            />
          ) : activeNav === 'notification-prefs' ? (
            <NotificationPreferencesView />
          ) : activeNav === 'calendar' ? (
            <CalendarView
              isNewEventModalOpen={isNewEventModalOpen}
              onOpenNewEventModal={() => setIsNewEventModalOpen(true)}
              onCloseNewEventModal={() => setIsNewEventModalOpen(false)}
              viewMode={calendarViewMode}
              onViewModeChange={setCalendarViewMode}
            />
          ) : activeNav === 'internal-chat' ? (
            <InternalChatView
              isNewChannelModalOpen={isNewChannelModalOpen}
              onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)}
              onCloseNewChannelModal={() => setIsNewChannelModalOpen(false)}
            />
          ) : activeNav === 'linked-repos' ? (
            <LinkedRepositoriesView
              isLinkRepoModalOpen={isLinkRepoModalOpen}
              onOpenLinkRepoModal={() => setIsLinkRepoModalOpen(true)}
              onCloseLinkRepoModal={() => setIsLinkRepoModalOpen(false)}
              productFilter={repoProductFilter}
              onProductFilterChange={setRepoProductFilter}
            />
          ) : activeNav === 'product-registry' ? (
            <ProductRegistryView
              isNewProductModalOpen={isNewProductModalOpen}
              onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
              onCloseNewProductModal={() => setIsNewProductModalOpen(false)}
            />
          ) : activeNav === 'access-audit' ? (
            <AccessAuditTrailView />
          ) : activeNav === 'pending-invites' ? (
            <PendingInvitesView
              isNewInviteModalOpen={isNewInviteModalOpen}
              onOpenNewInviteModal={() => setIsNewInviteModalOpen(true)}
              onCloseNewInviteModal={() => setIsNewInviteModalOpen(false)}
            />
          ) : activeNav === 'teams' ? (
            <TeamsView
              isNewTeamModalOpen={isNewTeamModalOpen}
              onOpenNewTeamModal={() => setIsNewTeamModalOpen(true)}
              onCloseNewTeamModal={() => setIsNewTeamModalOpen(false)}
            />
          ) : activeNav === 'users' ? (
            <UsersView
              isInviteModalOpen={isInviteUserModalOpen}
              onOpenInviteModal={() => setIsInviteUserModalOpen(true)}
              onCloseInviteModal={() => setIsInviteUserModalOpen(false)}
              onImpersonateUser={(target) => setImpersonatedUser(target)}
            />
          ) : activeNav === 'my-pay' ? (
            <MyPayView selectedPayPeriodFilter={selectedPayPeriod} />
          ) : activeNav === 'payroll-runs' ? (
            <PayrollRunsView selectedPayPeriod={selectedPayPeriod} />
          ) : activeNav === 'approvals' ? (
            <ApprovalsView filter={approvalsFilter} />
          ) : activeNav === 'time-tracking' ? (
            <TimeTrackingView
              isClockedIn={isClockedIn}
              clockedInSeconds={clockedInSeconds}
              onToggleClock={handleToggleClock}
            />
          ) : activeNav === 'sprints-backlog' ? (
            <SprintsBacklogView />
          ) : activeNav === 'github-activity' ? (
            <GitHubActivityView
              selectedProduct={githubProductFilter}
              selectedRepo={githubRepoFilter}
            />
          ) : activeNav === 'project-roadmap' ? (
            <ProjectRoadmapView
              timeframe={roadmapTimeframe}
              onTimeframeChange={setRoadmapTimeframe}
              onNewMilestone={() => {
                const btn = document.getElementById('btn-create-milestone-page');
                if (btn) btn.click();
              }}
            />
          ) : activeNav === 'task-board' ? (
            taskDisplayMode === 'detail' ? (
              <TaskDetailView
                taskStatus={taskStatus}
                onTaskStatusChange={setTaskStatus}
                taskPriority={taskPriority}
                onTaskPriorityChange={setTaskPriority}
                taskAssignee={taskAssignee}
                onTaskAssigneeChange={setTaskAssignee}
                onBackToBoard={() => setTaskDisplayMode('board')}
              />
            ) : (
              <TaskBoardView
                viewMode={taskBoardViewMode}
                onNewTask={() => {
                  const btn = document.getElementById('btn-create-task-page');
                  if (btn) btn.click();
                }}
              />
            )
          ) : activeNav === 'escalations' || activeNav === 'escalations-incidents' ? (
            <EscalationsView
              onNewIncident={() => {
                const btn = document.getElementById('btn-declare-incident-page');
                if (btn) btn.click();
              }}
            />
          ) : activeNav === 'support-tickets' ? (
            ticketDisplayMode === 'detail' ? (
              <TicketDetailView
                status={ticketStatus}
                onStatusChange={setTicketStatus}
                assignee={ticketAssignee}
                onAssigneeChange={setTicketAssignee}
                priority={ticketPriority}
                onPriorityChange={setTicketPriority}
                onBackToTickets={() => setTicketDisplayMode('list')}
              />
            ) : (
              <SupportTicketsView />
            )
          ) : activeNav === 'knowledge-base' ? (
            <KnowledgeBaseView
              onAttachToTicket={(article: KBArticle) => {
                alert(`KB Article [${article.code}: ${article.title}] attached to active ticket response draft.`);
              }}
            />
          ) : activeNav === 'live-chat' ? (
            <LiveChatView
              isEscalationOpen={isEscalationModalOpen}
              onOpenEscalation={() => setIsEscalationModalOpen(true)}
              onCloseEscalation={() => setIsEscalationModalOpen(false)}
            />
          ) : activeNav === 'profile' ? (
            <ProfileView
              onOpenLiveChat={() => handleSelectNav('live-chat', 'Live Chat')}
              onOpenSettings={() => handleSelectNav('settings', 'Settings')}
              onOpenSecurity={() => handleSelectNav('settings', 'Settings')}
            />
          ) : activeNav === 'settings' ? (
            <SettingsView
              darkMode={darkMode}
              onThemeChange={setDarkMode}
              onOpenLiveChat={() => handleSelectNav('live-chat', 'Live Chat')}
            />
          ) : activeNav === 'analytics-reports' ? (
            <AnalyticsDashboardView
              onNewReportClick={() => alert('Opening New Report Generator modal')}
            />
          ) : (
            <SubPageView
              pageId={activeNav}
              pageTitle={activeNavTitle}
              onBackToOverview={() => {
                setActiveNav('support-tickets');
                setActiveNavTitle('Support Tickets');
              }}
            />
          )}
        </main>
      </div>

      {/* Global Escalation Modal */}
      {isEscalationModalOpen && (
        <div
          id="global-escalation-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsEscalationModalOpen(false)}
        >
          <div
            id="global-escalation-modal-container"
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-700">
                <ShieldAlert className="w-5 h-5 text-[#B95F00]" />
                <h3 className="text-base font-bold text-slate-900">Escalate Ticket #4210</h3>
              </div>
              <button
                onClick={() => setIsEscalationModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                Escalating this ticket will notify the on-call Engineering Lead and flag this issue as a high-priority incident.
              </p>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                <div className="font-semibold text-[#B95F00]">Target Queue: Engineering & Incident Operations</div>
                <div className="text-[11px] text-slate-600">Product: MuuqWear · Current SLA: 2.4hrs left</div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-700">Escalation Notes / Incident Context</label>
              <textarea
                rows={3}
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/15 text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEscalationModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEscalationModalOpen(false);
                  alert('Ticket #4210 successfully escalated to Engineering Team.');
                }}
                className="px-4 py-2 bg-[#B95F00] hover:bg-[#924B00] text-white font-semibold rounded-xl text-xs shadow-xs"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSearchResultSelect}
      />

      <ViewAllProductsModal
        isOpen={isViewAllProductsOpen}
        onClose={() => setIsViewAllProductsOpen(false)}
        products={PRODUCT_TICKETS}
      />
    </div>
  );
}
