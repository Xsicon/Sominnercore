import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Video,
  CheckCircle2,
  AlertCircle,
  Flag,
  Sparkles,
  Search,
  Filter,
  X,
  Check,
  Circle,
  CalendarDays,
  Bell,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';

export type CalendarViewType = 'month' | 'week' | 'day';
export type EventCategory = 'Milestone' | 'Meeting' | 'Personal';

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: number; // Day of month in Nov 2025 (1 to 30)
  time: string;
  product?: string;
  location?: string;
  attendees?: string[];
  description?: string;
}

/**
 * Event Colors according to spec:
 * - Milestone = Tertiary (#B95F00)
 * - Meeting = Secondary (#3B82F6)
 * - Personal = Primary (#6366F1)
 */
export const EVENT_CATEGORY_STYLES: Record<
  EventCategory,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    badgeBg: string;
    badgeText: string;
    chipBg: string;
  }
> = {
  Milestone: {
    bg: 'bg-amber-50/90 dark:bg-amber-950/40',
    text: 'text-[#B95F00] dark:text-amber-400',
    border: 'border-amber-200/80 dark:border-amber-800/40',
    dot: 'bg-[#B95F00] dark:bg-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    badgeText: 'text-[#B95F00] dark:text-amber-400',
    chipBg: 'bg-[#B95F00] text-white',
  },
  Meeting: {
    bg: 'bg-blue-50/90 dark:bg-blue-950/40',
    text: 'text-[#3B82F6] dark:text-blue-400',
    border: 'border-blue-200/80 dark:border-blue-800/40',
    dot: 'bg-[#3B82F6] dark:bg-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
    badgeText: 'text-[#3B82F6] dark:text-blue-400',
    chipBg: 'bg-[#3B82F6] text-white',
  },
  Personal: {
    bg: 'bg-indigo-50/90 dark:bg-indigo-950/40',
    text: 'text-[#6366F1] dark:text-[#818CF8]',
    border: 'border-indigo-200/80 dark:border-indigo-800/40',
    dot: 'bg-[#6366F1] dark:bg-[#818CF8]',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    badgeText: 'text-[#6366F1] dark:text-[#818CF8]',
    chipBg: 'bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A]',
  },
};

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  // Explicit events from specification:
  {
    id: 'evt-nov-1',
    title: 'Sprint 23 Start',
    category: 'Personal', // Primary (#6366F1)
    date: 1,
    time: '09:00 AM',
    product: 'Cross-Platform',
    location: 'Jira / Sprint Board',
    attendees: ['Adeel D.', 'Leila H.', 'Mike C.'],
    description: 'Kickoff for Sprint 23 milestone deliverables and workload assignment.',
  },
  {
    id: 'evt-nov-3',
    title: 'API v2 Release',
    category: 'Milestone', // Tertiary (#B95F00)
    date: 3,
    time: '11:00 AM',
    product: 'GaarX',
    location: 'Production Gateway',
    attendees: ['Mike C.', 'Leila H.'],
    description: 'Version 2.0 API gateway deployment with zero-downtime routing.',
  },
  {
    id: 'evt-nov-15',
    title: 'Q4 Feature Release',
    category: 'Personal', // Primary (#6366F1) per prompt requirement
    date: 15,
    time: 'All Day',
    product: 'MuuqWear',
    location: 'Global Release CDN',
    attendees: ['Adeel D.', 'Sarah K.'],
    description: 'Multi-currency checkout, dynamic product tags, and responsive storefront push.',
  },
  {
    id: 'evt-nov-25',
    title: 'Mobile App Launch',
    category: 'Milestone', // Tertiary (#B95F00)
    date: 25,
    time: '02:00 PM',
    product: 'SomPay',
    location: 'App Store & Play Store',
    attendees: ['Ibrahim M.', 'Mike C.'],
    description: 'Official rollout of SomPay iOS and Android mobile applications.',
  },
  // Upcoming section events:
  {
    id: 'evt-today-1',
    title: 'Daily Standup',
    category: 'Meeting', // Secondary (#3B82F6)
    date: 14, // Today (Nov 14)
    time: '10:00 AM',
    product: 'Engineering',
    location: 'Google Meet (meet.google.com/kob-engi)',
    attendees: ['Adeel D.', 'Leila H.', 'Mike C.', 'Sarah K.'],
    description: '15-minute sync on blockers, in-flight PR reviews, and sprint status.',
  },
  {
    id: 'evt-today-2',
    title: 'Client Sync',
    category: 'Meeting', // Secondary (#3B82F6)
    date: 14, // Today (Nov 14)
    time: '11:30 AM',
    product: 'MuuqWear',
    location: 'Zoom Conference Room 3',
    attendees: ['Adeel D.', 'Sarah K.', 'Enterprise Partners'],
    description: 'Q4 roadmap alignment and payment processing migration review.',
  },
  {
    id: 'evt-week-1',
    title: 'Sprint Review',
    category: 'Meeting', // Secondary (#3B82F6)
    date: 16,
    time: '03:00 PM',
    product: 'Cross-Platform',
    location: 'Auditorium & Virtual',
    attendees: ['Full Engineering Team (14)'],
    description: 'Sprint 23 demo, milestone achievement verification, and retrospectives.',
  },
  {
    id: 'evt-week-2',
    title: 'Team Lunch',
    category: 'Personal', // Primary (#6366F1)
    date: 17,
    time: '12:30 PM',
    product: 'Company',
    location: 'Bistro 44 & Patio',
    attendees: ['All Department Leads'],
    description: 'Monthly team celebration and casual catchup.',
  },
];

