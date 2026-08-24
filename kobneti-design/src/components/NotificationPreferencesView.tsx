import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  Ticket,
  RefreshCw,
  AtSign,
  MessageSquare,
  AlertTriangle,
  Flame,
  CheckSquare,
  BadgeCheck,
  DollarSign,
  Layers,
  GitBranch,
  Megaphone,
  Moon,
  Clock,
  Calendar,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface NotificationPrefItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  inApp: boolean;
  email: boolean;
}

const INITIAL_PREFERENCE_ITEMS: NotificationPrefItem[] = [
  {
    id: 'ticket_assigned',
    label: 'Ticket assigned to me',
    description: 'When a new or existing ticket is reassigned to your queue.',
    icon: Ticket,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-[#6366F1]',
    inApp: true,
    email: true,
  },
  {
    id: 'ticket_status_changed',
    label: 'Ticket status changed',
    description: 'State transitions on tickets you are assigned to or watching.',
    icon: RefreshCw,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    inApp: true,
    email: false,
  },
  {
    id: 'mention_internal_chat',
    label: 'Mention in Internal Chat',
    description: 'Direct @mentions or team broadcasts in public or private channels.',
    icon: AtSign,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    inApp: true,
    email: true,
  },
  {
    id: 'direct_message',
    label: 'Direct Message',
    description: 'Incoming 1:1 chat pings and direct conversational threads.',
    icon: MessageSquare,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    inApp: true,
    email: true,
  },
  {
    id: 'sla_breach_warning',
    label: 'SLA breach warning',
    description: 'Urgent alerts when high or critical priority tickets near deadline.',
    icon: AlertTriangle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    inApp: true,
    email: true,
  },
  {
    id: 'escalation_incident',
    label: 'Escalation/Incident',
    description: 'Severity-1 platform outages and executive incident bridge triggers.',
    icon: Flame,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    inApp: true,
    email: true,
  },
  {
    id: 'approval_needed',
    label: 'Approval needed',
    description: 'New timesheet submissions, budget adjustments, or leave requests.',
    icon: CheckSquare,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    inApp: true,
    email: true,
  },
  {
    id: 'approval_decision',
    label: 'Approval decision',
    description: 'When your pending requests are approved or rejected with notes.',
    icon: BadgeCheck,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    inApp: true,
    email: true,
  },
  {
    id: 'payroll_run_finalized',
    label: 'Payroll run finalized',
    description: 'Confirmation and digital stub receipts once payroll is settled.',
    icon: DollarSign,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    inApp: false,
    email: true,
  },
  {
    id: 'new_product_created',
    label: 'New product created',
    description: 'When engineering or PMs register an enterprise product initiative.',
    icon: Layers,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    inApp: false,
    email: false,
  },
  {
    id: 'github_activity',
    label: 'GitHub activity',
    description: 'PR merges, CI/CD deployment runs, and repository webhooks.',
    icon: GitBranch,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    inApp: false,
    email: false,
  },
  {
    id: 'system_announcements',
    label: 'System announcements',
    description: 'Scheduled maintenance windows, compliance notes, and platform upgrades.',
    icon: Megaphone,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    inApp: true,
    email: true,
  },
];

export const NotificationPreferencesView: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPrefItem[]>(INITIAL_PREFERENCE_ITEMS);
  const [digestFrequency, setDigestFrequency] = useState<string>('Daily');
  const [digestTime, setDigestTime] = useState<string>('9:00 AM');
  const [includeWeekendActivity, setIncludeWeekendActivity] = useState<boolean>(false);

  // Quiet Hours
  const [quietStart, setQuietStart] = useState<string>('10:00 PM');
  const [quietEnd, setQuietEnd] = useState<string>('7:00 AM');
  const [muteQuietHours, setMuteQuietHours] = useState<boolean>(true);

  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleInApp = (id: string) => {
    setPreferences((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inApp: !item.inApp } : item
      )
    );
    showToast('Preference updated in real-time');
  };

  const handleToggleEmail = (id: string) => {
    setPreferences((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, email: !item.email } : item
      )
    );
    showToast('Preference updated in real-time');
  };

  const handleSaveAll = () => {
    showToast('All notification preferences saved successfully!');
  };

  const handleResetDefaults = () => {
    setPreferences(INITIAL_PREFERENCE_ITEMS);
    setDigestFrequency('Daily');
    setDigestTime('9:00 AM');
    setIncludeWeekendActivity(false);
    setQuietStart('10:00 PM');
    setQuietEnd('7:00 AM');
    setMuteQuietHours(true);
    showToast('Reset to system default preferences');
  };

  return (
    <div
      id="notification-preferences-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-5xl mx-auto pb-12"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
            Notification Preferences
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Choose how and when you receive notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:underline cursor-pointer transition-colors bg-transparent border-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: PREFERENCE TOGGLES (Full Width Card)                               */}
      {/* ========================================================================= */}
      <div
        id="preference-toggles-card"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        {/* Table Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold shadow-2xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notification Channels & Matrix</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Granular routing rules across web app sound/badge alerts and email dispatch.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-12 pr-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 w-20 justify-center">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>In-App</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 w-20 justify-center">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email</span>
            </div>
          </div>
        </div>

        {/* Matrix Rows */}
        <div className="divide-y divide-slate-100">
          {preferences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={`pref-row-${item.id}`}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                {/* Left: Type info + Icon */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} border border-slate-200/60 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.label}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right: Modern Switches for In-App & Email */}
                <div className="flex items-center justify-between sm:justify-end gap-8 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* In-App Toggle */}
                  <div className="flex items-center gap-2.5 sm:w-20 sm:justify-center">
                    <span className="text-[11px] font-semibold text-slate-500 sm:hidden">In-App:</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.inApp}
                      id={`toggle-inapp-${item.id}`}
                      onClick={() => handleToggleInApp(item.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 ${
                        item.inApp ? 'bg-[#6366F1]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          item.inApp ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email Toggle */}
                  <div className="flex items-center gap-2.5 sm:w-20 sm:justify-center">
                    <span className="text-[11px] font-semibold text-slate-500 sm:hidden">Email:</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.email}
                      id={`toggle-email-${item.id}`}
                      onClick={() => handleToggleEmail(item.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 ${
                        item.email ? 'bg-[#6366F1]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          item.email ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: DIGEST SETTINGS                                                    */}
      {/* ========================================================================= */}
      <div
        id="digest-settings-card"
        className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-2xs">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Digest Settings</h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Consolidate lower-priority updates into a single periodic email overview.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs pt-1">
          {/* Email Digest Frequency */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Email digest frequency
            </label>
            <select
              id="digest-frequency-select"
              value={digestFrequency}
              onChange={(e) => {
                setDigestFrequency(e.target.value);
                showToast(`Digest frequency set to ${e.target.value}`);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer shadow-2xs"
            >
              <option value="Real-time">Real-time (No digest)</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
            </select>
          </div>

          {/* Digest Time */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Digest time
            </label>
            <select
              id="digest-time-select"
              value={digestTime}
              onChange={(e) => {
                setDigestTime(e.target.value);
                showToast(`Digest dispatch time set to ${e.target.value}`);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] cursor-pointer shadow-2xs"
            >
              <option value="7:00 AM">7:00 AM (Early morning)</option>
              <option value="8:00 AM">8:00 AM</option>
              <option value="9:00 AM">9:00 AM (Start of workday)</option>
              <option value="12:00 PM">12:00 PM (Midday)</option>
              <option value="5:00 PM">5:00 PM (End of workday)</option>
            </select>
          </div>

          {/* Include Weekend Activity Toggle */}
          <div className="space-y-1.5 flex flex-col justify-between">
            <label className="block text-slate-700 font-bold">
              Include weekend activity
            </label>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-600">
                {includeWeekendActivity ? 'Active on Sat/Sun' : 'Workdays only'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={includeWeekendActivity}
                id="toggle-weekend-activity"
                onClick={() => {
                  setIncludeWeekendActivity(!includeWeekendActivity);
                  showToast(!includeWeekendActivity ? 'Weekend activity included' : 'Weekend activity muted');
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 ${
                  includeWeekendActivity ? 'bg-[#6366F1]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    includeWeekendActivity ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 3: QUIET HOURS                                                        */}
      {/* ========================================================================= */}
      <div
        id="quiet-hours-card"
        className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold shadow-2xs">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Quiet Hours</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Suppress non-emergency sound alerts and mobile banners while resting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
              Mute during quiet hours:
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={muteQuietHours}
              id="toggle-mute-quiet-hours"
              onClick={() => {
                setMuteQuietHours(!muteQuietHours);
                showToast(!muteQuietHours ? 'Quiet hours enabled' : 'Quiet hours disabled');
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 ${
                muteQuietHours ? 'bg-[#6366F1]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  muteQuietHours ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          {/* Start Time */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Start time
            </label>
            <div className="relative">
              <input
                type="text"
                id="quiet-hours-start"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] shadow-2xs"
              />
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* End Time */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              End time
            </label>
            <div className="relative">
              <input
                type="text"
                id="quiet-hours-end"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1] shadow-2xs"
              />
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM ACTION BUTTON                                                      */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Discard Changes
        </button>
        <button
          type="button"
          id="bottom-save-preferences-btn"
          onClick={handleSaveAll}
          className="px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
