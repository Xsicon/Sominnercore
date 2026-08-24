import React, { useState } from 'react';
import {
  Laptop,
  Key,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Users,
  Shield,
  Layers,
  Calendar,
  MoreVertical,
  Edit2,
  Eye,
  Trash2,
  X,
  Check,
  ChevronDown,
  Monitor,
  HardDrive,
  Cpu,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export type AssetType = 'hardware' | 'license';
export type AssetStatus = 'Available' | 'Assigned' | 'Retired' | 'Expiring Soon';

export interface AssetRecord {
  id: string;
  type: AssetType;
  name: string;
  serialOrSeat: string;
  status: AssetStatus;
  assignedTo?: string;
  assignedTeam?: string;
  renewalOrWarranty?: string;
  purchasedDate?: string;
  model?: string;
  notes?: string;
}

const INITIAL_ASSETS: AssetRecord[] = [
  {
    id: 'ast-1',
    type: 'hardware',
    name: 'MacBook Pro 16"',
    serialOrSeat: 'ABC123',
    status: 'Available',
    purchasedDate: '2024-03-15',
    renewalOrWarranty: '2027-03-15 (Warranty)',
    notes: 'M3 Max, 64GB RAM, Space Black. Reset to factory image.',
  },
  {
    id: 'ast-2',
    type: 'hardware',
    name: 'MacBook Pro 14"',
    serialOrSeat: 'DEF456',
    status: 'Assigned',
    assignedTo: 'Adeel D.',
    assignedTeam: 'Executive / Engineering',
    purchasedDate: '2024-01-10',
    renewalOrWarranty: '2027-01-10 (Warranty)',
    notes: 'M3 Pro, 36GB RAM, Silver.',
  },
  {
    id: 'ast-3',
    type: 'hardware',
    name: 'MacBook Pro 14"',
    serialOrSeat: 'GHI789',
    status: 'Assigned',
    assignedTo: 'Leila H.',
    assignedTeam: 'Product & Design',
    purchasedDate: '2024-02-20',
    renewalOrWarranty: '2027-02-20 (Warranty)',
    notes: 'M3 Pro, 36GB RAM, Space Black.',
  },
  {
    id: 'ast-4',
    type: 'hardware',
    name: 'MacBook Air',
    serialOrSeat: 'JKL012',
    status: 'Retired',
    purchasedDate: '2021-06-12',
    renewalOrWarranty: 'Expired (2024-06-12)',
    notes: 'M1 2020. Decommissioned after hardware refresh cycle.',
  },
  {
    id: 'ast-5',
    type: 'license',
    name: 'Adobe Creative Cloud',
    serialOrSeat: 'adele@kobneti.com',
    status: 'Assigned',
    assignedTo: 'Adeel D.',
    assignedTeam: 'Design',
    purchasedDate: '2024-11-30',
    renewalOrWarranty: 'Nov 30',
    notes: 'All Apps enterprise plan with generative credits.',
  },
  {
    id: 'ast-6',
    type: 'license',
    name: 'Figma Pro',
    serialOrSeat: 'leila@kobneti.com',
    status: 'Assigned',
    assignedTo: 'Leila H.',
    assignedTeam: 'Design',
    purchasedDate: '2024-12-15',
    renewalOrWarranty: 'Dec 15',
    notes: 'Organization tier design & FigJam editor license.',
  },
  {
    id: 'ast-7',
    type: 'license',
    name: 'GitHub Copilot',
    serialOrSeat: 'mike@kobneti.com',
    status: 'Available',
    purchasedDate: '2025-01-01',
    renewalOrWarranty: '2026-01-01',
    notes: 'Enterprise Copilot seat allocated for developer tooling.',
  },
  {
    id: 'ast-8',
    type: 'license',
    name: 'Jira Enterprise',
    serialOrSeat: 'sarah@kobneti.com',
    status: 'Assigned',
    assignedTo: 'Sarah K.',
    assignedTeam: 'Customer Support',
    purchasedDate: '2024-10-01',
    renewalOrWarranty: '2025-10-01',
    notes: 'Atlassian Cloud Premium agent seat.',
  },
  {
    id: 'ast-9',
    type: 'hardware',
    name: 'Dell Monitor',
    serialOrSeat: 'MNO345',
    status: 'Available',
    purchasedDate: '2024-04-18',
    renewalOrWarranty: '2027-04-18 (Warranty)',
    notes: 'UltraSharp 27" 4K USB-C Hub Monitor.',
  },
  {
    id: 'ast-10',
    type: 'hardware',
    name: 'Logitech Keyboard',
    serialOrSeat: 'PQR678',
    status: 'Assigned',
    assignedTo: 'Mike C.',
    assignedTeam: 'Core Engineering',
    purchasedDate: '2024-05-10',
    renewalOrWarranty: '2026-05-10 (Warranty)',
    notes: 'MX Keys S Wireless Keyboard + Palm Rest.',
  },
];

const TEAM_MEMBERS = [
  { name: 'Adeel D.', email: 'adeel@kobneti.com', team: 'Core Engineering' },
  { name: 'Leila H.', email: 'leila@kobneti.com', team: 'Product & Design' },
  { name: 'Ibrahim M.', email: 'ibrahim@kobneti.com', team: 'Management' },
  { name: 'Mike C.', email: 'mike@kobneti.com', team: 'Engineering' },
  { name: 'Sarah K.', email: 'sarah@kobneti.com', team: 'Customer Support' },
  { name: 'Lisa T.', email: 'lisa@kobneti.com', team: 'Quality Assurance' },
  { name: 'Alex P.', email: 'alex@kobneti.com', team: 'Product Specialist' },
];

const TEAMS_LIST = [
  'Core Engineering',
  'Product & Design',
  'Customer Support',
  'Executive & Operations',
  'Quality Assurance',
  'Sales & Marketing',
];

interface ResourceManagementViewProps {
  onOpenNewAssetModal?: () => void;
}

export const ResourceManagementView: React.FC<ResourceManagementViewProps> = ({
  onOpenNewAssetModal,
}) => {
  const [assets, setAssets] = useState<AssetRecord[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hardware' | 'license'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);

  // New Asset Form State
  const [newAssetType, setNewAssetType] = useState<AssetType>('hardware');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetSerial, setNewAssetSerial] = useState('');
  const [newAssetStatus, setNewAssetStatus] = useState<AssetStatus>('Available');
  const [newAssetPurchased, setNewAssetPurchased] = useState('2025-01-15');
  const [newAssetRenewal, setNewAssetRenewal] = useState('');

  // Assign Modal Form State
  const [assignUserSearch, setAssignUserSearch] = useState('');
  const [selectedAssignUser, setSelectedAssignUser] = useState(TEAM_MEMBERS[0].name);
  const [selectedAssignTeam, setSelectedAssignTeam] = useState(TEAMS_LIST[0]);

  // Edit Modal Form State
  const [editAssetName, setEditAssetName] = useState('');
  const [editAssetSerial, setEditAssetSerial] = useState('');
  const [editAssetStatus, setEditAssetStatus] = useState<AssetStatus>('Available');
  const [editAssetAssignedTo, setEditAssetAssignedTo] = useState('');
  const [editAssetRenewal, setEditAssetRenewal] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Assign Modal
  const handleOpenAssign = (asset: AssetRecord) => {
    setSelectedAsset(asset);
    setSelectedAssignUser(TEAM_MEMBERS[0].name);
    setSelectedAssignTeam(TEAM_MEMBERS[0].team);
    setIsAssignModalOpen(true);
  };

  // Submit Assign
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    setAssets((prev) =>
      prev.map((a) =>
        a.id === selectedAsset.id
          ? {
              ...a,
              status: 'Assigned',
              assignedTo: selectedAssignUser,
              assignedTeam: selectedAssignTeam,
            }
          : a
      )
    );

    setIsAssignModalOpen(false);
    showToast(`Assigned ${selectedAsset.name} to ${selectedAssignUser}`);
  };

  // Unassign action
  const handleUnassign = (asset: AssetRecord) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === asset.id
          ? {
              ...a,
              status: 'Available',
              assignedTo: undefined,
              assignedTeam: undefined,
            }
          : a
      )
    );
    showToast(`Unassigned ${asset.name}. Status set to Available.`);
  };

  // Open Edit Modal
  const handleOpenEdit = (asset: AssetRecord) => {
    setSelectedAsset(asset);
    setEditAssetName(asset.name);
    setEditAssetSerial(asset.serialOrSeat);
    setEditAssetStatus(asset.status);
    setEditAssetAssignedTo(asset.assignedTo || '');
    setEditAssetRenewal(asset.renewalOrWarranty || '');
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    setAssets((prev) =>
      prev.map((a) =>
        a.id === selectedAsset.id
          ? {
              ...a,
              name: editAssetName,
              serialOrSeat: editAssetSerial,
              status: editAssetStatus,
              assignedTo: editAssetStatus === 'Assigned' ? editAssetAssignedTo || 'Adeel D.' : undefined,
              renewalOrWarranty: editAssetRenewal,
            }
          : a
      )
    );

    setIsEditModalOpen(false);
    showToast(`Updated asset details for ${editAssetName}`);
  };

  // Open View Modal
  const handleOpenView = (asset: AssetRecord) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  // Submit Create New Asset
  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;

    const newRecord: AssetRecord = {
      id: `ast-${Date.now()}`,
      type: newAssetType,
      name: newAssetName,
      serialOrSeat: newAssetSerial || (newAssetType === 'hardware' ? `SN-${Math.floor(100000 + Math.random() * 900000)}` : 'license@kobneti.com'),
      status: newAssetStatus,
      purchasedDate: newAssetPurchased,
      renewalOrWarranty: newAssetRenewal || (newAssetType === 'hardware' ? '2028-01-15 (Warranty)' : '2026-01-15'),
      notes: 'Added via Resource Management portal.',
    };

    setAssets([newRecord, ...assets]);
    setIsNewAssetModalOpen(false);
    setNewAssetName('');
    setNewAssetSerial('');
    setNewAssetRenewal('');
    showToast(`Successfully created ${newRecord.name}`);
  };

  // Filtered Assets
  const filteredAssets = assets.filter((asset) => {
    if (typeFilter !== 'all' && asset.type !== typeFilter) return false;
    if (statusFilter !== 'all' && asset.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.serialOrSeat.toLowerCase().includes(q) ||
        (asset.assignedTo && asset.assignedTo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Helper for Status Badge
  const getStatusBadge = (status: AssetStatus, renewalOrWarranty?: string) => {
    const isExpiring = renewalOrWarranty && (renewalOrWarranty.includes('Nov 30') || renewalOrWarranty.includes('Dec 15'));

    if (status === 'Available') {
      return (
        <span
          id="badge-status-available"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#3B82F6] border border-blue-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
          Available
        </span>
      );
    }

    if (status === 'Assigned') {
      return (
        <span
          id="badge-status-assigned"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-[#6366F1] border border-indigo-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
          Assigned
        </span>
      );
    }

    if (status === 'Retired') {
      return (
        <span
          id="badge-status-retired"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-[#94A3B8] border border-slate-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span>
          Retired
        </span>
      );
    }

    return (
      <span
        id="badge-status-expiring"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#B95F00] border border-amber-200"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#B95F00]"></span>
        Expiring Soon
      </span>
    );
  };

  return (
    <div
      id="resource-management-view-root"
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
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Resource Management
          </h1>
          <p className="text-xs text-[#64748B] font-medium">
            Track hardware assets and software licenses.
          </p>
        </div>

        {/* Top Right Action: + New Asset (Primary button) */}
        <button
          id="btn-new-asset-header"
          onClick={() => setIsNewAssetModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Asset</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: ASSET SUMMARY (3 cards, equal width)                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Assets */}
        <div
          id="card-total-assets"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Assets
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-[#6366F1]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0F172A]">34</span>
              <span className="text-xs font-bold text-[#6366F1] bg-indigo-50 px-2 py-0.5 rounded-md">
                +4 this month
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Hardware: 22 · Licenses: 12
            </p>
          </div>
        </div>

        {/* Card 2: Available */}
        <div
          id="card-available-assets"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Available
            </span>
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[#3B82F6]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0F172A]">8</span>
              <span className="text-xs font-bold text-[#6366F1] bg-indigo-50 px-2 py-0.5 rounded-md">
                2 ready for assignment
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Hardware: 5 · Licenses: 3
            </p>
          </div>
        </div>

        {/* Card 3: Expiring Soon */}
        <div
          id="card-expiring-soon"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Expiring Soon
            </span>
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-[#B95F00]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#0F172A]">3</span>
              <span className="text-xs font-bold text-[#B95F00] bg-amber-50 px-2 py-0.5 rounded-md">
                Needs attention
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              2 licenses, 1 warranty
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FILTER & SEARCH BAR                                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-assets-input"
              type="text"
              placeholder="Search by asset name, serial, seat, or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Type Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            {(['all', 'hardware', 'license'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-white text-[#6366F1] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All Types' : t === 'hardware' ? 'Hardware' : 'Licenses'}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Retired">Retired</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: ASSETS TABLE (Full width)                                          */}
      {/* ========================================================================= */}
      <div
        id="assets-table-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Serial/Seat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Renewal</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAssets.map((asset) => {
                const isHardware = asset.type === 'hardware';
                const hasExpiringRenewal =
                  asset.renewalOrWarranty &&
                  (asset.renewalOrWarranty.includes('Nov 30') || asset.renewalOrWarranty.includes('Dec 15'));

                return (
                  <tr
                    key={asset.id}
                    id={`asset-row-${asset.id}`}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isHardware ? (
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700" title="Hardware Asset">
                            <Laptop className="w-4 h-4 text-slate-600" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-indigo-50 text-[#6366F1]" title="Software License">
                            <Key className="w-4 h-4 text-[#6366F1]" />
                          </div>
                        )}
                        <span className="text-xs font-semibold capitalize text-slate-600">
                          {asset.type}
                        </span>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 text-xs">
                        {asset.name}
                      </span>
                    </td>

                    {/* Serial/Seat */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isHardware ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-semibold text-[11px]">SN:</span>
                          <span className="font-mono text-slate-800 text-xs font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {asset.serialOrSeat}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-semibold text-[11px]">Seat:</span>
                          <span className="font-mono text-slate-700 text-xs font-medium">
                            {asset.serialOrSeat}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(asset.status, asset.renewalOrWarranty)}
                    </td>

                    {/* Assigned To */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                            {asset.assignedTo.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900">{asset.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-mono">—</span>
                      )}
                    </td>

                    {/* Renewal */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {asset.renewalOrWarranty ? (
                        hasExpiringRenewal ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[#B95F00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#B95F00]" />
                            {asset.renewalOrWarranty}
                          </span>
                        ) : (
                          <span className="text-slate-600 font-medium text-xs">
                            {asset.renewalOrWarranty}
                          </span>
                        )
                      ) : (
                        <span className="text-slate-300 font-mono">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {asset.status === 'Retired' ? (
                          <button
                            id={`btn-view-asset-${asset.id}`}
                            onClick={() => handleOpenView(asset)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                          >
                            [View]
                          </button>
                        ) : asset.status === 'Available' ? (
                          <button
                            id={`btn-assign-asset-${asset.id}`}
                            onClick={() => handleOpenAssign(asset)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#6366F1] border border-indigo-200 text-xs font-bold transition-colors cursor-pointer"
                          >
                            [Assign]
                          </button>
                        ) : (
                          <button
                            id={`btn-unassign-asset-${asset.id}`}
                            onClick={() => handleUnassign(asset)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            [Unassign]
                          </button>
                        )}

                        <button
                          id={`btn-edit-asset-${asset.id}`}
                          onClick={() => handleOpenEdit(asset)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          [Edit]
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <p className="font-semibold text-sm">No assets found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search criteria or filter options
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: NEW ASSET MODAL                                                  */}
      {/* ========================================================================= */}
      {isNewAssetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Asset</h3>
                <p className="text-xs text-slate-500">Register hardware or software license to inventory.</p>
              </div>
              <button
                onClick={() => setIsNewAssetModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssetSubmit} className="space-y-4">
              {/* Type Toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAssetType('hardware')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newAssetType === 'hardware'
                        ? 'bg-indigo-50 border-[#6366F1] text-[#6366F1] shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Laptop className="w-4 h-4" />
                    <span>Hardware</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAssetType('license')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newAssetType === 'license'
                        ? 'bg-indigo-50 border-[#6366F1] text-[#6366F1] shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>License</span>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Asset Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder={newAssetType === 'hardware' ? 'e.g. MacBook Pro 16", Dell Monitor' : 'e.g. Figma Pro, Adobe CC'}
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              {/* Serial / Seat info */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {newAssetType === 'hardware' ? 'Serial Number (SN)' : 'Seat Email / Key'}
                </label>
                <input
                  type="text"
                  placeholder={newAssetType === 'hardware' ? 'e.g. ABC123XYZ' : 'e.g. team.seat@kobneti.com'}
                  value={newAssetSerial}
                  onChange={(e) => setNewAssetSerial(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              {/* Status Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Initial Status
                </label>
                <select
                  value={newAssetStatus}
                  onChange={(e) => setNewAssetStatus(e.target.value as AssetStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  <option value="Available">Available (Ready for assignment)</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              {/* Purchased Date & Warranty / Renewal Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Purchased Date
                  </label>
                  <input
                    type="date"
                    value={newAssetPurchased}
                    onChange={(e) => setNewAssetPurchased(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Warranty / Renewal
                  </label>
                  <input
                    type="text"
                    placeholder={newAssetType === 'hardware' ? 'e.g. 2028-01-15' : 'e.g. Dec 31'}
                    value={newAssetRenewal}
                    onChange={(e) => setNewAssetRenewal(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAssetModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Create Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ASSIGN ASSET MODAL                                               */}
      {/* ========================================================================= */}
      {isAssignModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Asset</h3>
                <p className="text-xs text-slate-500">
                  Assign <span className="font-semibold text-slate-800">{selectedAsset.name}</span> ({selectedAsset.serialOrSeat})
                </p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {/* User Dropdown (Searchable) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assign To User *
                </label>
                <div className="relative">
                  <select
                    value={selectedAssignUser}
                    onChange={(e) => {
                      setSelectedAssignUser(e.target.value);
                      const member = TEAM_MEMBERS.find((m) => m.name === e.target.value);
                      if (member) setSelectedAssignTeam(member.team);
                    }}
                    className="w-full appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer"
                  >
                    {TEAM_MEMBERS.map((member) => (
                      <option key={member.name} value={member.name}>
                        {member.name} — {member.email} ({member.team})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Team Dropdown (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Team (Optional)
                </label>
                <div className="relative">
                  <select
                    value={selectedAssignTeam}
                    onChange={(e) => setSelectedAssignTeam(e.target.value)}
                    className="w-full appearance-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer"
                  >
                    {TEAMS_LIST.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
                <Shield className="w-4 h-4 text-[#6366F1] shrink-0 mt-0.5" />
                <span>
                  Assigning this asset will automatically link custody records and reflect in member access logs.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Assign Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT ASSET MODAL                                                 */}
      {/* ========================================================================= */}
      {isEditModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Asset Details</h3>
                <p className="text-xs text-slate-500">ID: {selectedAsset.id}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  value={editAssetName}
                  onChange={(e) => setEditAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Serial / Seat Info
                </label>
                <input
                  type="text"
                  value={editAssetSerial}
                  onChange={(e) => setEditAssetSerial(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={editAssetStatus}
                  onChange={(e) => setEditAssetStatus(e.target.value as AssetStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              {editAssetStatus === 'Assigned' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assigned To
                  </label>
                  <select
                    value={editAssetAssignedTo}
                    onChange={(e) => setEditAssetAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    {TEAM_MEMBERS.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Renewal / Warranty Date
                </label>
                <input
                  type="text"
                  value={editAssetRenewal}
                  onChange={(e) => setEditAssetRenewal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: VIEW ASSET MODAL                                                 */}
      {/* ========================================================================= */}
      {isViewModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedAsset.name}</h3>
                <p className="text-xs text-slate-500">Asset Record Details</p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Type:</span>
                <span className="font-bold text-slate-900 capitalize">{selectedAsset.type}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Serial / Seat:</span>
                <span className="font-mono font-bold text-slate-900">{selectedAsset.serialOrSeat}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold">Status:</span>
                <span>{getStatusBadge(selectedAsset.status, selectedAsset.renewalOrWarranty)}</span>
              </div>
              {selectedAsset.purchasedDate && (
                <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold">Purchased Date:</span>
                  <span className="font-medium text-slate-800">{selectedAsset.purchasedDate}</span>
                </div>
              )}
              {selectedAsset.renewalOrWarranty && (
                <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-semibold">Warranty / Renewal:</span>
                  <span className="font-medium text-slate-800">{selectedAsset.renewalOrWarranty}</span>
                </div>
              )}
              {selectedAsset.notes && (
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500 font-semibold block">Notes:</span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{selectedAsset.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
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
