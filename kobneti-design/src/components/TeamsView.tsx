import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Briefcase,
  ChevronRight,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Check,
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  teamRole: 'Lead' | 'Member';
  avatarColor?: string;
  initials: string;
}

export interface TeamRecord {
  id: string;
  name: string;
  description: string;
  lead: string;
  memberCount: number;
  members: TeamMember[];
  products: string[];
}

const INITIAL_TEAMS: TeamRecord[] = [
  {
    id: 'team-1',
    name: 'Product Engineering',
    description: 'Core application development, architecture design, and feature delivery across web and mobile.',
    lead: 'Adeel D.',
    memberCount: 8,
    products: ['MuuqWear', 'GaarX'],
    members: [
      { id: 'm-1', name: 'Adeel D.', role: 'Admin', teamRole: 'Lead', avatarColor: 'bg-indigo-600', initials: 'AD' },
      { id: 'm-2', name: 'Leila H.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-emerald-600', initials: 'LH' },
      { id: 'm-3', name: 'Mike C.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-blue-600', initials: 'MC' },
      { id: 'm-4', name: 'Sarah K.', role: 'Support', teamRole: 'Member', avatarColor: 'bg-purple-600', initials: 'SK' },
      { id: 'm-5', name: 'Alex P.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-cyan-600', initials: 'AP' },
      { id: 'm-6', name: 'James B.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-violet-600', initials: 'JB' },
      { id: 'm-7', name: 'Tom S.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-teal-600', initials: 'TS' },
      { id: 'm-8', name: 'Diana P.', role: 'Manager', teamRole: 'Member', avatarColor: 'bg-rose-600', initials: 'DP' },
    ],
  },
  {
    id: 'team-2',
    name: 'Customer Support',
    description: 'Frontline user assistance, ticket resolution, customer satisfaction, and feedback triage.',
    lead: 'Ibrahim M.',
    memberCount: 6,
    products: ['All Products'],
    members: [
      { id: 'm-9', name: 'Ibrahim M.', role: 'Manager', teamRole: 'Lead', avatarColor: 'bg-amber-600', initials: 'IM' },
      { id: 'm-10', name: 'John D.', role: 'Support', teamRole: 'Member', avatarColor: 'bg-teal-600', initials: 'JD' },
      { id: 'm-11', name: 'Emma W.', role: 'Support', teamRole: 'Member', avatarColor: 'bg-pink-600', initials: 'EW' },
      { id: 'm-12', name: 'Lisa A.', role: 'Support', teamRole: 'Member', avatarColor: 'bg-cyan-600', initials: 'LA' },
      { id: 'm-13', name: 'Chris R.', role: 'Support', teamRole: 'Member', avatarColor: 'bg-blue-600', initials: 'CR' },
      { id: 'm-14', name: 'Maria G.', role: 'Support', teamRole: 'Member', avatarColor: 'bg-purple-600', initials: 'MG' },
    ],
  },
  {
    id: 'team-3',
    name: 'Platform Operations',
    description: 'Cloud infrastructure reliability, DevOps pipelines, database clustering, and security hardening.',
    lead: 'Adeel D.',
    memberCount: 4,
    products: ['SomPay', 'Dhaxal', 'Ilays'],
    members: [
      { id: 'm-1', name: 'Adeel D.', role: 'Admin', teamRole: 'Lead', avatarColor: 'bg-indigo-600', initials: 'AD' },
      { id: 'm-2', name: 'Leila H.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-emerald-600', initials: 'LH' },
      { id: 'm-5', name: 'Alex P.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-cyan-600', initials: 'AP' },
      { id: 'm-15', name: 'Tom S.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-teal-600', initials: 'TS' },
    ],
  },
  {
    id: 'team-4',
    name: 'Quality Assurance',
    description: 'Automated end-to-end regression suites, test plans, manual verification, and release gatekeeping.',
    lead: 'Sarah K.',
    memberCount: 3,
    products: ['All Products'],
    members: [
      { id: 'm-4', name: 'Sarah K.', role: 'Support', teamRole: 'Lead', avatarColor: 'bg-purple-600', initials: 'SK' },
      { id: 'm-3', name: 'Mike C.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-blue-600', initials: 'MC' },
      { id: 'm-6', name: 'James B.', role: 'Engineer', teamRole: 'Member', avatarColor: 'bg-violet-600', initials: 'JB' },
    ],
  },
  {
    id: 'team-5',
    name: 'Design & Product',
    description: 'UI/UX interface design, design system governance, prototyping, and product discovery research.',
    lead: 'Leila H.',
    memberCount: 2,
    products: ['MuuqWear', 'GaarX', 'Salguri'],
    members: [
      { id: 'm-2', name: 'Leila H.', role: 'Engineer', teamRole: 'Lead', avatarColor: 'bg-emerald-600', initials: 'LH' },
      { id: 'm-11', name: 'Emma W.', role: 'Support', teamRole: 'Member', avatarColor: 'bg-pink-600', initials: 'EW' },
    ],
  },
  {
    id: 'team-6',
    name: 'Finance & Admin',
    description: 'Payroll disbursement, financial reporting, corporate compliance, and resource allocation.',
    lead: 'Adeel D.',
    memberCount: 3,
    products: ['All Products'],
    members: [
      { id: 'm-1', name: 'Adeel D.', role: 'Admin', teamRole: 'Lead', avatarColor: 'bg-indigo-600', initials: 'AD' },
      { id: 'm-9', name: 'Ibrahim M.', role: 'Manager', teamRole: 'Member', avatarColor: 'bg-amber-600', initials: 'IM' },
      { id: 'm-8', name: 'Diana P.', role: 'Manager', teamRole: 'Member', avatarColor: 'bg-rose-600', initials: 'DP' },
    ],
  },
];

