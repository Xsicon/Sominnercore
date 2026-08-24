import React, { useState } from 'react';
import {
  UserPlus,
  Download,
  Users,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  Edit2,
  Ban,
  RotateCcw,
  Eye,
  Search,
  Filter,
  X,
  Mail,
  Building2,
  Box,
  Check,
} from 'lucide-react';
import { UserEditSlideOver } from './UserEditSlideOver';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  roles: string[];
  products: string[];
  status: 'Active' | 'Suspended' | 'Deactivated';
  lastActive: string;
  avatarColor?: string;
  initials: string;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'user-1',
    name: 'Adeel D.',
    email: 'adeel@kobneti.com',
    roles: ['Admin'],
    products: ['All'],
    status: 'Active',
    lastActive: '2 min ago',
    avatarColor: 'bg-indigo-600',
    initials: 'AD',
  },
  {
    id: 'user-2',
    name: 'Leila H.',
    email: 'leila@kobneti.com',
    roles: ['Manager', 'Engineer'],
    products: ['MuuqWear', 'GaarX'],
    status: 'Active',
    lastActive: '14 min ago',
    avatarColor: 'bg-emerald-600',
    initials: 'LH',
  },
  {
    id: 'user-3',
    name: 'Mike C.',
    email: 'mike@kobneti.com',
    roles: ['Engineer'],
    products: ['GaarX', 'Salguri'],
    status: 'Active',
    lastActive: '1 hour ago',
    avatarColor: 'bg-blue-600',
    initials: 'MC',
  },
  {
    id: 'user-4',
    name: 'Sarah K.',
    email: 'sarah@kobneti.com',
    roles: ['Support'],
    products: ['MuuqWear', 'Salguri'],
    status: 'Active',
    lastActive: '3 hours ago',
    avatarColor: 'bg-purple-600',
    initials: 'SK',
  },
  {
    id: 'user-5',
    name: 'Ibrahim M.',
    email: 'ibrahim@kobneti.com',
    roles: ['Manager'],
    products: ['All'],
    status: 'Suspended',
    lastActive: '2 days ago',
    avatarColor: 'bg-amber-600',
    initials: 'IM',
  },
  {
    id: 'user-6',
    name: 'John D.',
    email: 'john@kobneti.com',
    roles: ['Support'],
    products: ['MuuqWear'],
    status: 'Active',
    lastActive: '5 hours ago',
    avatarColor: 'bg-teal-600',
    initials: 'JD',
  },
  {
    id: 'user-7',
    name: 'Emma W.',
    email: 'emma@kobneti.com',
    roles: ['Support'],
    products: ['SomPay', 'Dhaxal'],
    status: 'Active',
    lastActive: '6 hours ago',
    avatarColor: 'bg-pink-600',
    initials: 'EW',
  },
  {
    id: 'user-8',
    name: 'Alex P.',
    email: 'alex@kobneti.com',
    roles: ['Engineer'],
    products: ['SomPay', 'Ilays'],
    status: 'Deactivated',
    lastActive: '1 week ago',
    avatarColor: 'bg-slate-500',
    initials: 'AP',
  },
  {
    id: 'user-9',
    name: 'Lisa A.',
    email: 'lisa@kobneti.com',
    roles: ['Support'],
    products: ['MuuqWear', 'GaarX'],
    status: 'Active',
    lastActive: '8 hours ago',
    avatarColor: 'bg-cyan-600',
    initials: 'LA',
  },
  {
    id: 'user-10',
    name: 'James B.',
    email: 'james@kobneti.com',
    roles: ['Engineer'],
    products: ['MuuqWear', 'GaarX'],
    status: 'Active',
    lastActive: '9 hours ago',
    avatarColor: 'bg-violet-600',
    initials: 'JB',
  },
];

const ALL_ROLES = ['Admin', 'Manager', 'Engineer', 'Support'];
const ALL_PRODUCTS = ['MuuqWear', 'GaarX', 'Salguri', 'SomPay', 'Dhaxal', 'Ilays'];
const ALL_TEAMS = ['Core Engineering', 'Product Support', 'Operations', 'Executive Leadership', 'Infrastructure & Security'];

interface UsersViewProps {
  isInviteModalOpen?: boolean;
  onCloseInviteModal?: () => void;
  onOpenInviteModal?: () => void;
  onImpersonateUser?: (user: UserRecord) => void;
  initialEditingUserId?: string;
}

