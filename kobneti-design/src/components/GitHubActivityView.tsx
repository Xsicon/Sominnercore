import React, { useState } from 'react';
import {
  GitCommit,
  GitPullRequest,
  RotateCw,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  GitBranch,
  Filter,
  Check,
  X,
  Sparkles,
  Server,
  Layers,
  Calendar,
  User,
  FolderGit2,
} from 'lucide-react';

export type GitHubActivityTab = 'commits' | 'pull-requests' | 'deployments';

export interface CommitItem {
  sha: string;
  fullSha: string;
  message: string;
  author: string;
  repo: string;
  time: string;
  branch: string;
}

export interface PullRequestItem {
  id: string;
  number: string;
  title: string;
  status: 'Open' | 'Merged' | 'Closed';
  branch: string;
  repo: string;
  time: string;
  author: string;
}

export interface DeploymentItem {
  id: string;
  environment: 'Production' | 'Staging';
  status: 'Success' | 'Failed';
  commit: string;
  repo: string;
  deployedAt: string;
  duration: string;
  triggeredBy: string;
}

const COMMITS_DATA: CommitItem[] = [
  {
    sha: 'a1b2c3d',
    fullSha: 'a1b2c3d8e9f0123456789abcdef0123456789abc',
    message: 'Fix payment gateway timeout',
    author: 'Adeel D.',
    repo: 'muuqwear-web',
    time: '2 min ago',
    branch: 'fix/payment-gateway',
  },
  {
    sha: 'e4f5g6h',
    fullSha: 'e4f5g6h8e9f0123456789abcdef0123456789abc',
    message: 'Update webhook handlers',
    author: 'Leila H.',
    repo: 'muuqwear-api',
    time: '14 min ago',
    branch: 'main',
  },
  {
    sha: 'i7j8k9l',
    fullSha: 'i7j8k9l8e9f0123456789abcdef0123456789abc',
    message: 'Add 3DS verification',
    author: 'Mike C.',
    repo: 'gaarx-api',
    time: '1 hour ago',
    branch: 'feature/3ds-verification',
  },
  {
    sha: 'm1n2o3p',
    fullSha: 'm1n2o3p8e9f0123456789abcdef0123456789abc',
    message: 'Refactor user auth',
    author: 'Sarah K.',
    repo: 'sompay-api',
    time: '3 hours ago',
    branch: 'refactor/auth',
  },
  {
    sha: 'q4r5s6t',
    fullSha: 'q4r5s6t8e9f0123456789abcdef0123456789abc',
    message: 'Fix CORS configuration',
    author: 'Adeel D.',
    repo: 'muuqwear-web',
    time: '5 hours ago',
    branch: 'main',
  },
];

const PULL_REQUESTS_DATA: PullRequestItem[] = [
  {
    id: 'pr-42',
    number: '#42',
    title: 'Fix/payment-gateway',
    status: 'Open',
    branch: 'fix/payment-gateway',
    repo: 'muuqwear-web',
    time: '2 min ago',
    author: 'Adeel D.',
  },
  {
    id: 'pr-41',
    number: '#41',
    title: 'Feature/3ds-verification',
    status: 'Merged',
    branch: 'feature/3ds-verification',
    repo: 'muuqwear-api',
    time: '14 min ago',
    author: 'Mike C.',
  },
  {
    id: 'pr-40',
    number: '#40',
    title: 'Fix/api-timeout',
    status: 'Open',
    branch: 'fix/api-timeout',
    repo: 'gaarx-api',
    time: '1 hour ago',
    author: 'Leila H.',
  },
  {
    id: 'pr-39',
    number: '#39',
    title: 'Feature/user-permissions',
    status: 'Merged',
    branch: 'feature/user-permissions',
    repo: 'sompay-api',
    time: '3 hours ago',
    author: 'Sarah K.',
  },
  {
    id: 'pr-38',
    number: '#38',
    title: 'Refactor/auth',
    status: 'Closed',
    branch: 'refactor/auth',
    repo: 'muuqwear-web',
    time: '5 hours ago',
    author: 'Adeel D.',
  },
];

