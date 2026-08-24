import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Users,
  Globe,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Twitter,
  Github,
  Award,
} from 'lucide-react';

interface PublicAboutPageProps {
  onNavigate: (page: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact') => void;
  onOpenChat: () => void;
  darkMode?: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarColor: string;
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'david',
    name: 'David Chen',
    role: 'Chief Architect',
    bio: 'Former distributed systems lead with 14+ years designing high-throughput consensus networks and microservice meshes.',
    avatarColor: 'from-blue-600 to-indigo-800',
    initials: 'DC',
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    role: 'Head of Engineering',
    bio: 'Pioneered zero-downtime multi-region orchestration platforms. Passionate about developer velocity and automated telemetry.',
    avatarColor: 'from-purple-600 to-indigo-800',
    initials: 'SJ',
  },
  {
    id: 'alex',
    name: 'Alex Rivera',
    role: 'VP of Product',
    bio: 'Specializes in converting complex infrastructure requirements into intuitive, developer-first developer experiences and SDKs.',
    avatarColor: 'from-emerald-600 to-teal-800',
    initials: 'AR',
  },
  {
    id: 'elena',
    name: 'Elena Moss',
    role: 'Lead Designer',
    bio: 'Crafting minimalist, ergonomic interface systems that bring clarity to mission-critical operations workflows.',
    avatarColor: 'from-rose-600 to-amber-800',
    initials: 'EM',
  },
];

export const PublicAboutPage: React.FC<PublicAboutPageProps> = ({
  onNavigate,
  onOpenChat,
  darkMode,
}) => {
  const [teamCarouselIndex, setTeamCarouselIndex] = useState(0);

  const handlePrevTeam = () => {
    setTeamCarouselIndex((prev) => (prev === 0 ? TEAM_MEMBERS.length - 1 : prev - 1));
  };

  const handleNextTeam = () => {
    setTeamCarouselIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
  };

  return (
    <div className="w-full flex flex-col space-y-16 sm:space-y-24 py-8 sm:py-14">
      {/* ========================================================================= */}
      {/* TITLE SECTION                                                             */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          Our Story
        </h1>
        <p className="text-base sm:text-lg text-[#334155] dark:text-[#CBD5E1] leading-relaxed max-w-2xl mx-auto font-normal">
          Building the foundation for next-generation technical operations with a focus on reliability, innovation, and seamless integration.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* "A VISION REALIZED" HERO SECTION                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Narrative Card (As in Image 4) */}
          <div className="lg:col-span-6 p-8 sm:p-12 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              A vision realized.
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-normal">
              <p>
                Founded on the principle that complex systems need not be complicated to manage, KobNeti emerged from a collective desire to streamline operations. We saw a landscape cluttered with disparate tools and sought to build a cohesive, unified platform.
              </p>
              <p>
                Our journey began in a small data center, where the real-world challenges of scaling infrastructure became our proving ground. Through iterative design and a relentless focus on the end-user experience, we developed the architecture that powers our solutions today.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8]">
                KobNeti Engineering Group
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Established 2021</span>
            </div>
          </div>

          {/* Right Visual Panel with Data Center Photography Style */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-slate-800 aspect-4/3 bg-slate-950 shadow-xl flex items-center justify-center">
            {/* Ambient Lighting & Server Racks Representation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-indigo-950 to-blue-950 flex items-center justify-center p-6">
              <div className="w-full h-full border border-indigo-500/20 rounded-2xl p-4 flex flex-col justify-between relative">
                <div className="flex justify-between items-center text-[10px] font-mono text-indigo-300">
                  <span>DC-01 PRIMARY HYPERVISOR</span>
                  <span className="text-emerald-400">● 100% OPERATIONAL</span>
                </div>

                <div className="space-y-2 py-4">
                  <div className="text-lg font-bold text-white tracking-wider">
                    KOBNETI CORE FACILITY
                  </div>
                  <p className="text-xs text-slate-300 max-w-xs">
                    Redundant fiber uplinks, N+2 power distribution, biometric airlock containment.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] text-slate-300 font-mono">
                    Telemetry Ingest: 420,000 evt/s
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Live Chat Trigger Indicator on image (as in Image 4) */}
            <button
              onClick={onOpenChat}
              className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform"
              title="Speak with our team"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CORE VALUES SECTION                                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="text-center space-y-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Core Values
          </h3>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
            The principles that guide our architecture and our team.
          </p>
        </div>

        {/* 4 Stat Cards (As in Image 4) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center mx-auto">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              99.9%
            </div>
            <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
              UPTIME
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center mx-auto">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              Tier 4
            </div>
            <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
              SECURITY
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center mx-auto">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              50k+
            </div>
            <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
              ACTIVE USERS
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center mx-auto">
              <Globe className="w-4 h-4" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              12
            </div>
            <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
              GLOBAL REGIONS
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* "MEET THE TEAM" SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="text-center space-y-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Meet the Team
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The architects behind the platform.
          </p>
        </div>

        {/* 4 Team Member Cards with Circular Portraits (As in Image 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center space-y-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
            >
              {/* Circular Avatar Ring (As in Image 4) */}
              <div className="relative">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-tr ${member.avatarColor} p-1 shadow-lg ring-4 ring-indigo-500/20 flex items-center justify-center text-white text-2xl font-bold`}
                >
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <span>{member.initials}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-[#4338CA] dark:text-[#818CF8]">
                  {member.role}
                </p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                {member.bio}
              </p>

              <div className="flex items-center gap-3 text-slate-400">
                <a href="#linkedin" onClick={(e) => e.preventDefault()} className="hover:text-[#4338CA]">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a href="#twitter" onClick={(e) => e.preventDefault()} className="hover:text-[#4338CA]">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a href="#github" onClick={(e) => e.preventDefault()} className="hover:text-[#4338CA]">
                  <Github className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
