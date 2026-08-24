import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Circle,
  X,
  Check,
  Flag,
  User,
  ExternalLink,
} from 'lucide-react';

export type RoadmapTimeframe = 'week' | 'month' | 'quarter';

export interface Milestone {
  id: string;
  productId: string;
  title: string;
  startDate: string; // e.g. "Nov 1"
  endDate: string; // e.g. "Nov 30"
  startPercent: number; // 0 - 100 on Q4 timeline (Nov 1 to Dec 31 / 61 days)
  widthPercent: number; // width in percent
  progressText: string; // e.g. "██████████░░░░"
  progressPercent: number;
  status: 'In Progress' | 'At Risk' | 'Planned' | 'Done';
  lead: string;
  description: string;
}

export interface RoadmapProduct {
  id: string;
  name: string;
  milestones: Milestone[];
}

// Exactly the requested 5 rows & milestones
const ROADMAP_DATA: RoadmapProduct[] = [
  {
    id: 'muuqwear',
    name: 'MuuqWear',
    milestones: [
      {
        id: 'mw-1',
        productId: 'muuqwear',
        title: 'Q4 Feature Release',
        startDate: 'Nov 1',
        endDate: 'Nov 30',
        startPercent: 0, // Nov 1
        widthPercent: 49.1, // 30 days
        progressText: '██████████░░░░',
        progressPercent: 72,
        status: 'In Progress',
        lead: 'Adeel D.',
        description: 'Multi-currency checkout, dynamic product tags, and optimized inventory sync for mobile shoppers.',
      },
      {
        id: 'mw-2',
        productId: 'muuqwear',
        title: 'Mobile App Launch',
        startDate: 'Nov 15',
        endDate: 'Dec 15',
        startPercent: 23, // Nov 15
        widthPercent: 49.1, // 30 days (to Dec 15)
        progressText: '████████░░░░░░',
        progressPercent: 55,
        status: 'At Risk',
        lead: 'Mike C.',
        description: 'React Native iOS & Android build undergoing App Store review and biometric pay verification.',
      },
    ],
  },
  {
    id: 'gaarx',
    name: 'GaarX',
    milestones: [
      {
        id: 'gx-1',
        productId: 'gaarx',
        title: 'API v2 Release',
        startDate: 'Nov 1',
        endDate: 'Dec 1',
        startPercent: 0, // Nov 1
        widthPercent: 50.8, // 31 days
        progressText: '██████████░░░░',
        progressPercent: 70,
        status: 'In Progress',
        lead: 'Leila H.',
        description: 'GraphQL telemetry subscription endpoints, vehicle GPS webhooks, and rate-limited dispatch APIs.',
      },
    ],
  },
  {
    id: 'salguri',
    name: 'Salguri',
    milestones: [
      {
        id: 'sg-1',
        productId: 'salguri',
        title: 'Payment Processing Upgrade',
        startDate: 'Nov 1',
        endDate: 'Nov 15',
        startPercent: 0, // Nov 1
        widthPercent: 23, // 14 days
        progressText: '██████████░░░░',
        progressPercent: 100,
        status: 'Done',
        lead: 'Adeel D.',
        description: 'ISO-8583 settlement reconciliation speedups and automated banking batch settlement triggers.',
      },
      {
        id: 'sg-2',
        productId: 'salguri',
        title: 'Merchant Dashboard',
        startDate: 'Nov 15',
        endDate: 'Dec 15',
        startPercent: 23, // Nov 15
        widthPercent: 49.1, // 30 days
        progressText: '████████░░░░░░',
        progressPercent: 50,
        status: 'At Risk',
        lead: 'Sarah K.',
        description: 'Real-time revenue charts, dispute filing workflow, and automated payout schedule configuration.',
      },
    ],
  },
  {
    id: 'sompay',
    name: 'SomPay',
    milestones: [
      {
        id: 'sp-1',
        productId: 'sompay',
        title: 'Mobile App Redesign',
        startDate: 'Nov 1',
        endDate: 'Dec 1',
        startPercent: 0, // Nov 1
        widthPercent: 50.8, // 31 days
        progressText: '██████████░░░░',
        progressPercent: 68,
        status: 'In Progress',
        lead: 'Mike C.',
        description: 'Streamlined QR transfer flow, dark mode UI theme, and biometric lock security overhaul.',
      },
    ],
  },
  {
    id: 'platform',
    name: 'Platform Infrastructure',
    milestones: [
      {
        id: 'pi-1',
        productId: 'platform',
        title: 'Database Migration',
        startDate: 'Nov 1',
        endDate: 'Nov 30',
        startPercent: 0, // Nov 1
        widthPercent: 49.1, // 30 days
        progressText: '██████████░░░░',
        progressPercent: 75,
        status: 'In Progress',
        lead: 'Leila H.',
        description: 'PostgreSQL zero-downtime replication cutover and automated Point-In-Time recovery validation.',
      },
    ],
  },
];

