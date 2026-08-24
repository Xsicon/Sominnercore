import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Palette,
  StickyNote,
  Bell,
  Command,
  Boxes,
  Check,
  CheckCircle2,
  Edit2,
  Trash2,
  Pin,
  X,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import {
  STICKY_NOTE_COLORS,
  getStickyNoteColor,
  getSavedStickyColorHex,
  saveStickyColorHex,
} from '../utils/stickyNoteTheme';

interface SettingsViewProps {
  darkMode?: boolean;
  onThemeChange?: (themeOrDark: any) => void;
  currentTheme?: 'light' | 'dark' | 'system';
  onNavigate?: (navId: string, title: string) => void;
  onOpenLiveChat?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode = false,
  onThemeChange,
  currentTheme,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'general' | 'appearance' | 'sticky-notes' | 'notifications' | 'shortcuts' | 'integrations'
  >('general');

  // General Settings
  const [language, setLanguage] = useState('English (United States)');
  const [timeZone, setTimeZone] = useState('EAT (UTC+3)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  // Appearance Settings
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    if (currentTheme) return currentTheme;
    return darkMode ? 'dark' : 'light';
  });
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarDensity, setSidebarDensity] = useState('Default');

  // Sticky Note Color Settings
  const [selectedStickyHex, setSelectedStickyHex] = useState<string>(() =>
    getSavedStickyColorHex()
  );
  const selectedStickyConfig = getStickyNoteColor(selectedStickyHex);
  const [stickyNotePinned, setStickyNotePinned] = useState(false);

  // Notification Settings
  const [emailDigestFreq, setEmailDigestFreq] = useState('Daily');
  const [emailDigestTime, setEmailDigestTime] = useState('9:00 AM');
  const [emailIncludeWeekends, setEmailIncludeWeekends] = useState(false);
  const [showPreviewText, setShowPreviewText] = useState(true);
  const [playSoundNotification, setPlaySoundNotification] = useState(false);
  const [autoMarkRead, setAutoMarkRead] = useState(true);

  // Integrations Settings
  const [integrationsState, setIntegrationsState] = useState({
    github: true,
    googleCalendar: true,
    slack: false,
  });

  // Save Success Flash
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync theme when props change
  useEffect(() => {
    if (currentTheme) {
      setThemeMode(currentTheme);
    } else {
      setThemeMode(darkMode ? 'dark' : 'light');
    }
  }, [darkMode, currentTheme]);

  const handleSelectStickyColor = (hex: string) => {
    setSelectedStickyHex(hex);
    saveStickyColorHex(hex);
  };

  const handleThemeRadioChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    if (onThemeChange) {
      if (mode === 'dark') {
        onThemeChange(true);
      } else if (mode === 'light') {
        onThemeChange(false);
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        onThemeChange(prefersDark);
      }
    }
  };

  const handleSaveCategory = (categoryName: string) => {
    setSaveSuccessMsg(`${categoryName} preferences saved.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const toggleIntegration = (key: keyof typeof integrationsState) => {
    setIntegrationsState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaveSuccessMsg('Integration status updated.');
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const navCategories = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'sticky-notes', label: 'Sticky Notes', icon: StickyNote },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Command },
    { id: 'integrations', label: 'Integrations', icon: Boxes },
  ] as const;

  return (
    <div
      id="settings-page-container"
      className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150"
    >
      {/* Toast Flash Notification */}
      {saveSuccessMsg && (
        <div
          id="settings-save-toast"
          className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-[#10B981] text-white px-4 py-2.5 rounded-[10px] shadow-lg text-[13px] font-[500] animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
        <h1 className="text-[28px] font-[600] tracking-tight font-display text-[#1A1A1A] dark:text-[#F8FAFC]">
          Settings
        </h1>
        <p className="text-[15px] font-[500] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
          Customize your workspace preferences.
        </p>
      </div>

      {/* TWO-COLUMN LAYOUT (Left 25% / Right 75%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN (25% -> lg:col-span-3) — Navigation                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 space-y-1 lg:sticky lg:top-4">
          <div className="rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] bg-white dark:bg-[#1E293B] p-2 shadow-xs space-y-0.5">
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`settings-nav-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-[13px] font-[500] transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-[#6366F1] dark:text-[#818CF8] font-[600]'
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F8FAFC] hover:bg-[#F8F9FA] dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-[#6366F1] dark:text-[#818CF8]'
                        : 'text-[#64748B] dark:text-[#94A3B8]'
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (75% -> lg:col-span-9) — Content                             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-9 space-y-6">
          {/* ========================================================================= */}
          {/* CATEGORY 1: GENERAL                                                       */}
          {/* ========================================================================= */}
          {activeCategory === 'general' && (
            <div
              id="settings-content-general"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-xs animate-in fade-in duration-150"
            >
              <div>
                <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  General
                </h3>
                <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  Configure language, timezone, and localized date formats.
                </p>
              </div>

              <div className="space-y-4">
                {/* Language */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                    Language
                  </label>
                  <select
                    id="settings-select-language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-colors cursor-pointer"
                  >
                    <option value="English (United States)">English (United States) ▼</option>
                    <option value="Somali (Af Soomaali)">Somali (Af Soomaali) ▼</option>
                    <option value="Arabic (العربية)">Arabic (العربية) ▼</option>
                    <option value="French (Français)">French (Français) ▼</option>
                  </select>
                </div>

                {/* Time Zone */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                    Time Zone
                  </label>
                  <select
                    id="settings-select-timezone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-colors cursor-pointer"
                  >
                    <option value="EAT (UTC+3)">EAT (UTC+3) ▼</option>
                    <option value="UTC (UTC+0)">UTC (UTC+0) ▼</option>
                    <option value="EST (UTC-5)">EST (UTC-5) ▼</option>
                    <option value="PST (UTC-8)">PST (UTC-8) ▼</option>
                    <option value="CET (UTC+1)">CET (UTC+1) ▼</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                    Date Format
                  </label>
                  <select
                    id="settings-select-dateformat"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-colors cursor-pointer"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY ▼</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY ▼</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD ▼</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  id="btn-save-general-settings"
                  onClick={() => handleSaveCategory('General')}
                  className="px-5 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] dark:bg-[#818CF8] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-[13px] font-[600] shadow-xs transition-all duration-150 cursor-pointer active:scale-98"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 2: APPEARANCE & DARK MODE                                        */}
          {/* ========================================================================= */}
          {activeCategory === 'appearance' && (
            <div
              id="settings-content-appearance"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-xs animate-in fade-in duration-150"
            >
              <div>
                <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Appearance & Dark Mode
                </h3>
                <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  Control color scheme modes, dark aesthetic palettes, and structural layout density.
                </p>
              </div>

              {/* Theme: Light | Dark | System (Radio buttons) */}
              <div className="space-y-2">
                <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                  Theme
                </label>
                <div className="flex items-center gap-6 p-3 rounded-[9px] bg-[#F8F9FA] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Laptop },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isChecked = themeMode === item.id;
                    return (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC] cursor-pointer select-none"
                      >
                        <input
                          type="radio"
                          name="settings-theme-mode"
                          value={item.id}
                          checked={isChecked}
                          onChange={() => handleThemeRadioChange(item.id as any)}
                          className="text-[#6366F1] dark:text-[#818CF8] focus:ring-[#6366F1] cursor-pointer"
                        />
                        <Icon className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Dark Mode Preview Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-[600] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Dark Mode Preview
                  </span>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Attio Dark Aesthetic
                  </span>
                </div>

                {/* Container: #0F172A */}
                <div
                  style={{ backgroundColor: '#0F172A' }}
                  className="p-5 rounded-[12px] border border-slate-700/80 shadow-md space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" />
                      <span className="text-[13px] font-[600] text-[#F8FAFC] font-display">
                        Dark Theme Architecture
                      </span>
                    </div>
                    <span
                      style={{
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        borderColor: 'rgba(99, 102, 241, 0.35)',
                        color: '#818CF8',
                      }}
                      className="text-[11px] font-[500] px-2 py-0.5 rounded-[12px] border"
                    >
                      #0F172A Page Background
                    </span>
                  </div>

                  {/* Card: #1E293B with violet-glow border */}
                  <div
                    style={{
                      backgroundColor: '#1E293B',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                    }}
                    className="p-4 rounded-[10px] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-[600] text-[#F8FAFC]">
                        #1E293B Card Background
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">1px violet-glow</span>
                    </div>
                    <p className="text-[13px] text-[#94A3B8] leading-relaxed">
                      Primary text is #F8FAFC and muted text is #94A3B8. Buttons feature #818CF8 periwinkle accent.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        style={{
                          backgroundColor: '#818CF8',
                          color: '#0F172A',
                        }}
                        className="px-3 py-1.5 rounded-[7px] text-[12px] font-[600] shadow-xs cursor-default"
                      >
                        Primary Button (#818CF8)
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-[7px] text-[12px] font-[500] text-[#94A3B8] hover:text-[#F8FAFC] cursor-default transition-colors"
                      >
                        Ghost Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Mode Toggle */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#F8F9FA] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                  <div>
                    <div className="text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC]">
                      Compact Mode
                    </div>
                    <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                      Toggle dense layout padding across table rows
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompactMode(!compactMode)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-150 cursor-pointer ${
                      compactMode ? 'bg-[#6366F1] dark:bg-[#818CF8]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white dark:bg-[#0F172A] w-4 h-4 rounded-full shadow-xs transform transition-transform duration-150 ${
                        compactMode ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Sidebar Density */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                    Sidebar Density
                  </label>
                  <select
                    id="settings-select-sidebar-density"
                    value={sidebarDensity}
                    onChange={(e) => setSidebarDensity(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-colors cursor-pointer"
                  >
                    <option value="Default">Default ▼</option>
                    <option value="Comfortable">Comfortable ▼</option>
                    <option value="Compact">Compact ▼</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  id="btn-save-appearance-settings"
                  onClick={() => handleSaveCategory('Appearance')}
                  className="px-5 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] dark:bg-[#818CF8] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-[13px] font-[600] shadow-xs transition-all duration-150 cursor-pointer active:scale-98"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 3: STICKY NOTES (Docket Style Exact Match)                       */}
          {/* ========================================================================= */}
          {activeCategory === 'sticky-notes' && (
            <div
              id="settings-content-sticky-notes"
              className="rounded-[16px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-xs animate-in fade-in duration-150"
            >
              <div>
                <h3 className="text-[20px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Sticky Notes
                </h3>
                <p className="text-[14px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  Customize your Docket sticky note theme, high-contrast palette, and default layout.
                </p>
              </div>

              {/* Color Swatches Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-[600] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Color Palette (High-Contrast Docket Tones)
                  </span>
                  <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                    Selected:{' '}
                    <strong className="text-[#1A1A1A] dark:text-[#F8FAFC]">
                      {selectedStickyConfig.name}
                    </strong>{' '}
                    ({selectedStickyConfig.hex})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STICKY_NOTE_COLORS.map((color) => {
                    const isSelected =
                      selectedStickyHex.toLowerCase() === color.hex.toLowerCase();
                    return (
                      <button
                        key={color.id}
                        id={`sticky-swatch-${color.id}`}
                        type="button"
                        onClick={() => handleSelectStickyColor(color.hex)}
                        style={{
                          backgroundColor: color.hex,
                          borderColor: isSelected ? '#18181B' : color.borderHex,
                        }}
                        className={`p-3.5 rounded-[16px] text-left transition-all duration-150 cursor-pointer relative shadow-sm ${
                          isSelected
                            ? 'ring-3 ring-[#18181B] dark:ring-[#818CF8] ring-offset-2 dark:ring-offset-[#1E293B] scale-[1.02]'
                            : 'hover:scale-[1.02] border border-black/5 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            style={{ color: color.textHex }}
                            className="text-[13px] font-[600] truncate"
                          >
                            {color.name}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span
                          style={{ color: color.subtextHex }}
                          className="text-[11px] font-mono block mt-1 font-semibold"
                        >
                          {color.hex}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exact Docket Sticky Notes Gallery from Reference */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                      Docket Notes Gallery
                    </h4>
                    <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                      Click any card to select its color as your active workspace default.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    6 Docket Notes
                  </span>
                </div>

                {/* 6 Grid Cards Matching Reference Image Exactly */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Card 1: Apricot Orange (This is Docket note.|) */}
                  <div
                    onClick={() => handleSelectStickyColor('#F29D68')}
                    style={{ backgroundColor: '#F29D68' }}
                    className={`aspect-square p-7 rounded-[28px] shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-150 relative select-none group ${
                      selectedStickyHex.toLowerCase() === '#F29D68'.toLowerCase()
                        ? 'ring-4 ring-offset-2 ring-[#18181B] dark:ring-[#818CF8] dark:ring-offset-[#1E293B]'
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="text-[18px] sm:text-[19px] font-[500] text-[#1E1B18] leading-snug tracking-tight font-sans">
                      This is Docket note.
                      <span className="inline-block w-[2px] h-[20px] bg-[#1E1B18] ml-0.5 align-middle animate-pulse font-normal">
                        |
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[11px] font-[500] text-[#1E1B18]/40 group-hover:text-[#1E1B18]/70 transition-colors">
                        #F29D68
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Amber Yellow (The beginning of screenless design...) */}
                  <div
                    onClick={() => handleSelectStickyColor('#F8CF66')}
                    style={{ backgroundColor: '#F8CF66' }}
                    className={`aspect-square p-7 rounded-[28px] shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-150 relative select-none group ${
                      selectedStickyHex.toLowerCase() === '#F8CF66'.toLowerCase()
                        ? 'ring-4 ring-offset-2 ring-[#18181B] dark:ring-[#818CF8] dark:ring-offset-[#1E293B]'
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="text-[17px] sm:text-[18px] font-[500] text-[#1E1B18] leading-snug tracking-tight font-sans">
                      The beginning of screenless design: UI jobs to be taken over by Solution Architect
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-[14px] font-[500] text-[#1E1B18]/90">
                        May 21, 2020
                      </span>
                      <div className="w-10 h-10 rounded-full bg-[#18181B] text-white flex items-center justify-center shadow-md shrink-0">
                        <Edit2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Peach Salmon (13 Things You Should Give Up...) */}
                  <div
                    onClick={() => handleSelectStickyColor('#ED9566')}
                    style={{ backgroundColor: '#ED9566' }}
                    className={`aspect-square p-7 rounded-[28px] shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-150 relative select-none group ${
                      selectedStickyHex.toLowerCase() === '#ED9566'.toLowerCase()
                        ? 'ring-4 ring-offset-2 ring-[#18181B] dark:ring-[#818CF8] dark:ring-offset-[#1E293B]'
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="text-[17px] sm:text-[18px] font-[500] text-[#1E1B18] leading-snug tracking-tight font-sans">
                      13 Things You Should Give Up If You Want To Be a Successful UX Desi
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-[14px] font-[500] text-[#1E1B18]/90">
                        May 25, 2020
                      </span>
                      <span className="text-[11px] font-[500] text-[#1E1B18]/40 group-hover:text-[#1E1B18]/70 transition-colors">
                        #ED9566
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Lavender Purple (10 UI & UX Lessons...) */}
                  <div
                    onClick={() => handleSelectStickyColor('#9D80F5')}
                    style={{ backgroundColor: '#9D80F5' }}
                    className={`aspect-square p-7 rounded-[28px] shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-150 relative select-none group ${
                      selectedStickyHex.toLowerCase() === '#9D80F5'.toLowerCase()
                        ? 'ring-4 ring-offset-2 ring-[#18181B] dark:ring-[#818CF8] dark:ring-offset-[#1E293B]'
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-[17px] sm:text-[18px] font-[500] text-[#181424] leading-snug tracking-tight font-sans">
                        10 UI & UX Lessons from Designing My Own Product
                      </div>
                      <div className="w-9 h-9 rounded-full bg-[#18181B] text-amber-400 flex items-center justify-center shadow-md shrink-0">
                        <span className="text-sm">★</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[11px] font-[500] text-[#181424]/40 group-hover:text-[#181424]/70 transition-colors">
                        #9D80F5
                      </span>
                    </div>
                  </div>

                  {/* Card 5: Chartreuse Lime (52 Research Terms...) */}
                  <div
                    onClick={() => handleSelectStickyColor('#D2EA7B')}
                    style={{ backgroundColor: '#D2EA7B' }}
                    className={`aspect-square p-7 rounded-[28px] shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-150 relative select-none group ${
                      selectedStickyHex.toLowerCase() === '#D2EA7B'.toLowerCase()
                        ? 'ring-4 ring-offset-2 ring-[#18181B] dark:ring-[#818CF8] dark:ring-offset-[#1E293B]'
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="text-[17px] sm:text-[18px] font-[500] text-[#1A210F] leading-snug tracking-tight font-sans">
                      52 Research Terms you need to know as a UX Designer
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[11px] font-[500] text-[#1A210F]/40 group-hover:text-[#1A210F]/70 transition-colors">
                        #D2EA7B
                      </span>
                    </div>
                  </div>

                  {/* Card 6: Sky Cyan (Text fields & Forms design...) */}
                  <div
                    onClick={() => handleSelectStickyColor('#56CCF2')}
                    style={{ backgroundColor: '#56CCF2' }}
                    className={`aspect-square p-7 rounded-[28px] shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-150 relative select-none group ${
                      selectedStickyHex.toLowerCase() === '#56CCF2'.toLowerCase()
                        ? 'ring-4 ring-offset-2 ring-[#18181B] dark:ring-[#818CF8] dark:ring-offset-[#1E293B]'
                        : 'hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="text-[17px] sm:text-[18px] font-[500] text-[#0C2738] leading-snug tracking-tight font-sans">
                      Text fields & Forms design — UI compo series
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[11px] font-[500] text-[#0C2738]/40 group-hover:text-[#0C2738]/70 transition-colors">
                        #56CCF2
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] italic pt-2">
                  * Sticky notes maintain high-saturation pastel backgrounds with dark, high-contrast typography across both light and dark themes for maximum readability.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  id="btn-save-sticky-notes-settings"
                  onClick={() => handleSaveCategory('Sticky Notes')}
                  className="px-5 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] dark:bg-[#818CF8] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-[13px] font-[600] shadow-xs transition-all duration-150 cursor-pointer active:scale-98"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 4: NOTIFICATIONS                                                 */}
          {/* ========================================================================= */}
          {activeCategory === 'notifications' && (
            <div
              id="settings-content-notifications"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-xs animate-in fade-in duration-150"
            >
              <div>
                <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Notifications
                </h3>
                <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  Configure email summaries and in-app banner behavior.
                </p>
              </div>

              {/* Email Digest */}
              <div className="space-y-3 pb-5 border-b border-[#E2E8F0] dark:border-slate-800">
                <div className="text-[12px] font-[600] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Email Digest
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Frequency
                    </label>
                    <select
                      value={emailDigestFreq}
                      onChange={(e) => setEmailDigestFreq(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer"
                    >
                      <option value="Daily">Daily ▼</option>
                      <option value="Weekly">Weekly ▼</option>
                      <option value="Real-time">Real-time ▼</option>
                      <option value="Off">Off ▼</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                      Time
                    </label>
                    <select
                      value={emailDigestTime}
                      onChange={(e) => setEmailDigestTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-[7px] text-[14px] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer"
                    >
                      <option value="9:00 AM">9:00 AM ▼</option>
                      <option value="12:00 PM">12:00 PM ▼</option>
                      <option value="6:00 PM">6:00 PM ▼</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#F8F9FA] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] mt-2">
                  <div>
                    <div className="text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC]">
                      Include weekends
                    </div>
                    <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                      Send digest summaries on Saturday and Sunday
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailIncludeWeekends(!emailIncludeWeekends)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-150 cursor-pointer ${
                      emailIncludeWeekends ? 'bg-[#6366F1] dark:bg-[#818CF8]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white dark:bg-[#0F172A] w-4 h-4 rounded-full shadow-xs transform transition-transform duration-150 ${
                        emailIncludeWeekends ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="space-y-3">
                <div className="text-[12px] font-[600] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  In-App Notifications
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#F8F9FA] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                    <div>
                      <div className="text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC]">
                        Show preview text in notification
                      </div>
                      <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                        Display message snippet in toast banner
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreviewText(!showPreviewText)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-150 cursor-pointer ${
                        showPreviewText ? 'bg-[#6366F1] dark:bg-[#818CF8]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white dark:bg-[#0F172A] w-4 h-4 rounded-full shadow-xs transform transition-transform duration-150 ${
                          showPreviewText ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#F8F9FA] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                    <div>
                      <div className="text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC]">
                        Play sound on notification
                      </div>
                      <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                        Play chime audio when new alert arrives
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlaySoundNotification(!playSoundNotification)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-150 cursor-pointer ${
                        playSoundNotification ? 'bg-[#6366F1] dark:bg-[#818CF8]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white dark:bg-[#0F172A] w-4 h-4 rounded-full shadow-xs transform transition-transform duration-150 ${
                          playSoundNotification ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#F8F9FA] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                    <div>
                      <div className="text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC]">
                        Auto-mark as read after click
                      </div>
                      <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                        Clear unread indicator immediately upon opening item
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoMarkRead(!autoMarkRead)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-150 cursor-pointer ${
                        autoMarkRead ? 'bg-[#6366F1] dark:bg-[#818CF8]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white dark:bg-[#0F172A] w-4 h-4 rounded-full shadow-xs transform transition-transform duration-150 ${
                          autoMarkRead ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  id="btn-save-notifications-settings"
                  onClick={() => handleSaveCategory('Notifications')}
                  className="px-5 py-2 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] dark:bg-[#818CF8] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-[13px] font-[600] shadow-xs transition-all duration-150 cursor-pointer active:scale-98"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 5: KEYBOARD SHORTCUTS                                            */}
          {/* ========================================================================= */}
          {activeCategory === 'shortcuts' && (
            <div
              id="settings-content-shortcuts"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-xs animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    Navigate and trigger operations quickly with hotkeys.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSaveSuccessMsg('Custom key binding editor ready.');
                    setTimeout(() => setSaveSuccessMsg(null), 2500);
                  }}
                  className="text-[13px] font-[500] text-[#94A3B8] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] hover:underline cursor-pointer transition-colors"
                >
                  Edit Shortcuts
                </button>
              </div>

              {/* Global Shortcuts Table */}
              <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-[10px] divide-y divide-[#E2E8F0] dark:divide-slate-800 text-[13px]">
                {[
                  { keys: ['⌘', 'K'], action: 'Open search' },
                  { keys: ['⌘', '1'], action: 'Dashboard' },
                  { keys: ['⌘', '2'], action: 'Tickets' },
                  { keys: ['⌘', '3'], action: 'Live Chat' },
                  { keys: ['⌘', ','], action: 'Settings' },
                  { keys: ['⌘', '/'], action: 'Help Center' },
                ].map((sc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between hover:bg-[#F8F9FA] dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <span className="text-[#1A1A1A] dark:text-[#F8FAFC] font-[500]">
                      {sc.action}
                    </span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 rounded-[5px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono text-[12px] font-[600] shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORY 6: INTEGRATIONS                                                  */}
          {/* ========================================================================= */}
          {activeCategory === 'integrations' && (
            <div
              id="settings-content-integrations"
              className="rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] bg-white dark:bg-[#1E293B] p-6 space-y-6 shadow-xs animate-in fade-in duration-150"
            >
              <div>
                <h3 className="text-[17px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Integrations
                </h3>
                <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  Manage third-party tool links and OAuth synchronizations.
                </p>
              </div>

              <div className="space-y-3">
                {/* GitHub: Connected (Adeel D.) — [Disconnect] ghost */}
                <div className="p-4 rounded-[10px] border border-[#E2E8F0] dark:border-slate-800 bg-[#F8F9FA]/60 dark:bg-[#0F172A]/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      GH
                    </div>
                    <div>
                      <div className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                        GitHub
                      </div>
                      <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                        {integrationsState.github ? 'Connected (Adeel D.)' : 'Not Connected'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleIntegration('github')}
                    className={`px-3.5 py-1.5 rounded-[7px] text-[12px] font-[500] transition-colors cursor-pointer ${
                      integrationsState.github
                        ? 'border border-slate-300 dark:border-slate-700 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'bg-[#6366F1] dark:bg-[#818CF8] dark:text-[#0F172A] text-white hover:bg-[#4F46E5]'
                    }`}
                  >
                    {integrationsState.github ? 'Disconnect' : 'Connect'}
                  </button>
                </div>

                {/* Google Calendar: Connected (Adeel D.) — [Disconnect] ghost */}
                <div className="p-4 rounded-[10px] border border-[#E2E8F0] dark:border-slate-800 bg-[#F8F9FA]/60 dark:bg-[#0F172A]/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      GC
                    </div>
                    <div>
                      <div className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                        Google Calendar
                      </div>
                      <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                        {integrationsState.googleCalendar
                          ? 'Connected (Adeel D.)'
                          : 'Not Connected'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleIntegration('googleCalendar')}
                    className={`px-3.5 py-1.5 rounded-[7px] text-[12px] font-[500] transition-colors cursor-pointer ${
                      integrationsState.googleCalendar
                        ? 'border border-slate-300 dark:border-slate-700 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'bg-[#6366F1] dark:bg-[#818CF8] dark:text-[#0F172A] text-white hover:bg-[#4F46E5]'
                    }`}
                  >
                    {integrationsState.googleCalendar ? 'Disconnect' : 'Connect'}
                  </button>
                </div>

                {/* Slack: Not Connected — [Connect] Primary */}
                <div className="p-4 rounded-[10px] border border-[#E2E8F0] dark:border-slate-800 bg-[#F8F9FA]/60 dark:bg-[#0F172A]/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      SL
                    </div>
                    <div>
                      <div className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                        Slack
                      </div>
                      <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                        {integrationsState.slack ? 'Connected (Adeel D.)' : 'Not Connected'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleIntegration('slack')}
                    className={`px-3.5 py-1.5 rounded-[7px] text-[12px] font-[600] transition-colors cursor-pointer ${
                      integrationsState.slack
                        ? 'border border-slate-300 dark:border-slate-700 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A] hover:bg-[#4F46E5] dark:hover:bg-[#A5B4FC] shadow-xs'
                    }`}
                  >
                    {integrationsState.slack ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
