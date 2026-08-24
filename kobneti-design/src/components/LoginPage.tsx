import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Hexagon,
  Sparkles,
  ShieldCheck,
  X,
  Mail,
  User,
  KeyRound,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userEmail?: string) => void;
  onBackToWebsite: () => void;
  isAlreadyLoggedIn?: boolean;
  currentUser?: { name: string; email: string; role: string };
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToWebsite,
  isAlreadyLoggedIn = false,
  currentUser = { name: 'Adeel D.', email: 'adeel@kobneti.com', role: 'Administrator' },
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [showAlreadyLoggedInView, setShowAlreadyLoggedInView] = useState(isAlreadyLoggedIn);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    // Simulate backend SSO verification
    setTimeout(() => {
      // Test intentional failure if password is 'wrong' or email doesn't end in @kobneti.com
      if (password === 'wrong' || password === 'error') {
        setIsLoading(false);
        setErrorMessage('Invalid email or password. Please try again.');
        return;
      }

      setIsLoading(false);
      onLoginSuccess(email);
    }, 900);
  };

  // Quick Demo Autofill
  const handleQuickFillDemo = (type: 'valid' | 'invalid') => {
    if (type === 'valid') {
      setEmail('adeel@kobneti.com');
      setPassword('KobNeti2026!Sec');
      setErrorMessage(null);
    } else {
      setEmail('unauthorized@kobneti.com');
      setPassword('wrong');
      setErrorMessage(null);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      // reset after feedback
    }, 2000);
  };

  return (
    <div
      id="kobneti-standalone-login-page"
      className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] font-sans antialiased overflow-x-hidden selection:bg-[#6366F1]/20 selection:text-[#0F172A]"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.09) 0%, rgba(238, 242, 255, 0.5) 45%, rgba(248, 250, 252, 1) 100%)
        `,
      }}
    >
      {/* ========================================================================= */}
      {/* FAINT WATERMARK GEOMETRIC BRANDING (3% Opacity, non-distracting)          */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <div className="w-[850px] h-[850px] opacity-[0.03] text-[#6366F1] transform -rotate-12">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />
            <polygon points="50,20 78,35 78,65 50,80 22,65 22,35" fill="#F8FAFC" />
            <path
              d="M38 32 L38 68 M38 50 L62 32 M44 46 L64 68"
              stroke="#6366F1"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CENTERED LOGIN CARD (Width: 420px)                                        */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div
          id="kobneti-login-card"
          className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 sm:p-8 relative"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* --------------------------------------------------------------------- */}
          {/* TOP OF CARD: Logo, Wordmark, Caption, Headline, Subtext               */}
          {/* --------------------------------------------------------------------- */}
          <div className="flex flex-col items-start text-left">
            {/* Logo + Wordmark */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4338CA] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Hexagon className="w-5 h-5 fill-white/20 stroke-[2.4]" />
              </div>
              <span className="text-[24px] font-semibold text-[#0F172A] tracking-tight leading-none">
                KobNeti
              </span>
            </div>

            {/* Caption */}
            <div className="text-[11px] font-semibold text-[#94A3B8] tracking-wider uppercase mt-2">
              OPERATIONS PLATFORM
            </div>

            {/* Spacer (16px) */}
            <div className="h-4 w-full" />

            {/* Headline */}
            <h1 className="text-[20px] font-semibold text-[#0F172A] tracking-tight">
              Sign in to your account
            </h1>

            {/* Subtext */}
            <p className="text-[14px] text-[#64748B] mt-1 leading-relaxed">
              Enter your credentials to access the internal dashboard.
            </p>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* OPTIONAL STATE: ALREADY LOGGED IN                                     */}
          {/* --------------------------------------------------------------------- */}
          {showAlreadyLoggedInView ? (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  AD
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-500 font-medium">Already signed in as</div>
                  <div className="text-sm font-semibold text-[#0F172A] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-[#64748B] font-mono truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <button
                id="btn-go-to-dashboard"
                onClick={() => onLoginSuccess(currentUser.email)}
                className="w-full h-[44px] rounded-[8px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[14px] font-medium transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Go to Dashboard</span>
              </button>

              <button
                id="btn-switch-account"
                type="button"
                onClick={() => setShowAlreadyLoggedInView(false)}
                className="w-full text-center text-[13px] text-[#64748B] hover:text-[#6366F1] font-medium transition-colors cursor-pointer py-1"
              >
                Sign in with a different account
              </button>
            </div>
          ) : (
            /* ------------------------------------------------------------------- */
            /* MAIN FORM FIELDS                                                    */
            /* ------------------------------------------------------------------- */
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* ERROR STATE BANNER */}
              {errorMessage && (
                <div
                  id="login-error-banner"
                  role="alert"
                  className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-[13px] text-[#DC2626] animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-snug font-medium">{errorMessage}</div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-[#DC2626]/70 hover:text-[#DC2626] p-0.5 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* EMAIL FIELD */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="login-email-input"
                  className="block text-[13px] font-medium text-[#475569]"
                >
                  Email address
                </label>
                <input
                  id="login-email-input"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@kobneti.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full h-11 px-3.5 rounded-[8px] border border-[#E2E8F0] bg-white text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all font-sans"
                />
              </div>

              {/* PASSWORD FIELD */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password-input"
                    className="block text-[13px] font-medium text-[#475569]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    id="link-forgot-password"
                    onClick={() => {
                      setForgotEmail(email || 'adeel@kobneti.com');
                      setForgotSubmitted(false);
                      setShowForgotModal(true);
                    }}
                    className="text-[13px] font-medium text-[#6366F1] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full h-11 pl-3.5 pr-11 rounded-[8px] border border-[#E2E8F0] bg-white text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all font-sans"
                  />
                  <button
                    type="button"
                    id="btn-toggle-password-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#475569] transition-colors rounded cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* SIGN IN BUTTON */}
              <div className="pt-2">
                <button
                  id="btn-sign-in-submit"
                  type="submit"
                  disabled={isLoading}
                  className={`w-full h-[44px] rounded-[8px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[14px] font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                    isLoading ? 'opacity-90 cursor-wait' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign in</span>
                  )}
                </button>
              </div>

              {/* TEST HELPER: Quick Demo presets */}
              <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-[#64748B]">
                <span>Demo shortcuts:</span>
                <button
                  type="button"
                  onClick={() => handleQuickFillDemo('valid')}
                  className="text-[#6366F1] hover:underline font-medium cursor-pointer"
                >
                  Fill valid
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickFillDemo('invalid')}
                  className="text-slate-500 hover:text-[#DC2626] hover:underline cursor-pointer"
                >
                  Test error state
                </button>
              </div>
            </form>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* FOOTER OF CARD: Divider + "← Back to KobNeti.com"                      */}
          {/* --------------------------------------------------------------------- */}
          <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex flex-col items-center gap-3">
            {/* Back to KobNeti.com link */}
            <button
              id="link-back-to-kobneti"
              type="button"
              onClick={onBackToWebsite}
              className="text-[14px] text-[#64748B] hover:text-[#6366F1] font-medium transition-colors cursor-pointer flex items-center gap-1.5 group py-0.5"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-150">
                ←
              </span>
              <span>Back to KobNeti.com</span>
            </button>

            {/* SECURITY NOTE: Small text at the very bottom (centered) */}
            <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#94A3B8] pt-1">
              <Lock className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              <span>Secured by KobNeti SSO</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL DIALOG                                              */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0F172A] font-semibold text-base">
                <KeyRound className="w-5 h-5 text-[#6366F1]" />
                <span>Reset Password</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">
                  Password Reset Email Sent
                </p>
                <p className="text-[12px] text-emerald-700 leading-relaxed">
                  We have sent instructions and a secure one-time authorization link to <b>{forgotEmail}</b>.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3.5 text-xs text-left">
                <p className="text-slate-600 leading-relaxed">
                  Enter your registered work email address and our SSO identity server will send a secure reset link.
                </p>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@kobneti.com"
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg font-semibold cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
