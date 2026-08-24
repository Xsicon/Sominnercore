import React, { useState } from 'react';
import {
  GitBranch,
  Github,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCcw,
  Unlink,
  Activity,
  AlertCircle,
  X,
  Check,
  RefreshCw,
  Box,
  Layers,
  GitCommit,
  GitPullRequest,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';

export interface LinkedRepoItem {
  id: string;
  title: string;
  product: string;
  repo: string;
  connected: string;
  lastSync: string;
  status: 'Connected' | 'Pending' | 'Disconnected';
  defaultBranch?: string;
  openPRs?: number;
  recentCommits?: { hash: string; msg: string; author: string; time: string }[];
}

const INITIAL_REPOSITORIES: LinkedRepoItem[] = [
  {
    id: 'repo-1',
    title: 'MuuqWear Web',
    product: 'MuuqWear',
    repo: 'github.com/kobneti/muuqwear-web',
    connected: '2 min ago',
    lastSync: '2 min ago',
    status: 'Connected',
    defaultBranch: 'main',
    openPRs: 2,
    recentCommits: [
      { hash: 'e4a91b2', msg: 'fix(checkout): resolve address autofill bug', author: 'Ibrahim M.', time: '2m ago' },
      { hash: '7c8d201', msg: 'feat: add live chat widget trigger', author: 'Adeel D.', time: '18m ago' },
    ],
  },
  {
    id: 'repo-2',
    title: 'MuuqWear API',
    product: 'MuuqWear',
    repo: 'github.com/kobneti/muuqwear-api',
    connected: '14 min ago',
    lastSync: '14 min ago',
    status: 'Connected',
    defaultBranch: 'main',
    openPRs: 1,
    recentCommits: [
      { hash: 'b11c49e', msg: 'perf: optimize stock query cache layer', author: 'Sarah K.', time: '14m ago' },
      { hash: '09da23f', msg: 'chore: bump dependencies to v4.2.1', author: 'Adeel D.', time: '1h ago' },
    ],
  },
  {
    id: 'repo-3',
    title: 'GaarX API',
    product: 'GaarX',
    repo: 'github.com/kobneti/gaarx-api',
    connected: '1 hour ago',
    lastSync: '1 hour ago',
    status: 'Connected',
    defaultBranch: 'main',
    openPRs: 3,
    recentCommits: [
      { hash: 'f56a12b', msg: 'refactor(dispatch): real-time driver socket routing', author: 'Leila H.', time: '1h ago' },
      { hash: 'aa88e10', msg: 'fix: handle telemetry timeout exceptions', author: 'Mike C.', time: '3h ago' },
    ],
  },
  {
    id: 'repo-4',
    title: 'Salguri Web',
    product: 'Salguri',
    repo: 'github.com/kobneti/salguri-web',
    connected: '3 hours ago',
    lastSync: '3 hours ago',
    status: 'Connected',
    defaultBranch: 'production',
    openPRs: 0,
    recentCommits: [
      { hash: '99bc412', msg: 'ui: refine customer order tracking status badge', author: 'John D.', time: '3h ago' },
      { hash: '12ef448', msg: 'i18n: add Somali & Arabic portal strings', author: 'Adeel D.', time: '6h ago' },
    ],
  },
  {
    id: 'repo-5',
    title: 'SomPay Mobile',
    product: 'SomPay',
    repo: 'github.com/kobneti/sompay-mobile',
    connected: '5 hours ago',
    lastSync: '5 hours ago',
    status: 'Connected',
    defaultBranch: 'release',
    openPRs: 4,
    recentCommits: [
      { hash: '55bb019', msg: 'feat(qr): integrate cross-border merchant QR scanner', author: 'Ibrahim M.', time: '5h ago' },
      { hash: 'dd421c9', msg: 'fix(auth): biometric lock timeout on iOS 18', author: 'Sarah K.', time: '7h ago' },
    ],
  },
  {
    id: 'repo-6',
    title: 'Dhaxal Web',
    product: 'Dhaxal',
    repo: 'github.com/kobneti/dhaxal-web',
    connected: '6 hours ago',
    lastSync: '6 hours ago',
    status: 'Pending',
    defaultBranch: 'main',
    openPRs: 0,
    recentCommits: [
      { hash: '33e10ab', msg: 'init: bootstrap decentralized asset registry client', author: 'Alex P.', time: '6h ago' },
    ],
  },
  {
    id: 'repo-7',
    title: 'Ilays Web',
    product: 'Ilays',
    repo: 'github.com/kobneti/ilays-web',
    connected: '1 day ago',
    lastSync: '1 day ago',
    status: 'Connected',
    defaultBranch: 'main',
    openPRs: 2,
    recentCommits: [
      { hash: '44a88cd', msg: 'feat: add revenue anomaly auto-detection models', author: 'Adeel D.', time: '1d ago' },
      { hash: '90ea121', msg: 'fix: chart resize debounce memory leak', author: 'Leila H.', time: '2d ago' },
    ],
  },
];

const ALL_PRODUCTS = ['MuuqWear', 'GaarX', 'Salguri', 'SomPay', 'Dhaxal', 'Ilays'];

interface LinkedRepositoriesViewProps {
  isLinkRepoModalOpen?: boolean;
  onOpenLinkRepoModal?: () => void;
  onCloseLinkRepoModal?: () => void;
  productFilter?: string;
  onProductFilterChange?: (product: string) => void;
}

export const LinkedRepositoriesView: React.FC<LinkedRepositoriesViewProps> = ({
  isLinkRepoModalOpen: externalLinkRepoOpen,
  onOpenLinkRepoModal: externalOpenLinkRepo,
  onCloseLinkRepoModal: externalCloseLinkRepo,
  productFilter: externalProductFilter,
  onProductFilterChange: externalSetProductFilter,
}) => {
  const [repositories, setRepositories] = useState<LinkedRepoItem[]>(INITIAL_REPOSITORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalProductFilter, setInternalProductFilter] = useState('all');

  const activeProductFilter = externalProductFilter ?? internalProductFilter;
  const setProductFilter = externalSetProductFilter ?? setInternalProductFilter;

  // Internal Modal state fallback
  const [internalLinkRepoOpen, setInternalLinkRepoOpen] = useState(false);
  const isLinkRepoOpen = externalLinkRepoOpen ?? internalLinkRepoOpen;
  const openLinkRepo = externalOpenLinkRepo ?? (() => setInternalLinkRepoOpen(true));
  const closeLinkRepo = externalCloseLinkRepo ?? (() => setInternalLinkRepoOpen(false));

  // Form State
  const [selectedProductForm, setSelectedProductForm] = useState(ALL_PRODUCTS[0]);
  const [githubUrlInput, setGithubUrlInput] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');

  // Activity Drawer / Modal
  const [activeRepoForActivity, setActiveRepoForActivity] = useState<LinkedRepoItem | null>(null);

  // Syncing Animation State
  const [syncingRepoId, setSyncingRepoId] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Submit Link Repo
  const handleLinkRepoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrlInput.trim()) return;

    let cleanRepo = githubUrlInput.trim().replace(/^https?:\/\//, '');
    if (!cleanRepo.startsWith('github.com/')) {
      cleanRepo = `github.com/kobneti/${cleanRepo}`;
    }

    const repoSlug = cleanRepo.split('/').pop() || 'new-repo';
    const computedTitle =
      customTitleInput.trim() ||
      `${selectedProductForm} ${repoSlug.replace(/^(muuqwear|gaarx|salguri|sompay|dhaxal|ilays)-?/, '').toUpperCase() || 'Repo'}`;

    const newRepo: LinkedRepoItem = {
      id: `repo-${Date.now()}`,
      title: computedTitle,
      product: selectedProductForm,
      repo: cleanRepo,
      connected: 'Just now',
      lastSync: 'Just now',
      status: 'Connected',
      defaultBranch: 'main',
      openPRs: 0,
      recentCommits: [
        { hash: Math.random().toString(16).substring(2, 9), msg: 'chore: connect GitHub repository to product catalog', author: 'Adeel D.', time: 'Just now' },
      ],
    };

    setRepositories((prev) => [newRepo, ...prev]);
    showToast(`Linked repository ${newRepo.title} to ${selectedProductForm}`);
    setGithubUrlInput('');
    setCustomTitleInput('');
    closeLinkRepo();
  };

  // Disconnect Repo
  const handleDisconnect = (id: string, name: string) => {
    setRepositories((prev) => prev.filter((r) => r.id !== id));
    showToast(`Disconnected repository: ${name}`);
    if (activeRepoForActivity?.id === id) {
      setActiveRepoForActivity(null);
    }
  };

  // Retry / Sync Repo
  const handleRetrySync = (id: string, name: string) => {
    setSyncingRepoId(id);
    setTimeout(() => {
      setRepositories((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: 'Connected', lastSync: 'Just now' }
            : r
        )
      );
      setSyncingRepoId(null);
      showToast(`Synchronized ${name} with GitHub webhook events`);
    }, 900);
  };

  // Filtered list
  const filteredRepos = repositories.filter((r) => {
    const matchesProduct =
      activeProductFilter === 'all' || r.product.toLowerCase() === activeProductFilter.toLowerCase();

    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProduct && matchesSearch;
  });

  return (
    <div
      id="linked-repositories-root"
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
            Linked Repositories
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Connect GitHub repositories to products.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="page-header-link-repo-btn"
            onClick={openLinkRepo}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Link Repo</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search connected repositories or product names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Product:
          </span>
          <select
            value={activeProductFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="appearance-none px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="all">All Products (7)</option>
            {ALL_PRODUCTS.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: REPOSITORY CARDS (3 columns, grid)                                */}
      {/* ========================================================================= */}
      <div
        id="repository-cards-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filteredRepos.map((item) => {
          const isConnected = item.status === 'Connected';
          const isPending = item.status === 'Pending';
          const isSyncing = syncingRepoId === item.id;

          return (
            <div
              key={item.id}
              id={`repo-card-${item.id}`}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all group"
            >
              {/* Top Card Info */}
              <div className="space-y-3.5">
                {/* Product Chip & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs font-bold text-[#6366F1]">
                    <Box className="w-3.5 h-3.5" />
                    <span>{item.product}</span>
                  </div>

                  {/* Status Indicator */}
                  {isConnected && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Connected</span>
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#3B82F6] border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                      <span>Pending</span>
                    </span>
                  )}
                </div>

                {/* Card Title & GitHub Link */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#6366F1] transition-colors flex items-center gap-2">
                    <Github className="w-4 h-4 text-slate-700" />
                    {item.title}
                  </h3>
                  <a
                    href={`https://${item.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-900 transition-colors mt-1 truncate max-w-full"
                  >
                    <span>{item.repo}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                  </a>
                </div>

                {/* Connected and Last Sync Metadata */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Connected:</span>
                    <span className="font-semibold text-slate-700">{item.connected}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Last sync:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.lastSync}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions: [View Activity] & [Disconnect] or [Retry] */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-view-activity-${item.id}`}
                  onClick={() => setActiveRepoForActivity(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6366F1] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>View Activity</span>
                </button>

                {isPending ? (
                  <button
                    id={`btn-retry-sync-${item.id}`}
                    onClick={() => handleRetrySync(item.id, item.title)}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Retry'}</span>
                  </button>
                ) : (
                  <button
                    id={`btn-disconnect-${item.id}`}
                    onClick={() => handleDisconnect(item.id, item.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* LINK REPOSITORY MODAL                                                     */}
      {/* ========================================================================= */}
      {isLinkRepoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="link-repo-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-xs shadow-2xs">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Link Repository</h3>
                  <p className="text-xs text-slate-500">Connect a GitHub codebase to a KobNeti product</p>
                </div>
              </div>
              <button
                onClick={closeLinkRepo}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleLinkRepoSubmit} className="p-5 space-y-4 text-xs">
              {/* Product Dropdown */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Product <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedProductForm}
                  onChange={(e) => setSelectedProductForm(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  {ALL_PRODUCTS.map((prod) => (
                    <option key={prod} value={prod}>
                      {prod}
                    </option>
                  ))}
                </select>
              </div>

              {/* GitHub URL input */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  GitHub URL <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">https://</span>
                  <input
                    type="text"
                    required
                    placeholder="github.com/kobneti/my-service-repo"
                    value={githubUrlInput}
                    onChange={(e) => setGithubUrlInput(e.target.value)}
                    className="w-full pl-17 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Example: <code>github.com/kobneti/sompay-web</code>
                </p>
              </div>

              {/* Optional Custom Display Title */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Display Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SomPay Web Client"
                  value={customTitleInput}
                  onChange={(e) => setCustomTitleInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              {/* Webhook Sync Notice */}
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#6366F1] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  KobNeti will install a read-only webhook to receive commit pushes, automated pull request updates, and CI deployment statuses.
                </p>
              </div>

              {/* Action Buttons: [Link Repository] [Cancel] */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeLinkRepo}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Link Repository</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVITY INSPECTION DRAWER (opens on [View Activity] click)              */}
      {/* ========================================================================= */}
      {activeRepoForActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="repo-activity-drawer"
            className="h-full w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-sm shadow-xs">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{activeRepoForActivity.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                      {activeRepoForActivity.product}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-500">{activeRepoForActivity.repo}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveRepoForActivity(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs custom-scrollbar">
              {/* Repository Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Branch
                  </span>
                  <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-[#6366F1]" />
                    {activeRepoForActivity.defaultBranch || 'main'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Open PRs
                  </span>
                  <span className="font-bold text-indigo-600 flex items-center gap-1">
                    <GitPullRequest className="w-3 h-3 text-indigo-500" />
                    {activeRepoForActivity.openPRs || 0} active
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Webhook Sync
                  </span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" />
                    Healthy
                  </span>
                </div>
              </div>

              {/* Recent Commits Stream */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <GitCommit className="w-4 h-4 text-[#6366F1]" />
                    <h4 className="font-bold text-slate-900 text-xs">Recent Git Commits</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Last sync: {activeRepoForActivity.lastSync}</span>
                </div>

                <div className="space-y-2.5">
                  {activeRepoForActivity.recentCommits?.map((commit, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          #{commit.hash}
                        </span>
                        <span className="text-slate-400">{commit.time}</span>
                      </div>
                      <p className="font-medium text-slate-800 text-xs">{commit.msg}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>Author:</span>
                        <span className="font-semibold text-slate-600">{commit.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhook Activity Log */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[11px] text-slate-500">
                  Webhook Event Deliveries
                </h4>
                <div className="bg-slate-900 text-slate-300 font-mono text-[11px] p-3.5 rounded-xl space-y-1.5 border border-slate-800">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>[200 OK] push -&gt; refs/heads/main</span>
                    <span className="text-slate-500">12ms</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>[200 OK] pull_request.opened #14</span>
                    <span className="text-slate-500">18ms</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>[200 OK] check_run.completed</span>
                    <span className="text-slate-500">9ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <a
                href={`https://${activeRepoForActivity.repo}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#6366F1] transition-colors"
              >
                <span>Open in GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setActiveRepoForActivity(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
