import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  File,
  Upload,
  Download,
  MoreVertical,
  History,
  Lock,
  Unlock,
  Trash2,
  Share2,
  Eye,
  Search,
  Filter,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  HardDrive,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'png' | 'svg' | 'xlsx' | 'docx' | 'code';
  product: string;
  version: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  access: 'Restricted' | 'Public';
  folderPath: string;
  history?: {
    version: string;
    date: string;
    uploadedBy: string;
    size: string;
  }[];
}

const INITIAL_FILES: FileItem[] = [
  {
    id: 'f-1',
    name: 'Brand_Guidelines.pdf',
    type: 'pdf',
    product: 'MuuqWear',
    version: 'v3',
    size: '2.4 MB',
    uploadedBy: 'Adeel D.',
    uploadDate: 'Nov 15',
    access: 'Restricted',
    folderPath: 'Home / MuuqWear / Design Assets / Q3 Campaign',
    history: [
      { version: 'v3', date: 'Nov 15, 2025', uploadedBy: 'Adeel D.', size: '2.4 MB' },
      { version: 'v2', date: 'Nov 8, 2025', uploadedBy: 'Leila H.', size: '1.8 MB' },
      { version: 'v1', date: 'Nov 5, 2025', uploadedBy: 'Adeel D.', size: '1.2 MB' },
    ],
  },
  {
    id: 'f-2',
    name: 'hero_image_v2.png',
    type: 'png',
    product: 'MuuqWear',
    version: 'v2',
    size: '1.8 MB',
    uploadedBy: 'Leila H.',
    uploadDate: 'Nov 14',
    access: 'Public',
    folderPath: 'Home / MuuqWear / Design Assets / Q3 Campaign',
    history: [
      { version: 'v2', date: 'Nov 14, 2025', uploadedBy: 'Leila H.', size: '1.8 MB' },
      { version: 'v1', date: 'Nov 6, 2025', uploadedBy: 'Sarah K.', size: '1.5 MB' },
    ],
  },
  {
    id: 'f-3',
    name: 'Q3_Analytics_Report.xlsx',
    type: 'xlsx',
    product: 'MuuqWear',
    version: 'v5',
    size: '4.2 MB',
    uploadedBy: 'Adeel D.',
    uploadDate: 'Nov 13',
    access: 'Restricted',
    folderPath: 'Home / MuuqWear / Design Assets / Q3 Campaign',
    history: [
      { version: 'v5', date: 'Nov 13, 2025', uploadedBy: 'Adeel D.', size: '4.2 MB' },
      { version: 'v4', date: 'Nov 10, 2025', uploadedBy: 'Adeel D.', size: '3.9 MB' },
      { version: 'v3', date: 'Nov 4, 2025', uploadedBy: 'Leila H.', size: '3.1 MB' },
      { version: 'v2', date: 'Oct 28, 2025', uploadedBy: 'Adeel D.', size: '2.5 MB' },
      { version: 'v1', date: 'Oct 20, 2025', uploadedBy: 'Adeel D.', size: '2.1 MB' },
    ],
  },
  {
    id: 'f-4',
    name: 'Campaign_Brief.pdf',
    type: 'pdf',
    product: 'MuuqWear',
    version: 'v1',
    size: '1.2 MB',
    uploadedBy: 'Sarah K.',
    uploadDate: 'Nov 12',
    access: 'Public',
    folderPath: 'Home / MuuqWear / Design Assets / Q3 Campaign',
    history: [
      { version: 'v1', date: 'Nov 12, 2025', uploadedBy: 'Sarah K.', size: '1.2 MB' },
    ],
  },
  {
    id: 'f-5',
    name: 'logo_v3.svg',
    type: 'svg',
    product: 'MuuqWear',
    version: 'v3',
    size: '0.4 MB',
    uploadedBy: 'Mike C.',
    uploadDate: 'Nov 11',
    access: 'Public',
    folderPath: 'Home / MuuqWear / Design Assets / Q3 Campaign',
    history: [
      { version: 'v3', date: 'Nov 11, 2025', uploadedBy: 'Mike C.', size: '0.4 MB' },
      { version: 'v2', date: 'Nov 3, 2025', uploadedBy: 'Mike C.', size: '0.4 MB' },
      { version: 'v1', date: 'Oct 25, 2025', uploadedBy: 'Mike C.', size: '0.3 MB' },
    ],
  },
  {
    id: 'f-6',
    name: 'Budget_Planning.xlsx',
    type: 'xlsx',
    product: 'MuuqWear',
    version: 'v2',
    size: '3.1 MB',
    uploadedBy: 'Adeel D.',
    uploadDate: 'Nov 10',
    access: 'Restricted',
    folderPath: 'Home / MuuqWear / Design Assets / Q3 Campaign',
    history: [
      { version: 'v2', date: 'Nov 10, 2025', uploadedBy: 'Adeel D.', size: '3.1 MB' },
      { version: 'v1', date: 'Nov 1, 2025', uploadedBy: 'Adeel D.', size: '2.8 MB' },
    ],
  },
  {
    id: 'f-7',
    name: 'API_Documentation.pdf',
    type: 'pdf',
    product: 'GaarX',
    version: 'v4',
    size: '5.6 MB',
    uploadedBy: 'Leila H.',
    uploadDate: 'Nov 9',
    access: 'Public',
    folderPath: 'Home / GaarX / Documentation',
    history: [
      { version: 'v4', date: 'Nov 9, 2025', uploadedBy: 'Leila H.', size: '5.6 MB' },
      { version: 'v3', date: 'Nov 2, 2025', uploadedBy: 'Leila H.', size: '5.1 MB' },
      { version: 'v2', date: 'Oct 22, 2025', uploadedBy: 'Mike C.', size: '4.8 MB' },
      { version: 'v1', date: 'Oct 10, 2025', uploadedBy: 'Leila H.', size: '4.2 MB' },
    ],
  },
  {
    id: 'f-8',
    name: 'dashboard_mockup.png',
    type: 'png',
    product: 'GaarX',
    version: 'v1',
    size: '2.1 MB',
    uploadedBy: 'Sarah K.',
    uploadDate: 'Nov 8',
    access: 'Restricted',
    folderPath: 'Home / GaarX / UI Mockups',
    history: [
      { version: 'v1', date: 'Nov 8, 2025', uploadedBy: 'Sarah K.', size: '2.1 MB' },
    ],
  },
  {
    id: 'f-9',
    name: 'Sprint_23_Report.pdf',
    type: 'pdf',
    product: 'Engineering',
    version: 'v1',
    size: '1.8 MB',
    uploadedBy: 'Adeel D.',
    uploadDate: 'Nov 7',
    access: 'Public',
    folderPath: 'Home / Engineering',
    history: [
      { version: 'v1', date: 'Nov 7, 2025', uploadedBy: 'Adeel D.', size: '1.8 MB' },
    ],
  },
];