export const UsersView: React.FC<UsersViewProps> = ({
  isInviteModalOpen: externalInviteOpen,
  onCloseInviteModal: externalCloseInvite,
  onOpenInviteModal: externalOpenInvite,
  onImpersonateUser,
  initialEditingUserId = 'user-1',
}) => {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Internal invite modal state fallback if not controlled externally
  const [internalInviteOpen, setInternalInviteOpen] = useState(false);
  const isInviteOpen = externalInviteOpen ?? internalInviteOpen;
  const openInvite = externalOpenInvite ?? (() => setInternalInviteOpen(true));
  const closeInvite = externalCloseInvite ?? (() => setInternalInviteOpen(false));

  // Edit Modal State - default open for Adeel D. to showcase the requested panel
  const [editingUser, setEditingUser] = useState<UserRecord | null>(
    () => INITIAL_USERS.find((u) => u.id === initialEditingUserId) || INITIAL_USERS[0]
  );

  // View Only Modal State (for Deactivated)
  const [viewingUser, setViewingUser] = useState<UserRecord | null>(null);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Engineer');
  const [inviteTeam, setInviteTeam] = useState('Core Engineering');
  const [inviteProducts, setInviteProducts] = useState<string[]>(['MuuqWear', 'GaarX']);

  // Success Notification banner
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Open Edit Modal
  const handleOpenEdit = (u: UserRecord) => {
    setEditingUser(u);
  };

  // Save Edit Slide-over
  const handleSaveSlideOver = (
    updatedUser: UserRecord,
    permissionsConfig: { useRoleDefaults: boolean; customPermissions: Record<string, boolean> }
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    const overrideNotice = !permissionsConfig.useRoleDefaults
      ? ' with custom granular permissions overrides'
      : '';
    showToast(`Updated account settings and access controls for ${updatedUser.name}${overrideNotice}.`);
    setEditingUser(null);
  };

  // Impersonate User Handler
  const handleImpersonate = (targetUser: UserRecord) => {
    if (onImpersonateUser) {
      onImpersonateUser(targetUser);
    } else {
      showToast(`Session switched: You are now testing access as ${targetUser.name} (${targetUser.roles.join(', ')}).`);
      setEditingUser(null);
    }
  };

  // Suspend / Reactivate quick action
  const handleToggleSuspend = (u: UserRecord) => {
    const nextStatus: 'Active' | 'Suspended' = u.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: nextStatus } : item))
    );
    showToast(
      nextStatus === 'Suspended'
        ? `Account for ${u.name} has been suspended.`
        : `Account for ${u.name} has been reactivated.`
    );
  };

  // Submit Invite
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newUser: UserRecord = {
      id: `user-${Date.now()}`,
      name: inviteEmail.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()),
      email: inviteEmail.trim(),
      roles: [inviteRole],
      products: inviteProducts.length === ALL_PRODUCTS.length ? ['All'] : inviteProducts,
      status: 'Active',
      lastActive: 'Just invited',
      avatarColor: 'bg-indigo-600',
      initials: inviteEmail.slice(0, 2).toUpperCase(),
    };

    setUsers((prev) => [newUser, ...prev]);
    showToast(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    closeInvite();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Roles', 'Products', 'Status', 'Last Active'];
    const rows = users.map((u) => [
      u.name,
      u.email,
      u.roles.join('; '),
      u.products.join('; '),
      u.status,
      u.lastActive,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kobneti_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported users roster to CSV');
  };

  // Filtered List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.products.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.roles.includes(roleFilter);
    const matchesStatus = statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div
      id="users-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#6366F1]" />
          <span>{notification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
            Users
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Manage all internal staff accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="users-invite-user-btn"
            onClick={openInvite}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Invite User</span>
          </button>

          <button
            id="users-export-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] hover:underline cursor-pointer transition-colors bg-transparent border-0"
          >
            <Download className="w-3.5 h-3.5 text-[#6366F1]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: USER SUMMARY (3 cards, equal width)                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Users */}
        <div
          id="user-summary-card-total"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Users
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                +3 this month
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#0F172A] font-mono">24</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            14 active · 8 suspended · 2 deactivated
          </div>
        </div>

        {/* Card 2: Pending Invites */}
        <div
          id="user-summary-card-invites"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending Invites
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#B95F00] border border-amber-200">
                2 expiring soon
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#0F172A] font-mono">4</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            3 waiting &gt;24h
          </div>
        </div>

        {/* Card 3: Role Breakdown */}
        <div
          id="user-summary-card-roles"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Role Breakdown
              </span>
              <span className="p-1 rounded-md bg-indigo-50 text-[#6366F1]">
                <Shield className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Admin</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">2</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Manager</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">4</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Engineer</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">10</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Support</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">8</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Enterprise RBAC Tier</span>
            <span className="text-[#6366F1] font-semibold">Standard Roles</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: USERS TABLE (Full width)                                           */}
      {/* ========================================================================= */}
      <div
        id="card-users-table"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email, role, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1] shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Engineer">Engineer</option>
              <option value="Support">Support</option>
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">User</th>
                <th className="py-3.5 px-4 font-bold">Email</th>
                <th className="py-3.5 px-4 font-bold">Role(s)</th>
                <th className="py-3.5 px-4 font-bold">Products</th>
                <th className="py-3.5 px-4 font-bold text-center">Status</th>
                <th className="py-3.5 px-4 font-bold">Last Active</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isDeactivated = user.status === 'Deactivated';
                const isSuspended = user.status === 'Suspended';
                const isActive = user.status === 'Active';

                return (
                  <tr
                    key={user.id}
                    id={`user-row-${user.id}`}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* User */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shadow-2xs ${
                            user.avatarColor || 'bg-indigo-600'
                          }`}
                        >
                          {user.initials}
                        </div>
                        <span className="text-slate-900 font-bold">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono whitespace-nowrap">
                      {user.email}
                    </td>

                    {/* Role(s) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                              role === 'Admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : role === 'Manager'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : role === 'Engineer'
                                ? 'bg-indigo-50 text-[#6366F1] border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Products */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {user.products.map((prod) => (
                          <span
                            key={prod}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {prod}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                          <span>🟢</span>
                          <span>Active</span>
                        </span>
                      )}
                      {isSuspended && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#B95F00] border border-amber-200">
                          <span>🟡</span>
                          <span>Suspended</span>
                        </span>
                      )}
                      {isDeactivated && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-[#DC2626] border border-red-200">
                          <span>🔴</span>
                          <span>Deactivated</span>
                        </span>
                      )}
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.lastActive}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {isDeactivated ? (
                          <button
                            id={`user-view-btn-${user.id}`}
                            onClick={() => setViewingUser(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Only</span>
                          </button>
                        ) : (
                          <>
                            <button
                              id={`user-edit-btn-${user.id}`}
                              onClick={() => handleOpenEdit(user)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Edit2 className="w-3 h-3 text-slate-500" />
                              <span>Edit</span>
                            </button>

                            {isSuspended ? (
                              <button
                                id={`user-reactivate-btn-${user.id}`}
                                onClick={() => handleToggleSuspend(user)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer shadow-2xs"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reactivate</span>
                              </button>
                            ) : (
                              <button
                                id={`user-suspend-btn-${user.id}`}
                                onClick={() => handleToggleSuspend(user)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer shadow-2xs"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Suspend</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDIT USER SLIDE-OVER PANEL (Granular Permissions & Role Defaults)         */}
      {/* ========================================================================= */}
      <UserEditSlideOver
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveSlideOver}
        onImpersonate={handleImpersonate}
      />

      {/* ========================================================================= */}
      {/* INVITE USER MODAL                                                         */}
      {/* ========================================================================= */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="invite-user-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Invite Internal Staff</h3>
                  <p className="text-xs text-slate-500">Send an onboarding invite to a colleague</p>
                </div>
              </div>
              <button
                onClick={closeInvite}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendInvite} className="p-5 space-y-4 text-xs">
              {/* Email Input */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="colleague@kobneti.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Primary Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Team Dropdown */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Assigned Team
                  </label>
                  <select
                    value={inviteTeam}
                    onChange={(e) => setInviteTeam(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    {ALL_TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products: Multi-Select Checkboxes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Assigned Products
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {ALL_PRODUCTS.map((p) => {
                    const isChecked = inviteProducts.includes(p);
                    return (
                      <label
                        key={p}
                        className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setInviteProducts(inviteProducts.filter((item) => item !== p));
                            } else {
                              setInviteProducts([...inviteProducts, p]);
                            }
                          }}
                          className="w-4 h-4 rounded text-[#6366F1] focus:ring-[#6366F1] border-slate-300"
                        />
                        <span>{p}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeInvite}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW ONLY MODAL (Deactivated user)                                        */}
      {/* ========================================================================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="view-only-user-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-5 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-500 text-white text-xs font-bold flex items-center justify-center">
                  {viewingUser.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{viewingUser.name}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600">
                    🔴 Account Deactivated
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-900 font-semibold">{viewingUser.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Roles:</span>
                <span className="text-slate-900 font-semibold">{viewingUser.roles.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Products:</span>
                <span className="text-slate-900 font-semibold">{viewingUser.products.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Last Active:</span>
                <span className="text-slate-900 font-semibold">{viewingUser.lastActive}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
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
