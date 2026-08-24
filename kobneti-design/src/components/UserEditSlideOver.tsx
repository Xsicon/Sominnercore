import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  Check,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  UserCheck,
  Lock,
  Unlock,
  Sliders,
  CheckCircle2,
  Sparkles,
  Info,
  User,
  Users,
  Box,
  Layers,
  ArrowRight,
  Eye,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { UserRecord } from './UsersView';

export interface PermissionItem {
  id: string;
  label: string;
  description?: string;
  defaultOn: boolean;
}

export interface PermissionCategory {
  id: string;
  title: string;
  iconName?: string;
  permissions: PermissionItem[];
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'tickets-support',
    title: 'Tickets & Support',
    permissions: [
      { id: 'view-tickets', label: 'View Tickets', defaultOn: true },
      { id: 'create-tickets', label: 'Create Tickets', defaultOn: true },
      { id: 'edit-tickets', label: 'Edit Tickets', defaultOn: false },
      { id: 'assign-tickets', label: 'Assign Tickets', defaultOn: true },
      { id: 'close-tickets', label: 'Close/Resolve Tickets', defaultOn: true },
      { id: 'delete-tickets', label: 'Delete Tickets', defaultOn: false },
      { id: 'view-live-chat', label: 'View Live Chat', defaultOn: true },
      { id: 'respond-chat', label: 'Respond to Chat', defaultOn: true },
      { id: 'escalate-incident', label: 'Escalate to Incident', defaultOn: true },
    ],
  },
  {
    id: 'engineering',
    title: 'Engineering',
    permissions: [
      { id: 'view-tasks', label: 'View Tasks', defaultOn: true },
      { id: 'create-tasks', label: 'Create Tasks', defaultOn: true },
      { id: 'edit-tasks', label: 'Edit Tasks', defaultOn: true },
      { id: 'delete-tasks', label: 'Delete Tasks', defaultOn: false },
      { id: 'view-github-activity', label: 'View GitHub Activity', defaultOn: true },
      { id: 'manage-sprints', label: 'Manage Sprints', defaultOn: false },
      { id: 'view-project-roadmap', label: 'View Project Roadmap', defaultOn: true },
      { id: 'edit-project-roadmap', label: 'Edit Project Roadmap', defaultOn: false },
    ],
  },
  {
    id: 'time-payroll',
    title: 'Time & Payroll',
    permissions: [
      { id: 'view-own-time', label: 'View Own Time', defaultOn: true },
      { id: 'view-team-time', label: 'View Team Time', defaultOn: true },
      { id: 'log-time', label: 'Log Time', defaultOn: true },
      { id: 'request-time-edits', label: 'Request Time Edits', defaultOn: true },
      { id: 'approve-time-edits', label: 'Approve Time Edits', defaultOn: true },
      { id: 'view-own-payroll', label: 'View Own Payroll', defaultOn: true },
      { id: 'view-all-payroll', label: 'View All Payroll', defaultOn: false },
      { id: 'approve-payroll-runs', label: 'Approve Payroll Runs', defaultOn: false },
      { id: 'finalize-payroll', label: 'Finalize Payroll', defaultOn: false },
    ],
  },
  {
    id: 'admin-system',
    title: 'Admin & System',
    permissions: [
      { id: 'manage-users', label: 'Manage Users', defaultOn: true },
      { id: 'manage-teams', label: 'Manage Teams', defaultOn: true },
      { id: 'manage-products', label: 'Manage Products', defaultOn: true },
      { id: 'view-audit-logs', label: 'View Audit Logs', defaultOn: true },
      { id: 'export-audit-logs', label: 'Export Audit Logs', defaultOn: false },
      { id: 'manage-integrations', label: 'Manage Integrations', defaultOn: false },
      { id: 'configure-approval-rules', label: 'Configure Approval Rules', defaultOn: false },
    ],
  },
  {
    id: 'communication-files',
    title: 'Communication & Files',
    permissions: [
      { id: 'view-internal-chat', label: 'View Internal Chat', defaultOn: true },
      { id: 'send-internal-chat', label: 'Send Internal Chat', defaultOn: true },
      { id: 'create-channels', label: 'Create Channels', defaultOn: false },
      { id: 'view-calendar', label: 'View Calendar', defaultOn: true },
      { id: 'manage-files', label: 'Manage Files', defaultOn: true },
      { id: 'manage-resources', label: 'Manage Resources (Assets)', defaultOn: false },
    ],
  },
];