const AVAILABLE_USERS = [
  { id: 'u-1', name: 'Adeel D.', role: 'Admin', initials: 'AD', avatarColor: 'bg-indigo-600' },
  { id: 'u-2', name: 'Leila H.', role: 'Engineer', initials: 'LH', avatarColor: 'bg-emerald-600' },
  { id: 'u-3', name: 'Mike C.', role: 'Engineer', initials: 'MC', avatarColor: 'bg-blue-600' },
  { id: 'u-4', name: 'Sarah K.', role: 'Support', initials: 'SK', avatarColor: 'bg-purple-600' },
  { id: 'u-5', name: 'Ibrahim M.', role: 'Manager', initials: 'IM', avatarColor: 'bg-amber-600' },
  { id: 'u-6', name: 'John D.', role: 'Support', initials: 'JD', avatarColor: 'bg-teal-600' },
  { id: 'u-7', name: 'Emma W.', role: 'Support', initials: 'EW', avatarColor: 'bg-pink-600' },
  { id: 'u-8', name: 'Alex P.', role: 'Engineer', initials: 'AP', avatarColor: 'bg-cyan-600' },
  { id: 'u-9', name: 'Lisa A.', role: 'Support', initials: 'LA', avatarColor: 'bg-cyan-600' },
  { id: 'u-10', name: 'James B.', role: 'Engineer', initials: 'JB', avatarColor: 'bg-violet-600' },
  { id: 'u-11', name: 'Chris R.', role: 'Support', initials: 'CR', avatarColor: 'bg-blue-600' },
  { id: 'u-12', name: 'Maria G.', role: 'Support', initials: 'MG', avatarColor: 'bg-purple-600' },
  { id: 'u-13', name: 'Tom S.', role: 'Engineer', initials: 'TS', avatarColor: 'bg-teal-600' },
  { id: 'u-14', name: 'Diana P.', role: 'Manager', initials: 'DP', avatarColor: 'bg-rose-600' },
];

const ALL_PRODUCTS = ['MuuqWear', 'GaarX', 'Salguri', 'SomPay', 'Dhaxal', 'Ilays'];