const DEPLOYMENTS_DATA: DeploymentItem[] = [
  {
    id: 'dep-1',
    environment: 'Production',
    status: 'Success',
    commit: 'a1b2c3d',
    repo: 'muuqwear-web',
    deployedAt: '2 min ago',
    duration: '1m 14s',
    triggeredBy: 'Adeel D.',
  },
  {
    id: 'dep-2',
    environment: 'Staging',
    status: 'Success',
    commit: 'e4f5g6h',
    repo: 'muuqwear-api',
    deployedAt: '14 min ago',
    duration: '48s',
    triggeredBy: 'Leila H.',
  },
  {
    id: 'dep-3',
    environment: 'Production',
    status: 'Failed',
    commit: 'i7j8k9l',
    repo: 'gaarx-api',
    deployedAt: '1 hour ago',
    duration: '2m 05s',
    triggeredBy: 'Mike C.',
  },
  {
    id: 'dep-4',
    environment: 'Staging',
    status: 'Success',
    commit: 'm1n2o3p',
    repo: 'sompay-api',
    deployedAt: '3 hours ago',
    duration: '52s',
    triggeredBy: 'Sarah K.',
  },
  {
    id: 'dep-5',
    environment: 'Production',
    status: 'Success',
    commit: 'q4r5s6t',
    repo: 'muuqwear-web',
    deployedAt: '5 hours ago',
    duration: '1m 22s',
    triggeredBy: 'Adeel D.',
  },
];

interface GitHubActivityViewProps {
  selectedProduct?: string;
  selectedRepo?: string;
}