interface ProjectRoadmapViewProps {
  timeframe?: RoadmapTimeframe;
  onTimeframeChange?: (tf: RoadmapTimeframe) => void;
  onNewMilestone?: () => void;
}

export const ProjectRoadmapView: React.FC<ProjectRoadmapViewProps> = ({
  onNewMilestone,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2025');
  const [hoveredMilestone, setHoveredMilestone] = useState<Milestone | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isNewMilestoneModalOpen, setIsNewMilestoneModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Milestone Modal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newProduct, setNewProduct] = useState('muuqwear');
  const [newStatus, setNewStatus] = useState<'In Progress' | 'At Risk' | 'Planned' | 'Done'>('In Progress');
  const [newStartDate, setNewStartDate] = useState('Nov 1');
  const [newEndDate, setNewEndDate] = useState('Nov 30');
  const [newLead, setNewLead] = useState('Adeel D.');
  const [newDescription, setNewDescription] = useState('');

  const [productsList, setProductsList] = useState<RoadmapProduct[]>(ROADMAP_DATA);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenModal = () => {
    if (onNewMilestone) {
      onNewMilestone();
    }
    setIsNewMilestoneModalOpen(true);
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMilestoneObj: Milestone = {
      id: `ms-${Date.now()}`,
      productId: newProduct,
      title: newTitle.trim(),
      startDate: newStartDate,
      endDate: newEndDate,
      startPercent: 15,
      widthPercent: 35,
      progressText: '████████░░░░░░',
      progressPercent: newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? 60 : 40,
      status: newStatus,
      lead: newLead,
      description: newDescription || 'Newly scheduled roadmap milestone.',
    };

    setProductsList((prev) =>
      prev.map((prod) =>
        prod.id === newProduct
          ? { ...prod, milestones: [...prod.milestones, newMilestoneObj] }
          : prod
      )
    );

    setIsNewMilestoneModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    showToast(`Added milestone "${newTitle}"`);
  };

  /**
   * Status Colors strictly following specification:
   * - In Progress = Primary (#6366F1) fill
   * - At Risk = Tertiary (#B95F00) fill with warning icon
   * - Planned = Neutral (#94A3B8) outlined
   * - Done = Secondary (#3B82F6) fill with checkmark
   */
  const getMilestoneStyle = (status: Milestone['status']) => {
    switch (status) {
      case 'In Progress':
        return {
          barClass: 'bg-[#6366F1] text-white border border-[#4F46E5] shadow-xs',
          icon: null,
          statusLabel: 'In Progress',
          badgeClass: 'bg-indigo-50 text-[#6366F1] border-indigo-200',
        };
      case 'At Risk':
        return {
          barClass: 'bg-[#B95F00] text-white border border-[#9A4E00] shadow-xs',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-200 shrink-0" />,
          statusLabel: 'At Risk',
          badgeClass: 'bg-amber-50 text-[#B95F00] border-amber-200',
        };
      case 'Done':
        return {
          barClass: 'bg-[#3B82F6] text-white border border-[#2563EB] shadow-xs',
          icon: <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[2.5]" />,
          statusLabel: 'Done',
          badgeClass: 'bg-blue-50 text-[#3B82F6] border-blue-200',
        };
      case 'Planned':
      default:
        return {
          barClass: 'bg-white text-slate-700 border-2 border-dashed border-[#94A3B8] shadow-2xs hover:bg-slate-50',
          icon: <Circle className="w-3 h-3 text-[#94A3B8] shrink-0" />,
          statusLabel: 'Planned',
          badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  };

  return (
    <div
      id="project-roadmap-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="roadmap-toast"
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
      {/* MAIN CONTENT — PAGE HEADER                                                */}
      {/* Left: "Project Roadmap" (InterDisplay, 28px, 600 weight)                  */}
      {/* Subtext: "Strategic planning and milestone tracking." (Inter, 16px, 500)  */}
      {/* Right: Quarter selector dropdown + "+ New Milestone" (Primary filled)      */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <h1
            className="text-[28px] font-[600] tracking-[-0.015em] text-[#0F172A] leading-tight"
            style={{ fontFamily: 'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Project Roadmap
          </h1>
          <p
            className="text-[16px] font-[500] text-[#64748B] leading-normal"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Strategic planning and milestone tracking.
          </p>
        </div>

        {/* Right side: Quarter selector dropdown + "+ New Milestone" (Primary filled #6366F1, 7px radius) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quarter selector dropdown */}
          <div className="relative flex items-center">
            <select
              id="roadmap-quarter-select"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] focus:border-[#6366F1] rounded-[7px] text-xs font-semibold text-[#0F172A] focus:outline-none cursor-pointer transition-colors shadow-2xs"
            >
              <option value="Q4 2025">Q4 2025</option>
              <option value="Q1 2026">Q1 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q3 2025">Q3 2025</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 pointer-events-none" />
          </div>

          {/* + New Milestone button (Primary filled #6366F1, 7px radius) */}
          <button
            id="btn-create-milestone-page"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ New Milestone</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STATUS LEGEND                                                             */}
      {/* In Progress (#6366F1), At Risk (#B95F00 with warning), Planned (#94A3B8), */}
      {/* Done (#3B82F6 with checkmark)                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-1 text-xs text-[#64748B]">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
            <span className="font-medium text-[#0F172A]">In Progress</span>
            <span className="text-[11px] text-[#64748B]">(#6366F1)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B95F00]" />
            <AlertTriangle className="w-3 h-3 text-[#B95F00]" />
            <span className="font-medium text-[#0F172A]">At Risk</span>
            <span className="text-[11px] text-[#64748B]">(#B95F00)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-[#94A3B8] bg-white" />
            <span className="font-medium text-[#0F172A]">Planned</span>
            <span className="text-[11px] text-[#64748B]">(#94A3B8)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
            <Check className="w-3 h-3 text-[#3B82F6] stroke-[2.5]" />
            <span className="font-medium text-[#0F172A]">Done</span>
            <span className="text-[11px] text-[#64748B]">(#3B82F6)</span>
          </div>
        </div>

        <div className="text-[11px] text-[#64748B]">
          Timeline: <span className="font-semibold text-[#0F172A]">Nov 1 – Dec 31, 2025</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GANTT TIMELINE VIEW (Attio-style, clean, minimal)                         */}
      {/* ========================================================================= */}
      <div
        id="gantt-chart-container"
        className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[860px] flex flex-col">
            {/* Timeline Header Row: Months & Dates */}
            <div className="flex border-b border-[#E2E8F0] bg-slate-50/75 text-xs font-semibold text-[#64748B] sticky top-0 z-20">
              {/* Left Column: Product / Project title */}
              <div className="w-56 shrink-0 px-4 py-3 border-r border-[#E2E8F0] font-medium text-[#64748B]">
                Product / Project
              </div>

              {/* Right Gantt Scale: November & December */}
              <div className="flex-1 grid grid-cols-2 divide-x divide-[#E2E8F0]">
                {/* November */}
                <div className="py-2.5 px-3">
                  <div className="text-center font-semibold text-[#0F172A] mb-1">
                    November 2025
                  </div>
                  <div className="grid grid-cols-4 text-[11px] text-[#64748B] text-center font-mono">
                    <span>Nov 1</span>
                    <span>Nov 8</span>
                    <span>Nov 15</span>
                    <span>Nov 22</span>
                  </div>
                </div>

                {/* December */}
                <div className="py-2.5 px-3">
                  <div className="text-center font-semibold text-[#0F172A] mb-1">
                    December 2025
                  </div>
                  <div className="grid grid-cols-4 text-[11px] text-[#64748B] text-center font-mono">
                    <span>Dec 1</span>
                    <span>Dec 8</span>
                    <span>Dec 15</span>
                    <span>Dec 22</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Rows: Exactly the 5 requested rows */}
            <div className="divide-y divide-[#E2E8F0]">
              {productsList.map((product, pIndex) => (
                <div
                  key={product.id}
                  id={`roadmap-row-${product.id}`}
                  className="flex items-stretch hover:bg-slate-50/40 transition-colors group"
                >
                  {/* Left Column: Product Title */}
                  <div className="w-56 shrink-0 px-4 py-5 border-r border-[#E2E8F0] flex items-center justify-between bg-white group-hover:bg-slate-50/40 transition-colors z-10">
                    <span className="font-semibold text-sm text-[#0F172A]">
                      {product.name}
                    </span>
                    <span className="text-[11px] text-[#64748B] font-mono">
                      Row {pIndex + 1}
                    </span>
                  </div>

                  {/* Right Gantt Track Area */}
                  <div className="flex-1 relative px-4 py-4 min-h-[88px] flex flex-col justify-center space-y-2.5">
                    {/* Background Grid Columns for Nov / Dec */}
                    <div className="absolute inset-0 grid grid-cols-2 divide-x divide-slate-100 pointer-events-none">
                      <div className="grid grid-cols-4 divide-x divide-slate-50/80" />
                      <div className="grid grid-cols-4 divide-x divide-slate-50/80" />
                    </div>

                    {/* Milestones in this row */}
                    <div className="relative w-full flex flex-col justify-center space-y-2">
                      {product.milestones.map((milestone) => {
                        const style = getMilestoneStyle(milestone.status);

                        return (
                          <div
                            key={milestone.id}
                            id={`milestone-bar-${milestone.id}`}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltipPos({
                                x: rect.left + rect.width / 2,
                                y: rect.top - 8,
                              });
                              setHoveredMilestone(milestone);
                            }}
                            onMouseLeave={() => setHoveredMilestone(null)}
                            style={{
                              marginLeft: `${milestone.startPercent}%`,
                              width: `${milestone.widthPercent}%`,
                            }}
                            className={`relative h-[34px] rounded-[7px] px-2.5 flex items-center justify-between cursor-pointer transition-all duration-150 select-none ${
                              style.barClass
                            } hover:shadow-md hover:brightness-105`}
                          >
                            {/* Left side: Icon + Title */}
                            <div className="relative z-10 flex items-center gap-1.5 min-w-0 pr-2 overflow-hidden">
                              {style.icon}
                              <span className="text-xs font-semibold truncate leading-none">
                                {milestone.title}
                              </span>
                            </div>

                            {/* Right side: Progress blocks + Date range */}
                            <div className="relative z-10 flex items-center gap-2 shrink-0 text-[11px] font-mono">
                              <span className="hidden md:inline tracking-tighter opacity-85 text-[10px]">
                                {milestone.progressText}
                              </span>
                              <span className="text-[10px] font-semibold opacity-90 whitespace-nowrap">
                                ({milestone.startDate} – {milestone.endDate})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOVER TOOLTIP (Attio-style with milestone details)                         */}
      {/* ========================================================================= */}
      {hoveredMilestone && (
        <div
          id="milestone-hover-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="z-50 w-72 bg-[#0F172A] text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150 space-y-2 text-xs"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                {hoveredMilestone.productId.toUpperCase()}
              </span>
              <h4 className="font-semibold text-sm text-white leading-tight">
                {hoveredMilestone.title}
              </h4>
            </div>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                hoveredMilestone.status === 'In Progress'
                  ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-700'
                  : hoveredMilestone.status === 'At Risk'
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-700'
                  : hoveredMilestone.status === 'Done'
                  ? 'bg-blue-900/80 text-blue-200 border border-blue-700'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {hoveredMilestone.status}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-400 text-[10px] block">Dates:</span>
              <span className="font-medium">
                {hoveredMilestone.startDate} – {hoveredMilestone.endDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Owner:</span>
              <span className="font-medium text-indigo-300">{hoveredMilestone.lead}</span>
            </div>
          </div>

          {/* Progress bar visual */}
          <div className="space-y-1 pt-1 border-t border-slate-700/80">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="font-mono">{hoveredMilestone.progressText}</span>
              <span className="font-semibold text-white">{hoveredMilestone.progressPercent}%</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] text-slate-300 leading-relaxed pt-0.5">
            {hoveredMilestone.description}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: + NEW MILESTONE                                                    */}
      {/* ========================================================================= */}
      {isNewMilestoneModalOpen && (
        <div
          id="modal-new-milestone-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsNewMilestoneModalOpen(false)}
        >
          <div
            id="modal-new-milestone-container"
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6366F1] flex items-center justify-center">
                  <Flag className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#0F172A]">Add New Milestone</h3>
              </div>
              <button
                onClick={() => setIsNewMilestoneModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mobile App Launch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Product
                  </label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#6366F1] text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="muuqwear">MuuqWear</option>
                    <option value="gaarx">GaarX</option>
                    <option value="salguri">Salguri</option>
                    <option value="sompay">SomPay</option>
                    <option value="platform">Platform Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#6366F1] text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="In Progress">In Progress (Primary #6366F1)</option>
                    <option value="At Risk">At Risk (Tertiary #B95F00)</option>
                    <option value="Planned">Planned (Neutral Outlined)</option>
                    <option value="Done">Done (Secondary #3B82F6)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    placeholder="e.g., Nov 1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#6366F1] text-xs font-medium text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    placeholder="e.g., Nov 30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#6366F1] text-xs font-medium text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner / Lead
                </label>
                <select
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#6366F1] text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Adeel D.">Adeel D.</option>
                  <option value="Mike C.">Mike C.</option>
                  <option value="Leila H.">Leila H.</option>
                  <option value="Sarah K.">Sarah K.</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Deliverables
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Key milestones, deliverables, release criteria..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#6366F1] text-xs font-medium text-slate-800 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-[7px] border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
