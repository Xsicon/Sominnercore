import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Package,
  CreditCard,
  KeyRound,
  UserCheck,
  ShoppingCart,
  BarChart3,
  Tag,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Check,
  History,
  X,
  Plus,
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  Copy,
  Info,
  CheckCircle2,
} from 'lucide-react';

export interface KBArticle {
  id: string;
  code: string;
  icon: string;
  title: string;
  product: 'MuuqWear' | 'GaarX' | 'Salguri' | 'SomPay' | 'Dhaxal' | 'Ilays' | 'General';
  summary: string;
  tags: string[];
  updatedAt: string;
  views: number;
  helpfulCount: number;
  unhelpfulCount: number;
  author: string;
  version: string;
  revisionsCount: number;
  readTime: string;
  content: {
    overview: string;
    prerequisites?: string[];
    steps: {
      stepNumber: number;
      title: string;
      description: string;
      codeSnippet?: string;
      warningNote?: string;
    }[];
    edgeCases?: string[];
    escalationGuidance?: string;
  };
}

export const INITIAL_ARTICLES: KBArticle[] = [
  {
    id: 'kb-1',
    code: 'KB-MUQ-104',
    icon: '📦',
    title: 'Shipping & Delivery',
    product: 'MuuqWear',
    summary: 'How to reissue a shipping label and handle delivery exceptions...',
    tags: ['shipping', 'orders', 'delivery'],
    updatedAt: '2 days ago',
    views: 412,
    helpfulCount: 88,
    unhelpfulCount: 3,
    author: 'Adeel D. (Operations Lead)',
    version: 'v3.2',
    revisionsCount: 8,
    readTime: '4 min read',
    content: {
      overview:
        'Standard operating procedure for voiding compromised tracking identifiers, reissuing carrier labels with DHL/FedEx Express, and mitigating customs holds for MuuqWear international apparel deliveries.',
      prerequisites: [
        'Operations Tier 1 or Carrier Portal Admin role',
        'Customer verified order UUID (#MW-XXXX)',
        'Carrier dispatch API status active',
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Verify Address & Validate Delivery Status',
          description:
            'Cross-reference customer street address with carrier geocoding API. Check if the original package was marked as "Address Exception", "Return to Sender", or "Lost in Transit".',
          warningNote: 'Do not issue a new label if the package is currently flagged with Customs Duty Inspection.',
        },
        {
          stepNumber: 2,
          title: 'Void Existing Carrier Label in MuuqWear Dispatch Hub',
          description:
            'Access MuuqWear Logistics Panel > Select Order > Click "Void Waybill". Record the void reason code "RTS_ADDR_MISMATCH".',
          codeSnippet: 'POST /api/v2/muuqwear/fulfillment/void-waybill\n{\n  "order_id": "MW-98214",\n  "reason": "CARRIER_EXCEPTION_REROUTE",\n  "refund_postage": true\n}',
        },
        {
          stepNumber: 3,
          title: 'Generate Reissued Label and Dispatch Tracking',
          description:
            'Select priority express routing, generate the PDF shipping manifest, and trigger the automated SMS/Email delivery update to the customer.',
        },
      ],
      edgeCases: [
        'If carrier returns "Package Destroyed / Lost", immediately credit 100% store balance or queue instant replacement inventory batch.',
        'For high-value jackets (> $250), require direct signature delivery protocol.',
      ],
      escalationGuidance:
        'If the carrier fails to acknowledge label cancellation within 4 hours, escalate to Tier 2 Logistics Desk via #ops-logistics Slack channel.',
    },
  },
  {
    id: 'kb-2',
    code: 'KB-SAL-208',
    icon: '💳',
    title: 'Payment Disputes',
    product: 'Salguri',
    summary: 'Dispute resolution workflow for customer payment issues...',
    tags: ['payments', 'disputes', 'refunds'],
    updatedAt: '3 days ago',
    views: 620,
    helpfulCount: 142,
    unhelpfulCount: 5,
    author: 'Nasir H. (Fintech Operations)',
    version: 'v4.1',
    revisionsCount: 12,
    readTime: '6 min read',
    content: {
      overview:
        'Step-by-step resolution protocol for Salguri merchant chargebacks, duplicate settlement claims, and automated card network dispute representment.',
      prerequisites: [
        'Fintech Compliance Clearance Level 2',
        'Stripe/Visa Dispute Token & Merchant Evidence Dossier',
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Review Dispute Reason & Evidence Clock',
          description:
            'Identify the dispute category: "Fraudulent", "Product Not Received", or "Credit Not Processed". Note the strict 7-day representment deadline window.',
        },
        {
          stepNumber: 2,
          title: 'Compile Proof of Delivery & Digital Audit Trail',
          description:
            'Pull IP telemetry, digital signature, and biometric authentication log for the transaction ID.',
          codeSnippet: 'GET /api/v1/salguri/disputes/SAL-DSP-4091/evidence-bundle\nAuthorization: Bearer <FIN_OPS_KEY>',
        },
        {
          stepNumber: 3,
          title: 'Submit Network Defense or Authorize Concession Refund',
          description:
            'If evidence shows customer authorization, submit representment package. If merchant error occurred, issue immediate settlement refund with fee waiver.',
        },
      ],
      edgeCases: [
        'High Dispute Ratio (>0.9%): Flag merchant account for temporary rolling reserve.',
        'Friendly Fraud Pattern: File automated merchant network warning alert.',
      ],
      escalationGuidance:
        'Chargebacks exceeding $5,000 require dual-signoff from Lead Financial Risk Officer.',
    },
  },
  {
    id: 'kb-3',
    code: 'KB-GAX-315',
    icon: '🔐',
    title: 'API Authentication',
    product: 'GaarX',
    summary: 'API key setup, validation, and common error handling...',
    tags: ['api', 'authentication', 'keys'],
    updatedAt: '1 week ago',
    views: 890,
    helpfulCount: 210,
    unhelpfulCount: 2,
    author: 'Khadar Y. (Platform Engineer)',
    version: 'v2.8',
    revisionsCount: 5,
    readTime: '5 min read',
    content: {
      overview:
        'Guide for GaarX fleet management and logistics IoT developers resolving OAuth 2.0 Bearer token errors, mTLS certificate expiration, and rate-limit headers.',
      prerequisites: [
        'GaarX Developer Portal Admin Access',
        'Registered Client ID and Secret with appropriate Scope permissions',
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Check Token Expiration & Signature Algorithm',
          description:
            'Inspect JWT payload header for `RS256` or `EdDSA` signature. Verify `exp` claim against UTC timestamp.',
          codeSnippet: 'curl -X POST https://auth.gaarx.io/oauth2/token \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d "grant_type=client_credentials&client_id=GX_PROD_09&client_secret=*****"',
        },
        {
          stepNumber: 2,
          title: 'Verify IP Whitelisting & CIDR Block Settings',
          description:
            'Confirm the egress IP of customer server is enrolled in GaarX Security Access Gateway.',
        },
        {
          stepNumber: 3,
          title: 'Handle 429 Too Many Requests Backoff',
          description:
            'Ensure developer implements exponential backoff with jitter according to `Retry-After` header value.',
        },
      ],
      edgeCases: [
        'Invalid Key Hash (40103): Trigger automated credential rotation via Secrets Manager.',
      ],
    },
  },
  {
    id: 'kb-4',
    code: 'KB-SOM-412',
    icon: '👤',
    title: 'User Account Recovery',
    product: 'SomPay',
    summary: 'Password reset, account lock, and recovery workflows...',
    tags: ['account', 'recovery', 'password'],
    updatedAt: '4 days ago',
    views: 530,
    helpfulCount: 115,
    unhelpfulCount: 4,
    author: 'Amina M. (Support Specialist)',
    version: 'v3.0',
    revisionsCount: 9,
    readTime: '3 min read',
    content: {
      overview:
        'Identity verification and safe account unfreeze workflow for SomPay wallet holders experiencing lockouts or lost 2FA authenticators.',
      prerequisites: [
        'National ID or Passport record on file',
        'Secondary verified phone/SMS channel',
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Verify Identity via KYC Security Questions',
          description:
            'Confirm last 3 wallet transfer amounts and registered biometric enrollment date before resetting credentials.',
        },
        {
          stepNumber: 2,
          title: 'Generate Time-Limited One-Time Unlock Token',
          description:
            'Issue an encrypted 15-minute emergency unlock link dispatched only to verified hardware endpoints.',
        },
        {
          stepNumber: 3,
          title: 'Reset PIN and Enforce Immediate Password Rotation',
          description:
            'Instruct the user to create a new 6-digit transaction PIN upon successful biometric sign-in.',
        },
      ],
    },
  },
  {
    id: 'kb-5',
    code: 'KB-MUQ-501',
    icon: '🛒',
    title: 'Order Processing',
    product: 'MuuqWear',
    summary: 'Cancel orders, issue refunds, and handle order exceptions...',
    tags: ['orders', 'refunds', 'cancellations'],
    updatedAt: '5 days ago',
    views: 380,
    helpfulCount: 94,
    unhelpfulCount: 1,
    author: 'Adeel D. (Operations Lead)',
    version: 'v1.9',
    revisionsCount: 4,
    readTime: '4 min read',
    content: {
      overview:
        'Standard procedure for halting automated warehouse picking queues, cancelling backordered SKUs, and issuing partial or full invoice reversals.',
      steps: [
        {
          stepNumber: 1,
          title: 'Check Warehouse Picking Queue Status',
          description:
            'Orders in "Unfulfilled" or "Awaiting Pack" can be cancelled with immediate REST API intercept.',
        },
        {
          stepNumber: 2,
          title: 'Trigger Automated Reversal & Inventory Restock',
          description:
            'Release reserved SKU inventory counts back into global warehouse availability pool.',
        },
      ],
    },
  },
  {
    id: 'kb-6',
    code: 'KB-GEN-602',
    icon: '📊',
    title: 'Dashboard Loading Issues',
    product: 'General',
    summary: 'Troubleshooting dashboard performance and loading problems...',
    tags: ['performance', 'dashboard', 'loading'],
    updatedAt: '6 days ago',
    views: 740,
    helpfulCount: 168,
    unhelpfulCount: 7,
    author: 'Samatar O. (Infrastructure Engineer)',
    version: 'v2.1',
    revisionsCount: 6,
    readTime: '5 min read',
    content: {
      overview:
        'Diagnostic steps for resolving browser caching bottlenecks, CDN edge cache stalls, and WebSocket reconnection drops on KobNeti dashboards.',
      steps: [
        {
          stepNumber: 1,
          title: 'Bypass Cloudflare Edge CDN & Hard-Refresh Local Storage',
          description:
            'Instruct user to perform `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) and clear indexedDB state.',
        },
        {
          stepNumber: 2,
          title: 'Check Regional Datacenter Status',
          description:
            'Inspect latency telemetry at https://status.kobneti.internal for US-West and EU-Central node clusters.',
        },
      ],
    },
  },
];