interface FolderNode {
  name: string;
  path: string;
  children?: FolderNode[];
}

const FOLDER_TREE: FolderNode = {
  name: 'Home',
  path: 'Home',
  children: [
    {
      name: 'MuuqWear',
      path: 'Home / MuuqWear',
      children: [
        {
          name: 'Design Assets',
          path: 'Home / MuuqWear / Design Assets',
          children: [
            { name: 'Q3 Campaign', path: 'Home / MuuqWear / Design Assets / Q3 Campaign' },
            { name: 'Identity & Brand', path: 'Home / MuuqWear / Design Assets / Identity & Brand' },
          ],
        },
        { name: 'Marketing', path: 'Home / MuuqWear / Marketing' },
        { name: 'Financials', path: 'Home / MuuqWear / Financials' },
      ],
    },
    {
      name: 'GaarX',
      path: 'Home / GaarX',
      children: [
        { name: 'Documentation', path: 'Home / GaarX / Documentation' },
        { name: 'UI Mockups', path: 'Home / GaarX / UI Mockups' },
      ],
    },
    { name: 'Salguri', path: 'Home / Salguri' },
    { name: 'SomPay', path: 'Home / SomPay' },
    { name: 'Dhaxal', path: 'Home / Dhaxal' },
    { name: 'Ilays', path: 'Home / Ilays' },
    { name: 'Engineering', path: 'Home / Engineering' },
  ],
};

interface FileManagementViewProps {
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  isUploadModalOpen?: boolean;
  onOpenUploadModal?: () => void;
  onCloseUploadModal?: () => void;
}

