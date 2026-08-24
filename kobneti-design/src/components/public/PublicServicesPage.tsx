import React, { useState } from 'react';
import {
  Compass,
  Code2,
  Cpu,
  RefreshCw,
  ShieldAlert,
  CloudLightning,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';

interface PublicServicesPageProps {
  onNavigate: (page: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact') => void;
  onOpenGetStarted: () => void;
  darkMode?: boolean;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  features: string[];
  deliverables: string[];
  timeline: string;
}

const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'enterprise-strategy',
    title: 'Enterprise Strategy',
    description:
      'Aligning your technical infrastructure with long-term business objectives. We provide blueprinting for scalable, resilient architectures that adapt to market shifts.',
    icon: <Compass className="w-5 h-5" />,
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    iconColor: 'text-[#4338CA] dark:text-[#818CF8]',
    features: [
      'Multi-year technology roadmap design',
      'Vendor & technology stack evaluation',
      'Cost optimization & governance models',
    ],
    deliverables: ['Architecture Blueprint', 'TCO Reduction Model', 'SLA Governance Framework'],
    timeline: '2–4 Weeks',
  },
  {
    id: 'custom-development',
    title: 'Custom Development',
    description:
      'Bespoke software engineering focusing on high-performance, secure, and maintainable codebases. From core platforms to specialized microservices.',
    icon: <Code2 className="w-5 h-5" />,
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    features: [
      'Full-stack TypeScript & Go microservices',
      'Event-driven Kafka / NATS architectures',
      'Sub-50ms API SLA optimization',
    ],
    deliverables: ['Production-ready source repository', 'CI/CD pipelines', 'Integration testing suite'],
    timeline: '4–12 Weeks',
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    description:
      'Modernizing legacy systems and workflows. We facilitate smooth transitions to cloud-native environments, optimizing operational efficiency and agility.',
    icon: <Cpu className="w-5 h-5" />,
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    features: [
      'Legacy monolith strangulation pattern',
      'Zero-downtime database migrations',
      'Automated batch to streaming ingestion',
    ],
    deliverables: ['Zero-Downtime Cutover Plan', 'Cloud Migration Matrix', 'Staff Training Modules'],
    timeline: '6–16 Weeks',
  },
  {
    id: 'data-analytics-ai',
    title: 'Data Analytics & AI',
    description:
      'Unlocking insights from complex datasets. We build robust data pipelines and integrate predictive AI models to drive informed decision-making.',
    icon: <RefreshCw className="w-5 h-5" />,
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    features: [
      'Real-time data lakes & warehouse sync',
      'Predictive churn & revenue modeling',
      'LLM fine-tuning & RAG pipeline orchestration',
    ],
    deliverables: ['Automated BI Dashboards', 'Edge AI Models', 'Data Quality Health Watcher'],
    timeline: '3–8 Weeks',
  },
  {
    id: 'cybersecurity-ops',
    title: 'Cybersecurity Operations',
    description:
      'Comprehensive threat modeling, continuous monitoring, and incident response frameworks to protect your critical digital assets and maintain compliance.',
    icon: <ShieldAlert className="w-5 h-5" />,
    iconBg: 'bg-rose-500/10 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    features: [
      'SOC2 / ISO 27001 readiness audit',
      'Zero-trust cryptographic mesh implementation',
      'Automated vulnerability penetration testing',
    ],
    deliverables: ['Compliance Certification Packet', 'Incident Playbook', '24/7 SIEM Setup'],
    timeline: '2–6 Weeks',
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure',
    description:
      'Designing, deploying, and managing scalable multi-cloud architectures. We ensure high availability, optimal resource allocation, and cost efficiency.',
    icon: <CloudLightning className="w-5 h-5" />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    features: [
      'Kubernetes (EKS/GKE) cluster automation',
      'Terraform & OpenTofu infrastructure-as-code',
      'Global multi-region disaster recovery',
    ],
    deliverables: ['IaC Repository', 'Multi-Region Failover Architecture', 'FinOps Cost Audit'],
    timeline: '3–6 Weeks',
  },
];

export const PublicServicesPage: React.FC<PublicServicesPageProps> = ({
  onNavigate,
  onOpenGetStarted,
  darkMode,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev === 0 ? SERVICES_LIST.length - 1 : prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % SERVICES_LIST.length);
  };

  return (
    <div className="w-full flex flex-col space-y-14 sm:space-y-20 py-8 sm:py-14">
      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          Our Services
        </h1>

        <p className="text-base sm:text-lg text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-normal">
          We engineer comprehensive technical operations solutions, blending data-centric precision with modern, forward-thinking strategy to elevate your enterprise architecture.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            id="services-explore-offerings-btn"
            onClick={onOpenGetStarted}
            className="px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-95"
          >
            Explore Offerings
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VIEW CONTROLS (GRID vs CAROUSEL UI/UX)                                    */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="text-xs font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
          6 Core Capabilities
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
      {/* SERVICES DISPLAY                                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {viewMode === 'grid' ? (
          /* 6 CARDS 3-COLUMN GRID AS IN IMAGE 5 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_LIST.map((service) => (
              <div
                key={service.id}
                className="p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl ${service.iconBg} ${service.iconColor} flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    {service.icon}
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline flex items-center gap-1.5 cursor-pointer group-hover:translate-x-1 transition-transform"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* CAROUSEL SLIDER UI/UX */
          <div className="relative">
            {(() => {
              const current = SERVICES_LIST[carouselIndex];
              return (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-xl space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-2xl ${current.iconBg} ${current.iconColor} flex items-center justify-center`}
                      >
                        {current.icon}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5] dark:text-[#818CF8]">
                          Service 0{carouselIndex + 1} of 0{SERVICES_LIST.length}
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                          {current.title}
                        </h3>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevCarousel}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0F172A] dark:text-[#F8FAFC] cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextCarousel}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0F172A] dark:text-[#F8FAFC] cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed max-w-3xl">
                    {current.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Key Capabilities
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {current.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Standard Deliverables
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {current.deliverables.map((d, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Average Timeline
                        </div>
                        <div className="text-lg font-bold text-[#4338CA] dark:text-[#818CF8] mt-1">
                          {current.timeline}
                        </div>
                      </div>
                      <button
                        onClick={onOpenGetStarted}
                        className="mt-3 w-full py-2 rounded-lg bg-[#4338CA] text-white text-xs font-bold hover:bg-[#3730A3]"
                      >
                        Request Scoping
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${selectedService.iconBg} ${selectedService.iconColor} flex items-center justify-center`}
                >
                  {selectedService.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedService.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedService.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Capabilities & Scope:
              </span>
              <div className="space-y-1.5">
                {selectedService.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-mono">
                Typical Scope: {selectedService.timeline}
              </span>
              <button
                onClick={() => {
                  setSelectedService(null);
                  onOpenGetStarted();
                }}
                className="px-4 py-2 rounded-xl bg-[#4338CA] text-white text-xs font-bold cursor-pointer"
              >
                Request Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
