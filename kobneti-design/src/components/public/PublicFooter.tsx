import React from 'react';
import { Hexagon, ArrowUpRight, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

interface PublicFooterProps {
  onNavigate: (page: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact') => void;
  darkMode?: boolean;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, darkMode }) => {
  return (
    <footer
      id="public-website-footer"
      className={`border-t transition-colors duration-200 ${
        darkMode
          ? 'bg-[#080B11] border-slate-800 text-slate-400'
          : 'bg-[#F8FAFC] border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col (2 cols span) */}
          <div className="md:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
                <Hexagon className="w-4 h-4 fill-white/20" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                KobNeti
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#475569] dark:text-[#94A3B8] max-w-sm">
              Elevating enterprise solutions with modern aesthetics. We engineer comprehensive technical operations solutions, blending data-centric precision with modern, forward-thinking strategy.
            </p>

            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] pt-2">
              © 2024 KobNeti. All rights reserved.
            </p>
          </div>

          {/* Col 1: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-[#94A3B8]">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                >
                  Newsroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                >
                  Press
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-[#94A3B8]">
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Status</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">
              Social
            </h4>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-[#94A3B8]">
              <li>
                <a
                  href="#linkedin"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="#twitter"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors flex items-center gap-1.5"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="#github"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2024 KobNeti Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:underline">
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:underline">
              Terms of Service
            </a>
            <a href="#cookies" onClick={(e) => e.preventDefault()} className="hover:underline">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