export const FileManagementView: React.FC<FileManagementViewProps> = ({
  viewMode: externalViewMode,
  onViewModeChange: externalSetViewMode,
  isUploadModalOpen: externalUploadOpen,
  onOpenUploadModal: externalOpenUpload,
  onCloseUploadModal: externalCloseUpload,
}) => {
  const [internalViewMode, setInternalViewMode] = useState<'grid' | 'list'>('grid');
  const activeViewMode = externalViewMode ?? internalViewMode;
  const setViewMode = externalSetViewMode ?? setInternalViewMode;

  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [currentFolder, setCurrentFolder] = useState<string>('Home / MuuqWear / Design Assets / Q3 Campaign');
  const [searchQuery, setSearchQuery] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | 'Restricted' | 'Public'>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Modals
  const [internalUploadOpen, setInternalUploadOpen] = useState(false);
  const isUploadOpen = externalUploadOpen ?? internalUploadOpen;
  const openUploadModal = externalOpenUpload ?? (() => setInternalUploadOpen(true));
  const closeUploadModal = externalCloseUpload ?? (() => setInternalUploadOpen(false));

  const [historyModalFile, setHistoryModalFile] = useState<FileItem | null>(null);
  const [accessModalFile, setAccessModalFile] = useState<FileItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upload Form State
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadProduct, setUploadProduct] = useState('MuuqWear');
  const [uploadAccess, setUploadAccess] = useState<'Restricted' | 'Public'>('Public');

  const handleDownload = (file: FileItem, version?: string) => {
    showToast(`Downloading ${file.name} (${version || file.version})...`);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string, name: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    showToast(`Deleted ${name}`);
    setActiveMenuId(null);
  };

  const handleToggleAccess = (file: FileItem) => {
    const newAccess = file.access === 'Restricted' ? 'Public' : 'Restricted';
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, access: newAccess } : f))
    );
    showToast(`${file.name} access updated to ${newAccess}`);
    setAccessModalFile(null);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    const extension = uploadFileName.split('.').pop()?.toLowerCase() || 'pdf';
    let fileType: FileItem['type'] = 'pdf';
    if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) fileType = 'png';
    else if (['svg'].includes(extension)) fileType = 'svg';
    else if (['xlsx', 'csv', 'xls'].includes(extension)) fileType = 'xlsx';
    else if (['ts', 'tsx', 'js', 'json'].includes(extension)) fileType = 'code';

    const newFile: FileItem = {
      id: `f-${Date.now()}`,
      name: uploadFileName.trim(),
      type: fileType,
      product: uploadProduct,
      version: 'v1',
      size: '1.5 MB',
      uploadedBy: 'Adeel D.',
      uploadDate: 'Nov 16',
      access: uploadAccess,
      folderPath: currentFolder,
      history: [
        { version: 'v1', date: 'Nov 16, 2025', uploadedBy: 'Adeel D.', size: '1.5 MB' },
      ],
    };

    setFiles((prev) => [newFile, ...prev]);
    showToast(`Uploaded ${newFile.name} successfully`);
    setUploadFileName('');
    closeUploadModal();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setUploadFileName(droppedFile.name);
      openUploadModal();
    }
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAccess = accessFilter === 'all' || f.access === accessFilter;
    const matchesProduct = productFilter === 'all' || f.product === productFilter;
    return matchesSearch && matchesAccess && matchesProduct;
  });

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'png':
      case 'svg':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-indigo-500" />;
      default:
        return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  // Breadcrumbs parsing
  const breadcrumbParts = currentFolder.split(' / ');

  return (
    <div
      id="file-management-view-root"
      className="w-full flex-1 flex flex-col space-y-5 max-w-7xl mx-auto pb-12"
      onClick={() => setActiveMenuId(null)}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#6366F1]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            File Management
          </h1>
          <p className="text-xs text-[#64748B] font-medium">
            Organize and manage files across products and projects.
          </p>
        </div>

        {/* Action Controls & Grid/List view toggle */}
        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex items-center shadow-2xs">
            <button
              id="file-view-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeViewMode === 'grid'
                  ? 'bg-white text-[#6366F1] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              id="file-view-list-btn"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeViewMode === 'list'
                  ? 'bg-white text-[#6366F1] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="page-header-upload-file-btn"
            onClick={openUploadModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload File</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 1: BREADCRUMB & UPLOAD ZONE                                           */}
      {/* ========================================================================= */}
      <div
        id="file-breadcrumb-upload-row"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
      >
        {/* Left: Breadcrumbs bar */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold whitespace-nowrap">
            <span className="text-slate-400">📁</span>
            {breadcrumbParts.map((part, index) => {
              const isLast = index === breadcrumbParts.length - 1;
              const pathUpTo = breadcrumbParts.slice(0, index + 1).join(' / ');
              return (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  <button
                    onClick={() => {
                      setCurrentFolder(pathUpTo);
                      showToast(`Navigated to ${pathUpTo}`);
                    }}
                    className={`hover:text-[#6366F1] transition-colors cursor-pointer ${
                      isLast ? 'text-[#0F172A] font-bold' : 'text-slate-500'
                    }`}
                  >
                    {part}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Access filter */}
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value as any)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Access</option>
              <option value="Restricted">🔒 Restricted</option>
              <option value="Public">🔓 Public</option>
            </select>

            {/* Product filter */}
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Products</option>
              <option value="MuuqWear">MuuqWear</option>
              <option value="GaarX">GaarX</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
        </div>

        {/* Right: Drag and drop quick dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={openUploadModal}
          className={`lg:col-span-4 rounded-2xl border-2 border-dashed p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-2.5 shadow-2xs ${
            isDragOver
              ? 'border-[#6366F1] bg-indigo-50/60 scale-[1.01]'
              : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center shrink-0">
            <Upload className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              Drag & drop files or <span className="text-[#6366F1]">browse</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Supports PDF, PNG, SVG, XLSX (up to 50MB)</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: FILE GRID / LIST (3 COLUMNS)                                       */}
      {/* ========================================================================= */}
      {activeViewMode === 'grid' ? (
        <div
          id="file-management-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredFiles.map((file) => {
            const isMenuOpen = activeMenuId === file.id;
            const isRestricted = file.access === 'Restricted';

            return (
              <div
                key={file.id}
                id={`file-card-${file.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all hover:border-indigo-200 flex flex-col justify-between space-y-4 group relative"
              >
                {/* Top: Icon, Title, Badge & Menu */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className="text-xs font-bold text-slate-900 truncate leading-snug hover:text-[#6366F1] transition-colors cursor-pointer"
                        title={file.name}
                        onClick={() => handleDownload(file)}
                      >
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                        <span className="font-semibold text-slate-700">{file.product}</span>
                        <span>·</span>
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                          {file.version}
                        </span>
                        <span>·</span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Button */}
                  <div className="relative">
                    <button
                      type="button"
                      id={`file-menu-btn-${file.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : file.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Context Menu Dropdown */}
                    {isMenuOpen && (
                      <div
                        id={`file-dropdown-menu-${file.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-7 z-30 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 text-xs font-semibold text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          onClick={() => handleDownload(file)}
                          className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-800"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => {
                            setHistoryModalFile(file);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-800"
                        >
                          <History className="w-3.5 h-3.5 text-slate-400" />
                          <span>Version History</span>
                        </button>
                        <button
                          onClick={() => {
                            setAccessModalFile(file);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-800"
                        >
                          {isRestricted ? (
                            <Unlock className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>Manage Access</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={() => handleDelete(file.id, file.name)}
                          className="w-full px-3 py-1.5 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Delete (Danger)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle: Upload Metadata */}
                <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-slate-400">Uploaded by</span>
                    <span className="font-semibold text-slate-700">{file.uploadedBy}</span>
                  </div>
                  <span className="text-slate-400 shrink-0 font-medium">· {file.uploadDate}</span>
                </div>

                {/* Bottom: Access Badge & Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div
                    onClick={() => {
                      setAccessModalFile(file);
                    }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                      isRestricted
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isRestricted ? (
                      <>
                        <Lock className="w-2.5 h-2.5" />
                        <span>Restricted</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-2.5 h-2.5" />
                        <span>Public</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`download-btn-${file.id}`}
                      onClick={() => handleDownload(file)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/50 text-[#6366F1] text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div
          id="file-management-list"
          className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="divide-y divide-slate-100">
            {filteredFiles.map((file) => {
              const isMenuOpen = activeMenuId === file.id;
              const isRestricted = file.access === 'Restricted';

              return (
                <div
                  key={file.id}
                  className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => handleDownload(file)}
                          className="text-xs font-bold text-slate-900 truncate hover:text-[#6366F1] cursor-pointer"
                        >
                          {file.name}
                        </span>
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-bold shrink-0">
                          {file.version}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{file.product}</span>
                        <span>·</span>
                        <span>{file.size}</span>
                        <span>·</span>
                        <span>Uploaded by {file.uploadedBy} on {file.uploadDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isRestricted
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isRestricted ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                      <span>{file.access}</span>
                    </span>

                    <button
                      onClick={() => handleDownload(file)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[#6366F1] text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : file.id);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isMenuOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-7 z-30 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1 text-xs font-semibold text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            onClick={() => handleDownload(file)}
                            className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-800"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => {
                              setHistoryModalFile(file);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-800"
                          >
                            <History className="w-3.5 h-3.5 text-slate-400" />
                            <span>Version History</span>
                          </button>
                          <button
                            onClick={() => {
                              setAccessModalFile(file);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-800"
                          >
                            {isRestricted ? (
                              <Unlock className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span>Manage Access</span>
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            onClick={() => handleDelete(file.id, file.name)}
                            className="w-full px-3 py-1.5 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Delete (Danger)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VERSION HISTORY MODAL                                                     */}
      {/* ========================================================================= */}
      {historyModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="version-history-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-xs shadow-2xs">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Version History</h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                    {historyModalFile.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryModalFile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="space-y-2">
                {historyModalFile.history?.map((ver, idx) => (
                  <div
                    key={ver.version}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      idx === 0
                        ? 'bg-indigo-50/30 border-indigo-200'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{ver.version}</span>
                        {idx === 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#6366F1] text-white">
                            Current
                          </span>
                        )}
                        <span className="text-slate-400 font-normal">· {ver.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {ver.version === 'v1' ? 'Uploaded' : 'Updated'} by {ver.uploadedBy} ({ver.size})
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(historyModalFile, ver.version)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-[#6366F1] font-bold text-[11px] shadow-2xs transition-colors cursor-pointer shrink-0"
                    >
                      Download {ver.version}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end">
              <button
                onClick={() => setHistoryModalFile(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MANAGE ACCESS MODAL                                                       */}
      {/* ========================================================================= */}
      {accessModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="manage-access-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shadow-2xs">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Manage Access</h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                    {accessModalFile.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAccessModalFile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">General Access Status</div>
                  <div className="text-[11px] text-slate-500">
                    {accessModalFile.access === 'Restricted'
                      ? 'Only explicitly authorized project members can view.'
                      : 'Anyone with organization link can view and download.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleAccess(accessModalFile)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    accessModalFile.access === 'Restricted'
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  }`}
                >
                  Switch to {accessModalFile.access === 'Restricted' ? 'Public' : 'Restricted'}
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  People with access
                </div>
                <div className="space-y-1.5">
                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-[10px] font-bold">
                        AD
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Adeel D. (Owner)</div>
                        <div className="text-[10px] text-slate-400">adeel@enterprise.corp</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Full Control</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                        LH
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Leila H.</div>
                        <div className="text-[10px] text-slate-400">leila@enterprise.corp</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Can Edit</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">
                        SK
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">Sarah K.</div>
                        <div className="text-[10px] text-slate-400">sarah@enterprise.corp</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">Can View</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end">
              <button
                onClick={() => setAccessModalFile(null)}
                className="px-4 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UPLOAD FILE MODAL                                                         */}
      {/* ========================================================================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="upload-file-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-xs shadow-2xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Upload New File</h3>
                  <p className="text-[11px] text-slate-500">Add assets to {currentFolder}</p>
                </div>
              </div>
              <button
                onClick={closeUploadModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  File Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3_Campaign_Assets.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Product</label>
                  <select
                    value={uploadProduct}
                    onChange={(e) => setUploadProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    <option value="MuuqWear">MuuqWear</option>
                    <option value="GaarX">GaarX</option>
                    <option value="Salguri">Salguri</option>
                    <option value="SomPay">SomPay</option>
                    <option value="Dhaxal">Dhaxal</option>
                    <option value="Ilays">Ilays</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Access Permission</label>
                  <select
                    value={uploadAccess}
                    onChange={(e) => setUploadAccess(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
                  >
                    <option value="Public">🔓 Public (Organization)</option>
                    <option value="Restricted">🔒 Restricted (Project only)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-center space-y-1">
                <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                <div className="text-slate-600 font-semibold">Drop asset or choose from local drive</div>
                <div className="text-[10px] text-slate-400">PDF, PNG, SVG, XLSX, DOCX up to 50MB</div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
