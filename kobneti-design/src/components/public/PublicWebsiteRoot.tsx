import React, { useState } from 'react';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { PublicHomePage } from './PublicHomePage';
import { PublicProductsPage } from './PublicProductsPage';
import { PublicServicesPage } from './PublicServicesPage';
import { PublicAboutPage } from './PublicAboutPage';
import { PublicPortfolioPage } from './PublicPortfolioPage';
import { PublicContactPage } from './PublicContactPage';
import { PublicLiveChatModal } from './PublicLiveChatModal';
import { MessageSquare, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface PublicWebsiteRootProps {
  onOpenAdmin: () => void;
  onOpenLogin?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export type PublicPageId = 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact';

export const PublicWebsiteRoot: React.FC<PublicWebsiteRootProps> = ({
  onOpenAdmin,
  onOpenLogin,
  darkMode,
  onToggleDarkMode,
}) => {
  const [activePage, setActivePage] = useState<PublicPageId>('home');
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [getStartedFormSubmitted, setGetStartedFormSubmitted] = useState(false);
  const [getStartedEmail, setGetStartedEmail] = useState('');

  const handleGetStartedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!getStartedEmail) return;
    setGetStartedFormSubmitted(true);
  };

  return (
    <div
      id="kobneti-public-website-app"
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        darkMode ? 'bg-[#0B0F19] text-slate-100 dark' : 'bg-[#FAFAFC] text-slate-900'
      }`}
    >
      {/* Top Navigation */}
      <PublicNavbar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={onOpenAdmin}
        onOpenLogin={onOpenLogin || onOpenAdmin}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">
        {activePage === 'home' && (
          <PublicHomePage
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGetStarted={() => setIsGetStartedOpen(true)}
            darkMode={darkMode}
          />
        )}

        {activePage === 'products' && (
          <PublicProductsPage
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChat={() => setIsLiveChatOpen(true)}
            darkMode={darkMode}
          />
        )}

        {activePage === 'services' && (
          <PublicServicesPage
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGetStarted={() => setIsGetStartedOpen(true)}
            darkMode={darkMode}
          />
        )}

        {activePage === 'about' && (
          <PublicAboutPage
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChat={() => setIsLiveChatOpen(true)}
            darkMode={darkMode}
          />
        )}

        {activePage === 'portfolio' && (
          <PublicPortfolioPage
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenGetStarted={() => setIsGetStartedOpen(true)}
            darkMode={darkMode}
          />
        )}

        {activePage === 'contact' && (
          <PublicContactPage
            onOpenChat={() => setIsLiveChatOpen(true)}
            darkMode={darkMode}
          />
        )}
      </main>

      {/* Footer */}
      <PublicFooter
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        darkMode={darkMode}
      />

      {/* Floating Live Chat Trigger Button (As seen in the bottom-right of screenshots) */}
      <button
        id="public-floating-chat-trigger"
        onClick={() => setIsLiveChatOpen(!isLiveChatOpen)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#4338CA] hover:bg-[#3730A3] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer select-none"
        aria-label="Open KobNeti Live Support"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
      </button>

      {/* Live Chat Modal */}
      <PublicLiveChatModal
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        darkMode={darkMode}
      />

      {/* Get Started / Onboarding Modal */}
      {isGetStartedOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Get Started with KobNeti
              </h3>
              <button
                onClick={() => {
                  setIsGetStartedOpen(false);
                  setGetStartedFormSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {getStartedFormSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Welcome to KobNeti!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  We've sent an invitation and starter credentials to <b>{getStartedEmail}</b>.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setIsGetStartedOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#4338CA] text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <span>Launch Operations Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGetStartedSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Join enterprise engineering and operations teams deploying with KobNeti across commerce, payments, and infrastructure.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={getStartedEmail}
                    onChange={(e) => setGetStartedEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Primary Interest
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-indigo-500">
                    <option>MuuqWear E-Commerce Platform</option>
                    <option>SomPay Payment Ledger & Orchestration</option>
                    <option>GaarX IoT Telematics & Mobility</option>
                    <option>Salguri Enterprise Supply Chain</option>
                    <option>Cloud Infrastructure Migration</option>
                    <option>Internal Operations Admin Portal</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Create Organization Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
