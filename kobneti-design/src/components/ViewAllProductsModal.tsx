import React from 'react';
import { X, Box, ExternalLink, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ProductTicket } from '../types';

interface ViewAllProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductTicket[];
}

export const ViewAllProductsModal: React.FC<ViewAllProductsModalProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#6366F1] flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">
                Product Workload Breakdown
              </h2>
              <p className="text-xs text-[#64748B]">
                5 Active Products • 128 Total Support Tickets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase bg-slate-50">
                <th className="py-2.5 px-3 rounded-l-lg">PRODUCT</th>
                <th className="py-2.5 px-3">OPEN TICKETS</th>
                <th className="py-2.5 px-3">ACTIVE TASKS</th>
                <th className="py-2.5 px-3">SLA STATUS</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.name} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-semibold text-[#0F172A] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
                    {p.name}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {p.tickets} tickets
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {p.openCount} tasks
                  </td>
                  <td className="py-3 px-3">
                    {p.slaStatus === 'Healthy' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Healthy (99.8%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        At Risk (1 SLA Alert)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Navigating to ${p.name} product dashboard`)}
                      className="text-xs font-semibold text-[#6366F1] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Connected Repositories: 5 synced with GitHub</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
