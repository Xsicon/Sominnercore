import React, { useState } from 'react';
import {
  Box,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Copy,
  RotateCcw,
  ExternalLink,
  GitBranch,
  Github,
  Key,
  Shield,
  Layers,
  Edit3,
  Trash2,
  X,
  Check,
  Eye,
  Tag,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Ticket,
  ChevronRight,
  Sparkles,
  RefreshCw,
  FolderGit2,
  Users,
} from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  type: 'Public Website' | 'Web App' | 'Mobile App' | 'API Service' | 'Internal Tool';
  status: 'Active' | 'Beta' | 'Deprecated';
  supportTier: 'Enterprise' | 'Priority' | 'Standard';
  owningTeam: string;
  widgetKeys: {
    chatKey: string;
    ticketKey: string;
  };
  repos: string[];
  description?: string;
  createdDate?: string;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'MuuqWear',
    slug: 'muuqwear',
    type: 'Public Website',
    status: 'Active',
    supportTier: 'Priority',
    owningTeam: 'Product Engineering',
    widgetKeys: {
      chatKey: 'pk_chat_muuqwear_88f92a10b',
      ticketKey: 'pk_tix_muuqwear_44c19e83d',
    },
    repos: ['github.com/kobneti/muuqwear-web', 'github.com/kobneti/muuqwear-api'],
    description: 'Flagship e-commerce apparel and wearable tech platform with integrated live support.',
    createdDate: 'Jan 15, 2024',
  },
  {
    id: 'prod-2',
    name: 'GaarX',
    slug: 'gaarx',
    type: 'Web App',
    status: 'Active',
    supportTier: 'Priority',
    owningTeam: 'Product Engineering',
    widgetKeys: {
      chatKey: 'pk_chat_gaarx_33b81c74a',
      ticketKey: 'pk_tix_gaarx_99d20f61e',
    },
    repos: ['github.com/kobneti/gaarx-dashboard', 'github.com/kobneti/gaarx-services'],
    description: 'Fleet and logistics management SaaS web application with automated dispatch.',
    createdDate: 'Mar 10, 2024',
  },
  {
    id: 'prod-3',
    name: 'Salguri',
    slug: 'salguri',
    type: 'Web App',
    status: 'Active',
    supportTier: 'Standard',
    owningTeam: 'Customer Support',
    widgetKeys: {
      chatKey: 'pk_chat_salguri_71e04b99c',
      ticketKey: 'pk_tix_salguri_22a87d15f',
    },
    repos: ['github.com/kobneti/salguri-portal'],
    description: 'Self-service customer portal for account diagnostics and order tracking.',
    createdDate: 'Apr 22, 2024',
  },
  {
    id: 'prod-4',
    name: 'SomPay',
    slug: 'sompay',
    type: 'Mobile App',
    status: 'Active',
    supportTier: 'Enterprise',
    owningTeam: 'Platform Operations',
    widgetKeys: {
      chatKey: 'pk_chat_sompay_19a32c44b',
      ticketKey: 'pk_tix_sompay_66e81d77a',
    },
    repos: ['github.com/kobneti/sompay-ios', 'github.com/kobneti/sompay-android'],
    description: 'Cross-border digital remittance and multi-currency mobile wallet infrastructure.',
    createdDate: 'Jun 05, 2024',
  },
  {
    id: 'prod-5',
    name: 'Dhaxal',
    slug: 'dhaxal',
    type: 'Web App',
    status: 'Beta',
    supportTier: 'Standard',
    owningTeam: 'Platform Operations',
    widgetKeys: {
      chatKey: 'pk_chat_dhaxal_55d11f88c',
      ticketKey: 'pk_tix_dhaxal_33c90e22b',
    },
    repos: ['github.com/kobneti/dhaxal-core'],
    description: 'Decentralized asset registry and inheritance verification engine currently in closed beta.',
    createdDate: 'Aug 18, 2025',
  },
  {
    id: 'prod-6',
    name: 'Ilays',
    slug: 'ilays',
    type: 'Web App',
    status: 'Active',
    supportTier: 'Enterprise',
    owningTeam: 'Product Engineering',
    widgetKeys: {
      chatKey: 'pk_chat_ilays_44e66b11a',
      ticketKey: 'pk_tix_ilays_88f33d99e',
    },
    repos: ['github.com/kobneti/ilays-web', 'github.com/kobneti/ilays-ml-pipeline'],
    description: 'AI-driven business intelligence and real-time revenue analytics dashboard.',
    createdDate: 'Nov 02, 2024',
  },
];

