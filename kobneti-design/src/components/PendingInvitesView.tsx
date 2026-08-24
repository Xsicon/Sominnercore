import React, { useState } from 'react';
import {
  Mail,
  Send,
  Plus,
  RotateCcw,
  XCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  X,
  Shield,
  Briefcase,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Check,
} from 'lucide-react';

export interface PendingInvite {
  id: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Engineer' | 'Support';
  team: string;
  products: string[];
  status: 'Pending' | 'Expiring Soon' | 'Revoked';
  invitedBy: string;
  expires: string;
  invitedAt: string;
}

const INITIAL_INVITES: PendingInvite[] = [
  {
    id: 'inv-1',
    email: 'alex@kobneti.com',
    role: 'Engineer',
    team: 'Product Engineering',
    products: ['MuuqWear'],
    status: 'Pending',
    invitedBy: 'Adeel D.',
    expires: '2 days',
    invitedAt: '1 day ago',
  },
  {
    id: 'inv-2',
    email: 'lisa@kobneti.com',
    role: 'Support',
    team: 'Customer Support',
    products: ['All'],
    status: 'Pending',
    invitedBy: 'Ibrahim M.',
    expires: '1 day',
    invitedAt: '2 days ago',
  },
  {
    id: 'inv-3',
    email: 'james@kobneti.com',
    role: 'Manager',
    team: 'Product Engineering',
    products: ['All'],
    status: 'Pending',
    invitedBy: 'Adeel D.',
    expires: '3 days',
    invitedAt: '3 hours ago',
  },
  {
    id: 'inv-4',
    email: 'emma@kobneti.com',
    role: 'Support',
    team: 'Customer Support',
    products: ['MuuqWear', 'GaarX'],
    status: 'Expiring Soon',
    invitedBy: 'Ibrahim M.',
    expires: '12 hours',
    invitedAt: '2.5 days ago',
  },
];

const ALL_ROLES: ('Admin' | 'Manager' | 'Engineer' | 'Support')[] = [
  'Admin',
  'Manager',
  'Engineer',
  'Support',
];

const ALL_TEAMS = [
  'Product Engineering',
  'Customer Support',
  'Platform Operations',
  'Quality Assurance',
  'Design & Product',
  'Finance & Admin',
];

const ALL_PRODUCTS = ['MuuqWear', 'GaarX', 'Salguri', 'SomPay', 'Dhaxal', 'Ilays'];

interface PendingInvitesViewProps {
  isNewInviteModalOpen?: boolean;
  onOpenNewInviteModal?: () => void;
  onCloseNewInviteModal?: () => void;
}