const ALL_ROLES = ['Admin', 'Manager', 'Engineer', 'Support'];
const ALL_PRODUCTS = ['MuuqWear', 'GaarX', 'Salguri', 'SomPay', 'Dhaxal', 'Ilays'];
const ALL_TEAMS = [
  'Product Engineering',
  'Platform Operations',
  'Core Architecture',
  'Customer Support',
  'Executive Leadership',
];

interface UserEditSlideOverProps {
  user: UserRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserRecord, permissionsConfig: { useRoleDefaults: boolean; customPermissions: Record<string, boolean> }) => void;
  onImpersonate: (user: UserRecord) => void;
}

export const UserEditSlideOver: React.FC<UserEditSlideOverProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  onImpersonate,
}) => {
  if (!isOpen || !user) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'roles' | 'permissions'>('details');

  // Tab 1 Form State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [status, setStatus] = useState<'Active' | 'Suspended' | 'Deactivated'>(user.status);

  // Tab 2 Form State
  const [roles, setRoles] = useState<string[]>(user.roles || ['Admin']);
  const [teams, setTeams] = useState<string[]>(['Product Engineering', 'Platform Operations']);
  const [products, setProducts] = useState<string[]>(
    user.products.includes('All') ? ['MuuqWear', 'GaarX', 'SomPay'] : user.products
  );

  // Tab 3 Form State (Granular Permissions)
  const [useRoleDefaults, setUseRoleDefaults] = useState(true);
  const [permSearch, setPermSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'tickets-support': true,
    'engineering': true,
    'time-payroll': true,
    'admin-system': true,
    'communication-files': true,
  });

  // Initialize custom permissions map
  const [customPermissions, setCustomPermissions] = useState<Record<string, boolean>>(() => {
    const initialMap: Record<string, boolean> = {};
    PERMISSION_CATEGORIES.forEach((cat) => {
      cat.permissions.forEach((p) => {
        initialMap[p.id] = p.defaultOn;
      });
    });
    return initialMap;
  });

  // Toggle Category Accordion
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Toggle Permission
  const togglePermission = (permId: string) => {
    if (useRoleDefaults) return;
    setCustomPermissions((prev) => ({
      ...prev,
      [permId]: !prev[permId],
    }));
  };

  // Toggle Role
  const handleToggleRole = (roleName: string) => {
    setRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
    );
  };

  // Toggle Team
  const handleToggleTeam = (teamName: string) => {
    setTeams((prev) =>
      prev.includes(teamName) ? prev.filter((t) => t !== teamName) : [...prev, teamName]
    );
  };

  // Toggle Product
  const handleToggleProduct = (productName: string) => {
    setProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((p) => p !== productName)
        : [...prev, productName]
    );
  };

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!permSearch.trim()) return PERMISSION_CATEGORIES;
    const query = permSearch.toLowerCase();
    return PERMISSION_CATEGORIES.map((cat) => {
      const matchingPerms = cat.permissions.filter((p) =>
        p.label.toLowerCase().includes(query)
      );
      return {
        ...cat,
        permissions: matchingPerms,
      };
    }).filter((cat) => cat.permissions.length > 0);
  }, [permSearch]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: UserRecord = {
      ...user,
      name,
      email,
      status,
      roles: roles.length > 0 ? roles : ['Support'],
      products: products.length === ALL_PRODUCTS.length ? ['All'] : products.length > 0 ? products : ['None'],
    };
    onSave(updated, { useRoleDefaults, customPermissions });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over panel container */}
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div
          id="user-edit-slideover-panel"
          className="w-screen max-w-[640px] bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-250 ease-out"
        >
          {/* ========================================================================= */}
          {/* 1. PANEL HEADER                                                           */}
          {/* ========================================================================= */}
          <div className="px-6 py-5 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight flex items-center gap-2.5">
                <span>Edit User — {name || user.name}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : status === 'Suspended'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {status}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Manage account details, roles, and granular permissions.
              </p>
            </div>

            <button
              id="close-user-edit-panel-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close Edit Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 2. TABS NAVIGATION                                                        */}
          {/* ========================================================================= */}
          <div className="px-6 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2 sticky top-[77px] z-20">
            <button
              id="tab-user-details"
              onClick={() => setActiveTab('details')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'details'
                  ? 'border-[#4338CA] text-[#4338CA] bg-white font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Details
            </button>

            <button
              id="tab-user-roles-products"
              onClick={() => setActiveTab('roles')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'roles'
                  ? 'border-[#4338CA] text-[#4338CA] bg-white font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Roles & Products</span>
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                {roles.length}
              </span>
            </button>

            <button
              id="tab-user-permissions"
              onClick={() => setActiveTab('permissions')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'permissions'
                  ? 'border-[#4338CA] text-[#4338CA] bg-white font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Permissions</span>
              {!useRoleDefaults && (
                <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-[#4338CA] text-[10px] font-bold">
                  Custom
                </span>
              )}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 3. SCROLLABLE TAB CONTENT BODY                                            */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* --------------------------------------------------------------------- */}
            {/* TAB 1: DETAILS                                                        */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Large Avatar Block */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div
                    className={`w-16 h-16 rounded-2xl text-white text-xl font-extrabold flex items-center justify-center shadow-md ${
                      user.avatarColor || 'bg-indigo-600'
                    }`}
                  >
                    {user.initials}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900">{name || user.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{email || user.email}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Last Login: <b>2 min ago</b></span>
                    </div>
                  </div>
                </div>

                {/* Editable Inputs Form */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Full Name
                    </label>
                    <input
                      id="edit-user-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                      placeholder="e.g. Adeel D."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Work Email Address
                    </label>
                    <input
                      id="edit-user-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                      placeholder="adeel@kobneti.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Account Status
                    </label>
                    <select
                      id="edit-user-status-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Active' | 'Suspended' | 'Deactivated')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA] cursor-pointer"
                    >
                      <option value="Active">🟢 Active (Full System Access)</option>
                      <option value="Suspended">🟡 Suspended (Temporarily Frozen)</option>
                      <option value="Deactivated">🔴 Deactivated (Revoked Credentials)</option>
                    </select>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#4338CA] shrink-0 mt-0.5" />
                    <div className="text-[11px] text-slate-600 leading-relaxed">
                      Changes made to profile credentials take effect immediately across all active session tokens and SSO identity providers.
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleSave()}
                    className="px-4 py-2.5 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 2: ROLES & PRODUCTS                                               */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'roles' && (
              <div className="space-y-6 text-xs">
                {/* Roles Section */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Assigned Roles
                    </label>
                    <span className="text-[11px] text-slate-500">Multi-select chips</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map((r) => {
                      const isSelected = roles.includes(r);
                      const isAdmin = r === 'Admin';
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleToggleRole(r)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                            isSelected
                              ? isAdmin
                                ? 'bg-[#4338CA] text-white border-[#4338CA] shadow-xs'
                                : 'bg-indigo-50 text-[#4338CA] border-indigo-300 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                              isSelected
                                ? 'bg-white text-[#4338CA] border-transparent'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span>{r}</span>
                          {isAdmin && (
                            <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-white/20 text-white font-mono">
                              Primary
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Teams Section */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Assigned Teams
                  </label>
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    {ALL_TEAMS.map((teamName) => {
                      const isChecked = teams.includes(teamName);
                      return (
                        <label
                          key={teamName}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleTeam(teamName)}
                              className="w-4 h-4 rounded text-[#4338CA] focus:ring-[#4338CA] border-slate-300"
                            />
                            <span className="text-xs font-semibold text-slate-800">
                              {teamName}
                            </span>
                          </div>
                          {isChecked && (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Active Member
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Product Assignments */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Product Assignments
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProducts(
                          products.length === ALL_PRODUCTS.length ? [] : [...ALL_PRODUCTS]
                        )
                      }
                      className="text-[11px] text-[#4338CA] hover:underline font-bold"
                    >
                      {products.length === ALL_PRODUCTS.length ? 'Deselect All' : 'Select All (6)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {ALL_PRODUCTS.map((prodName) => {
                      const isSelected = products.includes(prodName);
                      return (
                        <div
                          key={prodName}
                          onClick={() => handleToggleProduct(prodName)}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-indigo-50/70 border-indigo-200 text-[#4338CA] shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isSelected
                                  ? 'bg-[#4338CA] text-white border-[#4338CA]'
                                  : 'bg-white border-slate-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                            <span>{prodName}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleSave()}
                    className="px-4 py-2.5 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: GRANULAR PERMISSIONS (EXPANDED VIEW)                           */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                {/* Granular Permissions Header */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Granular Permissions
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Override default role permissions. Turn ON &quot;Use role defaults&quot; to inherit permissions from assigned roles.
                  </p>
                </div>

                {/* Master Toggle Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          useRoleDefaults
                            ? 'bg-indigo-100 text-[#4338CA]'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {useRoleDefaults ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Use role defaults
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {useRoleDefaults
                            ? 'Inheriting presets from assigned roles'
                            : 'Custom permission overrides enabled'}
                        </div>
                      </div>
                    </div>

                    {/* Clean Modern Switch */}
                    <button
                      id="master-role-defaults-switch"
                      type="button"
                      role="switch"
                      aria-checked={useRoleDefaults}
                      onClick={() => setUseRoleDefaults(!useRoleDefaults)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        useRoleDefaults ? 'bg-[#4338CA]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          useRoleDefaults ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Summary Banner */}
                  {useRoleDefaults ? (
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-slate-700 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-[#4338CA] shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-semibold text-slate-900">
                          User inherits permissions from:
                        </span>{' '}
                        <span className="font-bold text-[#4338CA]">
                          {roles.join(', ') || 'Admin'}
                        </span>{' '}
                        <span className="text-slate-500">(Union of all assigned roles)</span>. All toggles below are locked to their inherited state.
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold">Custom Override Active:</span> You can now toggle individual permissions below for fine-grained access governance.
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={permSearch}
                    onChange={(e) => setPermSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA]"
                  />
                  {permSearch && (
                    <button
                      onClick={() => setPermSearch('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Permission Categories (Accordion style, expandable by default) */}
                <div className="space-y-4">
                  {filteredCategories.map((category) => {
                    const isExpanded = expandedCategories[category.id] ?? true;
                    return (
                      <div
                        key={category.id}
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
                      >
                        {/* Category Header */}
                        <button
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className="w-full px-4 py-3 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between transition-colors cursor-pointer text-left border-b border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500" />
                            )}
                            <span className="text-[14px] font-semibold text-slate-900">
                              {category.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 font-medium">
                              {category.permissions.filter((p) => customPermissions[p.id]).length} of {category.permissions.length} active
                            </span>
                          </div>
                        </button>

                        {/* Permission Rows */}
                        {isExpanded && (
                          <div className="divide-y divide-slate-100 px-2 py-1">
                            {category.permissions.map((perm) => {
                              const isChecked = customPermissions[perm.id] ?? perm.defaultOn;
                              return (
                                <div
                                  key={perm.id}
                                  className={`py-2.5 px-3 flex items-center justify-between rounded-lg transition-colors pl-6 ${
                                    useRoleDefaults
                                      ? 'opacity-70 cursor-not-allowed bg-transparent'
                                      : 'hover:bg-slate-50 cursor-pointer'
                                  }`}
                                  onClick={() => togglePermission(perm.id)}
                                >
                                  <div className="space-y-0.5">
                                    <div className="text-xs font-medium text-slate-800">
                                      {perm.label}
                                    </div>
                                    {perm.description && (
                                      <div className="text-[10px] text-slate-400">
                                        {perm.description}
                                      </div>
                                    )}
                                  </div>

                                  {/* Individual Toggle Switch */}
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isChecked}
                                    disabled={useRoleDefaults}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePermission(perm.id);
                                    }}
                                    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                      useRoleDefaults ? 'cursor-not-allowed' : 'cursor-pointer'
                                    } ${isChecked ? 'bg-[#4338CA]' : 'bg-slate-200'}`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                        isChecked ? 'translate-x-4' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 4. STICKY PANEL FOOTER                                                    */}
          {/* ========================================================================= */}
          <div className="p-4 sm:px-6 border-t border-slate-200 bg-white sticky bottom-0 z-20 flex items-center justify-between gap-3 shadow-lg">
            {/* Left: Impersonate User Button with Tooltip */}
            <div className="relative group">
              <button
                id="impersonate-user-btn"
                type="button"
                onClick={() => onImpersonate(user)}
                className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-[#4338CA] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                title={`Log in as ${name || user.name} (Test Access)`}
              >
                <KeyRound className="w-3.5 h-3.5 text-[#4338CA]" />
                <span className="hidden sm:inline">Log in as {name || user.name} (Test Access)</span>
                <span className="sm:hidden">Impersonate</span>
              </button>

              {/* Warning tooltip */}
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] leading-snug shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-30">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 pb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Session Switch</span>
                </div>
                This will log you out and log you in as this user to test their exact permissions and view.
              </div>
            </div>

            {/* Right: Cancel & Save Changes */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                id="panel-save-user-btn"
                type="button"
                onClick={() => handleSave()}
                className="px-4 py-2 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
