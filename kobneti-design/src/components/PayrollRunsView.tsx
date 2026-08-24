import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileDown,
  Check,
  X,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Download,
  Building,
  CreditCard,
  Layers,
  ChevronDown,
  Lock,
} from 'lucide-react';

export interface PayrollEmployeeRow {
  id: string;
  name: string;
  avatar: string;
  role: 'Admin' | 'Engineer' | 'Support' | 'Manager';
  hours: number;
  rate: number;
  grossPay: number;
  department: string;
}

const EMPLOYEES_DATA: PayrollEmployeeRow[] = [
  { id: 'emp-1', name: 'Adeel D.', avatar: 'AD', role: 'Admin', hours: 80.0, rate: 45.0, grossPay: 3600.0, department: 'Executive' },
  { id: 'emp-2', name: 'Leila H.', avatar: 'LH', role: 'Engineer', hours: 76.5, rate: 40.0, grossPay: 3060.0, department: 'Engineering' },
  { id: 'emp-3', name: 'Mike C.', avatar: 'MC', role: 'Engineer', hours: 72.0, rate: 38.0, grossPay: 2736.0, department: 'Engineering' },
  { id: 'emp-4', name: 'Sarah K.', avatar: 'SK', role: 'Support', hours: 80.0, rate: 30.0, grossPay: 2400.0, department: 'Customer Success' },
  { id: 'emp-5', name: 'Ibrahim M.', avatar: 'IM', role: 'Manager', hours: 78.0, rate: 42.0, grossPay: 3276.0, department: 'DevOps & Infra' },
  { id: 'emp-6', name: 'John D.', avatar: 'JD', role: 'Support', hours: 75.0, rate: 28.0, grossPay: 2100.0, department: 'Customer Success' },
  { id: 'emp-7', name: 'Emma W.', avatar: 'EW', role: 'Support', hours: 80.0, rate: 32.0, grossPay: 2560.0, department: 'Customer Success' },
  { id: 'emp-8', name: 'Alex P.', avatar: 'AP', role: 'Engineer', hours: 70.0, rate: 36.0, grossPay: 2520.0, department: 'Engineering' },
  { id: 'emp-9', name: 'Lisa A.', avatar: 'LA', role: 'Support', hours: 76.0, rate: 30.0, grossPay: 2280.0, department: 'Customer Success' },
  { id: 'emp-10', name: 'James B.', avatar: 'JB', role: 'Engineer', hours: 74.0, rate: 38.0, grossPay: 2812.0, department: 'Engineering' },
  { id: 'emp-11', name: 'Chris R.', avatar: 'CR', role: 'Support', hours: 72.0, rate: 28.0, grossPay: 2016.0, department: 'Customer Success' },
  { id: 'emp-12', name: 'Maria G.', avatar: 'MG', role: 'Support', hours: 78.0, rate: 30.0, grossPay: 2340.0, department: 'Customer Success' },
  { id: 'emp-13', name: 'Tom S.', avatar: 'TS', role: 'Engineer', hours: 76.0, rate: 36.0, grossPay: 2736.0, department: 'Engineering' },
  { id: 'emp-14', name: 'Diana P.', avatar: 'DP', role: 'Manager', hours: 80.0, rate: 40.0, grossPay: 3200.0, department: 'Engineering' },
];

export type PayrollRunStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Finalized';

interface PayrollRunsViewProps {
  selectedPayPeriod?: string;
  onGenerateRun?: () => void;
}