const PRODUCT_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  MuuqWear: { bg: 'bg-indigo-50', text: 'text-[#6366F1]', border: 'border-indigo-200' },
  GaarX: { bg: 'bg-amber-50', text: 'text-[#B95F00]', border: 'border-amber-200' },
  Salguri: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  SomPay: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Dhaxal: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Ilays: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  General: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
};

interface KnowledgeBaseViewProps {
  onNewArticleClick?: () => void;
  onAttachToTicket?: (article: KBArticle) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  onNewArticleClick,
  onAttachToTicket,
}) => {
  const [articles, setArticles] = useState<KBArticle[]>(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<KBArticle | null>(null);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'yes' | 'no' | null>>({});
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const filterScrollRef = useRef<HTMLDivElement>(null);

  const scrollFilters = (direction: 'left' | 'right') => {
    if (filterScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      filterScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // New article form state
  const [newTitle, setNewTitle] = useState('');
  const [newProduct, setNewProduct] = useState<KBArticle['product']>('MuuqWear');
  const [newSummary, setNewSummary] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newOverview, setNewOverview] = useState('');
  const [newStep1, setNewStep1] = useState('');

  const filterProducts = [
    'All',
    'MuuqWear',
    'GaarX',
    'Salguri',
    'SomPay',
    'Dhaxal',
    'Ilays',
    'General',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVote = (articleId: string, type: 'yes' | 'no') => {
    setHelpfulFeedback((prev) => ({
      ...prev,
      [articleId]: prev[articleId] === type ? null : type,
    }));
    showToast(type === 'yes' ? 'Thanks for your feedback!' : 'Feedback noted for editorial review.');
  };

  const handleAttachArticle = (article: KBArticle) => {
    if (onAttachToTicket) {
      onAttachToTicket(article);
    }
    showToast(`Attached [${article.code}: ${article.title}] to ticket reply.`);
  };

  const handleCopySnippet = (article: KBArticle) => {
    navigator.clipboard?.writeText(
      `KB Reference: [${article.code}] ${article.title}\nLink: https://ops.kobneti.internal/kb/${article.id}\nSummary: ${article.summary}`
    );
    showToast('KB snippet copied to clipboard!');
  };

  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const created: KBArticle = {
      id: `kb-custom-${Date.now()}`,
      code: `KB-${newProduct.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      icon: newProduct === 'MuuqWear' ? '📦' : newProduct === 'GaarX' ? '🔐' : '📄',
      title: newTitle,
      product: newProduct,
      summary: newSummary || 'Technical documentation and standard operating procedure...',
      tags: parsedTags.length > 0 ? parsedTags : ['documentation', 'sop'],
      updatedAt: 'Just now',
      views: 1,
      helpfulCount: 1,
      unhelpfulCount: 0,
      author: 'Adeel D. (Administrator)',
      version: 'v1.0',
      revisionsCount: 1,
      readTime: '3 min read',
      content: {
        overview: newOverview || newSummary || 'Standard operating procedure for internal operations team.',
        steps: [
          {
            stepNumber: 1,
            title: 'Initial Diagnosis & Verification',
            description: newStep1 || 'Verify customer logs and validate transaction headers.',
          },
        ],
      },
    };

    setArticles([created, ...articles]);
    setIsCreatingArticle(false);
    setActiveArticle(created);
    setNewTitle('');
    setNewSummary('');
    setNewTags('');
    setNewOverview('');
    setNewStep1('');
    showToast(`Created new article: ${created.title}`);
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchProduct = selectedProduct === 'All' || article.product === selectedProduct;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.product.toLowerCase().includes(q) ||
        article.code.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchProduct && matchQuery;
    });
  }, [articles, selectedProduct, searchQuery]);

  return (
    <div id="knowledge-base-root" className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          id="kb-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0">
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
      {/* PAGE HEADER                                                               */}
      {/* Left: "Knowledge Base" (InterDisplay, 28px, 600 weight)                   */}
      {/* Subtext: "Technical documentation for resolving customer and product issues." */}
      {/* Right: "+ New Article" (Primary filled #6366F1)                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <h1
            className="text-[28px] font-[600] tracking-[-0.015em] text-[#0F172A] leading-tight"
            style={{ fontFamily: 'InterDisplay, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Knowledge Base
          </h1>
          <p
            className="text-[16px] font-[500] text-[#64748B] leading-normal"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Technical documentation for resolving customer and product issues.
          </p>
        </div>

        <button
          id="btn-create-new-article-main"
          onClick={() => {
            if (onNewArticleClick) {
              onNewArticleClick();
            } else {
              setIsCreatingArticle(true);
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ New Article</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: SEARCH & FILTERS (With Arrow Buttons)                              */}
      {/* Large search input: "Search articles..." (full width, clean)              */}
      {/* Filter pills below: All (active), MuuqWear, GaarX, Salguri, SomPay...    */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[12px] p-4 sm:p-5 border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-xs space-y-4">
        {/* Large search input (full width): "Search articles..." */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-[#94A3B8]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="kb-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100/60 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 focus:border-[#6366F1] dark:focus:border-[#818CF8] rounded-[9px] text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] transition-all focus:outline-none focus:ring-2 focus:ring-[#6366F1]/15 dark:focus:ring-[#818CF8]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter pills below: All (active), MuuqWear, GaarX, Salguri, SomPay, Dhaxal, Ilays, General */}
        <div className="flex items-center gap-2">
          {/* Scroll Left Button */}
          <button
            id="btn-scroll-kb-filters-left"
            onClick={() => scrollFilters('left')}
            className="p-1.5 rounded-[7px] bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 transition-colors cursor-pointer shadow-2xs"
            title="Scroll filters left"
            aria-label="Scroll filters left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={filterScrollRef}
            className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth pb-1"
          >
            {filterProducts.map((prod) => {
              const isActive = selectedProduct === prod;
              const count =
                prod === 'All'
                  ? articles.length
                  : articles.filter((a) => a.product === prod).length;

              return (
                <button
                  key={prod}
                  id={`filter-pill-${prod.toLowerCase()}`}
                  onClick={() => setSelectedProduct(prod)}
                  className={`px-3 py-1.5 rounded-[7px] text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A] shadow-xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  <span>{prod}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/15 text-white dark:text-[#0F172A]'
                        : 'bg-slate-200/90 dark:bg-slate-700/90 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            id="btn-scroll-kb-filters-right"
            onClick={() => scrollFilters('right')}
            className="p-1.5 rounded-[7px] bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 transition-colors cursor-pointer shadow-2xs"
            title="Scroll filters right"
            aria-label="Scroll filters right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: ARTICLE GRID (3 columns, Attio-style cards)                        */}
      {/* Card 1: 📦 "Shipping & Delivery" — MuuqWear                               */}
      {/* Card 2: 💳 "Payment Disputes" — Salguri                                   */}
      {/* Card 3: 🔐 "API Authentication" — GaarX                                   */}
      {/* Card 4: 👤 "User Account Recovery" — SomPay                               */}
      {/* Card 5: 🛒 "Order Processing" — MuuqWear                                  */}
      {/* Card 6: 📊 "Dashboard Loading Issues" — General                           */}
      {/* ========================================================================= */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-[12px] p-12 border border-[#E2E8F0] shadow-xs text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#0F172A]">No articles found</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            No knowledge base entries matched "{searchQuery}". Try adjusting your query or product filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedProduct('All');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-[#6366F1] hover:bg-[#6366F1]/10 rounded-[7px] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Reset filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => {
            const badgeStyle = PRODUCT_BADGE_STYLES[article.product] || PRODUCT_BADGE_STYLES.General;

            return (
              <div
                key={article.id}
                id={`article-card-${article.id}`}
                className="bg-white rounded-[12px] p-5 border border-[#E2E8F0] hover:border-[#6366F1]/40 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Icon, Title & Product Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg shrink-0" role="img" aria-label={article.title}>
                        {article.icon}
                      </span>
                      <h2
                        onClick={() => setActiveArticle(article)}
                        className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#6366F1] transition-colors leading-snug cursor-pointer"
                      >
                        {article.title}
                      </h2>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-[5px] border shrink-0 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                    >
                      {article.product}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-3 leading-relaxed">
                    {article.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchQuery(tag);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#0F172A] text-[11px] font-medium rounded-[5px] cursor-pointer transition-colors"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Updated timestamp & "Read" ghost link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Updated {article.updatedAt}</span>
                  </div>

                  {/* "Read" ghost link */}
                  <button
                    id={`btn-read-article-${article.id}`}
                    onClick={() => setActiveArticle(article)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-[7px] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ChevronRight className="w-3 h-3 text-[#64748B]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ARTICLE DETAIL VIEW (Opens on click)                                      */}
      {/* - Full article content                                                    */}
      {/* - Tags displayed                                                          */}
      {/* - Version history ghost link                                              */}
      {/* - "Was this helpful?" thumbs up/down                                      */}
      {/* - "Attach to Ticket Reply" ghost link                                     */}
      {/* ========================================================================= */}
      {activeArticle && (
        <div
          id="article-detail-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => {
            setActiveArticle(null);
            setShowVersionHistory(false);
          }}
        >
          <div
            id="article-detail-container"
            className="bg-white w-full max-w-3xl rounded-[16px] shadow-2xl border border-[#E2E8F0] flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="hover:text-[#6366F1] flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Knowledge Base</span>
                </button>
                <span>/</span>
                <span className="font-semibold text-slate-800">{activeArticle.product}</span>
                <span>/</span>
                <span className="font-mono text-slate-500">{activeArticle.code}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySnippet(activeArticle)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-[7px] transition-colors cursor-pointer"
                  title="Copy Reference"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-[7px] transition-colors cursor-pointer"
                  title="Close Reader"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
              {/* Article Headline & Meta */}
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="text-xl" role="img" aria-label="icon">
                    {activeArticle.icon}
                  </span>
                  <h1 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                    {activeArticle.title}
                  </h1>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-[5px] border ${
                      PRODUCT_BADGE_STYLES[activeArticle.product]?.bg
                    } ${PRODUCT_BADGE_STYLES[activeArticle.product]?.text} ${
                      PRODUCT_BADGE_STYLES[activeArticle.product]?.border
                    }`}
                  >
                    {activeArticle.product}
                  </span>
                </div>

                {/* Meta details & Version History Ghost Link */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] pt-1 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Updated {activeArticle.updatedAt}</span>
                  </div>
                  <div>•</div>
                  <div>Author: <span className="font-semibold text-slate-700">{activeArticle.author}</span></div>
                  <div>•</div>
                  <div>Read time: {activeArticle.readTime}</div>
                  <div>•</div>
                  {/* Version history ghost link */}
                  <button
                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                    className="px-2 py-0.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-[5px] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <History className="w-3 h-3 text-[#64748B]" />
                    <span>Version history ({activeArticle.version})</span>
                  </button>
                </div>
              </div>

              {/* Version History Drawer */}
              {showVersionHistory && (
                <div className="p-3.5 bg-slate-50 rounded-[10px] border border-[#E2E8F0] text-xs space-y-2 animate-in fade-in duration-150">
                  <div className="font-bold text-[#0F172A] flex items-center justify-between">
                    <span>Revision History & Audit Log</span>
                    <span className="text-[11px] font-normal text-slate-500">Auto-synced with Docs</span>
                  </div>
                  <div className="space-y-1 pt-1 text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span><strong>{activeArticle.version}</strong> — Updated API token parameters and geocode SLA</span>
                      <span className="text-slate-400">{activeArticle.updatedAt} by {activeArticle.author}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span><strong>v2.0</strong> — Initialized multi-region carrier dispatch fallback steps</span>
                      <span className="text-slate-400">2 weeks ago by Admin</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span><strong>v1.0</strong> — Published standard operating procedure draft</span>
                      <span className="text-slate-400">1 month ago by System</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Overview & Scope */}
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Overview & Scope</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-[10px] border border-slate-100">
                  {activeArticle.content.overview}
                </p>
              </div>

              {/* Prerequisites */}
              {activeArticle.content.prerequisites && activeArticle.content.prerequisites.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Prerequisites & Permissions</h3>
                  <ul className="space-y-1">
                    {activeArticle.content.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Steps (Standard Operating Procedure) */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Standard Resolution Procedure</h3>
                <div className="space-y-3">
                  {activeArticle.content.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 rounded-[10px] border border-[#E2E8F0] bg-white shadow-2xs space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs font-bold text-[#0F172A]">{step.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-7">
                        {step.description}
                      </p>

                      {step.codeSnippet && (
                        <div className="ml-7 mt-1.5">
                          <pre className="bg-[#0F172A] text-slate-100 text-[11px] font-mono p-3 rounded-[7px] overflow-x-auto custom-scrollbar">
                            <code>{step.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      {step.warningNote && (
                        <div className="ml-7 mt-1.5 p-2.5 bg-amber-50 rounded-[7px] border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{step.warningNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Section */}
              <div className="pt-1">
                <span className="text-xs font-semibold text-[#64748B] block mb-1.5">Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-[5px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer: "Was this helpful?" thumbs up/down & "Attach to Ticket Reply" ghost link */}
            <div className="p-3.5 sm:p-4 border-t border-[#E2E8F0] bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Was this helpful? */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#0F172A]">Was this helpful?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-feedback-thumbs-up"
                    onClick={() => handleVote(activeArticle.id, 'yes')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer border ${
                      helpfulFeedback[activeArticle.id] === 'yes'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Yes ({activeArticle.helpfulCount + (helpfulFeedback[activeArticle.id] === 'yes' ? 1 : 0)})</span>
                  </button>

                  <button
                    id="btn-feedback-thumbs-down"
                    onClick={() => handleVote(activeArticle.id, 'no')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer border ${
                      helpfulFeedback[activeArticle.id] === 'no'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                    <span>No ({activeArticle.unhelpfulCount + (helpfulFeedback[activeArticle.id] === 'no' ? 1 : 0)})</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: "Attach to Ticket Reply" ghost link */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-attach-to-ticket-reply"
                  onClick={() => handleAttachArticle(activeArticle)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/70 rounded-[7px] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach to Ticket Reply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW ARTICLE MODAL */}
      {isCreatingArticle && (
        <div
          id="create-article-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsCreatingArticle(false)}
        >
          <div
            id="create-article-container"
            className="bg-white w-full max-w-lg rounded-[16px] shadow-2xl border border-[#E2E8F0] p-5 space-y-4 my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[7px] bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">New KB Article</h3>
                  <p className="text-[11px] text-[#64748B]">Publish internal documentation & SOP</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreatingArticle(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateArticleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Webhook Retry Configuration"
                    className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-[7px] focus:border-[#6366F1] outline-none text-[#0F172A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Product *</label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value as KBArticle['product'])}
                    className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-[7px] focus:border-[#6366F1] outline-none text-[#0F172A] bg-white cursor-pointer"
                  >
                    <option value="MuuqWear">MuuqWear</option>
                    <option value="GaarX">GaarX</option>
                    <option value="Salguri">Salguri</option>
                    <option value="SomPay">SomPay</option>
                    <option value="Dhaxal">Dhaxal</option>
                    <option value="Ilays">Ilays</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Summary</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Short description displayed on card..."
                  className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-[7px] focus:border-[#6366F1] outline-none text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. shipping, orders, delivery"
                  className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-[7px] focus:border-[#6366F1] outline-none text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Overview</label>
                <textarea
                  rows={2}
                  value={newOverview}
                  onChange={(e) => setNewOverview(e.target.value)}
                  placeholder="Detailed context of this SOP..."
                  className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-[7px] focus:border-[#6366F1] outline-none text-[#0F172A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Step 1 Resolution Instructions</label>
                <textarea
                  rows={2}
                  value={newStep1}
                  onChange={(e) => setNewStep1(e.target.value)}
                  placeholder="Primary step or action to resolve this issue..."
                  className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-[7px] focus:border-[#6366F1] outline-none text-[#0F172A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreatingArticle(false)}
                  className="px-3 py-1.5 border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 font-semibold rounded-[7px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-[7px] shadow-xs transition-colors cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
