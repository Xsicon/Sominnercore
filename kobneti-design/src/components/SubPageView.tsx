import React from 'react';
import { ArrowLeft, Filter, Plus, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface SubPageViewProps {
  pageId: string;
  pageTitle: string;
  onBackToOverview: () => void;
}

export const SubPageView: React.FC<SubPageViewProps> = ({
  pageId,
  pageTitle,
  onBackToOverview,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToOverview}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:underline mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Overview</span>
          </button>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage and monitor operations for {pageTitle.toLowerCase()} across KobNeti services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`New item created in ${pageTitle}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6366F1] hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
          <input
            type="text"
            placeholder={`Filter ${pageTitle.toLowerCase()}...`}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By Product</span>
          </button>
        </div>
      </div>

      {/* Content Card with mock table items */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Active Records ({pageId})
          </div>
          <span className="text-xs text-slate-500">Live operational sync</span>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            {
              id: 'KB-8821',
              title: `${pageTitle} Priority Dispatch item for MuuqWear stack`,
              status: 'In Progress',
              priority: 'High',
              time: '12m ago',
              owner: 'Adeel D.',
            },
            {
              id: 'KB-8820',
              title: `Automated SLA verification check for GaarX service`,
              status: 'Completed',
              priority: 'Medium',
              time: '45m ago',
              owner: 'Ibrahim M.',
            },
            {
              id: 'KB-8819',
              title: `Weekly sync pipeline and status audit for Salguri`,
              status: 'Pending Review',
              priority: 'Low',
              time: '2h ago',
              owner: 'Leila H.',
            },
          ].map((row) => (
            <div
              key={row.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6366F1] flex items-center justify-center font-bold text-xs shrink-0">
                  {row.id.substring(3)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0F172A] hover:text-[#6366F1] cursor-pointer">
                    {row.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1">
                    <span>ID: {row.id}</span>
                    <span>•</span>
                    <span>Assignee: {row.owner}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {row.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    row.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : row.status === 'In Progress'
                      ? 'bg-indigo-50 text-[#6366F1] border border-indigo-100'
                      : 'bg-amber-50 text-[#B95F00] border border-amber-200'
                  }`}
                >
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
