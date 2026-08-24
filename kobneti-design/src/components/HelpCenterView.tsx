import React, { useState, useRef } from 'react';
import {
  Search,
  BookOpen,
  Video,
  Play,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  Send,
  Plus,
  X,
  FileText,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Tag,
  Eye,
  MessageSquare,
  LifeBuoy,
} from 'lucide-react';

export interface HelpArticle {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: 'Getting Started' | 'Tickets & Support' | 'Engineering' | 'Time & Payroll' | 'Admin';
  updatedAt: string;
  hasVideo: boolean;
  videoDuration?: string;
  videoThumbnail?: string;
  readTime: string;
  content: {
    overview: string;
    steps: {
      title: string;
      description: string;
      tip?: string;
    }[];
    summary?: string;
  };
}

const ARTICLES_DATA: HelpArticle[] = [
  {
    id: 'art-1',
    emoji: '🚀',
    title: 'Getting Started with KobNeti',
    description: 'How to log in, navigate the dashboard, and access your tools.',
    category: 'Getting Started',
    updatedAt: '2 days ago',
    hasVideo: true,
    videoDuration: '3:45',
    readTime: '4 min read',
    content: {
      overview: 'Welcome to KobNeti! This guide outlines how to authenticate securely, configure your profile, and quickly navigate the executive workspace.',
      steps: [
        {
          title: '1. Secure Single Sign-On (SSO) Authentication',
          description: 'Access the login portal using your corporate Google Workspace or email credentials. Ensure 2FA is enabled on your enterprise account.',
          tip: 'Bookmark your organization direct URL for instant workspace loading.',
        },
        {
          title: '2. Workspace & Sidebar Navigation',
          description: 'Use the left navigation sidebar to switch between Support Tickets, Engineering Boards, Time & Payroll, and Communication modules. The sidebar can be collapsed for maximum canvas focus.',
        },
        {
          title: '3. Global Search & Command Palette',
          description: 'Press Cmd+K (Mac) or Ctrl+K (Windows) from any screen to instantly search across tickets, GitHub repositories, audit logs, and team members.',
          tip: 'Use search filters by typing category names like #tickets or #team.',
        },
      ],
      summary: 'You are now ready to collaborate seamlessly across all KobNeti tools and operational modules.',
    },
  },
  {
    id: 'art-2',
    emoji: '🎫',
    title: 'Managing Tickets',
    description: 'How to view, assign, and close tickets in the support queue.',
    category: 'Tickets & Support',
    updatedAt: '3 days ago',
    hasVideo: true,
    videoDuration: '4:20',
    readTime: '5 min read',
    content: {
      overview: 'Step-by-step guide to managing customer and internal support tickets efficiently in KobNeti.',
      steps: [
        {
          title: '1. Triaging the Support Queue',
          description: 'Open the Tickets & Support view. Filter by priority (Urgent, High, Normal, Low) or SLA status to tackle critical tickets before breach thresholds.',
          tip: 'Tickets within 15 minutes of SLA breach are highlighted in amber/rose with warning indicators.',
        },
        {
          title: '2. Claiming & Assigning Tickets',
          description: 'Click on any unassigned ticket to claim it for yourself, or use the Assignee dropdown to route it to a specialized engineer or support agent.',
        },
        {
          title: '3. Logging Responses & Internal Notes',
          description: 'Use the conversation pane to reply directly to the customer. Toggle "Internal Note" mode for private collaboration visible only to staff.',
        },
        {
          title: '4. Resolving and Closing Tickets',
          description: 'Once the problem is solved, set the status to "Resolved" or "Closed". Add resolution categorization tags to improve platform analytics.',
          tip: 'Closing a ticket triggers an automated satisfaction survey sent to the requester.',
        },
      ],
      summary: 'Prompt triage and accurate categorization ensure team SLAs stay above our target 98.5% response rate.',
    },
  },
  {
    id: 'art-3',
    emoji: '💻',
    title: 'Creating Engineering Tasks',
    description: 'How to create, assign, and track tasks on the Task Board.',
    category: 'Engineering',
    updatedAt: '1 week ago',
    hasVideo: false,
    readTime: '3 min read',
    content: {
      overview: 'Learn how engineering squads manage sprints, create linked GitHub issues, and move tasks across Kanban columns.',
      steps: [
        {
          title: '1. Creating a New Task Card',
          description: 'Click "+ New Task" in the header or at the top of any Kanban column. Enter task title, estimate story points, and choose the target sprint.',
        },
        {
          title: '2. Linking Pull Requests and Repositories',
          description: 'Attach GitHub branches or PR links directly in the task modal. KobNeti auto-syncs branch status, CI pass/fail results, and commit hashes.',
          tip: 'Branch naming format "feat/TICK-123" will auto-link tasks to Git commits.',
        },
        {
          title: '3. Progressing Through Kanban Stages',
          description: 'Drag and drop cards between Backlog, In Progress, Code Review, and Done columns. Status changes notify relevant reviewers automatically.',
        },
      ],
      summary: 'Task board automation keeps engineers focused on writing code while maintaining clear release visibility.',
    },
  },
  {
    id: 'art-4',
    emoji: '⏱️',
    title: 'Tracking Your Time',
    description: 'How to clock in, log time, and request edits.',
    category: 'Time & Payroll',
    updatedAt: '4 days ago',
    hasVideo: true,
    videoDuration: '2:50',
    readTime: '4 min read',
    content: {
      overview: 'Comprehensive manual for accurate work-hour logging, break tracking, and submitting time correction requests.',
      steps: [
        {
          title: '1. Starting a Live Timer (Clock In)',
          description: 'Click the "Clock In" button located in the top navigation bar or Time Tracking dashboard. The active session counter will run continuously.',
          tip: 'You can associate the active timer with specific product tickets or projects.',
        },
        {
          title: '2. Logging Manual Shifts',
          description: 'Forgot to clock in? Navigate to Time & Payroll → Time Tracking and click "+ Log Time" to enter exact start and end timestamps.',
        },
        {
          title: '3. Submitting Time Edits for Approval',
          description: 'If an error occurs on a past timesheet entry, click the edit pencil icon, specify the corrected hours, provide a brief reason, and submit to your manager.',
        },
      ],
      summary: 'Accurate timesheets ensure seamless bi-weekly payroll processing without delay.',
    },
  },
  {
    id: 'art-5',
    emoji: '✅',
    title: 'Approving Requests',
    description: 'How to review and approve time edits, payroll, and budget requests.',
    category: 'Time & Payroll',
    updatedAt: '5 days ago',
    hasVideo: false,
    readTime: '3 min read',
    content: {
      overview: 'Administrative workflows for managers, tech leads, and HR administrators approving organizational requests.',
      steps: [
        {
          title: '1. Accessing Pending Approvals',
          description: 'Open Time & Payroll → Approvals to view pending requests categorized by Timesheet Edits, Expense Reimbursements, and Time-Off.',
        },
        {
          title: '2. Reviewing Request Details',
          description: 'Click on any request to view employee history, attached receipts, previous clock timestamps, and justification notes.',
          tip: 'Use keyboard shortcut A for Approve and R for Reject when reviewing cards.',
        },
        {
          title: '3. Batch Approvals',
          description: 'Select multiple validated timesheets using the row checkboxes and click "Approve Selected" to process routine submissions rapidly.',
        },
      ],
      summary: 'Prompt approvals help keep team payroll runs on schedule and maintain trust across departments.',
    },
  },
  {
    id: 'art-6',
    emoji: '🔐',
    title: 'Managing Users & Teams',
    description: 'How to invite users, assign roles, and manage teams.',
    category: 'Admin',
    updatedAt: '6 days ago',
    hasVideo: false,
    readTime: '5 min read',
    content: {
      overview: 'Governance and role-based access control (RBAC) instructions for company workspace administrators.',
      steps: [
        {
          title: '1. Sending Member Invitations',
          description: 'Go to People & Teams → Directory. Click "+ Invite Member", input corporate email address, and select primary department/role.',
        },
        {
          title: '2. Configuring Role Permissions',
          description: 'Assign appropriate privilege tiers: Super Admin, Product Lead, Senior Engineer, Support Specialist, or Contractor.',
          tip: 'Contractor accounts have restricted access to internal payroll and billing records.',
        },
        {
          title: '3. Squad and Team Allocation',
          description: 'Organize employees into functional squads (e.g. MuuqWear Core, GaarX Mobile, SomPay Engine) to streamline ticket routing and task assignments.',
        },
      ],
      summary: 'Adhere to least-privilege principles when granting administrative access tiers.',
    },
  },
];