interface CalendarViewProps {
  isNewEventModalOpen?: boolean;
  onOpenNewEventModal?: () => void;
  onCloseNewEventModal?: () => void;
  viewMode?: CalendarViewType;
  onViewModeChange?: (view: CalendarViewType) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  isNewEventModalOpen: externalNewEventOpen,
  onOpenNewEventModal: externalOpenNewEvent,
  onCloseNewEventModal: externalCloseNewEvent,
  viewMode: externalViewMode,
  onViewModeChange: externalSetViewMode,
}) => {
  const [internalViewMode, setInternalViewMode] = useState<CalendarViewType>('month');
  const activeViewMode = externalViewMode ?? internalViewMode;
  const setViewMode = externalSetViewMode ?? setInternalViewMode;

  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [selectedDay, setSelectedDay] = useState<number>(14); // Designated "Today" is Nov 14, 2025
  const [inspectedEvent, setInspectedEvent] = useState<CalendarEvent | null>(null);

  // Modal State
  const [internalNewEventOpen, setInternalNewEventOpen] = useState(false);
  const isNewEventOpen = externalNewEventOpen ?? internalNewEventOpen;
  const openNewEvent = externalOpenNewEvent ?? (() => setInternalNewEventOpen(true));
  const closeNewEvent = externalCloseNewEvent ?? (() => setInternalNewEventOpen(false));

  // Form State for + New Event
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EventCategory>('Personal');
  const [formDate, setFormDate] = useState<number>(14);
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formProduct, setFormProduct] = useState('Cross-Platform');
  const [formLocation, setFormLocation] = useState('Google Meet');
  const [formDescription, setFormDescription] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      date: Number(formDate) || 14,
      time: formTime.trim() || 'All Day',
      product: formProduct,
      location: formLocation.trim() || 'Virtual',
      attendees: ['Adeel D.'],
      description: formDescription.trim() || 'Scheduled from workspace calendar.',
    };

    setEvents((prev) => [...prev, newEvt]);
    showToast(`Added event "${newEvt.title}"`);
    setFormTitle('');
    setFormDescription('');
    closeNewEvent();
  };

  /**
   * Calendar Grid Configuration for November 2025
   * Grid starts on Monday (Mon Tue Wed Thu Fri Sat Sun)
   * Nov 1, 2025 was a Saturday.
   * So days Mon-Fri before Nov 1 belong to October (Oct 27, 28, 29, 30, 31 -> 5 days)
   * November has 30 days (1 to 30).
   * Nov 30, 2025 is Sunday. Total slots = 5 + 30 = 35 days (exactly 5 full weeks!).
   */
  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const prevMonthDays = [27, 28, 29, 30, 31]; // 5 days from Oct
  const currentMonthDays = Array.from({ length: 30 }, (_, i) => i + 1); // 1 to 30

  // Today events (Nov 14)
  const todayEvents = events.filter((e) => e.date === 14);

  // This Week events (Nov 15 - Nov 21)
  const thisWeekEvents = events.filter((e) => e.date === 16 || e.date === 17);

  // Milestones
  const milestoneEvents = events.filter((e) => e.title.includes('Release') || e.title.includes('Launch') || e.category === 'Milestone');

  return (
    <div
      id="calendar-page-root"
      className="w-full flex-1 flex flex-col space-y-6 pb-16"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="calendar-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#6366F1] dark:bg-[#818CF8] flex items-center justify-center text-white dark:text-[#0F172A] shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT — PAGE HEADER                                                */}
      {/* Left: "Calendar" (InterDisplay, 28px, 600 weight)                         */}
      {/* Subtext: "Schedules, milestones, and reminders." (Inter, 16px, 500)       */}
      {/* Right: Month/Week/Day toggle + "Today" ghost link + "+ New Event" (filled)*/}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <h1
            className="text-[28px] font-[600] tracking-[-0.015em] text-[#0F172A] dark:text-[#F8FAFC] leading-tight"
            style={{ fontFamily: 'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Calendar
          </h1>
          <p
            className="text-[16px] font-[500] text-[#64748B] dark:text-[#94A3B8] leading-normal"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Schedules, milestones, and reminders.
          </p>
        </div>

        {/* Right side: Month/Week/Day toggle + "Today" ghost link + "+ New Event" (Primary filled #6366F1 / #818CF8) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Month / Week / Day segmented toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-[7px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] text-xs font-semibold">
            {(['month', 'week', 'day'] as CalendarViewType[]).map((v) => (
              <button
                key={v}
                id={`calendar-view-toggle-${v}`}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1 rounded-[5px] capitalize transition-all cursor-pointer ${
                  activeViewMode === v
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs font-bold'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* "Today" ghost link */}
          <button
            id="btn-calendar-today-link"
            onClick={() => {
              setSelectedDay(14);
              showToast('Jumped to Today (Nov 14, 2025)');
            }}
            className="px-2.5 py-1.5 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer"
          >
            Today
          </button>

          {/* "+ New Event" (Primary filled #6366F1, dark: #818CF8 text-[#0F172A]) */}
          <button
            id="btn-page-new-event"
            onClick={openNewEvent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[7px] bg-[#6366F1] dark:bg-[#818CF8] hover:bg-[#4F46E5] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-xs font-semibold shadow-xs transition-colors cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ New Event</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EVENT COLORS LEGEND BAR                                                   */}
      {/* Milestone (Tertiary #B95F00), Meeting (Secondary #3B82F6), Personal (#6366F1) */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B95F00]" />
            <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">Milestone</span>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Tertiary (#B95F00)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
            <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">Meeting</span>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Secondary (#3B82F6)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] dark:bg-[#818CF8]" />
            <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">Personal</span>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Primary (#6366F1 / #818CF8)</span>
          </div>
        </div>

        <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
          <span>Active Period: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">November 2025</strong></span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH EXPANDED CALENDAR GRID                                         */}
      {/* ========================================================================= */}
      <div
        id="calendar-grid-column"
        className="w-full bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-xs overflow-hidden flex flex-col"
      >
        {/* Calendar Month & Navigation Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[7px] bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">November 2025</h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Q4 Product releases, sprint milestones & syncs</p>
            </div>
          </div>

          {/* Previous / Next Month Navigation */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] p-0.5 shadow-2xs">
            <button
              onClick={() => showToast('Viewing October 2025')}
              className="p-1.5 rounded-[5px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('Viewing December 2025')}
              className="p-1.5 rounded-[5px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header: Mon Tue Wed Thu Fri Sat Sun */}
        <div className="grid grid-cols-7 border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-center">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="py-2.5 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Month: November 2025 Day Cells Grid (Full Screen Expansion) */}
        <div className="grid grid-cols-7 auto-rows-fr bg-[#E2E8F0] dark:bg-slate-800 gap-px">
          {/* Trailing October Days (Oct 27, 28, 29, 30, 31) */}
          {prevMonthDays.map((d) => (
            <div
              key={`oct-${d}`}
              className="bg-slate-50/50 dark:bg-slate-900/40 min-h-[120px] p-2.5 flex flex-col justify-between text-slate-400 dark:text-slate-600 select-none"
            >
              <span className="text-xs font-medium">{d}</span>
            </div>
          ))}

          {/* Current Month: Nov 1 to Nov 30 */}
          {currentMonthDays.map((d) => {
            const isSelected = selectedDay === d;
            const isToday = d === 14;
            const dayEvents = events.filter((e) => e.date === d);

            return (
              <div
                key={`nov-${d}`}
                id={`calendar-cell-${d}`}
                onClick={() => setSelectedDay(d)}
                className={`bg-white dark:bg-[#1E293B] min-h-[120px] p-2.5 flex flex-col justify-between transition-colors cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/80 group ${
                  isSelected ? 'ring-2 ring-inset ring-[#6366F1] dark:ring-[#818CF8] bg-indigo-50/15 dark:bg-indigo-950/20' : ''
                }`}
              >
                {/* Top: Day Number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isToday
                        ? 'bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A] shadow-xs font-bold'
                        : isSelected
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 text-[#6366F1] dark:text-[#818CF8] font-bold'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#6366F1] dark:group-hover:text-[#818CF8]'
                    }`}
                  >
                    {d}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                      {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                    </span>
                  )}
                </div>

                {/* Events inside this cell */}
                <div className="space-y-1.5 mt-1.5 overflow-hidden">
                  {dayEvents.map((evt) => {
                    const color = EVENT_CATEGORY_STYLES[evt.category] || EVENT_CATEGORY_STYLES.Meeting;

                    return (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedEvent(evt);
                        }}
                        className={`px-2 py-1 rounded-[6px] text-[11px] font-semibold border truncate flex items-center gap-1.5 transition-all hover:scale-[1.02] shadow-2xs ${color.bg} ${color.text} ${color.border}`}
                        title={`${evt.title} (${evt.category} - ${evt.time})`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`} />
                        <span className="truncate">{evt.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3-COLUMN UPCOMING EVENTS & MILESTONES SUMMARY                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Today's Agenda */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">Today's Agenda</h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Active meetings & standups</p>
            </div>
            <span className="text-[11px] text-[#6366F1] dark:text-[#818CF8] font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-[5px] border border-indigo-100 dark:border-indigo-800">
              Nov 14
            </span>
          </div>

          <div className="space-y-2.5">
            {todayEvents.map((evt) => {
              const style = EVENT_CATEGORY_STYLES[evt.category];
              return (
                <div
                  key={evt.id}
                  onClick={() => setInspectedEvent(evt)}
                  className={`p-3 rounded-[8px] border transition-all cursor-pointer hover:border-indigo-300 shadow-2xs space-y-1 ${style.bg} ${style.border}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-[#64748B] dark:text-[#94A3B8]">
                      {evt.time}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.badgeBg} ${style.badgeText}`}>
                      {evt.category}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                    {evt.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: This Week's Agenda */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">This Week</h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Nov 15 – Nov 21</p>
            </div>
            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>

          <div className="space-y-2.5">
            {thisWeekEvents.map((evt) => {
              const style = EVENT_CATEGORY_STYLES[evt.category];
              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedDay(evt.date);
                    setInspectedEvent(evt);
                  }}
                  className="p-3 rounded-[8px] bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      Nov {evt.date}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.badgeBg} ${style.badgeText}`}>
                      {evt.category}
                    </span>
                  </div>
                  <div className="text-xs text-[#0F172A] dark:text-[#F8FAFC] font-medium">
                    {evt.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Key Milestones */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[12px] border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">Key Milestones</h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Major launches & deliverables</p>
            </div>
            <Flag className="w-4 h-4 text-[#B95F00]" />
          </div>

          <div className="space-y-2.5">
            <div
              onClick={() => {
                const evt = events.find((e) => e.id === 'evt-nov-15');
                if (evt) {
                  setSelectedDay(15);
                  setInspectedEvent(evt);
                }
              }}
              className="p-3 rounded-[8px] bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#6366F1] dark:text-[#818CF8]">Nov 15</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-[#6366F1] dark:text-[#818CF8]">
                  Primary
                </span>
              </div>
              <div className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                Q4 Feature Release
              </div>
            </div>

            <div
              onClick={() => {
                const evt = events.find((e) => e.id === 'evt-nov-25');
                if (evt) {
                  setSelectedDay(25);
                  setInspectedEvent(evt);
                }
              }}
              className="p-3 rounded-[8px] bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 hover:bg-amber-100/70 dark:hover:bg-amber-950/50 transition-colors cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#B95F00] dark:text-amber-400">Nov 25</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-[#B95F00] dark:text-amber-400">
                  Tertiary
                </span>
              </div>
              <div className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                Mobile App Launch
              </div>
            </div>

            {/* Quick add event trigger */}
            <button
              onClick={() => {
                setFormDate(selectedDay);
                openNewEvent();
              }}
              className="w-full py-2.5 rounded-[7px] border border-dashed border-[#CBD5E1] dark:border-slate-700 hover:border-[#6366F1] dark:hover:border-[#818CF8] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Event on Nov {selectedDay}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: SCHEDULE NEW EVENT (+ New Event)                                   */}
      {/* ========================================================================= */}
      {isNewEventOpen && (
        <div
          id="modal-new-event-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={closeNewEvent}
        >
          <div
            id="modal-new-event-container"
            className="bg-white dark:bg-[#1E293B] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-slate-700 p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC]">Schedule New Event</h3>
              </div>
              <button
                onClick={closeNewEvent}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Feature Release or Sprint Planning"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#6366F1] dark:focus:border-[#818CF8] focus:ring-1 focus:ring-[#818CF8] text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category (Color) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#6366F1] dark:focus:border-[#818CF8] text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none"
                  >
                    <option value="Milestone">Milestone (Tertiary #B95F00)</option>
                    <option value="Meeting">Meeting (Secondary #3B82F6)</option>
                    <option value="Personal">Personal (Primary #6366F1)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Day in November 2025 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formDate}
                    onChange={(e) => setFormDate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#6366F1] dark:focus:border-[#818CF8] text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time / Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#6366F1] dark:focus:border-[#818CF8] text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Product / Context
                  </label>
                  <select
                    value={formProduct}
                    onChange={(e) => setFormProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#6366F1] dark:focus:border-[#818CF8] text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none"
                  >
                    <option value="Cross-Platform">Cross-Platform</option>
                    <option value="MuuqWear">MuuqWear</option>
                    <option value="GaarX">GaarX</option>
                    <option value="Salguri">Salguri</option>
                    <option value="SomPay">SomPay</option>
                    <option value="Dhaxal">Dhaxal</option>
                    <option value="Ilays">Ilays</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Meeting Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google Meet or Conference Room"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#6366F1] dark:focus:border-[#818CF8] text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="Key deliverables, meeting agenda, or preparation notes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#6366F1] dark:focus:border-[#818CF8] text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeNewEvent}
                  className="px-4 py-2 rounded-[7px] border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-[#94A3B8] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[7px] bg-[#6366F1] dark:bg-[#818CF8] hover:bg-[#4F46E5] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-xs font-semibold shadow-xs transition-colors cursor-pointer active:scale-98"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EVENT INSPECTOR MODAL                                                     */}
      {/* ========================================================================= */}
      {inspectedEvent && (
        <div
          id="modal-event-details-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setInspectedEvent(null)}
        >
          <div
            id="modal-event-details-container"
            className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[7px] bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center font-bold text-xs">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${
                      EVENT_CATEGORY_STYLES[inspectedEvent.category]?.badgeBg
                    } ${EVENT_CATEGORY_STYLES[inspectedEvent.category]?.badgeText} ${
                      EVENT_CATEGORY_STYLES[inspectedEvent.category]?.border
                    }`}
                  >
                    {inspectedEvent.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">{inspectedEvent.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-[8px] border border-[#E2E8F0] dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                    Date & Time
                  </span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Nov {inspectedEvent.date}, 2025 · {inspectedEvent.time}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                    Product
                  </span>
                  <span className="font-bold text-[#6366F1] dark:text-[#818CF8]">
                    {inspectedEvent.product || 'Cross-Platform'}
                  </span>
                </div>
              </div>

              {inspectedEvent.location && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-[#94A3B8]">
                  <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{inspectedEvent.location}</span>
                </div>
              )}

              {inspectedEvent.description && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-[8px] border border-[#E2E8F0] dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {inspectedEvent.description}
                </div>
              )}

              {inspectedEvent.attendees && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Attendees
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectedEvent.attendees.map((att, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-[6px] text-slate-700 dark:text-slate-300 font-medium text-[11px]"
                      >
                        {att}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E2E8F0] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex items-center justify-end">
              <button
                onClick={() => setInspectedEvent(null)}
                className="px-4 py-1.5 rounded-[7px] bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A] text-xs font-semibold hover:bg-[#4F46E5] dark:hover:bg-[#A5B4FC] transition-colors cursor-pointer"
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
