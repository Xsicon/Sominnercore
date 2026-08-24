import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Server,
  Network,
  Activity,
  Layers,
  Sparkles,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';

interface PublicPortfolioPageProps {
  onNavigate: (page: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact') => void;
  onOpenGetStarted: () => void;
  darkMode?: boolean;
}

interface PortfolioItem {
  id: string;
  title: string;
  badge: string;
  badgeType: 'efficiency' | 'downtime' | 'sla' | 'speed';
  description: string;
  industry: string;
  clientScale: string;
  results: string[];
  visualType: 'datacenter' | 'network' | 'dashboard' | 'fiber';
}

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'data-pipeline',
    title: 'Global Data Pipeline Restructure',
    badge: '+40% Efficiency',
    badgeType: 'efficiency',
    description:
      'Engineered a high-throughput, fault-tolerant data ingestion pipeline that reduced processing latency significantly for a leading fintech enterprise.',
    industry: 'Financial Technology',
    clientScale: '18M Active Ledgers',
    results: [
      'Ingestion latency reduced from 4.2s to 180ms',
      '99.999% message delivery guarantee under spike loads',
      'Saved $1.4M annually in cloud computing compute costs',
    ],
    visualType: 'datacenter',
  },
  {
    id: 'cloud-migration',
    title: 'Enterprise Cloud Migration',
    badge: 'Zero Downtime',
    badgeType: 'downtime',
    description:
      'Orchestrated a seamless transition of legacy on-premise systems to a modern cloud infrastructure, ensuring continuous operational uptime.',
    industry: 'Enterprise SaaS & Commerce',
    clientScale: '450+ Microservices',
    results: [
      'Zero user-facing downtime during multi-region cutover',
      'Auto-scaling latency lowered by 85%',
      'SOC 2 Type II compliance achieved on Day 1',
    ],
    visualType: 'network',
  },
  {
    id: 'automated-ops',
    title: 'Automated Ops Oversight',
    badge: '99.99% SLA',
    badgeType: 'sla',
    description:
      'Implemented intelligent monitoring and automated remediation protocols to drastically reduce manual intervention and maintain high availability.',
    industry: 'Healthcare & Critical Infrastructure',
    clientScale: '2,400 Nodes Monitored',
    results: [
      '78% of transient outages resolved autonomously',
      'Mean time to detection (MTTD) dropped to under 12 seconds',
      'Team pager fatigue reduced by 64%',
    ],
    visualType: 'dashboard',
  },
  {
    id: 'network-optimization',
    title: 'Core Network Optimization',
    badge: '10x Speed Boost',
    badgeType: 'speed',
    description:
      'Redesigned the core network topology for a major telecom provider, significantly increasing throughput and reducing structural bottlenecks.',
    industry: 'Telecommunications & Edge Transit',
    clientScale: '40Gbps Transit Traffic',
    results: [
      '10x bandwidth throughput increase with BGP route optimization',
      'Cross-region packet loss reduced to < 0.001%',
      'Optimized edge CDN hit ratio to 94.8%',
    ],
    visualType: 'fiber',
  },
];

export const PublicPortfolioPage: React.FC<PublicPortfolioPageProps> = ({
  onNavigate,
  onOpenGetStarted,
  darkMode,
}) => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<PortfolioItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? PORTFOLIO_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % PORTFOLIO_DATA.length);
  };

  return (
    <div className="w-full flex flex-col space-y-14 sm:space-y-20 py-8 sm:py-14">
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          Our Portfolio
        </h1>

        <p className="text-base sm:text-lg text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-normal">
          Discover how we engineer robust architectures and deliver scalable operations for industry leaders. A showcase of precision and innovation.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* CONTROLS (GRID vs CAROUSEL)                                               */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
          Featured Enterprise Engagements
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-[#F8FAFC] shadow-2xs'
                : 'text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'carousel'
                ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-[#F8FAFC] shadow-2xs'
                : 'text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Carousel UX</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PORTFOLIO GRID / CAROUSEL DISPLAY                                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {viewMode === 'grid' ? (
          /* 2x2 GRID AS IN IMAGE 3 */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PORTFOLIO_DATA.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Visual Header Banner */}
                <div className="relative h-56 bg-slate-950 flex flex-col justify-between p-4 overflow-hidden">
                  {/* Visual Background Theme */}
                  {item.visualType === 'datacenter' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 flex items-center justify-center">
                      <div className="grid grid-cols-6 gap-2 opacity-30 w-full px-6">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="h-28 bg-blue-500/20 border border-blue-400/30 rounded-xs flex flex-col justify-between p-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 text-xs font-mono text-indigo-300">
                        Nexus Data Systems • High-Throughput Node
                      </div>
                    </div>
                  )}

                  {item.visualType === 'network' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-cyan-950 flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border border-cyan-400/30 animate-spin" />
                        <div className="absolute text-[10px] font-mono text-cyan-300">
                          CLOUD NETWORK MESH
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    </div>
                  )}

                  {item.visualType === 'dashboard' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
                      <div className="w-full max-w-sm rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3 space-y-2">
                        <div className="flex justify-between text-[10px] text-white">
                          <span>Automated Ops Stream</span>
                          <span className="text-emerald-300">99.99% SLA</span>
                        </div>
                        <div className="h-10 bg-white/10 rounded flex items-end p-1 gap-1">
                          {[30, 45, 60, 80, 95, 70, 88].map((v, idx) => (
                            <div key={idx} className="flex-1 bg-indigo-400 rounded-2xs" style={{ height: `${v}%` }} />
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    </div>
                  )}

                  {item.visualType === 'fiber' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-cyan-950 to-indigo-950 flex items-center justify-center">
                      <div className="w-full flex items-center justify-around opacity-40">
                        <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_15px_#22d3ee]" />
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_15px_#34d399]" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Top Right Badge (As in Image 3) */}
                  <div className="relative z-10 flex justify-end">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#4F46E5] text-white shadow-md">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedCaseStudy(item)}
                      className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* CAROUSEL MODE */
          <div className="relative">
            {(() => {
              const current = PORTFOLIO_DATA[carouselIndex];
              return (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#4F46E5] text-white">
                      {current.badge}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrev}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0F172A] dark:text-[#F8FAFC]"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0F172A] dark:text-[#F8FAFC]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                    {current.title}
                  </h3>

                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    {current.results.map((res, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 font-medium">
                        ✓ {res}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setSelectedCaseStudy(current)}
                      className="px-5 py-2.5 rounded-xl bg-[#4338CA] text-white text-xs font-bold"
                    >
                      View Deep Dive Specs
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* Case Study Deep Dive Modal */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#4338CA] dark:text-[#818CF8] uppercase">
                  {selectedCaseStudy.industry}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedCaseStudy.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedCaseStudy.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Measurable Impact & Architecture Metrics:
              </span>
              <div className="space-y-1.5">
                {selectedCaseStudy.results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-mono">
                Scale: {selectedCaseStudy.clientScale}
              </span>
              <button
                onClick={() => {
                  setSelectedCaseStudy(null);
                  onOpenGetStarted();
                }}
                className="px-4 py-2 rounded-xl bg-[#4338CA] text-white text-xs font-bold cursor-pointer"
              >
                Schedule Architecture Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