const ALL_TYPES: ('Public Website' | 'Web App' | 'Mobile App' | 'API Service' | 'Internal Tool')[] = [
  'Public Website',
  'Web App',
  'Mobile App',
  'API Service',
  'Internal Tool',
];

const ALL_SUPPORT_TIERS: ('Enterprise' | 'Priority' | 'Standard')[] = [
  'Enterprise',
  'Priority',
  'Standard',
];

const ALL_TEAMS = [
  'Product Engineering',
  'Customer Support',
  'Platform Operations',
  'Quality Assurance',
  'Design & Product',
  'Finance & Admin',
];

interface ProductRegistryViewProps {
  isNewProductModalOpen?: boolean;
  onOpenNewProductModal?: () => void;
  onCloseNewProductModal?: () => void;
}

export const ProductRegistryView: React.FC<ProductRegistryViewProps> = ({
  isNewProductModalOpen: externalNewProductOpen,
  onOpenNewProductModal: externalOpenNewProduct,
  onCloseNewProductModal: externalCloseNewProduct,
}) => {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Internal modal fallback
  const [internalNewProductOpen, setInternalNewProductOpen] = useState(false);
  const isNewProductOpen = externalNewProductOpen ?? internalNewProductOpen;
  const openNewProduct = externalOpenNewProduct ?? (() => setInternalNewProductOpen(true));
  const closeNewProduct = externalCloseNewProduct ?? (() => setInternalNewProductOpen(false));

  // Detail Drawer / Modal Panel
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State for New Product Modal
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formType, setFormType] = useState<'Public Website' | 'Web App' | 'Mobile App' | 'API Service' | 'Internal Tool'>('Web App');
  const [formSupportTier, setFormSupportTier] = useState<'Enterprise' | 'Priority' | 'Standard'>('Priority');
  const [formOwningTeam, setFormOwningTeam] = useState('Product Engineering');
  const [formDescription, setFormDescription] = useState('');

  // Link Repo Modal State
  const [isLinkRepoModalOpen, setIsLinkRepoModalOpen] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');

  // Key inspection modal
  const [keyModalProduct, setKeyModalProduct] = useState<{ product: ProductItem; keyType: 'chat' | 'ticket' } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper for auto-generating slug
  const handleNameChange = (name: string) => {
    setFormName(name);
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormSlug(slug);
  };

  // Create Product Submit
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const finalSlug = formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-');

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: formName.trim(),
      slug: finalSlug,
      type: formType,
      status: 'Active',
      supportTier: formSupportTier,
      owningTeam: formOwningTeam,
      widgetKeys: {
        chatKey: `pk_chat_${finalSlug}_${Math.random().toString(36).substring(2, 9)}`,
        ticketKey: `pk_tix_${finalSlug}_${Math.random().toString(36).substring(2, 9)}`,
      },
      repos: [`github.com/kobneti/${finalSlug}-main`],
      description: formDescription.trim() || 'Newly registered application in KobNeti operations catalog.',
      createdDate: 'Nov 15, 2025',
    };

    setProducts((prev) => [newProd, ...prev]);
    showToast(`Created new product: ${newProd.name}`);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    closeNewProduct();
  };

  // Edit Product Submit
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    if (selectedProduct?.id === editingProduct.id) {
      setSelectedProduct(editingProduct);
    }
    showToast(`Updated product: ${editingProduct.name}`);
    setEditingProduct(null);
  };

  // Rotate Key
  const handleRotateKey = (prodId: string, keyType: 'chat' | 'ticket') => {
    const newKey = `pk_${keyType === 'chat' ? 'chat' : 'tix'}_${Math.random().toString(36).substring(2, 10)}`;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          const updated = {
            ...p,
            widgetKeys: {
              ...p.widgetKeys,
              [keyType === 'chat' ? 'chatKey' : 'ticketKey']: newKey,
            },
          };
          if (selectedProduct?.id === prodId) {
            setSelectedProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
    showToast(`Rotated ${keyType === 'chat' ? 'Chat' : 'Ticket'} widget key.`);
  };

  // Copy Key to Clipboard
  const handleCopyKey = (keyString: string, label: string) => {
    navigator.clipboard?.writeText(keyString);
    showToast(`Copied ${label} to clipboard!`);
  };

  // Deprecate Product
  const handleDeprecate = (prod: ProductItem) => {
    const nextStatus = prod.status === 'Deprecated' ? 'Active' : 'Deprecated';
    const msg = prod.status === 'Deprecated' ? `Re-activated ${prod.name}` : `Deprecated ${prod.name}`;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prod.id) {
          const updated = { ...p, status: nextStatus as 'Active' | 'Beta' | 'Deprecated' };
          if (selectedProduct?.id === prod.id) {
            setSelectedProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );
    showToast(msg);
  };

  // Link Repo Submit
  const handleAddRepoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl.trim() || !selectedProduct) return;

    const formattedRepo = newRepoUrl.trim().replace(/^https?:\/\//, '');

    const updated = {
      ...selectedProduct,
      repos: [...selectedProduct.repos, formattedRepo],
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? updated : p))
    );
    setSelectedProduct(updated);
    setNewRepoUrl('');
    setIsLinkRepoModalOpen(false);
    showToast(`Linked repository: ${formattedRepo}`);
  };

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.owningTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = tierFilter === 'all' || prod.supportTier === tierFilter;
    const matchesType = typeFilter === 'all' || prod.type === typeFilter;

    return matchesSearch && matchesTier && matchesType;
  });

  return (
    <div
      id="product-registry-root"
      className="w-full flex-1 flex flex-col space-y-6 max-w-7xl mx-auto pb-16"
    >
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#6366F1]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-[28px] font-[600] tracking-tight text-[#0F172A] leading-tight font-display">
            Product Registry
          </h1>
          <p className="text-[16px] font-[500] text-[#64748B]">
            Manage all products in the KobNeti catalog.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="registry-new-product-btn"
            onClick={openNewProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Product</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: PRODUCT SUMMARY (3 cards, equal width)                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Products */}
        <div
          id="summary-card-total-products"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Products
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                <ArrowUpRight className="w-3 h-3 text-[#6366F1]" />
                <span>+1 this month</span>
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#0F172A] font-mono">6</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            5 active · 1 beta
          </div>
        </div>

        {/* Card 2: Support Tiers */}
        <div
          id="summary-card-support-tiers"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Support Tiers
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                3 Tiers
              </span>
            </div>
            <div className="pt-1 flex items-baseline gap-4 font-mono">
              <div>
                <span className="text-xl font-black text-purple-700">2</span>
                <p className="text-[10px] font-sans font-bold text-slate-400">Enterprise</p>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-xl font-black text-indigo-600">2</span>
                <p className="text-[10px] font-sans font-bold text-slate-400">Priority</p>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-xl font-black text-slate-600">2</span>
                <p className="text-[10px] font-sans font-bold text-slate-400">Standard</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium flex items-center justify-between">
            <span>Enterprise: 2 · Priority: 2 · Standard: 2</span>
          </div>
        </div>

        {/* Card 3: Widget Keys */}
        <div
          id="summary-card-widget-keys"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Widget Keys
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>All Active</span>
              </span>
            </div>
            <div className="pt-1 flex items-baseline gap-4 font-mono">
              <div>
                <span className="text-xl font-black text-slate-900">6</span>
                <p className="text-[10px] font-sans font-bold text-slate-400">Chat</p>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-xl font-black text-slate-900">6</span>
                <p className="text-[10px] font-sans font-bold text-slate-400">Ticket Form</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            Total: 12 keys active
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: PRODUCTS TABLE (Full width)                                        */}
      {/* ========================================================================= */}
      <div
        id="card-products-table"
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden"
      >
        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products, slug, team, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1] shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All Types</option>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Filter by Tier */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="appearance-none px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All Tiers</option>
              {ALL_SUPPORT_TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Product</th>
                <th className="py-3.5 px-4 font-bold">Type</th>
                <th className="py-3.5 px-4 font-bold text-center">Status</th>
                <th className="py-3.5 px-4 font-bold">Support Tier</th>
                <th className="py-3.5 px-4 font-bold">Managing Team</th>
                <th className="py-3.5 px-4 font-bold text-center">Widget Keys</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const isActive = prod.status === 'Active';
                const isBeta = prod.status === 'Beta';
                const isDeprecated = prod.status === 'Deprecated';

                return (
                  <tr
                    key={prod.id}
                    id={`product-row-${prod.id}`}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Product Name & Slug */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-xs shadow-2xs">
                          <Box className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#6366F1] transition-colors">
                            {prod.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 font-normal">
                            /{prod.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {prod.type}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#6366F1] border border-indigo-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"></span>
                          <span>Active</span>
                        </span>
                      )}
                      {isBeta && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#3B82F6] border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                          <span>Beta</span>
                        </span>
                      )}
                      {isDeprecated && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#94A3B8] border border-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span>
                          <span>Deprecated</span>
                        </span>
                      )}
                    </td>

                    {/* Support Tier */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          prod.supportTier === 'Enterprise'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : prod.supportTier === 'Priority'
                            ? 'bg-indigo-50 text-[#6366F1] border-indigo-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {prod.supportTier}
                      </span>
                    </td>

                    {/* Owning Team */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prod.owningTeam}</span>
                      </div>
                    </td>

                    {/* Widget Keys Buttons */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          id={`key-chat-btn-${prod.id}`}
                          onClick={() => setKeyModalProduct({ product: prod, keyType: 'chat' })}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-[#6366F1] border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                          title="View & copy Chat Widget Key"
                        >
                          <MessageSquare className="w-3 h-3 text-slate-500" />
                          <span>Chat</span>
                        </button>
                        <button
                          id={`key-ticket-btn-${prod.id}`}
                          onClick={() => setKeyModalProduct({ product: prod, keyType: 'ticket' })}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-[#6366F1] border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                          title="View & copy Ticket Form Key"
                        >
                          <Ticket className="w-3 h-3 text-slate-500" />
                          <span>Ticket</span>
                        </button>
                      </div>
                    </td>

                    {/* Actions: Edit & View */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          id={`edit-prod-btn-${prod.id}`}
                          onClick={() => setEditingProduct(prod)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Edit3 className="w-3 h-3 text-slate-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          id={`view-prod-btn-${prod.id}`}
                          onClick={() => setSelectedProduct(prod)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#6366F1] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT DETAIL PANEL (opens on [View] click)                              */}
      {/* ========================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="product-detail-panel"
            className="h-full w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
          >
            {/* Panel Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-sm shadow-xs">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedProduct.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        selectedProduct.status === 'Active'
                          ? 'bg-indigo-50 text-[#6366F1] border-indigo-200'
                          : selectedProduct.status === 'Beta'
                          ? 'bg-blue-50 text-[#3B82F6] border-blue-200'
                          : 'bg-slate-100 text-[#94A3B8] border-slate-300'
                      }`}
                    >
                      {selectedProduct.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-500">slug: {selectedProduct.slug}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs custom-scrollbar">
              {/* Product Metadata Specs */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Product Type
                  </span>
                  <span className="font-semibold text-slate-800">{selectedProduct.type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Support Tier
                  </span>
                  <span className="font-bold text-[#6366F1]">{selectedProduct.supportTier} Tier</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Managing Team
                  </span>
                  <span className="font-semibold text-slate-800">{selectedProduct.owningTeam}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Catalog Registration
                  </span>
                  <span className="font-mono text-slate-600">{selectedProduct.createdDate || 'Nov 2024'}</span>
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1.5 uppercase tracking-wider text-[11px] text-slate-500">
                    Overview & Description
                  </h4>
                  <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {/* SECTION: WIDGET KEYS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-[#6366F1]" />
                    <h4 className="font-bold text-slate-900 text-xs">Widget Keys</h4>
                  </div>
                  <span className="text-[11px] text-slate-400">Public client integration tokens</span>
                </div>

                <div className="space-y-2.5">
                  {/* Chat Widget Key */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        Chat Widget Key
                      </span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live / Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
                      <span className="truncate">
                        pk_chat_{selectedProduct.slug}_•••••••••••••
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          id="btn-copy-chat-key"
                          onClick={() => handleCopyKey(selectedProduct.widgetKeys.chatKey, 'Chat Widget Key')}
                          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Copy Full Key"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id="btn-rotate-chat-key"
                          onClick={() => handleRotateKey(selectedProduct.id, 'chat')}
                          className="p-1 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Rotate Chat Key"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Form Key */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-indigo-500" />
                        Ticket Form Key
                      </span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live / Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
                      <span className="truncate">
                        pk_tix_{selectedProduct.slug}_•••••••••••••
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          id="btn-copy-ticket-key"
                          onClick={() => handleCopyKey(selectedProduct.widgetKeys.ticketKey, 'Ticket Form Key')}
                          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Copy Full Key"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id="btn-rotate-ticket-key"
                          onClick={() => handleRotateKey(selectedProduct.id, 'ticket')}
                          className="p-1 rounded text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Rotate Ticket Key"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: LINKED REPOSITORIES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Github className="w-4 h-4 text-slate-700" />
                    <h4 className="font-bold text-slate-900 text-xs">Linked Repositories</h4>
                  </div>
                  <button
                    id="btn-open-link-repo-modal"
                    onClick={() => setIsLinkRepoModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6366F1] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Link Repo</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedProduct.repos.map((repo, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 group/repo hover:bg-indigo-50/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 font-mono text-xs text-slate-800">
                        <GitBranch className="w-3.5 h-3.5 text-slate-400 group-hover/repo:text-[#6366F1]" />
                        <span>{repo}</span>
                      </div>
                      <a
                        href={`https://${repo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="View repository"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
              <button
                id="panel-deprecate-btn"
                onClick={() => handleDeprecate(selectedProduct)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  selectedProduct.status === 'Deprecated'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
              >
                {selectedProduct.status === 'Deprecated' ? 'Re-activate Product' : 'Deprecate Product'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="panel-edit-btn"
                  onClick={() => {
                    setEditingProduct(selectedProduct);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEW PRODUCT MODAL                                                         */}
      {/* ========================================================================= */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="new-product-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Product</h3>
                  <p className="text-xs text-slate-500">Register an application to the KobNeti catalog</p>
                </div>
              </div>
              <button
                onClick={closeNewProduct}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProductSubmit} className="p-5 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MuuqWear"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              {/* Slug Auto-Generated */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Slug (Auto-generated)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-mono text-slate-400 text-xs">/</span>
                  <input
                    type="text"
                    required
                    placeholder="muuqwear"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              {/* Type Dropdown */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Type Dropdown
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  {ALL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Support Tier Dropdown */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Support Tier Dropdown
                </label>
                <select
                  value={formSupportTier}
                  onChange={(e) => setFormSupportTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  {ALL_SUPPORT_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              {/* Managing Team Dropdown */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Managing Team Dropdown
                </label>
                <select
                  value={formOwningTeam}
                  onChange={(e) => setFormOwningTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                >
                  {ALL_TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeNewProduct}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PRODUCT MODAL                                                        */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="edit-product-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Product</h3>
                  <p className="text-xs text-slate-500">Update metadata for {editingProduct.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditProductSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Type</label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, type: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    {ALL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Status</label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    <option value="Active">Active</option>
                    <option value="Beta">Beta</option>
                    <option value="Deprecated">Deprecated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Support Tier</label>
                  <select
                    value={editingProduct.supportTier}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, supportTier: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    {ALL_SUPPORT_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Managing Team</label>
                  <select
                    value={editingProduct.owningTeam}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, owningTeam: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    {ALL_TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LINK REPO MODAL                                                           */}
      {/* ========================================================================= */}
      {isLinkRepoModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="link-repo-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-slate-800" />
                <h3 className="text-sm font-bold text-slate-900">Link GitHub Repository</h3>
              </div>
              <button
                onClick={() => setIsLinkRepoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRepoSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Repository URL or Path
                </label>
                <div className="relative">
                  <FolderGit2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="github.com/kobneti/my-service"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLinkRepoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                >
                  Link Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK KEY INSPECTION POPUP                                                */}
      {/* ========================================================================= */}
      {keyModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#6366F1]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {keyModalProduct.keyType === 'chat' ? 'Live Chat Widget Key' : 'Ticket Form Widget Key'}
                </h3>
              </div>
              <button
                onClick={() => setKeyModalProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-600">
                Public client key for <strong>{keyModalProduct.product.name}</strong> ({keyModalProduct.product.slug}):
              </p>
              <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl flex items-center justify-between gap-2 overflow-x-auto">
                <span className="select-all">
                  {keyModalProduct.keyType === 'chat'
                    ? keyModalProduct.product.widgetKeys.chatKey
                    : keyModalProduct.product.widgetKeys.ticketKey}
                </span>
                <button
                  onClick={() => {
                    const k =
                      keyModalProduct.keyType === 'chat'
                        ? keyModalProduct.product.widgetKeys.chatKey
                        : keyModalProduct.product.widgetKeys.ticketKey;
                    handleCopyKey(k, `${keyModalProduct.keyType.toUpperCase()} Key`);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Copy Key"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setKeyModalProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
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
