import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Building,
} from 'lucide-react';

interface PublicContactPageProps {
  onOpenChat: () => void;
  darkMode?: boolean;
}

export const PublicContactPage: React.FC<PublicContactPageProps> = ({ onOpenChat, darkMode }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: 'MuuqWear',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
  };

  return (
    <div className="w-full flex flex-col space-y-16 sm:space-y-24 py-8 sm:py-14">
      {/* ========================================================================= */}
      {/* TITLE SECTION                                                             */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-[#334155] dark:text-[#CBD5E1] leading-relaxed max-w-2xl mx-auto font-normal">
          Have questions about our enterprise platforms or custom software engineering? Our architecture team is ready to help.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* CONTACT FORM & DIRECTORY GRID                                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            {formSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-[#334155] dark:text-[#CBD5E1] max-w-md mx-auto">
                  Thank you for reaching out, {formData.name}. A technical solutions specialist from KobNeti will respond to {formData.email} within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', product: 'MuuqWear', subject: '', message: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] dark:bg-slate-800 text-white text-xs font-bold mt-4 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Send Us an Inquiry
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Fill out the form below and we'll route it directly to the product lead.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1E293B] dark:text-[#E2E8F0]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Hassan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-[#0F172A] dark:text-white focus:outline-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1E293B] dark:text-[#E2E8F0]">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="david@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-[#0F172A] dark:text-white focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1E293B] dark:text-[#E2E8F0]">
                      Product or Solution of Interest
                    </label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-[#0F172A] dark:text-white focus:outline-indigo-500"
                    >
                      <option value="MuuqWear">MuuqWear (Apparel & Lifestyle)</option>
                      <option value="SomPay">SomPay (Fintech & Checkout)</option>
                      <option value="GaarX">GaarX (IoT & Fleet Telematics)</option>
                      <option value="Salguri">Salguri (Supply Chain Ops)</option>
                      <option value="Enterprise Strategy">Enterprise Architecture Consultation</option>
                      <option value="Cloud Migration">Cloud Infrastructure Migration</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1E293B] dark:text-[#E2E8F0]">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Partnership, Demo, or Enterprise Pricing"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-[#0F172A] dark:text-white focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E293B] dark:text-[#E2E8F0]">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your project requirements, volume, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-[#0F172A] dark:text-white focus:outline-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Global Locations & Quick Connect */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Connect Box */}
            <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Direct Channels
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-[#334155] dark:text-[#CBD5E1]">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Inquiries</div>
                    <a href="mailto:contact@kobneti.com" className="hover:underline text-indigo-600 dark:text-indigo-400">
                      contact@kobneti.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#334155] dark:text-[#CBD5E1]">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Support Hotline</div>
                    <div>+1 (800) 555-KOBNETI (24/7 SLA)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#334155] dark:text-[#CBD5E1]">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Operating Hours</div>
                    <div>Enterprise Support: 24/7/365</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenChat}
                  className="w-full py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Start Instant Live Chat</span>
                </button>
              </div>
            </div>

            {/* Office Locations */}
            <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Global Operations Centers
              </h3>

              <div className="space-y-3 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
                    <span>North America Hub</span>
                  </div>
                  <p className="mt-1 text-[#64748B] dark:text-[#94A3B8]">
                    450 Mission Street, Suite 1200, San Francisco, CA 94105
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#4F46E5] dark:text-[#818CF8]" />
                    <span>EMEA Technical Operations</span>
                  </div>
                  <p className="mt-1 text-[#64748B] dark:text-[#94A3B8]">
                    1 Poultry, Bank Junction, London EC2R 8EJ, United Kingdom
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
