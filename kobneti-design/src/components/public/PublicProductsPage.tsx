import React, { useState } from 'react';
import {
  Package,
  Truck,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Shield,
  CreditCard,
  RefreshCw,
  Search,
  MessageCircle,
} from 'lucide-react';

interface PublicProductsPageProps {
  onNavigate: (page: 'home' | 'products' | 'services' | 'about' | 'portfolio' | 'contact') => void;
  onOpenChat: () => void;
  darkMode?: boolean;
}

interface ProductDetailItem {
  id: string;
  name: string;
  headline: string;
  subtext: string;
  itemTitle: string;
  itemCategory: string;
  itemDescription: string;
  price: string;
  imageVisual: string;
  helpCards: {
    icon: 'orders' | 'shipping' | 'security' | 'api';
    title: string;
    description: string;
    actionLabel: string;
  }[];
}

const PRODUCTS_DATA: ProductDetailItem[] = [
  {
    id: 'muuqwear',
    name: 'MuuqWear',
    headline: 'MuuqWear',
    subtext: 'Elevating comfort to an art form. The next generation of daily essentials.',
    itemTitle: 'ZENITH SEAMLESS SET',
    itemCategory: 'Product Detail Template (MuuqWear)',
    itemDescription:
      'Engineered for comfort and style. Premium four-way stretch fabric with moisture-wicking technology.',
    price: '$128.00 USD',
    imageVisual: 'activewear',
    helpCards: [
      {
        icon: 'orders',
        title: 'Orders',
        description: 'Track, modify, or return your recent MuuqWear purchases seamlessly.',
        actionLabel: 'Track Order',
      },
      {
        icon: 'shipping',
        title: 'Shipping',
        description: 'Delivery timelines, international rates, and shipping policies.',
        actionLabel: 'View Shipping Rates',
      },
    ],
  },
  {
    id: 'sompay',
    name: 'SomPay',
    headline: 'SomPay',
    subtext: 'Next-generation merchant ledger, checkout orchestration, and instant payout gateway.',
    itemTitle: 'SOMPAY TERMINAL PRO',
    itemCategory: 'Payment Infrastructure (SomPay)',
    itemDescription:
      'Enterprise point-of-sale and digital checkout gateway supporting 3DS biometric verification and multi-currency ledgers.',
    price: '$249.00 USD / mo',
    imageVisual: 'terminal',
    helpCards: [
      {
        icon: 'api',
        title: 'Merchant Integration',
        description: 'REST and GraphQL SDKs to integrate SomPay checkout in under 15 minutes.',
        actionLabel: 'Explore APIs',
      },
      {
        icon: 'security',
        title: 'KYC & Compliance',
        description: 'Automated AML screening, merchant onboarding, and escrow protection.',
        actionLabel: 'Compliance Guides',
      },
    ],
  },
  {
    id: 'gaarx',
    name: 'GaarX',
    headline: 'GaarX',
    subtext: 'Connected fleet intelligence, GPS telemetry, and driver dispatch automation.',
    itemTitle: 'GAARX TELEMATICS HUB',
    itemCategory: 'IoT Fleet Platform (GaarX)',
    itemDescription:
      'High-frequency OBD-II IoT telemetry hub capturing real-time CAN bus telemetry and driver safety scores.',
    price: '$199.00 USD / unit',
    imageVisual: 'fleet',
    helpCards: [
      {
        icon: 'shipping',
        title: 'Fleet Diagnostics',
        description: 'Live engine telemetry, preventative maintenance alerts, and DTC fault codes.',
        actionLabel: 'View Diagnostics',
      },
      {
        icon: 'orders',
        title: 'Hardware Dispatch',
        description: 'Order installation kits and schedule certified technician deployment.',
        actionLabel: 'Order Hardware',
      },
    ],
  },
];