export const PayrollRunsView: React.FC<PayrollRunsViewProps> = ({
  selectedPayPeriod = 'Nov 1 – Nov 15, 2025',
}) => {
  const [runStatus, setRunStatus] = useState<PayrollRunStatus>('Pending Approval');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalHours = EMPLOYEES_DATA.reduce((acc, curr) => acc + curr.hours, 0);
  const totalGross = EMPLOYEES_DATA.reduce((acc, curr) => acc + curr.grossPay, 0);

  const handleApproveRun = () => {
    setRunStatus('Approved');
    showToast('Payroll Run approved! Ready for Administrator finalization.');
  };

  const handleFinalizeRun = () => {
    setRunStatus('Finalized');
    showToast('Payroll Run finalized and locked. ACH/Direct deposits queued for disbursement.');
  };

  const handleExportCSV = () => {
    if (runStatus !== 'Finalized') return;
    showToast('Exporting Payroll_Nov_1_15_2025.csv...');
  };

  const handleExportPDF = () => {
    if (runStatus !== 'Finalized') return;
    showToast('Generating Payroll_Summary_Statement_Nov15.pdf...');
  };

  const isFinalized = runStatus === 'Finalized';
  const isApproved = runStatus === 'Approved';
  const isPending = runStatus === 'Pending Approval';

  return (
    <div
      id="payroll-runs-view-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="payroll-toast"
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
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
            Payroll Runs
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Generate, review, and finalize payroll.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <select
              id="payroll-runs-header-period-select"
              defaultValue="nov-1-15-2025"
              className="appearance-none pl-3.5 pr-9 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer transition-colors shadow-2xs"
            >
              <option value="nov-1-15-2025">Nov 1 – Nov 15, 2025 (Current)</option>
              <option value="oct-16-31-2025">Oct 16 – Oct 31, 2025</option>
              <option value="oct-1-15-2025">Oct 1 – Oct 15, 2025</option>
              <option value="sep-16-30-2025">Sep 16 – Sep 30, 2025</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          <button
            id="btn-generate-payroll-run-header"
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <span>Generate Run</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: PAYROLL SUMMARY (3 cards, equal width)                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Current Pay Period */}
        <div
          id="payroll-card-current"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Pay Period
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#B95F00] border border-amber-200">
                <span>🟡</span>
                <span>Processing</span>
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0F172A]">Nov 1 – Nov 15, 2025</h3>
              <p className="text-2xl font-extrabold text-[#0F172A] font-mono">$38,240</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Employees: <strong className="text-slate-800 font-bold">14</strong></span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">1,057.5 hrs logged</span>
          </div>
        </div>

        {/* Card 2: Previous Pay Period */}
        <div
          id="payroll-card-previous"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Previous Pay Period
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                <span>✅</span>
                <span>Finalized</span>
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0F172A]">Oct 16 – Oct 31, 2025</h3>
              <p className="text-2xl font-extrabold text-[#0F172A] font-mono">$36,810</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Employees: <strong className="text-slate-800 font-bold">14</strong></span>
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Paid Nov 05
            </span>
          </div>
        </div>

        {/* Card 3: Payroll Stats */}
        <div
          id="payroll-card-stats"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Payroll Stats
              </span>
              <span className="p-1 rounded-md bg-slate-100 text-slate-600">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Avg. Hours</span>
                <span className="text-base font-bold text-[#0F172A] font-mono">42.5</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Avg. Gross</span>
                <span className="text-base font-bold text-[#0F172A] font-mono">$2,731</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total YTD Disbursed:</span>
            <span className="font-bold font-mono text-[#0F172A] text-sm">$82,450</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: PAYROLL RUN DETAIL (Full width table)                               */}
      {/* ========================================================================= */}
      <div
        id="card-payroll-run-detail"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        <div className="p-4 sm:px-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-[#6366F1]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Run: November 1-15, 2025
              </h3>
              <p className="text-[11px] text-slate-500">
                14 individual payroll line items calculated from approved timesheet logs.
              </p>
            </div>
          </div>

          {/* Status tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isFinalized
                  ? 'bg-indigo-50 text-[#6366F1] border border-indigo-200'
                  : isApproved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-[#B95F00] border border-amber-200'
              }`}
            >
              <span>{isFinalized ? '✅' : isApproved ? '🟢' : '🟡'}</span>
              <span>{runStatus}</span>
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Role</th>
                <th className="py-3.5 px-4 font-bold text-right">Hours</th>
                <th className="py-3.5 px-4 font-bold text-right">Rate</th>
                <th className="py-3.5 px-4 font-bold text-right">Gross Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EMPLOYEES_DATA.map((emp) => {
                const getRoleBadge = (role: string) => {
                  switch (role) {
                    case 'Admin':
                      return 'bg-purple-50 text-purple-700 border-purple-200';
                    case 'Engineer':
                      return 'bg-blue-50 text-blue-700 border-blue-200';
                    case 'Manager':
                      return 'bg-indigo-50 text-[#6366F1] border-indigo-200';
                    case 'Support':
                    default:
                      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  }
                };

                return (
                  <tr
                    key={emp.id}
                    id={`payroll-row-${emp.id}`}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Employee */}
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                          {emp.avatar}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-[#6366F1] transition-colors">
                            {emp.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {emp.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getRoleBadge(
                          emp.role
                        )}`}
                      >
                        {emp.role}
                      </span>
                    </td>

                    {/* Hours */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 text-right whitespace-nowrap">
                      {emp.hours.toFixed(1)}
                    </td>

                    {/* Rate */}
                    <td className="py-3 px-4 font-mono text-slate-600 text-right whitespace-nowrap">
                      ${emp.rate.toFixed(2)}
                    </td>

                    {/* Gross Pay */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right whitespace-nowrap">
                      ${emp.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totals Footer Row */}
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50/90 font-bold text-slate-900 text-xs">
                <td className="py-3.5 px-4 uppercase tracking-wider font-extrabold text-slate-700" colSpan={2}>
                  Totals (14 Employees)
                </td>
                <td className="py-3.5 px-4 font-mono font-extrabold text-right text-slate-900">
                  {totalHours.toFixed(1)} hrs
                </td>
                <td className="py-3.5 px-4 text-right text-slate-400 font-normal">
                  —
                </td>
                <td className="py-3.5 px-4 font-mono font-extrabold text-right text-[#0F172A] text-sm">
                  ${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: ACTIONS                                                            */}
      {/* ========================================================================= */}
      <div
        id="card-payroll-actions"
        className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#6366F1]" />
          <span>
            {isFinalized ? (
              <strong className="text-emerald-700 font-semibold">
                Payroll locked and finalized. Direct disbursement files ready for download.
              </strong>
            ) : isApproved ? (
              <span>
                Approved by Management. Ready for <strong>Administrator Finalization</strong>.
              </span>
            ) : (
              <span>
                Requires <strong>Manager Review & Approval</strong> before finalization.
              </span>
            )}
          </span>
        </div>

        {/* Action button cluster */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {/* Manager Approve Run */}
          {isPending && (
            <button
              id="btn-approve-payroll-run"
              onClick={handleApproveRun}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve Run (Manager)</span>
            </button>
          )}

          {/* Admin Finalize Run (Appears after approval or can be triggered directly) */}
          {(isApproved || isPending) && (
            <button
              id="btn-finalize-payroll-run"
              onClick={handleFinalizeRun}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 ${
                isApproved
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Finalize Run (Admin)</span>
            </button>
          )}

          {/* Export CSV (Outlined, enabled when finalized) */}
          <button
            id="btn-export-payroll-csv"
            onClick={handleExportCSV}
            disabled={!isFinalized}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
              isFinalized
                ? 'border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs'
                : 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed opacity-60'
            }`}
            title={!isFinalized ? 'Finalize run to enable CSV export' : 'Export CSV'}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Export PDF (Outlined, enabled when finalized) */}
          <button
            id="btn-export-payroll-pdf"
            onClick={handleExportPDF}
            disabled={!isFinalized}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
              isFinalized
                ? 'border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs'
                : 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed opacity-60'
            }`}
            title={!isFinalized ? 'Finalize run to enable PDF export' : 'Export PDF'}
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: GENERATE NEW PAYROLL RUN                                           */}
      {/* ========================================================================= */}
      {isGenerateModalOpen && (
        <div
          id="modal-generate-run-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsGenerateModalOpen(false)}
        >
          <div
            id="modal-generate-run-container"
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6366F1]" />
                <span>Generate Payroll Run</span>
              </h3>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pay Period</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none">
                  <option>Nov 16 – Nov 30, 2025</option>
                  <option>Nov 1 – Nov 15, 2025</option>
                  <option>Oct 16 – Oct 31, 2025</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Disbursement Date</label>
                <input
                  type="date"
                  defaultValue="2025-11-20"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 text-[11px]">
                Calculates automatic totals from 14 verified contractor and full-time employee timesheets.
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGenerateModalOpen(false);
                  showToast('Generated new draft Payroll Run for Nov 16 – Nov 30, 2025');
                }}
                className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Generate Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