interface TeamsViewProps {
  isNewTeamModalOpen?: boolean;
  onOpenNewTeamModal?: () => void;
  onCloseNewTeamModal?: () => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  isNewTeamModalOpen: externalNewTeamOpen,
  onOpenNewTeamModal: externalOpenNewTeam,
  onCloseNewTeamModal: externalCloseNewTeam,
}) => {
  const [teams, setTeams] = useState<TeamRecord[]>(INITIAL_TEAMS);
  
  // Internal modal state fallback
  const [internalNewTeamOpen, setInternalNewTeamOpen] = useState(false);
  const isNewTeamOpen = externalNewTeamOpen ?? internalNewTeamOpen;
  const openNewTeam = externalOpenNewTeam ?? (() => setInternalNewTeamOpen(true));
  const closeNewTeam = externalCloseNewTeam ?? (() => setInternalNewTeamOpen(false));

  // Team Detail View State
  const [selectedTeam, setSelectedTeam] = useState<TeamRecord | null>(null);

  // Edit Team Modal State
  const [editingTeam, setEditingTeam] = useState<TeamRecord | null>(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamDesc, setEditTeamDesc] = useState('');
  const [editTeamLead, setEditTeamLead] = useState('');
  const [editTeamProducts, setEditTeamProducts] = useState<string[]>([]);

  // Add Member Modal State
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [targetTeamForMember, setTargetTeamForMember] = useState<TeamRecord | null>(null);
  const [selectedUserId, setSelectedUserId] = useState(AVAILABLE_USERS[0].id);
  const [selectedTeamRole, setSelectedTeamRole] = useState<'Member' | 'Lead'>('Member');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // New Team Modal State
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamLead, setNewTeamLead] = useState(AVAILABLE_USERS[0].name);
  const [newTeamProducts, setNewTeamProducts] = useState<string[]>(['MuuqWear', 'GaarX']);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Edit Team Modal
  const handleOpenEditTeam = (team: TeamRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingTeam(team);
    setEditTeamName(team.name);
    setEditTeamDesc(team.description);
    setEditTeamLead(team.lead);
    setEditTeamProducts(team.products.includes('All Products') ? [...ALL_PRODUCTS] : [...team.products]);
  };

  // Save Edit Team Modal
  const handleSaveEditTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    const finalProducts = editTeamProducts.length === ALL_PRODUCTS.length ? ['All Products'] : editTeamProducts;

    const updatedTeams = teams.map((t) =>
      t.id === editingTeam.id
        ? {
            ...t,
            name: editTeamName,
            description: editTeamDesc,
            lead: editTeamLead,
            products: finalProducts.length > 0 ? finalProducts : ['None'],
          }
        : t
    );

    setTeams(updatedTeams);
    if (selectedTeam && selectedTeam.id === editingTeam.id) {
      setSelectedTeam(updatedTeams.find((t) => t.id === editingTeam.id) || null);
    }

    showToast(`Updated details for "${editTeamName}"`);
    setEditingTeam(null);
  };

  // Delete Team
  const handleDeleteTeam = (teamId: string, teamName: string) => {
    if (confirm(`Are you sure you want to delete the "${teamName}" team?`)) {
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(null);
      }
      showToast(`Team "${teamName}" was removed.`);
    }
  };

  // Open Add Member Modal
  const handleOpenAddMember = (team: TeamRecord) => {
    setTargetTeamForMember(team);
    setSelectedUserId(AVAILABLE_USERS[0].id);
    setSelectedTeamRole('Member');
    setMemberSearchQuery('');
    setIsAddMemberOpen(true);
  };

  // Submit Add Member
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTeamForMember) return;

    const userToAdd = AVAILABLE_USERS.find((u) => u.id === selectedUserId);
    if (!userToAdd) return;

    // Check if already in team
    if (targetTeamForMember.members.some((m) => m.name === userToAdd.name)) {
      alert(`${userToAdd.name} is already a member of this team.`);
      return;
    }

    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: userToAdd.name,
      role: userToAdd.role,
      teamRole: selectedTeamRole,
      avatarColor: userToAdd.avatarColor,
      initials: userToAdd.initials,
    };

    const updatedTeams = teams.map((t) => {
      if (t.id === targetTeamForMember.id) {
        const updatedMembers = [...t.members, newMember];
        return {
          ...t,
          members: updatedMembers,
          memberCount: updatedMembers.length,
          lead: selectedTeamRole === 'Lead' ? userToAdd.name : t.lead,
        };
      }
      return t;
    });

    setTeams(updatedTeams);
    if (selectedTeam && selectedTeam.id === targetTeamForMember.id) {
      setSelectedTeam(updatedTeams.find((t) => t.id === targetTeamForMember.id) || null);
    }

    showToast(`Added ${userToAdd.name} to ${targetTeamForMember.name}`);
    setIsAddMemberOpen(false);
  };

  // Submit Create New Team
  const handleCreateNewTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const leadUser = AVAILABLE_USERS.find((u) => u.name === newTeamLead) || AVAILABLE_USERS[0];
    const initialMembers: TeamMember[] = [
      {
        id: `m-${Date.now()}`,
        name: leadUser.name,
        role: leadUser.role,
        teamRole: 'Lead',
        avatarColor: leadUser.avatarColor,
        initials: leadUser.initials,
      },
    ];

    const finalProducts = newTeamProducts.length === ALL_PRODUCTS.length ? ['All Products'] : newTeamProducts;

    const newTeam: TeamRecord = {
      id: `team-${Date.now()}`,
      name: newTeamName.trim(),
      description: newTeamDesc.trim() || 'Internal cross-functional team.',
      lead: leadUser.name,
      memberCount: 1,
      members: initialMembers,
      products: finalProducts.length > 0 ? finalProducts : ['All Products'],
    };

    setTeams((prev) => [newTeam, ...prev]);
    showToast(`Created new team "${newTeam.name}"`);
    setNewTeamName('');
    setNewTeamDesc('');
    closeNewTeam();
  };

  return (
    <div
      id="teams-view-root"
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
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Teams
          </h1>
          <p className="text-xs text-[#64748B] font-medium">
            Manage teams and their members across the organization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="teams-new-team-btn"
            onClick={openNewTeam}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Team</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: TEAMS GRID (3 columns, card layout)                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((team) => {
          const visibleMembers = team.members.slice(0, 4);
          const remainingCount = team.memberCount > 4 ? team.memberCount - 4 : 0;

          return (
            <div
              key={team.id}
              id={`team-card-${team.id}`}
              onClick={() => setSelectedTeam(team)}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between cursor-pointer group"
            >
              {/* Card Top: Title & Lead */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#6366F1] transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">
                      {team.description}
                    </p>
                  </div>
                  <span className="p-1.5 rounded-xl bg-slate-50 text-slate-400 group-hover:text-[#6366F1] group-hover:bg-indigo-50 transition-colors">
                    <Briefcase className="w-4 h-4" />
                  </span>
                </div>

                {/* Team Lead Badge */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Lead:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                    <Shield className="w-3 h-3" />
                    <span>{team.lead}</span>
                  </span>
                </div>

                {/* Member Avatars & Count */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold">Members: {team.memberCount}</span>
                    <span className="text-[11px] text-slate-400">
                      {team.members.map((m) => m.name).slice(0, 3).join(', ')}
                      {team.memberCount > 3 ? `, +${team.memberCount - 3}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center -space-x-1.5">
                    {visibleMembers.map((m, idx) => (
                      <div
                        key={idx}
                        title={`${m.name} (${m.role})`}
                        className={`w-7 h-7 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center shadow-2xs ${
                          m.avatarColor || 'bg-indigo-600'
                        }`}
                      >
                        {m.initials}
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center shadow-2xs">
                        +{remainingCount}
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Assigned */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium">Products:</span>
                  {team.products.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  id={`team-view-btn-${team.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTeam(team);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
                >
                  <span>View Team</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id={`team-edit-btn-${team.id}`}
                  onClick={(e) => handleOpenEditTeam(team, e)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-slate-500" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TEAM DETAIL MODAL / DRAWER (Opens on Card Click)                          */}
      {/* ========================================================================= */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="team-detail-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 space-y-6 animate-in zoom-in-95 duration-150"
          >
            {/* Detail Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{selectedTeam.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                    Lead: {selectedTeam.lead}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedTeam.description}</p>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Assignments */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Product Assignments
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTeam.products.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Team Members ({selectedTeam.members.length})
                </span>
                <button
                  id="team-detail-add-member-btn"
                  onClick={() => handleOpenAddMember(selectedTeam)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Member</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {selectedTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-2xs ${
                          member.avatarColor || 'bg-indigo-600'
                        }`}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{member.name}</span>
                        <span className="text-[11px] text-slate-500">{member.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {member.teamRole === 'Lead' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-[#B95F00] border border-amber-200">
                          <Shield className="w-3 h-3" />
                          <span>Team Lead</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Member
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                id="team-detail-delete-btn"
                onClick={() => handleDeleteTeam(selectedTeam.id, selectedTeam.name)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Team</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="team-detail-edit-btn"
                  onClick={() => handleOpenEditTeam(selectedTeam)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Team</span>
                </button>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD MEMBER MODAL                                                          */}
      {/* ========================================================================= */}
      {isAddMemberOpen && targetTeamForMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="add-member-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Team Member</h3>
                  <p className="text-xs text-slate-500">To {targetTeamForMember.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="p-5 space-y-4 text-xs">
              {/* User Dropdown Searchable */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Select User
                </label>
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 custom-scrollbar">
                  {AVAILABLE_USERS.filter((u) =>
                    u.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
                  ).map((u) => {
                    const isSelected = selectedUserId === u.id;
                    return (
                      <div
                        key={u.id}
                        onClick={() => setSelectedUserId(u.id)}
                        className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-50/80 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${u.avatarColor}`}
                          >
                            {u.initials}
                          </div>
                          <span className="text-xs text-slate-900">{u.name}</span>
                          <span className="text-[10px] text-slate-400">({u.role})</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#6366F1]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Role in Team: Member / Lead */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Role in Team
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTeamRole('Member')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      selectedTeamRole === 'Member'
                        ? 'bg-indigo-50 border-[#6366F1] text-[#6366F1]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTeamRole('Lead')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      selectedTeamRole === 'Lead'
                        ? 'bg-amber-50 border-amber-500 text-[#B95F00]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Team Lead
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs active:scale-95 transition-colors cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE NEW TEAM MODAL                                                     */}
      {/* ========================================================================= */}
      {isNewTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="new-team-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create New Team</h3>
                  <p className="text-xs text-slate-500">Configure team roles and product coverage</p>
                </div>
              </div>
              <button
                onClick={closeNewTeam}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTeam} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infrastructure SRE"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities and primary domain..."
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Team Lead
                </label>
                <select
                  value={newTeamLead}
                  onChange={(e) => setNewTeamLead(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  {AVAILABLE_USERS.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Product Coverage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {ALL_PRODUCTS.map((p) => {
                    const isChecked = newTeamProducts.includes(p);
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
                              setNewTeamProducts(newTeamProducts.filter((item) => item !== p));
                            } else {
                              setNewTeamProducts([...newTeamProducts, p]);
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

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeNewTeam}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs active:scale-95 transition-colors cursor-pointer"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT TEAM MODAL                                                           */}
      {/* ========================================================================= */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="edit-team-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#6366F1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Team Settings</h3>
                  <p className="text-xs text-slate-500">{editingTeam.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingTeam(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTeam} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  value={editTeamName}
                  onChange={(e) => setEditTeamName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editTeamDesc}
                  onChange={(e) => setEditTeamDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Team Lead
                </label>
                <select
                  value={editTeamLead}
                  onChange={(e) => setEditTeamLead(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  {AVAILABLE_USERS.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Assigned Products
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {ALL_PRODUCTS.map((p) => {
                    const isChecked = editTeamProducts.includes(p);
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
                              setEditTeamProducts(editTeamProducts.filter((item) => item !== p));
                            } else {
                              setEditTeamProducts([...editTeamProducts, p]);
                            }
                          }}
                          className="w-4 h-4 rounded text-[#6366F1] border-slate-300"
                        />
                        <span>{p}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs active:scale-95 transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