export const PendingInvitesView: React.FC<PendingInvitesViewProps> = ({
  isNewInviteModalOpen: externalNewInviteOpen,
  onOpenNewInviteModal: externalOpenNewInvite,
  onCloseNewInviteModal: externalCloseNewInvite,
}) => {
  const [invites, setInvites] = useState<PendingInvite[]>(INITIAL_INVITES);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');

  // Internal modal fallback
  const [internalNewInviteOpen, setInternalNewInviteOpen] = useState(false);
  const isNewInviteOpen = externalNewInviteOpen ?? internalNewInviteOpen;
  const openNewInvite = externalOpenNewInvite ?? (() => setInternalNewInviteOpen(true));
  const closeNewInvite = externalCloseNewInvite ?? (() => setInternalNewInviteOpen(false));

  // Form State for New Invite Modal
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Manager' | 'Engineer' | 'Support'>('Engineer');
  const [newTeam, setNewTeam] = useState('Product Engineering');
  const [newProducts, setNewProducts] = useState<string[]>(['MuuqWear', 'GaarX']);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Resend Invite Action
  const handleResend = (invite: PendingInvite) => {
    showToast(`Invitation resent to ${invite.email}`);
  };

  // Revoke Invite Action
  const handleRevoke = (invite: PendingInvite) => {
    if (confirm(`Are you sure you want to revoke the invitation for ${invite.email}?`)) {
      setInvites((prev) => prev.filter((i) => i.id !== invite.id));
      showToast(`Invitation revoked for ${invite.email}`);
    }
  };

  // Submit New Invite
  const handleSendInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const finalProducts = newProducts.length === ALL_PRODUCTS.length ? ['All'] : newProducts;

    const newInv: PendingInvite = {
      id: `inv-${Date.now()}`,
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      team: newTeam,
      products: finalProducts.length > 0 ? finalProducts : ['All'],
      status: 'Pending',
      invitedBy: 'Adeel D.',
      expires: '3 days',
      invitedAt: 'Just now',
    };

    setInvites((prev) => [newInv, ...prev]);
    showToast(`Invitation sent to ${newEmail}`);
    setNewEmail('');
    setNewProducts(['MuuqWear', 'GaarX']);
    closeNewInvite();
  };

  // Filtered Invites
  const filteredInvites = invites.filter((inv) => {
    const matchesSearch =
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invitedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.products.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || inv.role === roleFilter;
    const matchesTeam = teamFilter === 'all' || inv.team === teamFilter;

    return matchesSearch && matchesRole && matchesTeam;
  });

  return (
    <div
      id="pending-invites-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Banner */}
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
            Pending Invites
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Track and manage outstanding invitations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="pending-invites-new-invite-btn"
            onClick={openNewInvite}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Invite</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: INVITE SUMMARY (3 cards, equal width)                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Pending Invites */}
        <div
          id="invite-summary-card-pending"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending Invites
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-[#B95F00] border border-amber-200">
                <Clock className="w-3 h-3 text-[#B95F00]" />
                <span>2 expiring in 48h</span>
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#0F172A] font-mono">4</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            1 pending &gt;24h
          </div>
        </div>

        {/* Card 2: Accepted This Week */}
        <div
          id="invite-summary-card-accepted"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Accepted This Week
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                <ArrowUpRight className="w-3 h-3 text-[#6366F1]" />
                <span>+2 vs last week</span>
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#0F172A] font-mono">3</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            All on time
          </div>
        </div>

        {/* Card 3: Expired/Revoked */}
        <div
          id="invite-summary-card-expired"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Expired/Revoked
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                <TrendingDown className="w-3 h-3 text-[#6366F1]" />
                <span>-1 vs last week</span>
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#0F172A] font-mono">2</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            1 expired, 1 revoked
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: INVITES TABLE (Full width)                                         */}
      {/* ========================================================================= */}
      <div
        id="card-invites-table"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by email, role, team, or product..."
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
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Filter by Team */}
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="appearance-none px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All Teams</option>
              {ALL_TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Invites Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Email</th>
                <th className="py-3.5 px-4 font-bold">Role</th>
                <th className="py-3.5 px-4 font-bold">Team</th>
                <th className="py-3.5 px-4 font-bold">Products</th>
                <th className="py-3.5 px-4 font-bold text-center">Status</th>
                <th className="py-3.5 px-4 font-bold">Invited By</th>
                <th className="py-3.5 px-4 font-bold">Expires</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvites.map((invite) => {
                const isExpiringSoon = invite.status === 'Expiring Soon';

                return (
                  <tr
                    key={invite.id}
                    id={`invite-row-${invite.id}`}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Email */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-mono text-slate-900">{invite.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          invite.role === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : invite.role === 'Manager'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : invite.role === 'Engineer'
                            ? 'bg-indigo-50 text-[#6366F1] border-indigo-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {invite.role}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{invite.team}</span>
                      </div>
                    </td>

                    {/* Products */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {invite.products.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isExpiringSoon ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-[#B95F00] border border-amber-200">
                          <span>⚠️</span>
                          <span>Expiring Soon</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                          <span>⏳</span>
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Invited By */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">
                      {invite.invitedBy}
                    </td>

                    {/* Expires */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium">
                      <span
                        className={`flex items-center gap-1.5 ${
                          isExpiringSoon ? 'text-[#B95F00] font-bold' : 'text-slate-500'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{invite.expires}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          id={`invite-resend-btn-${invite.id}`}
                          onClick={() => handleResend(invite)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
                        >
                          <RotateCcw className="w-3 h-3 text-slate-500" />
                          <span>Resend</span>
                        </button>

                        <button
                          id={`invite-revoke-btn-${invite.id}`}
                          onClick={() => handleRevoke(invite)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Revoke</span>
                        </button>
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
      {/* NEW INVITE MODAL                                                          */}
      {/* ========================================================================= */}
      {isNewInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="new-invite-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Send New Invitation</h3>
                  <p className="text-xs text-slate-500">Invite a team member to KobNeti Operations</p>
                </div>
              </div>
              <button
                onClick={closeNewInvite}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendInviteSubmit} className="p-5 space-y-4 text-xs">
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
                    placeholder="candidate@kobneti.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              {/* Role & Team Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Role Dropdown
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) =>
                      setNewRole(e.target.value as 'Admin' | 'Manager' | 'Engineer' | 'Support')
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">
                    Team Dropdown
                  </label>
                  <select
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
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

              {/* Products Multi-Select */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Assigned Products (Multi-Select)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {ALL_PRODUCTS.map((p) => {
                    const isChecked = newProducts.includes(p);
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
                              setNewProducts(newProducts.filter((item) => item !== p));
                            } else {
                              setNewProducts([...newProducts, p]);
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
                  onClick={closeNewInvite}
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
    </div>
  );
};
