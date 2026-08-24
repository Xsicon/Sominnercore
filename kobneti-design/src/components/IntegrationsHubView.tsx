import React, { useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  Unlink,
  Link,
  AlertTriangle,
  X,
  ExternalLink,
  Shield,
  Key,
  Lock,
  Clock,
  User,
  Layers,
  Sparkles,
  Search,
  Check,
  Radio,
} from 'lucide-react';

export interface IntegrationItem {
  id: string;
  name: string;
  iconEmoji: string;
  status: 'connected' | 'not_connected';
  lastSync?: string;
  connectedBy?: string;
  metaLabel?: string;
  metaValue?: string;
  description: string;
  category: 'Developer' | 'Productivity' | 'Communication' | 'Cloud Infrastructure';
  isComingSoon?: boolean;
}

const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'github',
    name: 'GitHub',
    iconEmoji: '🐙',
    status: 'connected',
    lastSync: '2 min ago',
    connectedBy: 'Adeel D.',
    metaLabel: 'Repos',
    metaValue: '7',
    description: 'Sync pull requests, commit hashes, branches, and issue tracking across engineering boards.',
    category: 'Developer',
  },
  {
    id: 'email',
    name: 'Email',
    iconEmoji: '✉️',
    status: 'connected',
    lastSync: '5 min ago',
    connectedBy: 'Adeel D.',
    metaLabel: 'Inbound',
    metaValue: '2 addresses',
    description: 'Direct inbound/outbound support queue routing, email notification relays, and ticket forwarding.',
    category: 'Productivity',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    iconEmoji: '📅',
    status: 'connected',
    lastSync: '15 min ago',
    connectedBy: 'Adeel D.',
    metaLabel: 'Accounts',
    metaValue: '1',
    description: 'Real-time schedule synchronization, sprint release milestone tracking, and team out-of-office alerts.',
    category: 'Productivity',
  },
  {
    id: 'slack',
    name: 'Slack',
    iconEmoji: '💬',
    status: 'not_connected',
    lastSync: '—',
    connectedBy: '—',
    metaLabel: '—',
    metaValue: '',
    description: 'Broadcast urgent incident alerts, ticket escalations, and automated deployment bots to Slack channels.',
    category: 'Communication',
  },
  {
    id: 'jira',
    name: 'Jira',
    iconEmoji: '📋',
    status: 'not_connected',
    lastSync: '—',
    connectedBy: '—',
    metaLabel: '—',
    metaValue: '',
    description: 'Two-way synchronization for enterprise sprint backlogs, epics, and QA testing cycles.',
    category: 'Developer',
  },
  {
    id: 'aws',
    name: 'AWS',
    iconEmoji: '☁️',
    status: 'not_connected',
    lastSync: '—',
    connectedBy: '—',
    metaLabel: '—',
    metaValue: '',
    description: 'CloudWatch telemetry, S3 asset storage bridges, and automated container health checks.',
    category: 'Cloud Infrastructure',
  },
];