const CATEGORIES = [
  'All',
  'Getting Started',
  'Tickets & Support',
  'Engineering',
  'Time & Payroll',
  'Admin',
] as const;

interface HelpCenterViewProps {
  isNewArticleModalOpen?: boolean;
  onOpenNewArticleModal?: () => void;
  onCloseNewArticleModal?: () => void;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({
  isNewArticleModalOpen: externalNewArticleOpen,
  onOpenNewArticleModal: externalOpenNewArticle,
  onCloseNewArticleModal: externalCloseNewArticle,
}) => {
  const [articles, setFiles] = useState<HelpArticle[]>(ARTICLES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>('art-2'); // default shows Managing Tickets detail or active selection
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Modals
  const [internalNewArticleOpen, setInternalNewArticleOpen] = useState(false);
  const isNewArticleOpen = externalNewArticleOpen ?? internalNewArticleOpen;
  const openNewArticleModal = externalOpenNewArticle ?? (() => setInternalNewArticleOpen(true));
  const closeNewArticleModal = externalCloseNewArticle ?? (() => setInternalNewArticleOpen(false));

  // Feedback State per article
  const [feedbackState, setFeedbackState] = useState<Record<string, 'yes' | 'no' | 'submitted' | null>>({});
  const [feedbackComments, setFeedbackComments] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Article Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<HelpArticle['category']>('Getting Started');
  const [newHasVideo, setNewHasVideo] = useState(false);
  const [newEmoji, setNewEmoji] = useState('📘');

  // Category Carousel scroll ref
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFeedbackVote = (articleId: string, vote: 'yes' | 'no') => {
    setFeedbackState((prev) => ({ ...prev, [articleId]: vote }));
    if (vote === 'yes') {
      showToast('Thank you! Your feedback helps us improve platform documentation.');
    }
  };

  const handleFeedbackSubmit = (articleId: string) => {
    setFeedbackState((prev) => ({ ...prev, [articleId]: 'submitted' }));
    showToast('Feedback submitted. Thank you for your suggestions!');
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newArt: HelpArticle = {
      id: `art-${Date.now()}`,
      emoji: newEmoji || '📘',
      title: newTitle.trim(),
      description: newDesc.trim() || 'Comprehensive guide for team members.',
      category: newCat,
      updatedAt: 'Just now',
      hasVideo: newHasVideo,
      videoDuration: newHasVideo ? '3:00' : undefined,
      readTime: '3 min read',
      content: {
        overview: newDesc.trim() || 'Step-by-step documentation for team members.',
        steps: [
          {
            title: '1. Getting Started',
            description: 'Follow platform standard operating procedures for maximum efficiency.',
          },
          {
            title: '2. Executing Workflow',
            description: 'Ensure all task requirements and quality criteria are met.',
          },
        ],
        summary: 'Contact your team lead or system admin if you have additional questions.',
      },
    };

    setFiles((prev) => [newArt, ...prev]);
    setSelectedArticleId(newArt.id);
    showToast(`Created article "${newArt.title}" successfully`);
    setNewTitle('');
    setNewDesc('');
    closeNewArticleModal();
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];

  return (
    <div
      id="help-center-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#6366F1]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
            Help Center
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Platform usage documentation for KobNeti staff.
          </p>
        </div>

        <button
          id="help-center-new-article-btn"
          onClick={openNewArticleModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Article</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: SEARCH & CATEGORIES (With Arrow Buttons)                            */}
      {/* ========================================================================= */}
      <div id="help-search-and-categories" className="space-y-4">
        {/* Large Search Input (Full Width) */}
        <div className="relative w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="help-center-search-input"
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] rounded-2xl text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1] dark:focus:ring-[#818CF8] shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills with Navigation Arrows */}
        <div className="flex items-center gap-2">
          {/* Scroll Left Button */}
          <button
            id="btn-scroll-categories-left"
            onClick={() => scrollCategories('left')}
            className="p-1.5 rounded-[7px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 transition-colors cursor-pointer shadow-2xs"
            title="Scroll categories left"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            id="help-category-pills"
            ref={categoryScrollRef}
            className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth"
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`category-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A] shadow-xs'
                      : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-[#F8FAFC] border border-[#E2E8F0] dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            id="btn-scroll-categories-right"
            onClick={() => scrollCategories('right')}
            className="p-1.5 rounded-[7px] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 transition-colors cursor-pointer shadow-2xs"
            title="Scroll categories right"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: ARTICLE CARDS (3 COLUMNS)                                          */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Articles ({filteredArticles.length})</span>
          {searchQuery && <span>Matching "{searchQuery}"</span>}
        </div>

        <div
          id="help-articles-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredArticles.map((art) => {
            const isSelected = selectedArticleId === art.id;

            return (
              <div
                key={art.id}
                id={`help-article-card-${art.id}`}
                className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer ${
                  isSelected
                    ? 'border-[#6366F1] ring-1 ring-[#6366F1]/20 bg-indigo-50/10'
                    : 'border-slate-200 hover:border-indigo-200'
                }`}
                onClick={() => {
                  setSelectedArticleId(art.id);
                  const detailElem = document.getElementById('article-detail-section');
                  if (detailElem) {
                    detailElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {/* Top: Emoji, Title & Description */}
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl leading-none shrink-0">{art.emoji}</span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#6366F1] transition-colors">
                        {art.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                    "{art.description}"
                  </p>
                </div>

                {/* Middle & Bottom Meta */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {art.category}
                    </span>
                    <span className="text-slate-400">Updated {art.updatedAt}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      {art.hasVideo ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6366F1] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          <Video className="w-3 h-3 text-[#6366F1]" />
                          <span>📹 Video available</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{art.readTime}</span>
                        </div>
                      )}
                    </div>

                    <button
                      id={`read-article-btn-${art.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedArticleId(art.id);
                        const detailElem = document.getElementById('article-detail-section');
                        if (detailElem) {
                          detailElem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#6366F1] text-slate-700 hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer group-hover:bg-[#6366F1] group-hover:text-white"
                    >
                      <span>Read</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: ARTICLE DETAIL (OPENS ON CLICK / ACTIVE ARTICLE)                   */}
      {/* ========================================================================= */}
      {selectedArticle && (
        <div
          id="article-detail-section"
          className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6 mt-6 animate-in fade-in duration-200"
        >
          {/* Article Header */}
          <div className="border-b border-slate-100 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[#6366F1] text-xs font-bold">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  · Updated {selectedArticle.updatedAt}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  · {selectedArticle.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(window.location.href);
                    showToast('Article link copied to clipboard');
                  }}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                  title="Share Article"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-3xl leading-none">{selectedArticle.emoji}</span>
              <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight">
                {selectedArticle.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {selectedArticle.description}
            </p>
          </div>

          {/* Embedded Video Player / Simulation */}
          {selectedArticle.hasVideo && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>🎬 Embedded Tutorial Video</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({selectedArticle.videoDuration || '3:45'})
                </span>
              </div>

              <div
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md group cursor-pointer flex items-center justify-center"
              >
                {/* Background Video Simulation Canvas */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 opacity-90" />
                
                {/* UI Mock preview inside video */}
                <div className="absolute inset-0 opacity-25 p-6 flex flex-col justify-between pointer-events-none">
                  <div className="flex items-center justify-between border-b border-white/20 pb-2 text-white text-xs">
                    <span className="font-bold">KobNeti Workspace Tutorial</span>
                    <span className="text-[10px]">HD 1080p</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-white/10 rounded-lg" />
                    <div className="h-16 bg-white/10 rounded-lg" />
                    <div className="h-16 bg-white/10 rounded-lg" />
                  </div>
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>

                {/* Play Button & Center Overlay */}
                <div className="relative z-10 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-[#6366F1] group-hover:bg-[#4F46E5] text-white flex items-center justify-center shadow-xl mx-auto group-hover:scale-110 transition-all">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    {isVideoPlaying ? 'Playing Tutorial Simulation...' : 'Watch Step-by-Step Tutorial'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Click to {isVideoPlaying ? 'pause' : 'play'} video walkthrough
                  </div>
                </div>

                {/* Video Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/75 text-white text-[10px] font-mono font-bold">
                  {selectedArticle.videoDuration || '3:45'}
                </div>
              </div>
            </div>
          )}

          {/* Article Body Content */}
          <div className="space-y-6 text-slate-700 text-xs leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <p className="font-semibold text-slate-800 leading-normal">
                "{selectedArticle.content.overview}"
              </p>
            </div>

            {/* Step by Step Breakdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Step-by-step guide to {selectedArticle.title.toLowerCase()}
              </h3>

              <div className="space-y-4">
                {selectedArticle.content.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-indigo-200 transition-colors shadow-2xs"
                  >
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step.title}</span>
                    </h4>
                    <p className="text-slate-600 text-xs pl-7 leading-relaxed font-normal">
                      {step.description}
                    </p>
                    {step.tip && (
                      <div className="ml-7 mt-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-start gap-2">
                        <span className="font-bold text-amber-700 shrink-0">💡 Pro Tip:</span>
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedArticle.content.summary && (
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-slate-800 text-xs">
                <span className="font-bold text-[#6366F1]">Summary: </span>
                {selectedArticle.content.summary}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* FEEDBACK MECHANISM                                                        */}
          {/* ========================================================================= */}
          <div
            id="article-feedback-widget"
            className="border-t border-slate-100 pt-6 mt-6 space-y-4 bg-slate-50/60 p-5 rounded-2xl border"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Was this article helpful?</h4>
                <p className="text-[11px] text-slate-500">
                  Your feedback helps our documentation team improve guide quality.
                </p>
              </div>

              {/* Feedback Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="feedback-btn-yes"
                  onClick={() => handleFeedbackVote(selectedArticle.id, 'yes')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    feedbackState[selectedArticle.id] === 'yes'
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700 hover:bg-emerald-50/50'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes</span>
                </button>

                <button
                  id="feedback-btn-no"
                  onClick={() => handleFeedbackVote(selectedArticle.id, 'no')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    feedbackState[selectedArticle.id] === 'no' ||
                    feedbackState[selectedArticle.id] === 'submitted'
                      ? 'bg-rose-500 border-rose-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 hover:border-rose-300 text-slate-700 hover:bg-rose-50/50'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No</span>
                </button>
              </div>
            </div>

            {/* If No clicked: Comment input */}
            {feedbackState[selectedArticle.id] === 'no' && (
              <div
                id="feedback-comment-box"
                className="space-y-3 pt-3 border-t border-slate-200 animate-in fade-in duration-150"
              >
                <label className="block text-xs font-bold text-slate-800">
                  What could be improved?
                </label>
                <textarea
                  rows={3}
                  value={feedbackComments[selectedArticle.id] || ''}
                  onChange={(e) =>
                    setFeedbackComments((prev) => ({
                      ...prev,
                      [selectedArticle.id]: e.target.value,
                    }))
                  }
                  placeholder="Tell us what was missing, unclear, or out of date..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
                <div className="flex justify-end">
                  <button
                    id="submit-feedback-btn"
                    onClick={() => handleFeedbackSubmit(selectedArticle.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit Feedback</span>
                  </button>
                </div>
              </div>
            )}

            {/* If feedback submitted */}
            {feedbackState[selectedArticle.id] === 'submitted' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your feedback has been received and routed to our technical writers.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEW ARTICLE MODAL                                                         */}
      {/* ========================================================================= */}
      {isNewArticleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="new-article-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-xs shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create Help Article</h3>
                  <p className="text-[11px] text-slate-500">Publish new documentation for team</p>
                </div>
              </div>
              <button
                onClick={closeNewArticleModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-slate-700 font-bold mb-1.5">Icon</label>
                  <select
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    <option value="📘">📘 Book</option>
                    <option value="🚀">🚀 Launch</option>
                    <option value="🎫">🎫 Ticket</option>
                    <option value="💻">💻 Code</option>
                    <option value="⏱️">⏱️ Time</option>
                    <option value="✅">✅ Check</option>
                    <option value="🔐">🔐 Security</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Article Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Setting Up 2FA Verification"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  <option value="Getting Started">Getting Started</option>
                  <option value="Tickets & Support">Tickets & Support</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Time & Payroll">Time & Payroll</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Short Summary / Description</label>
                <textarea
                  rows={2}
                  placeholder="Provide a concise 1-2 sentence overview of what this guide teaches..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="has-video-toggle"
                  checked={newHasVideo}
                  onChange={(e) => setNewHasVideo(e.target.checked)}
                  className="w-4 h-4 text-[#6366F1] rounded border-slate-300 focus:ring-[#6366F1]"
                />
                <label htmlFor="has-video-toggle" className="text-slate-800 font-bold cursor-pointer">
                  Include Video Walkthrough Tutorial
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeNewArticleModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