export const GitHubActivityView: React.FC<GitHubActivityViewProps> = ({
  selectedProduct = 'all',
  selectedRepo = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<GitHubActivityTab>('commits');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState('2 min ago');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime('Just now');
      showToast('GitHub activity synced with remote webhooks');
    }, 900);
  };

  // Filter commits
  const filteredCommits = COMMITS_DATA.filter((commit) => {
    const matchSearch =
      commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.sha.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.repo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRepo = selectedRepo === 'all' || commit.repo === selectedRepo;
    const matchProduct =
      selectedProduct === 'all' ||
      (selectedProduct === 'muuqwear' && commit.repo.startsWith('muuqwear')) ||
      (selectedProduct === 'gaarx' && commit.repo.startsWith('gaarx')) ||
      (selectedProduct === 'sompay' && commit.repo.startsWith('sompay'));

    return matchSearch && matchRepo && matchProduct;
  });

  // Filter PRs
  const filteredPRs = PULL_REQUESTS_DATA.filter((pr) => {
    const matchSearch =
      pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.repo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRepo = selectedRepo === 'all' || pr.repo === selectedRepo;
    const matchProduct =
      selectedProduct === 'all' ||
      (selectedProduct === 'muuqwear' && pr.repo.startsWith('muuqwear')) ||
      (selectedProduct === 'gaarx' && pr.repo.startsWith('gaarx')) ||
      (selectedProduct === 'sompay' && pr.repo.startsWith('sompay'));

    return matchSearch && matchRepo && matchProduct;
  });

  // Filter Deployments
  const filteredDeployments = DEPLOYMENTS_DATA.filter((dep) => {
    const matchSearch =
      dep.environment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.commit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.triggeredBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRepo = selectedRepo === 'all' || dep.repo === selectedRepo;
    const matchProduct =
      selectedProduct === 'all' ||
      (selectedProduct === 'muuqwear' && dep.repo.startsWith('muuqwear')) ||
      (selectedProduct === 'gaarx' && dep.repo.startsWith('gaarx')) ||
      (selectedProduct === 'sompay' && dep.repo.startsWith('sompay'));

    return matchSearch && matchRepo && matchProduct;
  });

  return (
    <div
      id="github-activity-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="github-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
              GitHub Activity
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Read-Only
            </span>
          </div>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Read-only view of commits, pull requests, and deployments.
          </p>
        </div>

        {/* Sync Now ghost link + Last synced indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last synced: <strong className="text-slate-700">{lastSyncedTime}</strong></span>
          </div>

          <button
            id="btn-github-sync-now"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] hover:underline cursor-pointer transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#6366F1] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync now'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB NAVIGATION & SEARCH BAR                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Three Tabs: Commits | Pull Requests | Deployments */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold w-fit">
          <button
            id="tab-btn-commits"
            onClick={() => {
              setActiveTab('commits');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'commits'
                ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCommit className={`w-3.5 h-3.5 ${activeTab === 'commits' ? 'text-[#6366F1]' : 'text-slate-400'}`} />
            <span>Commits</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'commits' ? 'bg-indigo-50 text-[#6366F1]' : 'bg-slate-200/70 text-slate-600'}`}>
              5
            </span>
          </button>

          <button
            id="tab-btn-pull-requests"
            onClick={() => {
              setActiveTab('pull-requests');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'pull-requests'
                ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitPullRequest className={`w-3.5 h-3.5 ${activeTab === 'pull-requests' ? 'text-[#6366F1]' : 'text-slate-400'}`} />
            <span>Pull Requests</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'pull-requests' ? 'bg-indigo-50 text-[#6366F1]' : 'bg-slate-200/70 text-slate-600'}`}>
              5
            </span>
          </button>

          <button
            id="tab-btn-deployments"
            onClick={() => {
              setActiveTab('deployments');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'deployments'
                ? 'bg-white text-[#0F172A] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className={`w-3.5 h-3.5 ${activeTab === 'deployments' ? 'text-[#6366F1]' : 'text-slate-400'}`} />
            <span>Deployments</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'deployments' ? 'bg-indigo-50 text-[#6366F1]' : 'bg-slate-200/70 text-slate-600'}`}>
              5
            </span>
          </button>
        </div>

        {/* Tab-level Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            id="github-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'commits' ? 'commits by SHA, message...' : activeTab === 'pull-requests' ? 'PRs by title, #...' : 'deployments...'}`}
            className="w-full pl-9 pr-8 py-2 bg-white border border-[#E2E8F0] focus:border-[#6366F1] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT: COMMITS TABLE (Tab 1 - Active)                               */}
      {/* ========================================================================= */}
      {activeTab === 'commits' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">SHA</th>
                  <th className="py-3.5 px-4 font-bold">Message</th>
                  <th className="py-3.5 px-4 font-bold">Author</th>
                  <th className="py-3.5 px-4 font-bold">Repo</th>
                  <th className="py-3.5 px-4 font-bold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCommits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      No commits match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredCommits.map((commit) => (
                    <tr
                      key={commit.sha}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* SHA link */}
                      <td className="py-3.5 px-4 font-mono font-bold text-xs whitespace-nowrap">
                        <a
                          href={`https://github.com/kobneti/${commit.repo}/commit/${commit.fullSha}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          id={`commit-link-${commit.sha}`}
                          onClick={(e) => {
                            // In dev sandbox, alert/toast for smooth demo
                            showToast(`Opening GitHub commit ${commit.sha} in new tab`);
                          }}
                          className="inline-flex items-center gap-1 text-[#6366F1] hover:text-[#4F46E5] hover:underline cursor-pointer bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100"
                        >
                          <GitCommit className="w-3 h-3 text-[#6366F1]" />
                          <span>{commit.sha}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                        </a>
                      </td>

                      {/* Message */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-md">{commit.message}</span>
                          <span className="hidden lg:inline-flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            <GitBranch className="w-2.5 h-2.5 text-slate-400" />
                            {commit.branch}
                          </span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[9px] font-bold">
                            {commit.author.substring(0, 2)}
                          </div>
                          <span className="font-medium text-slate-800">{commit.author}</span>
                        </div>
                      </td>

                      {/* Repo */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                          {commit.repo}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-right text-slate-500 font-medium whitespace-nowrap">
                        {commit.time}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: PULL REQUESTS TABLE (Tab 2)                                  */}
      {/* ========================================================================= */}
      {activeTab === 'pull-requests' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">#</th>
                  <th className="py-3.5 px-4 font-bold">Title</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Branch</th>
                  <th className="py-3.5 px-4 font-bold">Repo</th>
                  <th className="py-3.5 px-4 font-bold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPRs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      No pull requests match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredPRs.map((pr) => {
                    return (
                      <tr
                        key={pr.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* # number */}
                        <td className="py-3.5 px-4 font-mono font-bold text-xs whitespace-nowrap">
                          <a
                            href={`https://github.com/kobneti/${pr.repo}/pull/${pr.number.replace('#', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            id={`pr-link-${pr.number.replace('#', '')}`}
                            onClick={(e) => {
                              showToast(`Opening GitHub Pull Request ${pr.number} in new tab`);
                            }}
                            className="inline-flex items-center gap-1 text-[#6366F1] hover:text-[#4F46E5] hover:underline cursor-pointer bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100"
                          >
                            <GitPullRequest className="w-3 h-3 text-[#6366F1]" />
                            <span>{pr.number}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                          </a>
                        </td>

                        {/* Title */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{pr.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">by {pr.author}</span>
                          </div>
                        </td>

                        {/* Status (🟢 Open: Secondary / 🔵 Merged: Primary / ⚪ Closed: Neutral) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {pr.status === 'Open' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#3B82F6] border border-blue-200">
                              <span>🟢</span>
                              <span>Open</span>
                            </span>
                          )}
                          {pr.status === 'Merged' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                              <span>🔵</span>
                              <span>Merged</span>
                            </span>
                          )}
                          {pr.status === 'Closed' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <span>⚪</span>
                              <span>Closed</span>
                            </span>
                          )}
                        </td>

                        {/* Branch */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-fit">
                            <GitBranch className="w-3 h-3 text-slate-400" />
                            <span>{pr.branch}</span>
                          </div>
                        </td>

                        {/* Repo */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                            {pr.repo}
                          </span>
                        </td>

                        {/* Time */}
                        <td className="py-3.5 px-4 text-right text-slate-500 font-medium whitespace-nowrap">
                          {pr.time}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: DEPLOYMENTS TABLE (Tab 3)                                    */}
      {/* ========================================================================= */}
      {activeTab === 'deployments' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Environment</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Commit</th>
                  <th className="py-3.5 px-4 font-bold text-right">Deployed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeployments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-400">
                      No deployments match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredDeployments.map((dep) => {
                    return (
                      <tr
                        key={dep.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* Environment */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                dep.environment === 'Production' ? 'bg-[#6366F1]' : 'bg-amber-500'
                              }`}
                            />
                            <span className="font-bold text-slate-900">{dep.environment}</span>
                          </div>
                        </td>

                        {/* Status (✅ Success: Primary / ❌ Failed: Danger) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {dep.status === 'Success' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                              <span>✅</span>
                              <span>Success</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <span>❌</span>
                              <span>Failed</span>
                            </span>
                          )}
                        </td>

                        {/* Commit SHA link */}
                        <td className="py-3.5 px-4 font-mono font-bold text-xs whitespace-nowrap">
                          <a
                            href={`https://github.com/kobneti/${dep.repo}/commit/${dep.commit}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            id={`dep-commit-link-${dep.commit}`}
                            onClick={(e) => {
                              showToast(`Opening GitHub commit ${dep.commit} in new tab`);
                            }}
                            className="inline-flex items-center gap-1 text-[#6366F1] hover:text-[#4F46E5] hover:underline cursor-pointer bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100"
                          >
                            <GitCommit className="w-3 h-3 text-[#6366F1]" />
                            <span>{dep.commit}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                          </a>
                        </td>

                        {/* Deployed At */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{dep.deployedAt}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