export const PublicProductsPage: React.FC<PublicProductsPageProps> = ({
  onNavigate,
  onOpenChat,
  darkMode,
}) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedModalHelp, setSelectedModalHelp] = useState<string | null>(null);

  const currentProduct = PRODUCTS_DATA[selectedProductIndex];

  const handlePrevProduct = () => {
    setSelectedProductIndex((prev) => (prev === 0 ? PRODUCTS_DATA.length - 1 : prev - 1));
    setAddedToCart(false);
  };

  const handleNextProduct = () => {
    setSelectedProductIndex((prev) => (prev + 1) % PRODUCTS_DATA.length);
    setAddedToCart(false);
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3500);
  };

  return (
    <div className="w-full flex flex-col space-y-14 sm:space-y-20 py-8 sm:py-12">
      {/* ========================================================================= */}
      {/* PRODUCT CAROUSEL SWITCHER / TABS                                          */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] uppercase tracking-wider">
              Product Suite:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {PRODUCTS_DATA.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProductIndex(idx);
                    setAddedToCart(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedProductIndex === idx
                      ? 'bg-white dark:bg-slate-900 text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                      : 'text-[#475569] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevProduct}
              aria-label="Previous Product"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0F172A] dark:text-[#F8FAFC]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextProduct}
              aria-label="Next Product"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#0F172A] dark:text-[#F8FAFC]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT HERO & SHOWCASE CARD                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center space-y-8">
        {/* Main Product Title */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            {currentProduct.headline}
          </h1>
          <p className="text-base sm:text-lg text-[#334155] dark:text-[#CBD5E1]">
            {currentProduct.subtext}
          </p>
        </div>

        {/* Big Showcase Card */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-gradient-to-b from-[#F4F6FB] via-white to-[#ECEFF8] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
            {/* Left Info Column */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-widest block mb-1">
                  {currentProduct.itemCategory}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                  {currentProduct.itemTitle}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                {currentProduct.itemDescription}
              </p>

              <div className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] pt-2">
                {currentProduct.price}
              </div>

              <div className="pt-2">
                <button
                  id="product-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
                    addedToCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0F172A] hover:bg-slate-800 dark:bg-[#4F46E5] dark:hover:bg-[#4338CA] text-white'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Product 3D / Studio Visual Mockup */}
            <div className="relative aspect-4/3 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center p-6 border border-slate-300/60 dark:border-slate-700 overflow-hidden shadow-inner">
              {currentProduct.id === 'muuqwear' ? (
                /* Studio Activewear Representation */
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Floating Podium */}
                  <div className="w-48 h-32 bg-gradient-to-t from-slate-400/30 to-slate-300/40 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl shadow-lg transform -rotate-6 flex flex-col items-center justify-center p-4 border border-white/40">
                    <div className="w-20 h-14 bg-slate-800 dark:bg-slate-900 rounded-lg shadow-md flex items-center justify-center text-slate-300 text-[10px] font-bold">
                      ZENITH TOP
                    </div>
                    <div className="w-24 h-10 bg-slate-700 dark:bg-slate-800 rounded-md mt-2 shadow-sm flex items-center justify-center text-slate-300 text-[9px] font-bold">
                      SEAMLESS TIGHTS
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-xs border border-slate-200">
                    MuuqWear Studio
                  </div>
                </div>
              ) : currentProduct.id === 'sompay' ? (
                /* Terminal Representation */
                <div className="relative w-full h-full flex flex-col items-center justify-center space-y-2">
                  <div className="w-44 h-28 bg-slate-900 rounded-xl border border-slate-700 p-3 text-white flex flex-col justify-between shadow-xl">
                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                      <span>SOMPAY POS</span>
                      <span>● ONLINE</span>
                    </div>
                    <div className="text-center font-mono font-bold text-lg text-white">
                      $128.00
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>NFC Tap</span>
                      <span>3DS Verified</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Fleet Hub Representation */
                <div className="relative w-full h-full flex flex-col items-center justify-center space-y-2">
                  <div className="w-44 h-28 bg-slate-900 rounded-xl border border-slate-700 p-3 text-white flex flex-col justify-between shadow-xl">
                    <div className="flex items-center justify-between text-[10px] text-blue-400 font-mono">
                      <span>GAARX OBD-II</span>
                      <span>5G LIVE</span>
                    </div>
                    <div className="text-center font-mono font-bold text-xs text-slate-200">
                      Telemetry Stream 120Hz
                    </div>
                    <div className="w-full h-1 bg-blue-500 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* "HOW CAN WE HELP YOU?" SECTION                                            */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How can we help you?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Quick solutions for common inquiries.
          </p>
        </div>

        {/* 2 Big Action Cards (As in Image 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {currentProduct.helpCards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Icon Box */}
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-[#4338CA] dark:text-[#818CF8]">
                  {card.icon === 'orders' ? (
                    <Package className="w-5 h-5" />
                  ) : card.icon === 'shipping' ? (
                    <Truck className="w-5 h-5" />
                  ) : card.icon === 'security' ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )}
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {card.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedModalHelp(card.title)}
                className="text-xs font-bold text-[#4338CA] dark:text-[#818CF8] hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>{card.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Help Modal */}
      {selectedModalHelp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedModalHelp} Support
              </h4>
              <button
                onClick={() => setSelectedModalHelp(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              For immediate assistance with {currentProduct.name} {selectedModalHelp.toLowerCase()}, our support team is on standby 24/7.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedModalHelp(null);
                  onOpenChat();
                }}
                className="px-4 py-2 rounded-xl bg-[#4338CA] text-white text-xs font-bold"
              >
                Chat with Specialist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
