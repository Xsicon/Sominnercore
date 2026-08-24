import React from 'react';
import {
  Hexagon,
  Moon,
  Sun,
  Shield,
  Layers,
  ArrowRight,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface PublicNavbarProps {
  activePage: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact';
  onNavigate: (page: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact') => void;
  onOpenAdmin: () => void;
  onOpenLogin?: () => void;
  onOpenGetStarted: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  activePage,
  onNavigate,
  onOpenAdmin,
  onOpenLogin,
  onOpenGetStarted,
  darkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact'; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      id="public-website-header"
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        darkMode
          ? 'bg-[#0B0F19]/90 border-slate-800 backdrop-blur-md'
          : 'bg-white/90 border-slate-100 backdrop-blur-md'
      } border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="kobneti-public-brand-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4338CA] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Hexagon className="w-5 h-5 fill-white/20 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#4F46E5] dark:text-[#818CF8]">
            KobNeti
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                id={`public-nav-link-${link.id}`}
                onClick={() => onNavigate(link.id)}
                className={`relative text-sm font-medium transition-colors cursor-pointer py-1 ${
                  isActive
                    ? 'text-[#4F46E5] dark:text-[#818CF8] font-bold'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#4F46E5] dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5] dark:bg-[#818CF8] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark / Light Toggle */}
          <button
            id="public-dark-mode-toggle"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Staff Login / Portal link */}
          <button
            id="public-header-admin-link"
            onClick={onOpenLogin || onOpenAdmin}
            className="text-sm font-semibold text-[#1E293B] dark:text-[#F8FAFC] hover:text-[#4F46E5] dark:hover:text-[#818CF8] px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
            <span>Sign In</span>
          </button>

          {/* Get Started Button */}
          <button
            id="public-header-get-started-btn"
            onClick={onOpenGetStarted}
            className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span>Get Started</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            id="public-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activePage === link.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-[#4338CA] dark:text-[#818CF8] font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#6366F1]" />
              <span>Operations Admin Portal</span>
            </button>
            <button
              onClick={() => {
                onOpenGetStarted();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#4338CA] text-white text-xs font-bold shadow-md text-center"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
