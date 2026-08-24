import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  CheckCircle2,
  Clock,
  Ticket,
  CheckSquare,
  Globe,
  Bell,
  Smartphone,
  Laptop,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Lock,
} from 'lucide-react';

interface ProfileViewProps {
  onNavigate?: (navId: string, title: string) => void;
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  currentTheme?: 'light' | 'dark' | 'system';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigate,
  onThemeChange,
  currentTheme = 'light',
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'preferences' | 'activity' | 'security'>(
    'details'
  );

  // Profile Details Form State
  const [fullName, setFullName] = useState('Adeel D.');
  const [email, setEmail] = useState('adeel@kobneti.com');
  const [phone, setPhone] = useState('+252 61 234 5678');
  const [department, setDepartment] = useState('Platform Operations');
  const [location, setLocation] = useState('Mogadishu, SO');
  const [timeZone, setTimeZone] = useState('EAT (UTC+3)');
  const [language, setLanguage] = useState('English');

  // Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    ticketAssigned: { inApp: true, email: true },
    mentionChat: { inApp: true, email: true },
    slaBreach: { inApp: true, email: true },
    approvalNeeded: { inApp: true, email: true },
    payrollFinalized: { inApp: false, email: true },
  });

  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>(currentTheme);
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarCollapsedDefault, setSidebarCollapsedDefault] = useState(false);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 2FA Modal State
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Success Flash Notification
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sessions State
  const [sessions, setSessions] = useState([
    {
      id: 's-1',
      device: 'Chrome on Windows',
      location: 'Mogadishu, SO',
      status: 'Active now',
      isCurrent: true,
      icon: Laptop,
    },
    {
      id: 's-2',
      device: 'Chrome on Mac',
      location: 'Mogadishu, SO',
      status: 'Nov 14, 2025 — Expired',
      isCurrent: false,
      icon: Laptop,
    },
    {
      id: 's-3',
      device: 'Safari on iPhone',
      location: 'Mogadishu, SO',
      status: 'Nov 13, 2025 — Expired',
      isCurrent: false,
      icon: Smartphone,
    },
  ]);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg('Profile information saved successfully.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (onThemeChange) {
      onThemeChange(themePreference);
    }
    setSaveSuccessMsg('Preferences updated successfully.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    setPasswordError('');
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSaveSuccessMsg('Password changed successfully.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleLogoutOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setSaveSuccessMsg('Logged out of all other sessions.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const toggleNotifPref = (
    key: keyof typeof notifPrefs,
    channel: 'inApp' | 'email'
  ) => {
    setNotifPrefs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [channel]: !prev[key][channel],
      },
    }));
  };

  return (
    <div id="profile-page-container" className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Toast Flash Notification */}
      {saveSuccessMsg && (
        <div
          id="profile-save-toast"
          className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-[#10B981] text-white px-4 py-2.5 rounded-[10px] shadow-lg text-[13px] font-[500] animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
        <div>
          <h1 className="text-[28px] font-[600] tracking-tight font-display text-[#1A1A1A] dark:text-[#F8FAFC]">
            Profile
          </h1>
          <p className="text-[15px] font-[500] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="profile-header-edit-btn"
            onClick={() => setActiveTab('details')}
            className="text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-[7px] transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            id="profile-header-change-pw-btn"
            onClick={() => setIsPasswordModalOpen(true)}
            className="text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-slate-800/60 px-3 py-1.5 rounded-[7px] transition-colors cursor-pointer"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT (Left 30% / Right 70%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN (30% -> 3/10) — Sticky User Card                             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-4">
          <div
            id="profile-user-card"
            className="rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] space-y-4"
          >
            {/* Avatar & Identity */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[26px] font-[600] shadow-sm">
                  AD
                </div>
                <div
                  className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white dark:bg-[#1E293B] flex items-center justify-center p-0.5"
                  title="Active"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] inline-block ring-2 ring-white dark:ring-[#1E293B]" />
                </div>
              </div>

              <div>
                <h2 className="text-[20px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] font-display">
                  {fullName}
                </h2>
                <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] font-[450] mt-0.5">
                  Administrator
                </p>
                <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] font-mono mt-0.5">
                  {email}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-[500]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
                <span>·</span>
                <span>Member since Nov 2025</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-[600] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Quick Stats
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex items-center justify-between py-1 px-2 rounded-[7px] bg-[#F8F9FA] dark:bg-slate-800/50">
                  <span className="text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                    <Ticket className="w-3.5 h-3.5 text-[#6366F1]" />
                    Tickets handled
                  </span>
                  <span className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">247</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded-[7px] bg-[#F8F9FA] dark:bg-slate-800/50">
                  <span className="text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                    Tasks completed
                  </span>
                  <span className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">89</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded-[7px] bg-[#F8F9FA] dark:bg-slate-800/50">
                  <span className="text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Hours logged
                  </span>
                  <span className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">1,200.5</span>
                </div>
              </div>
            </div>

            {/* Actions Links */}
            <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-col gap-1 text-[13px]">
              <button
                id="btn-view-my-activity"
                onClick={() => setActiveTab('activity')}
                className="w-full text-left px-2.5 py-1.5 text-[#6366F1] dark:text-[#818CF8] hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30 rounded-[7px] font-[500] transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>View My Activity</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-view-my-pay"
                onClick={() => onNavigate?.('my-pay', 'My Pay')}
                className="w-full text-left px-2.5 py-1.5 text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-[7px] font-[500] transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>My Pay</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (70% -> 7/10) — Account Details & Tabs                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 border-b border-[#E2E8F0] dark:border-slate-800 pb-px">
            {(
              [
                { id: 'details', label: 'Details' },
                { id: 'preferences', label: 'Preferences' },
                { id: 'activity', label: 'Activity' },
                { id: 'security', label: 'Security' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`profile-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-[14px] font-[500] border-b-2 transition-all duration-150 cursor-pointer -mb-px ${
                    isActive
                      ? 'border-[#6366F1] text-[#6366F1] dark:text-[#818CF8] font-[600]'
                      : 'border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div
              id="profile-tab-content-details"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] animate-in fade-in duration-150"
            >
              <div>
                <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Profile Information
                </h3>
                <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  Update your contact details and operational department settings.
                </p>
              </div>

              <form onSubmit={handleSaveDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="profile-input-fullname"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="profile-input-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Phone
                    </label>
                    <input
                      type="text"
                      id="profile-input-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
                    />
                  </div>

                  {/* Role (Read-only) */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Role
                    </label>
                    <div className="flex items-center justify-between px-3 py-2 bg-[#F8F9FA] dark:bg-slate-800/80 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[14px] text-[#64748B] dark:text-[#94A3B8] cursor-not-allowed">
                      <span>Administrator</span>
                      <span className="text-[11px] font-[500] px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-[5px]">
                        Read-only
                      </span>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Department
                    </label>
                    <input
                      type="text"
                      id="profile-input-department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Location
                    </label>
                    <input
                      type="text"
                      id="profile-input-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors"
                    />
                  </div>

                  {/* Time Zone */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Time Zone
                    </label>
                    <select
                      id="profile-select-timezone"
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors cursor-pointer"
                    >
                      <option value="EAT (UTC+3)">EAT (UTC+3) — East Africa Time</option>
                      <option value="UTC (UTC+0)">UTC (UTC+0) — Coordinated Universal Time</option>
                      <option value="EST (UTC-5)">EST (UTC-5) — Eastern Standard Time</option>
                      <option value="PST (UTC-8)">PST (UTC-8) — Pacific Standard Time</option>
                      <option value="CET (UTC+1)">CET (UTC+1) — Central European Time</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Language
                    </label>
                    <select
                      id="profile-select-language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] transition-colors cursor-pointer"
                    >
                      <option value="English">English (United States)</option>
                      <option value="Somali">Somali (Af Soomaali)</option>
                      <option value="Arabic">Arabic (العربية)</option>
                      <option value="French">French (Français)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    id="btn-save-profile-details"
                    className="px-5 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] dark:bg-[#818CF8] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-[13px] font-[600] shadow-sm transition-all duration-150 cursor-pointer active:scale-98"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div
              id="profile-tab-content-preferences"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] animate-in fade-in duration-150"
            >
              <form onSubmit={handleSavePreferences} className="space-y-6">
                {/* Notification Preferences */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                      Notification Preferences
                    </h3>
                    <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Configure how you receive activity and operations alerts.
                    </p>
                  </div>

                  <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-[10px] divide-y divide-[#E2E8F0] dark:divide-slate-800">
                    {[
                      { key: 'ticketAssigned', label: 'Ticket assigned to me' },
                      { key: 'mentionChat', label: 'Mention in chat' },
                      { key: 'slaBreach', label: 'SLA breach warning' },
                      { key: 'approvalNeeded', label: 'Approval needed' },
                      { key: 'payrollFinalized', label: 'Payroll finalized' },
                    ].map((item) => {
                      const pref = notifPrefs[item.key as keyof typeof notifPrefs];
                      return (
                        <div
                          key={item.key}
                          className="p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                        >
                          <span className="text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC]">
                            {item.label}
                          </span>
                          <div className="flex items-center gap-4 text-[13px]">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pref.inApp}
                                onChange={() =>
                                  toggleNotifPref(item.key as keyof typeof notifPrefs, 'inApp')
                                }
                                className="w-4 h-4 text-[#6366F1] rounded border-slate-300 focus:ring-[#6366F1]"
                              />
                              <span className="text-[#64748B] dark:text-[#94A3B8]">In-App</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={pref.email}
                                onChange={() =>
                                  toggleNotifPref(item.key as keyof typeof notifPrefs, 'email')
                                }
                                className="w-4 h-4 text-[#6366F1] rounded border-slate-300 focus:ring-[#6366F1]"
                              />
                              <span className="text-[#64748B] dark:text-[#94A3B8]">Email</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Appearance */}
                <div className="space-y-4 pt-4 border-t border-[#E2E8F0] dark:border-slate-800">
                  <div>
                    <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                      Appearance
                    </h3>
                    <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Customize workspace presentation and interface layout.
                    </p>
                  </div>

                  {/* Theme radio buttons */}
                  <div className="space-y-2">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Theme
                    </label>
                    <div className="flex items-center gap-4">
                      {(['light', 'dark', 'system'] as const).map((t) => (
                        <label
                          key={t}
                          className="flex items-center gap-2 text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC] cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="profile-theme-radio"
                            value={t}
                            checked={themePreference === t}
                            onChange={() => setThemePreference(t)}
                            className="text-[#6366F1] focus:ring-[#6366F1]"
                          />
                          <span className="capitalize">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Compact mode & Sidebar toggles */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#F8F9FA] dark:bg-slate-900/50">
                      <div>
                        <div className="text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC]">
                          Compact mode
                        </div>
                        <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                          Tighter tables and condensed row spacing
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCompactMode(!compactMode)}
                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-150 cursor-pointer ${
                          compactMode ? 'bg-[#6366F1]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-150 ${
                            compactMode ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#F8F9FA] dark:bg-slate-900/50">
                      <div>
                        <div className="text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC]">
                          Sidebar collapsed by default
                        </div>
                        <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                          Start sessions in icon-only collapsed navigation
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSidebarCollapsedDefault(!sidebarCollapsedDefault)}
                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-150 cursor-pointer ${
                          sidebarCollapsedDefault ? 'bg-[#6366F1]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-150 ${
                            sidebarCollapsedDefault ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    id="btn-save-profile-preferences"
                    className="px-5 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] dark:bg-[#818CF8] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-[13px] font-[600] shadow-sm transition-all duration-150 cursor-pointer active:scale-98"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ACTIVITY */}
          {activeTab === 'activity' && (
            <div
              id="profile-tab-content-activity"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                    Recent Activity
                  </h3>
                  <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    Chronological audit record of actions and updates performed by you.
                  </p>
                </div>
              </div>

              {/* Scrollable Activity List */}
              <div className="space-y-3">
                {[
                  {
                    id: 'act-1',
                    timestamp: 'Nov 15, 2025 10:23 AM',
                    action: 'Closed ticket #4210',
                    context: 'MuuqWear',
                    badge: 'Ticket',
                  },
                  {
                    id: 'act-2',
                    timestamp: 'Nov 15, 2025 09:15 AM',
                    action: 'Commented on ENG-35',
                    context: 'Engineering Task Board',
                    badge: 'Task',
                  },
                  {
                    id: 'act-3',
                    timestamp: 'Nov 15, 2025 08:45 AM',
                    action: 'Logged 2.5 hours on #4205',
                    context: 'Time Tracking',
                    badge: 'Time',
                  },
                  {
                    id: 'act-4',
                    timestamp: 'Nov 14, 2025 04:30 PM',
                    action: 'Escalated ticket #4207',
                    context: 'SomPay',
                    badge: 'Escalation',
                  },
                  {
                    id: 'act-5',
                    timestamp: 'Nov 14, 2025 02:00 PM',
                    action: 'Updated KB article "3DS Verification"',
                    context: 'Knowledge Base',
                    badge: 'KB',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-[9px] border border-[#E2E8F0] dark:border-slate-800 bg-[#F8F9FA]/70 dark:bg-slate-900/40 flex items-start justify-between gap-3 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                          {item.action}
                        </span>
                        <span className="text-[11px] font-[500] px-2 py-0.2 rounded-[12px] bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] border border-indigo-100 dark:border-indigo-900">
                          {item.context}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                        {item.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Activity ghost link */}
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-center">
                <button
                  id="btn-view-all-activity-link"
                  onClick={() => onNavigate?.('audit-logs', 'Audit Logs')}
                  className="text-[13px] font-[500] text-[#6366F1] dark:text-[#818CF8] hover:text-[#4F46E5] hover:underline px-3 py-1.5 cursor-pointer transition-colors"
                >
                  View All Activity &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div
              id="profile-tab-content-security"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] animate-in fade-in duration-150"
            >
              {/* Password Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E2E8F0] dark:border-slate-800">
                <div>
                  <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#6366F1]" />
                    Password
                  </h3>
                  <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    Ensure your account is using a strong, unique authentication password.
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-profile-change-password"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] dark:bg-[#818CF8] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-[13px] font-[600] shadow-sm transition-all cursor-pointer shrink-0"
                >
                  Change Password
                </button>
              </div>

              {/* Sessions Section */}
              <div className="space-y-3 pb-5 border-b border-[#E2E8F0] dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                      Sessions
                    </h3>
                    <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Devices currently or recently signed into your KobNeti account.
                    </p>
                  </div>
                </div>

                <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-[10px] divide-y divide-[#E2E8F0] dark:divide-slate-800">
                  {sessions.map((sess) => {
                    const Icon = sess.icon;
                    return (
                      <div
                        key={sess.id}
                        className="p-3.5 flex items-center justify-between gap-3 text-[13px]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[7px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] flex items-center gap-2">
                              <span>{sess.device}</span>
                              {sess.isCurrent && (
                                <span className="text-[10px] font-[600] px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                              {sess.location} · {sess.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {sessions.length > 1 && (
                  <div className="pt-1">
                    <button
                      id="btn-logout-other-sessions"
                      onClick={handleLogoutOtherSessions}
                      className="text-[13px] font-[500] text-[#EF4444] dark:text-red-400 hover:text-[#DC2626] hover:underline cursor-pointer transition-colors"
                    >
                      Log Out All Other Sessions
                    </button>
                  </div>
                )}
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                <div>
                  <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#6366F1]" />
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    Add an extra layer of security with authenticator app verification.
                  </p>
                  <div className="mt-1 text-[13px] font-[500] flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
                    <span>Status:</span>
                    {is2FAEnabled ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-[600] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Enabled
                      </span>
                    ) : (
                      <span className="text-red-500 dark:text-red-400 font-[600] flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        Not enabled
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-enable-2fa"
                  onClick={() => setIs2FAModalOpen(true)}
                  className="px-4 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] dark:bg-[#818CF8] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-[13px] font-[600] shadow-sm transition-all cursor-pointer shrink-0"
                >
                  {is2FAEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div
          id="profile-password-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-slate-700 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
              <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                Change Password
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#1A1A1A] dark:text-[#94A3B8] dark:hover:text-white rounded-[7px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[12px] rounded-[7px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[13px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1]"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[13px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1]"
                  placeholder="Min 8 characters"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[13px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1]"
                  placeholder="Repeat new password"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[13px] font-[600] bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-[7px] shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA SETUP MODAL */}
      {is2FAModalOpen && (
        <div
          id="profile-2fa-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-slate-700 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
              <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                {is2FAEnabled ? 'Two-Factor Authentication Active' : 'Setup Two-Factor Authentication'}
              </h3>
              <button
                onClick={() => setIs2FAModalOpen(false)}
                className="p-1 text-[#64748B] hover:text-[#1A1A1A] dark:text-[#94A3B8] dark:hover:text-white rounded-[7px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-[13px] text-[#64748B] dark:text-[#94A3B8]">
              <p>
                Scan the QR code below with Google Authenticator, Authy, or 1Password to bind your identity.
              </p>

              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-[12px] flex flex-col items-center justify-center space-y-2 border border-slate-200 dark:border-slate-800">
                <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center shadow-inner font-mono text-[10px] text-slate-800 text-center">
                  [QR Code Placeholder: otpauth://totp/KobNeti:adeel@kobneti.com]
                </div>
                <div className="font-mono text-[11px] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Secret: <span className="font-bold">KOBN-7489-ET22-X90P</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIs2FAModalOpen(false)}
                className="px-3.5 py-1.5 text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setIs2FAEnabled(!is2FAEnabled);
                  setIs2FAModalOpen(false);
                  setSaveSuccessMsg(
                    is2FAEnabled ? '2FA has been disabled.' : '2FA activated successfully.'
                  );
                  setTimeout(() => setSaveSuccessMsg(null), 3000);
                }}
                className={`px-4 py-1.5 text-[13px] font-[600] rounded-[7px] text-white shadow-xs ${
                  is2FAEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-[#6366F1] hover:bg-[#4F46E5]'
                }`}
              >
                {is2FAEnabled ? 'Disable 2FA' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