export const IntegrationsHubView: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [searchFilter, setSearchFilter] = useState('');

  // Modal States
  const [connectModalService, setConnectModalService] = useState<IntegrationItem | null>(null);
  const [disconnectModalService, setDisconnectModalService] = useState<IntegrationItem | null>(null);
  const [rotateModalService, setRotateModalService] = useState<IntegrationItem | null>(null);

  // Connect Form State
  const [authMethod, setAuthMethod] = useState<'oauth' | 'apikey'>('oauth');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Connect Modal
  const handleOpenConnect = (service: IntegrationItem) => {
    setConnectModalService(service);
    setAuthMethod('oauth');
    setApiKeyInput('');
    setApiSecretInput('');
  };

  // Perform Connect
  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectModalService) return;

    setIsAuthorizing(true);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) => {
          if (item.id === connectModalService.id) {
            let metaLabel = 'Connected';
            let metaValue = 'Active';
            if (item.id === 'slack') {
              metaLabel = 'Channels';
              metaValue = '4 active';
            } else if (item.id === 'jira') {
              metaLabel = 'Projects';
              metaValue = '3 synced';
            } else if (item.id === 'aws') {
              metaLabel = 'Clusters';
              metaValue = '2 active';
            }

            return {
              ...item,
              status: 'connected',
              lastSync: 'Just now',
              connectedBy: 'Adeel D.',
              metaLabel,
              metaValue,
            };
          }
          return item;
        })
      );
      setIsAuthorizing(false);
      showToast(`Successfully connected ${connectModalService.name}!`);
      setConnectModalService(null);
    }, 600);
  };

  // Perform Disconnect
  const handleConfirmDisconnect = () => {
    if (!disconnectModalService) return;

    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === disconnectModalService.id) {
          return {
            ...item,
            status: 'not_connected',
            lastSync: '—',
            connectedBy: '—',
            metaLabel: '—',
            metaValue: '',
          };
        }
        return item;
      })
    );

    showToast(`Disconnected ${disconnectModalService.name}.`);
    setDisconnectModalService(null);
  };

  // Perform Rotate Credentials
  const handleConfirmRotate = () => {
    if (!rotateModalService) return;

    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === rotateModalService.id) {
          return {
            ...item,
            lastSync: 'Just now',
          };
        }
        return item;
      })
    );

    showToast(`Rotated credentials for ${rotateModalService.name}. New access tokens generated.`);
    setRotateModalService(null);
  };

  const filteredIntegrations = integrations.filter(
    (item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      id="integrations-hub-root"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
            <span>Integrations Hub</span>
          </h1>
          <p className="text-xs text-[#64748B] font-medium">
            Manage connections to external services.
          </p>
        </div>

        {/* Global Filter / Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1] shadow-2xs"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: INTEGRATION CARDS (3 COLUMNS GRID)                                 */}
      {/* ========================================================================= */}
      <div
        id="integrations-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filteredIntegrations.map((item) => {
          const isConnected = item.status === 'connected';

          return (
            <div
              key={item.id}
              id={`integration-card-${item.id}`}
              className={`bg-white rounded-2xl border p-5.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative ${
                isConnected
                  ? 'border-slate-200/90'
                  : 'border-slate-200 bg-slate-50/30'
              }`}
            >
              {/* Top Header: Emoji + Title + Status Pill */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {item.iconEmoji}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isConnected ? (
                    <div
                      id={`status-badge-${item.id}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366F1] text-[11px] font-bold shadow-2xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
                      <span>Connected</span>
                    </div>
                  ) : (
                    <div
                      id={`status-badge-${item.id}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold"
                    >
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>Not Connected</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Middle Metadata Block */}
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Last sync:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{item.lastSync}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Connected by:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{item.connectedBy}</span>
                </div>

                {item.metaLabel !== '—' && (
                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/50">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{item.metaLabel}:</span>
                    </span>
                    <span className="font-bold text-[#6366F1]">{item.metaValue}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-2 border-t border-slate-100">
                {isConnected ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`rotate-cred-btn-${item.id}`}
                      onClick={() => setRotateModalService(item)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-slate-500" />
                      <span className="truncate">Rotate Credentials</span>
                    </button>

                    <button
                      id={`disconnect-btn-${item.id}`}
                      onClick={() => setDisconnectModalService(item)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Unlink className="w-3 h-3 text-rose-600" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                ) : (
                  <button
                    id={`connect-btn-${item.id}`}
                    onClick={() => handleOpenConnect(item)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-98"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Connect {item.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* CONNECT MODAL (Opens on [Connect] click)                                  */}
      {/* ========================================================================= */}
      {connectModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="connect-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-2xs">
                  {connectModalService.iconEmoji}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Connect {connectModalService.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Authenticate to grant secure platform access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConnectModalService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Auth Flow Form */}
            <form onSubmit={handleAuthorize} className="p-5 space-y-4 text-xs">
              {/* Service Info Box */}
              <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-slate-700 text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-700">Pre-selected Service</span>
                <span className="font-bold text-[#6366F1] flex items-center gap-1">
                  <span>{connectModalService.iconEmoji}</span>
                  <span>{connectModalService.name}</span>
                </span>
              </div>

              {/* Authentication Type Selector */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">Authentication Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('oauth')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      authMethod === 'oauth'
                        ? 'border-[#6366F1] bg-indigo-50/30 ring-1 ring-[#6366F1]/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">OAuth 2.0</span>
                      {authMethod === 'oauth' && <Check className="w-3.5 h-3.5 text-[#6366F1]" />}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">
                      One-click authorization with official provider
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMethod('apikey')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      authMethod === 'apikey'
                        ? 'border-[#6366F1] bg-indigo-50/30 ring-1 ring-[#6366F1]/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">API Key / Token</span>
                      {authMethod === 'apikey' && <Check className="w-3.5 h-3.5 text-[#6366F1]" />}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">
                      Enter personal access tokens or secrets
                    </span>
                  </button>
                </div>
              </div>

              {/* Form Input fields if API Key selected */}
              {authMethod === 'apikey' ? (
                <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Access Token / API Key <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="sk_live_..."
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Secret Key (Optional)
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="Optional client secret..."
                        value={apiSecretInput}
                        onChange={(e) => setApiSecretInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Shield className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span>Secure OAuth Handshake</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Clicking Authorize will redirect to {connectModalService.name} to grant read/write scopes. You can revoke permissions at any time.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConnectModalService(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthorizing}
                  className="px-5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAuthorizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authorizing...</span>
                    </>
                  ) : (
                    <>
                      <Link className="w-3.5 h-3.5" />
                      <span>Authorize</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DISCONNECT CONFIRMATION MODAL (Danger Pattern)                            */}
      {/* ========================================================================= */}
      {disconnectModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="disconnect-confirmation-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  Are you sure you want to disconnect {disconnectModalService.name}?
                </h3>
                <p className="text-xs text-rose-600 font-medium">
                  This will break all integrations using this connection.
                </p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed px-2">
                External synchronization webhooks, linked tickets, automated relays, and bot triggers will cease functioning until re-authenticated.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDisconnectModalService(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDisconnect}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Confirm Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROTATE CREDENTIALS MODAL                                                  */}
      {/* ========================================================================= */}
      {rotateModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="rotate-credentials-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 text-[#6366F1] flex items-center justify-center mx-auto shadow-xs">
                <RefreshCw className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  Rotate Credentials for {rotateModalService.name}
                </h3>
                <p className="text-xs text-slate-600">
                  Regenerate active API secret tokens and re-authorize OAuth sessions.
                </p>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed px-2">
                This will safely invalidate older session credentials and generate refreshed HMAC signature tokens without dropping active queue workflows.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRotateModalService(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRotate}
                  className="px-5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rotate Credentials</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
