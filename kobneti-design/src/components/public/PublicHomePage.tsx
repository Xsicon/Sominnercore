import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Play,
  TrendingUp,
  Cloud,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Users,
  Smartphone,
  CreditCard,
  Truck,
  SunMedium,
  Building,
} from 'lucide-react';

interface PublicHomePageProps {
  onNavigate: (page: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact') => void;
  onOpenGetStarted: () => void;
  darkMode?: boolean;
}

const FEATURED_CAROUSEL_PRODUCTS = [
  {
    id: 'muuqwear',
    name: 'MuuqWear',
    tagline: 'Elevating comfort to an art form. The next generation of daily essentials.',
    category: 'Consumer Lifestyle & E-Commerce',
    rating: '4.9 ★ (18.4k reviews)',
    stats: '140k+ units shipped',
    badge: 'Flagship Lifestyle',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900',
    color: 'from-rose-500/20 to-indigo-500/20',
    gradientBg: 'bg-gradient-to-tr from-slate-900 to-indigo-950',
    features: ['Active Stretch Tech', 'Automated Warehouse Dispatch', 'Global Express Shipping'],
    metric: '99.4% Fulfillment Rate',
  },
  {
    id: 'sompay',
    name: 'SomPay',
    tagline: 'Unified payment orchestration and multi-currency merchant ledger.',
    category: 'Fintech & Digital Payments',
    rating: '4.95 ★ (Enterprise)',
    stats: '$42M+ monthly volume',
    badge: 'Fintech Core',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900',
    color: 'from-emerald-500/20 to-teal-500/20',
    gradientBg: 'bg-gradient-to-tr from-slate-900 to-emerald-950',
    features: ['3DS Security Shield', 'Instant Sub-Second Settlement', 'Automated KYC & AML'],
    metric: '99.999% Gateway Uptime',
  },
  {
    id: 'gaarx',
    name: 'GaarX',
    tagline: 'Intelligent fleet management, real-time telemetry, and dispatch routing.',
    category: 'Smart Mobility & Logistics',
    rating: '4.8 ★ (120 fleets)',
    stats: '12k vehicles connected',
    badge: 'IoT Mobility',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900',
    color: 'from-blue-500/20 to-cyan-500/20',
    gradientBg: 'bg-gradient-to-tr from-slate-900 to-blue-950',
    features: ['Sub-second GPS telemetry', 'Predictive maintenance AI', 'Automated fuel audit'],
    metric: '-28% Fuel Burn Reduction',
  },
  {
    id: 'salguri',
    name: 'Salguri',
    tagline: 'End-to-end supply chain trace, wholesale procurement, and inventory sync.',
    category: 'Supply Chain Operations',
    rating: '4.9 ★ (85 Enterprise)',
    stats: '4.2M SKU inventory',
    badge: 'Enterprise Supply',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900',
    color: 'from-amber-500/20 to-orange-500/20',
    gradientBg: 'bg-gradient-to-tr from-slate-900 to-amber-950',
    features: ['Real-time batch tracking', 'Supplier invoice automation', 'Smart reorder alerts'],
    metric: '99.8% Order Accuracy',
  },
];

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onNavigate,
  onOpenGetStarted,
  darkMode,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % FEATURED_CAROUSEL_PRODUCTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? FEATURED_CAROUSEL_PRODUCTS.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % FEATURED_CAROUSEL_PRODUCTS.length);
  };

  return (
    <div className="w-full flex flex-col space-y-16 sm:space-y-24 py-8 sm:py-14 overflow-hidden">
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/90 dark:bg-indigo-950/60 text-xs font-semibold text-[#4338CA] dark:text-[#A5B4FC] shadow-xs">
              <Cloud className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
              <span className="tracking-wide uppercase font-bold text-[11px] text-[#4338CA] dark:text-[#A5B4FC]">
                290K+ DOWNLOADS WORLDWIDE
              </span>
            </div>

            {/* Main Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-warm font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-[1.15]">
              Enterprise Software That Powers{' '}
              <span className="text-[#4F46E5] dark:text-[#818CF8] font-sans font-extrabold">
                Modern Business
              </span>
            </h1>

            {/* Body Copy */}
            <p className="text-base sm:text-lg text-[#334155] dark:text-[#CBD5E1] leading-relaxed max-w-2xl font-normal">
              Elevate your operational efficiency with our cutting-edge, data-centric architecture. KobNeti delivers reliable innovation designed to scale with your most demanding marketing and operational needs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-explore-products-btn"
                onClick={() => onNavigate('products')}
                className="px-6 py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 group"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-watch-demo-btn"
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#0F172A] dark:text-[#F8FAFC] text-sm font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2.5 active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/60 flex items-center justify-center text-[#4F46E5] dark:text-[#A5B4FC]">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 3 Metric Stats Row */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#4F46E5] dark:text-[#818CF8]">
                  24+
                </div>
                <div className="text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mt-0.5">
                  ACTIVE PRODUCTS
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#4F46E5] dark:text-[#818CF8]">
                  290K
                </div>
                <div className="text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mt-0.5">
                  TOTAL DOWNLOADS
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#4F46E5] dark:text-[#818CF8]">
                  1.2M
                </div>
                <div className="text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider mt-0.5">
                  ACTIVE USERS
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Card Preview */}
          <div className="lg:col-span-5 relative">
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />

            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 p-5 sm:p-6 text-white shadow-2xl border border-slate-800">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    New Release
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    KobNeti Home Page
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">v4.8.0</span>
              </div>

              {/* Dashboard Preview Visual */}
              <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-4 shadow-inner">
                {/* Mock Chart & Stats Banner */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Dashboard Overview</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +34.8% this month
                  </span>
                </div>

                {/* Visual Bars / Chart Graphic */}
                <div className="h-28 w-full bg-gradient-to-b from-indigo-950/40 to-slate-900/60 rounded-lg p-3 flex items-end justify-between gap-1.5 border border-slate-800/60">
                  {[45, 62, 54, 78, 90, 85, 98, 115, 130, 142, 160].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className="w-full bg-gradient-to-t from-[#4338CA] to-[#818CF8] rounded-t-xs hover:brightness-125 transition-all"
                        style={{ height: `${(val / 160) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Sub features preview list */}
                <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                    <span>Active Services</span>
                    <span className="font-bold text-white">6 Modules</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                    <span>SLA Health</span>
                    <span className="font-bold text-emerald-400">99.99%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Pill Badge */}
              <div className="mt-4 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-[11px] font-bold text-indigo-200">
                  <TrendingUp className="w-3.5 h-3.5 text-[#818CF8]" />
                  <span>5K+ Downloads Today</span>
                </div>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore Suite</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE PRODUCT CAROUSEL SHOWCASE                                     */}
      {/* ========================================================================= */}
      <section
        id="product-carousel-showcase-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
              <span>Ecosystem Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
              Featured Products & Solutions
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
              Explore the specialized applications engineered under the KobNeti platform.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Product"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next Product"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Active Slide Card */}
        {(() => {
          const current = FEATURED_CAROUSEL_PRODUCTS[activeSlide];
          return (
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Info Column */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${current.badgeColor}`}>
                        {current.badge}
                      </span>
                      <span className="text-xs font-semibold text-[#475569] dark:text-[#94A3B8]">
                        {current.category}
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                      {current.name}
                    </h3>

                    <p className="text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-normal">
                      {current.tagline}
                    </p>

                    {/* Features checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {current.features.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Stats & CTA */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Performance Metric</div>
                      <div className="text-base font-extrabold text-[#4F46E5] dark:text-[#818CF8]">
                        {current.metric}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('products')}
                      className="px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Explore {current.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Visual Panel */}
                <div className={`lg:col-span-5 ${current.gradientBg} p-8 sm:p-12 text-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800`}>
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300">
                      Live Telemetry & Rating
                    </span>
                    <div className="text-2xl font-bold">{current.rating}</div>
                    <div className="text-xs text-slate-300">{current.stats}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 my-6 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">Integrated Modules</span>
                      <span className="text-emerald-300 font-mono">100% Operational</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 w-full" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Product ID: KOB-{current.id.toUpperCase()}</span>
                    <span>Ready for Deployment</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {FEATURED_CAROUSEL_PRODUCTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === idx
                  ? 'w-8 bg-[#4F46E5] dark:bg-[#818CF8]'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* QUICK VALUE PROPOSITIONS                                                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-[#4F46E5] dark:text-[#818CF8]">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Ultra Low-Latency Pipelines
            </h4>
            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              Engineered with sub-millisecond edge processing, ensuring real-time event streaming and rapid inventory synchronization.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Enterprise Zero-Trust Security
            </h4>
            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              Tier 4 compliant encryption with automated threat detection and role-based cryptographic access controls.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Modular Microservice Mesh
            </h4>
            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              Seamlessly scale individual services across multi-cloud regions without incurring downtime or architectural lock-in.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BOTTOM CTA BANNER                                                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-[#4338CA] via-[#4F46E5] to-[#6366F1] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to modernize your operations?
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Join leading organizations that trust KobNeti to orchestrate their infrastructure, commerce, and logistics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenGetStarted}
              className="px-6 py-3 rounded-xl bg-white text-[#4338CA] hover:bg-slate-100 text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEMO MODAL                                                                */}
      {/* ========================================================================= */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                KobNeti Platform Overview Demo
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center text-slate-400 space-y-3 border border-slate-800">
              <div className="w-14 h-14 rounded-full bg-[#4338CA] text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                Click to play interactive walk-through (2:45)
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold"
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
