import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Pin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Link,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import {
  getSavedStickyColorHex,
  getStickyNoteColor,
  saveStickyColorHex,
  STICKY_NOTE_COLORS,
} from '../utils/stickyNoteTheme';

export interface ChatItem {
  id: string;
  name: string;
  company: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  assigned: 'me' | 'unassigned';
  avatarColor: string;
  online: boolean;
  email: string;
  role: string;
  productColor?: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName?: string;
  content: string;
  time: string;
}

export interface StepGuideItem {
  stepNumber: number;
  title: string;
  description: string;
  actionRequired?: string;
}

export interface KBArticleItem {
  id: string;
  title: string;
  company: string;
  category: string;
  readTime: string;
  description: string;
  badgeColor: string;
  steps: StepGuideItem[];
  waybillData?: {
    code: string;
    origin: string;
    carrier: string;
    weight: string;
    datamatrix: string;
  };
  checklist: string[];
}

export interface CompanyCarouselItem {
  id: string;
  name: string;
  activeChatsCount: number;
  color: string;
}

export interface UserNote {
  agent: string;
  date: string;
  reasonForContact: string;
  keyActionsTaken: string[];
  pinned?: boolean;
}

const COMPANIES: CompanyCarouselItem[] = [
  { id: 'all', name: 'All Companies', activeChatsCount: 12, color: '#6366F1' },
  { id: 'MuuqWear', name: 'MuuqWear', activeChatsCount: 4, color: '#6366F1' },
  { id: 'GaarX', name: 'GaarX', activeChatsCount: 3, color: '#6366F1' },
  { id: 'Salguri', name: 'Salguri', activeChatsCount: 2, color: '#38BDF8' },
  { id: 'SomPay', name: 'SomPay', activeChatsCount: 2, color: '#38BDF8' },
  { id: 'Dhaxal', name: 'Dhaxal', activeChatsCount: 1, color: '#38BDF8' },
  { id: 'Ilays', name: 'Ilays', activeChatsCount: 0, color: '#94A3B8' },
];

const INITIAL_CHATS: ChatItem[] = [
  {
    id: 'c1',
    name: 'Mike Banner',
    company: 'MuuqWear',
    lastMessage: 'Yes, I can. Thanks you for the...',
    time: '10:23 AM',
    unreadCount: 2,
    assigned: 'me',
    avatarColor: 'bg-[#6366F1]',
    productColor: '#6366F1',
    online: true,
    email: 'mike.b@muuqwear.com',
    role: 'Procurement Director',
  },
  {
    id: 'c2',
    name: 'Dianne Russell',
    company: 'GaarX',
    lastMessage: 'Idea from competitor analysis.',
    time: '10:00 AM',
    unreadCount: 1,
    assigned: 'me',
    avatarColor: 'bg-[#6366F1]',
    productColor: '#6366F1',
    online: true,
    email: 'dianne.r@gaarx.io',
    role: 'Product Specialist',
  },
  {
    id: 'c3',
    name: 'Tony Stark',
    company: 'Salguri',
    lastMessage: "Hey there! I'm new here and rea...",
    time: '9:45 AM',
    unreadCount: 0,
    assigned: 'me',
    avatarColor: 'bg-[#6366F1]',
    productColor: '#38BDF8',
    online: true,
    email: 't.stark@salguri.com',
    role: 'Merchant Risk Analyst',
  },
  {
    id: 'c4',
    name: 'Jordan Smith',
    company: 'SomPay',
    lastMessage: 'This is a friendly reminder that...',
    time: '9:30 AM',
    unreadCount: 3,
    assigned: 'me',
    avatarColor: 'bg-slate-300 text-slate-700',
    productColor: '#38BDF8',
    online: false,
    email: 'jordan.s@sompay.net',
    role: 'Fintech Operations Lead',
  },
  {
    id: 'c5',
    name: 'Walker Den',
    company: 'MuuqWear',
    lastMessage: "Hi! I'm currently working on pro...",
    time: '9:15 AM',
    unreadCount: 0,
    assigned: 'me',
    avatarColor: 'bg-slate-300 text-slate-700',
    productColor: '#38BDF8',
    online: false,
    email: 'walker.den@muuqwear.com',
    role: 'Supply Chain Manager',
  },
  {
    id: 'c6',
    name: 'Henry Cavil',
    company: 'GaarX',
    lastMessage: 'Yes, I saw your message...',
    time: '8:45 AM',
    unreadCount: 1,
    assigned: 'unassigned',
    avatarColor: 'bg-slate-300 text-slate-700',
    productColor: '#38BDF8',
    online: false,
    email: 'h.cavil@gaarx.io',
    role: 'Cloud Architect',
  },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  c2: [
    {
      id: 'm-sys-2',
      sender: 'system',
      content: 'Chat started with Dianne Russell',
      time: '10:00 AM',
    },
    {
      id: 'm20',
      sender: 'customer',
      senderName: 'Dianne Russell',
      content: "Hey Harry! I'm new here and really curious about the concept of sustainable design. Can anyone explain how it works?",
      time: '10:00 AM',
    },
    {
      id: 'm21',
      sender: 'agent',
      senderName: 'Adeel D.',
      content:
        'Hey Dianne, welcome! Sustainable design focuses on creating products and spaces that minimize environmental impact. It involves using eco-friendly materials and energy-efficient methods.',
      time: '9:58 AM',
    },
    {
      id: 'm22',
      sender: 'customer',
      senderName: 'Dianne Russell',
      content:
        'That sounds interesting! So, does that mean I can create designs that are both beautiful and environmentally responsible? I found a project idea, what do you think?',
      time: '9:50 AM',
    },
    {
      id: 'm23',
      sender: 'agent',
      senderName: 'Adeel D.',
      content:
        'Exactly! By applying sustainable design principles, you can develop creative solutions that are both functional and eco-conscious. It offers more innovation and responsibility in design.',
      time: '9:45 AM',
    },
  ],
  c1: [
    {
      id: 'm-sys-1',
      sender: 'system',
      content: 'Chat started with Mike Banner',
      time: '10:23 AM',
    },
    {
      id: 'm1',
      sender: 'customer',
      senderName: 'Mike Banner',
      content: 'Yes, I can. Thanks you for the prompt waybill dispatch and status update!',
      time: '10:23 AM',
    },
    {
      id: 'm2',
      sender: 'agent',
      senderName: 'Adeel D.',
      content:
        'Always happy to assist, Mike! The new tracking barcode has been synced with regional dispatch.',
      time: '10:20 AM',
    },
  ],
  c3: [
    {
      id: 'm-sys-3',
      sender: 'system',
      content: 'Chat started with Tony Stark',
      time: '9:45 AM',
    },
    {
      id: 'm30',
      sender: 'customer',
      senderName: 'Tony Stark',
      content: "Hey there! I'm new here and really curious about the payment dispute window.",
      time: '9:45 AM',
    },
    {
      id: 'm31',
      sender: 'agent',
      senderName: 'Adeel D.',
      content: 'Hello Tony! I can guide you through the Salguri dispute resolution matrix.',
      time: '9:43 AM',
    },
  ],
  c4: [
    {
      id: 'm-sys-4',
      sender: 'system',
      content: 'Chat started with Jordan Smith',
      time: '9:30 AM',
    },
    {
      id: 'm40',
      sender: 'customer',
      senderName: 'Jordan Smith',
      content:
        'This is a friendly reminder that the 2FA biometric reset challenge is pending customer SMS authorization.',
      time: '9:30 AM',
    },
  ],
  c5: [
    {
      id: 'm-sys-5',
      sender: 'system',
      content: 'Chat started with Walker Den',
      time: '9:15 AM',
    },
    {
      id: 'm50',
      sender: 'customer',
      senderName: 'Walker Den',
      content: "Hi! I'm currently working on procurement logistics for East Hub.",
      time: '9:15 AM',
    },
  ],
  c6: [
    {
      id: 'm-sys-6',
      sender: 'system',
      content: 'Chat started with Henry Cavil',
      time: '8:45 AM',
    },
    {
      id: 'm60',
      sender: 'customer',
      senderName: 'Henry Cavil',
      content: 'Yes, I saw your message regarding API authentication and sandbox token limits.',
      time: '8:45 AM',
    },
  ],
};

const INITIAL_USER_NOTES: Record<string, UserNote> = {
  c2: {
    agent: 'Adeel D.',
    date: 'Nov 15, 2025 10:00 AM',
    reasonForContact: 'Customer inquired about sustainable design concepts',
    keyActionsTaken: [
      'Explained sustainable design principles',
      'Provided examples of eco-friendly materials',
    ],
    pinned: false,
  },
  c1: {
    agent: 'Adeel D.',
    date: 'Nov 15, 2025 10:23 AM',
    reasonForContact: 'Waybill re-generation and courier barcode verification for MuuqWear shipment.',
    keyActionsTaken: [
      'Verified order in logistics portal',
      'Assigned DHL-EXP-48H tracking barcode',
    ],
    pinned: false,
  },
  c3: {
    agent: 'Adeel D.',
    date: 'Nov 15, 2025 9:45 AM',
    reasonForContact: 'Merchant dispute policy inquiry.',
    keyActionsTaken: ['Provided 3-step refund dispute workflow'],
    pinned: false,
  },
};

const KB_ARTICLES: KBArticleItem[] = [
  {
    id: 'kb-1',
    title: 'Shipping & Delivery',
    company: 'MuuqWear',
    category: 'Logistics & Orders',
    readTime: '2 min read',
    description: 'How to reissue a shipping label, override carrier waybills, and update live tracking.',
    badgeColor: '#6366F1',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate & Verify Order in MuuqWear Logistics Portal',
        description:
          'Open the MuuqWear Fulfillment hub and search by Customer Name or Order Tracking ID. Verify that the parcel has not left the regional fulfillment center.',
      },
      {
        stepNumber: 2,
        title: 'Re-generate Waybill & Assign Courier Barcode',
        description:
          'Select active priority carrier code (DHL Express 48H) and update parcel weight and customs declaration data.',
      },
      {
        stepNumber: 3,
        title: 'Dispatch Instant SMS & Push Live Tracking Update',
        description:
          'Trigger the automated carrier webhook to notify the customer via SMS with live GPS tracking coordinates.',
      },
    ],
    waybillData: {
      code: 'WAYBILL #MW-98234-DHL',
      origin: 'MuuqWear Warehouse East #01, Mogadishu, SO',
      carrier: 'PRIORITY EXPRESS · DHL-EXP-48H',
      weight: 'WT: 0.85 KG',
      datamatrix: '2D-ISO-15434',
    },
    checklist: [
      'Customer order status is verified as Pending or Label Failed',
      'Address format is international carrier ISO-3166 standards',
      'Tracking number has been generated',
    ],
  },
  {
    id: 'kb-2',
    title: 'Payment Disputes',
    company: 'Salguri',
    category: 'Payments & Refunds',
    readTime: '3 min read',
    description: 'How to handle customer payment disputes and process refunds.',
    badgeColor: '#38BDF8',
    steps: [
      {
        stepNumber: 1,
        title: 'Retrieve Transaction in Salguri Gateway Ledger',
        description: 'Verify authorization token, settlement window, and merchant dispute reason code.',
      },
      {
        stepNumber: 2,
        title: 'Execute Reversible Ledger Credit',
        description: 'Trigger escrow reversal if within the 48-hour dispute window.',
      },
      {
        stepNumber: 3,
        title: 'Notify Customer & Update Audit Log',
        description: 'Send receipt confirmation and attach compliance reference number.',
      },
    ],
    checklist: [
      'Dispute timestamp is verified within SLA window',
      'Customer identity authenticated via 2FA pin',
      'Reversal receipt logged to financial ledger',
    ],
  },
  {
    id: 'kb-3',
    title: 'API Authentication',
    company: 'GaarX',
    category: 'API & Integration',
    readTime: '4 min read',
    description: 'API key setup, validation, and common error handling.',
    badgeColor: '#6366F1',
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Bearer Token Signature',
        description: 'Check HMAC SHA-256 validity and tenant API access tier permissions.',
      },
      {
        stepNumber: 2,
        title: 'Refresh Expired OAuth Scope',
        description: 'Issue a refreshed 60-minute token and revoke compromised credentials.',
      },
      {
        stepNumber: 3,
        title: 'Verify Rate Limit Headers',
        description: 'Check 429 response quotas and reset counter in Redis cache.',
      },
    ],
    checklist: [
      'Tenant ID matches registered GaarX customer account',
      'API rate limit headers evaluated in telemetry dashboard',
      'Endpoint scopes authorized for requested resources',
    ],
  },
  {
    id: 'kb-4',
    title: 'User Account Recovery',
    company: 'SomPay',
    category: 'Account Management',
    readTime: '2 min read',
    description: 'Password reset, account lock, and recovery workflows.',
    badgeColor: '#38BDF8',
    steps: [
      {
        stepNumber: 1,
        title: 'Verify Customer Primary Phone & ID',
        description: 'Confirm last 4 digits of government ID and registered MSISDN.',
      },
      {
        stepNumber: 2,
        title: 'Dispatch One-Time Recovery Challenge',
        description: 'Send cryptographic challenge SMS with 15-minute expiration time.',
      },
      {
        stepNumber: 3,
        title: 'Unlock Account & Reset Biometric Profile',
        description: 'Clear security freeze upon challenge verification.',
      },
    ],
    checklist: [
      'MSISDN verified with carrier network gateway',
      'Account lockout flag reset in identity directory',
      'Security audit trail logged with agent ID',
    ],
  },
  {
    id: 'kb-5',
    title: 'Order Processing',
    company: 'MuuqWear',
    category: 'Logistics & Orders',
    readTime: '3 min read',
    description: 'Cancel orders, issue refunds, and handle order exceptions.',
    badgeColor: '#6366F1',
    steps: [
      {
        stepNumber: 1,
        title: 'Check Warehouse Packing Queue State',
        description: 'Ensure order is in "Unfulfilled" or "Awaiting Pickup" state before modification.',
      },
      {
        stepNumber: 2,
        title: 'Halt Automated Conveyor Sort',
        description: 'Signal the automated fulfillment line to divert order crate #MW-EXP.',
      },
      {
        stepNumber: 3,
        title: 'Process Store Credit or Refund',
        description: 'Credit customer wallet or initiate card processor chargeback avoidance refund.',
      },
    ],
    checklist: [
      'Inventory count re-incremented in warehouse database',
      'Customer notified via automated email confirmation',
      'Support ticket status updated to Resolved',
    ],
  },
];

const MACROS_LIST = [
  'Welcome message — New customer',
  'Shipping label reissue instructions',
  'Payment dispute resolution',
  'Account recovery steps',
  'Escalation to engineering',
];

const MACRO_TEMPLATES: Record<string, string> = {
  'Welcome message — New customer':
    'Hello! Welcome to KobNeti Support. How can I assist you with your workspace and product integrations today?',
  'Shipping label reissue instructions':
    'I have verified your shipment status. A replacement shipping label has been generated with priority tracking via DHL Express (#MW-98234-DHL).',
  'Payment dispute resolution':
    'We have opened the payment dispute case file. Please confirm the courier signature confirmation and timestamped receipt.',
  'Account recovery steps':
    'To verify account ownership, please confirm the last 4 digits of your registered ID. A 15-minute challenge PIN will be dispatched via SMS.',
  'Escalation to engineering':
    'I am escalating this ticket directly to the core engineering team for live log telemetry inspection.',
};

export interface LiveChatViewProps {
  isEscalationOpen?: boolean;
  onOpenEscalation?: () => void;
  onCloseEscalation?: () => void;
}

export const LiveChatView: React.FC<LiveChatViewProps> = ({
  isEscalationOpen: propIsEscalationOpen,
  onOpenEscalation,
  onCloseEscalation,
}) => {
  // Navigation & Filtering
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [chats, setChats] = useState<ChatItem[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>('c2'); // Dianne Russell default
  const [searchQuery, setSearchQuery] = useState('');
  const [kbSearchQuery, setKbSearchQuery] = useState('');

  // Active chat & messages
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [replyText, setReplyText] = useState('');
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [showMacros, setShowMacros] = useState(false);

  // KB Articles & Interactive SOP
  const [selectedKbId, setSelectedKbId] = useState<string>('kb-1');
  const [openedKbId, setOpenedKbId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    'c1-0': true,
    'c1-1': true,
    'c1-2': false,
  });

  // Close chat confirmation modal
  const [isCloseChatModalOpen, setIsCloseChatModalOpen] = useState(false);

  // Sticky note state
  const [userNotesMap, setUserNotesMap] = useState<Record<string, UserNote>>(INITIAL_USER_NOTES);
  const [isStickyNoteOpen, setIsStickyNoteOpen] = useState(false);
  const [isEditingStickyNote, setIsEditingStickyNote] = useState(false);
  const [stickyNotePos, setStickyNotePos] = useState({ x: 320, y: 130 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const [stickyHex, setStickyHex] = useState<string>(() => getSavedStickyColorHex());
  const stickyTheme = getStickyNoteColor(stickyHex);

  useEffect(() => {
    const handleColorChange = (e: any) => {
      if (e.detail?.hex) {
        setStickyHex(e.detail.hex);
      }
    };
    window.addEventListener('kobneti:sticky-color-change', handleColorChange);
    return () => window.removeEventListener('kobneti:sticky-color-change', handleColorChange);
  }, []);

  // Escalation modal state
  const [internalEscalateModalOpen, setInternalEscalateModalOpen] = useState(false);
  const isEscalateModalOpen =
    propIsEscalationOpen !== undefined ? propIsEscalationOpen : internalEscalateModalOpen;
  const setEscalateModalOpen = (open: boolean) => {
    setInternalEscalateModalOpen(open);
    if (open) {
      onOpenEscalation?.();
    } else {
      onCloseEscalation?.();
    }
  };
  const [escalateTarget, setEscalateTarget] = useState<'engineering' | 'support_manager' | 'agent'>(
    'engineering'
  );
  const [escalateAgent, setEscalateAgent] = useState('Sarah Jenkins');
  const [escalateSeverity, setEscalateSeverity] = useState('High');
  const [escalateReason, setEscalateReason] = useState('');
  const [escalationSuccessMsg, setEscalationSuccessMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const macrosRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];
  const selectedKb = KB_ARTICLES.find((a) => a.id === (openedKbId || selectedKbId)) || KB_ARTICLES[0];

  const handleConfirmCloseChat = () => {
    const sysMsg: Message = {
      id: `m-close-${Date.now()}`,
      sender: 'system',
      content: `Chat session closed by agent Adeel D.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), sysMsg],
    }));

    setIsCloseChatModalOpen(false);
  };

  const activeNote = userNotesMap[activeChatId] || {
    agent: 'Adeel D.',
    date: 'Nov 15, 2025 10:00 AM',
    reasonForContact: 'Customer inquired about sustainable design concepts',
    keyActionsTaken: [
      'Explained sustainable design principles',
      'Provided examples of eco-friendly materials',
    ],
    pinned: false,
  };

  const [editReasonText, setEditReasonText] = useState(activeNote.reasonForContact);
  const [editActionsText, setEditActionsText] = useState(activeNote.keyActionsTaken.join('\n'));

  // Update edit buffer when chat switches
  useEffect(() => {
    const note = userNotesMap[activeChatId] || {
      agent: 'Adeel D.',
      date: 'Nov 15, 2025 10:00 AM',
      reasonForContact: 'Customer inquired about sustainable design concepts',
      keyActionsTaken: [
        'Explained sustainable design principles',
        'Provided examples of eco-friendly materials',
      ],
      pinned: false,
    };
    setEditReasonText(note.reasonForContact);
    setEditActionsText(note.keyActionsTaken.join('\n'));
    setIsEditingStickyNote(false);
  }, [activeChatId, userNotesMap]);

  // Filtered chats by Company Carousel & Search input
  const filteredChats = chats.filter((c) => {
    const matchesCompany = selectedCompany === 'all' || c.company.toLowerCase() === selectedCompany.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q);
    return matchesCompany && matchesSearch;
  });

  // Filtered KB Articles by Search input
  const filteredKbArticles = KB_ARTICLES.filter((a) => {
    const q = kbSearchQuery.toLowerCase();
    return (
      !kbSearchQuery ||
      a.title.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  });

  const currentMessages = messagesMap[activeChatId] || [];

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, activeChatId]);

  // Click outside macros
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (macrosRef.current && !macrosRef.current.contains(e.target as Node)) {
        setShowMacros(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sticky note dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartOffset({
      x: e.clientX - stickyNotePos.x,
      y: e.clientY - stickyNotePos.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 380, e.clientX - dragStartOffset.x));
      const newY = Math.max(70, Math.min(window.innerHeight - 400, e.clientY - dragStartOffset.y));
      setStickyNotePos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartOffset]);

  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'agent',
      senderName: 'Adeel D.',
      content: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMessage: replyText.trim(), time: 'Just now', unreadCount: 0 }
          : c
      )
    );

    setReplyText('');
    setShowMacros(false);
  };

  const handleSaveStickyNote = () => {
    const actionsArray = editActionsText
      .split('\n')
      .map((a) => a.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    setUserNotesMap((prev) => ({
      ...prev,
      [activeChatId]: {
        agent: 'Adeel D.',
        date: 'Updated Just now',
        reasonForContact: editReasonText,
        keyActionsTaken: actionsArray.length > 0 ? actionsArray : activeNote.keyActionsTaken,
        pinned: activeNote.pinned,
      },
    }));
    setIsEditingStickyNote(false);
  };

  const handleDeleteStickyNote = () => {
    setUserNotesMap((prev) => ({
      ...prev,
      [activeChatId]: {
        agent: 'Adeel D.',
        date: 'Just now',
        reasonForContact: '',
        keyActionsTaken: [],
        pinned: false,
      },
    }));
    setIsStickyNoteOpen(false);
  };

  const handleTogglePinStickyNote = () => {
    setUserNotesMap((prev) => ({
      ...prev,
      [activeChatId]: {
        ...activeNote,
        pinned: !activeNote.pinned,
      },
    }));
  };

  const handleConfirmEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateReason.trim()) return;

    const targetLabel =
      escalateTarget === 'engineering'
        ? 'Engineering Team'
        : escalateTarget === 'support_manager'
        ? 'Support Team (Manager)'
        : `Agent: ${escalateAgent}`;

    const escalationNotice: Message = {
      id: `m-esc-${Date.now()}`,
      sender: 'system',
      content: `Ticket escalated to ${targetLabel} (${escalateSeverity} Severity). Reason: "${escalateReason.trim()}"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), escalationNotice],
    }));

    setEscalationSuccessMsg(`Escalated to ${targetLabel}`);
    setTimeout(() => {
      setEscalationSuccessMsg(null);
      setEscalateModalOpen(false);
      setEscalateReason('');
    }, 1200);
  };

  const handleAttachKbSnippet = (customText?: string) => {
    const textToInsert =
      customText ||
      `[SOP: ${selectedKb.title} — ${selectedKb.company}]\n${selectedKb.description}`;
    setReplyText((prev) => (prev ? `${prev}\n\n${textToInsert}` : textToInsert));
  };

  const handleSelectMacro = (macroTitle: string) => {
    const template = MACRO_TEMPLATES[macroTitle] || macroTitle;
    setReplyText((prev) => (prev ? `${prev}\n\n${template}` : template));
    setShowMacros(false);
  };

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden bg-[#F8F9FA] dark:bg-[#0B0F19] text-[#1A1A1A] dark:text-[#F8FAFC] relative font-sans">
      {/* Hidden button for header close link accessibility */}
      <button
        id="btn-close-live-chat"
        onClick={() => {
          setActiveChatId(INITIAL_CHATS[0].id);
        }}
        className="hidden"
        aria-hidden="true"
      />

      {/* THREE-COLUMN ATTIO-INSPIRED MAIN LAYOUT (25% Left, 40% Middle, 35% Right) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3.5 p-3.5 sm:p-4 overflow-hidden">
        {/* ========================================================================= */}
        {/* LEFT COLUMN (25%) — Active Conversations & Company Carousel               */}
        {/* ========================================================================= */}
        <div
          id="live-chat-left-conversations"
          className="w-full lg:w-[25%] shrink-0 bg-white dark:bg-[#111827] rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-3.5 flex flex-col h-full min-h-0 overflow-hidden transition-all duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <h2 className="text-[16px] font-[600] tracking-tight text-[#1A1A1A] dark:text-[#F8FAFC]">
              Conversations
            </h2>
            <span className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] bg-[#F8F9FA] dark:bg-slate-800/60 px-2 py-0.5 rounded-[7px] border border-[#E2E8F0] dark:border-slate-700">
              12 active
            </span>
          </div>

          {/* Search Input (Placed above categories) */}
          <div className="pt-2.5 pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
            <div className="relative flex items-center border-b border-[#E2E8F0] dark:border-slate-800 focus-within:border-[#6366F1] transition-colors duration-150">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 mr-2" />
              <input
                type="text"
                id="search-conversations-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full py-1 bg-transparent text-[13px] font-[450] text-[#1A1A1A] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none border-0 ring-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Company Carousel (Categories with Left/Right arrow navigation) */}
          <div className="py-2.5 border-b border-[#E2E8F0] dark:border-slate-800 relative group/carousel">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-[600] uppercase tracking-wider text-[#94A3B8]">
                Select Brand
              </span>
              <div className="flex items-center gap-1">
                <button
                  id="btn-carousel-scroll-left"
                  onClick={() => {
                    carouselRef.current?.scrollBy({ left: -140, behavior: 'smooth' });
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Previous brands"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  id="btn-carousel-scroll-right"
                  onClick={() => {
                    carouselRef.current?.scrollBy({ left: 140, behavior: 'smooth' });
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Next brands"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar snap-x scroll-smooth"
            >
              {COMPANIES.map((comp) => {
                const isCompActive = selectedCompany === comp.id || (comp.id === 'all' && selectedCompany === 'all');
                return (
                  <button
                    key={comp.id}
                    id={`company-carousel-card-${comp.id}`}
                    onClick={() => setSelectedCompany(comp.id)}
                    style={
                      isCompActive
                        ? {
                            boxShadow: '0 0 10px rgba(99,102,241,0.35)',
                            borderColor: '#6366F1',
                          }
                        : undefined
                    }
                    className={`shrink-0 w-[125px] h-[62px] p-2 rounded-[12px] text-left transition-all duration-150 cursor-pointer snap-start flex flex-col justify-between ${
                      isCompActive
                        ? 'bg-white dark:bg-[#1E293B] border border-[#6366F1] ring-1 ring-[#6366F1]/30'
                        : 'bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_2px_6px_rgba(99,102,241,0.08)]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[13px]">🏢</span>
                      <span className="text-[12px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                        {comp.name}
                      </span>
                    </div>
                    <div className="text-[11px] font-[450] text-[#64748B] dark:text-[#94A3B8]">
                      {comp.activeChatsCount} active chat{comp.activeChatsCount === 1 ? '' : 's'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation List (scrollable) */}
          <div
            id="conversations-list-container"
            className="flex-1 min-h-0 overflow-y-auto mt-2 space-y-1 pr-0.5 custom-scrollbar"
          >
            {filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const initials = chat.name
                .split(' ')
                .map((n) => n[0])
                .join('');

              return (
                <button
                  key={chat.id}
                  id={`conversation-item-${chat.id}`}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setChats((prev) =>
                      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  className={`w-full text-left p-2.5 rounded-[7px] transition-all duration-150 cursor-pointer relative flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-[#F1F4F9] dark:bg-indigo-950/30 border-l-2 border-l-[#6366F1] pl-2'
                      : 'hover:bg-[#F8F9FA] dark:hover:bg-slate-800/40 bg-transparent'
                  }`}
                >
                  {/* Left edge active indicator dot (3px) */}
                  {chat.online && (
                    <span className="absolute left-1 top-4 w-[3px] h-[3px] rounded-full bg-emerald-500" />
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-[600] ${
                        isActive || chat.online
                          ? 'bg-[#6366F1] text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {initials}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[15px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                        {chat.name}
                      </span>
                      <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] font-[450] shrink-0">
                        {chat.time}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] font-[450] truncate mt-0.5">
                      {chat.lastMessage}
                    </p>

                    <div className="flex items-center justify-between mt-1.5">
                      {/* Glowing Light Company Badge */}
                      <span
                        style={{
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          color: '#6366F1',
                          boxShadow: '0 0 12px rgba(99,102,241,0.08)',
                          border: '1px solid rgba(99, 102, 241, 0.15)',
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-[500] px-2.5 py-0.5 rounded-[12px]"
                      >
                        <span>{chat.company}</span>
                      </span>

                      {/* Unread badge (Primary pill) */}
                      {!!chat.unreadCount && chat.unreadCount > 0 && !isActive && (
                        <span className="inline-flex items-center justify-center px-1.5 py-0.2 min-w-4 h-4 rounded-full bg-[#6366F1] text-white text-[10px] font-bold">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredChats.length === 0 && (
              <div className="text-center py-10 text-[13px] text-[#64748B] dark:text-[#94A3B8]">
                No conversations found in {selectedCompany === 'all' ? 'any company' : selectedCompany}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MIDDLE COLUMN (40%) — Active Conversation Thread                          */}
        {/* ========================================================================= */}
        <div
          id="live-chat-middle-thread"
          className="w-full lg:w-[40%] shrink-0 bg-white dark:bg-[#111827] rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-3.5 sm:p-4 flex flex-col h-full min-h-0 overflow-hidden transition-all duration-150"
        >
          {/* Conversation Header (Attio-style, clean) */}
          <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-full ${
                  activeChat.online
                    ? 'bg-[#6366F1] text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                } flex items-center justify-center font-[600] text-[13px] shrink-0`}
              >
                {activeChat.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="min-w-0">
                <div className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] truncate">
                  {activeChat.name}
                </div>
                <div className="text-[12px] font-[450] text-[#64748B] dark:text-[#94A3B8]">
                  {activeChat.online ? 'Online' : 'Offline'} · Customer
                </div>
              </div>
            </div>

            {/* Header Ghost Links: Sticky Note, Escalate, Close Chat */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-conversation-sticky-note"
                onClick={() => setIsStickyNoteOpen(!isStickyNoteOpen)}
                className={`text-[12px] font-[500] px-2.5 py-1 rounded-[7px] transition-colors duration-150 cursor-pointer ${
                  isStickyNoteOpen
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-[#B95F00] font-semibold'
                    : 'text-[#B95F00] hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-[#9A4F00]'
                }`}
              >
                Sticky Note
              </button>

              <button
                id="btn-conversation-escalate"
                onClick={() => setEscalateModalOpen(true)}
                className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1 rounded-[7px] transition-colors duration-150 cursor-pointer"
              >
                Escalate
              </button>

              <button
                id="btn-conversation-close-chat"
                onClick={() => setIsCloseChatModalOpen(true)}
                className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#EF4444] dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1 rounded-[7px] transition-colors duration-150 cursor-pointer"
              >
                Close Chat
              </button>
            </div>
          </div>

          {/* Message Thread (Scrollable, 16px between messages) */}
          <div
            id="chat-message-thread"
            className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar"
          >
            {currentMessages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="py-2 my-1">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100 dark:border-slate-800" />
                      </div>
                      <span className="relative bg-white dark:bg-[#111827] px-3 text-[12px] text-[#64748B] dark:text-[#94A3B8] italic font-[450]">
                        {msg.content} · {msg.time}
                      </span>
                    </div>
                  </div>
                );
              }

              const isAgent = msg.sender === 'agent';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isAgent ? 'items-end' : 'items-start'
                  } transition-opacity duration-150`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-[12px] text-[15px] font-[450] leading-relaxed break-words shadow-2xs ${
                      isAgent
                        ? 'bg-[#6366F1] text-white'
                        : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#1A1A1A] dark:text-[#F8FAFC]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Timestamp below message */}
                  <span
                    className={`text-[11px] font-[450] text-[#64748B] dark:text-[#94A3B8] mt-1 ${
                      isAgent ? 'text-right pr-1' : 'text-left pl-1'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer (Attio-style, minimal) */}
          <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 shrink-0 space-y-2 relative">
            {/* Macros Dropdown Menu */}
            {showMacros && (
              <div
                ref={macrosRef}
                className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-[#1E293B] rounded-[12px] shadow-lg border border-[#E2E8F0] dark:border-slate-700 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2.5 py-1 text-[11px] font-[600] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] border-b border-slate-100 dark:border-slate-700">
                  Quick Macros
                </div>
                <div className="space-y-0.5 mt-1">
                  {MACROS_LIST.map((macro) => (
                    <button
                      key={macro}
                      type="button"
                      onClick={() => handleSelectMacro(macro)}
                      className="w-full text-left px-2.5 py-2 rounded-[7px] text-[13px] text-[#1A1A1A] dark:text-[#F8FAFC] hover:bg-[#F8F9FA] dark:hover:bg-slate-800 transition-colors duration-150 cursor-pointer truncate"
                    >
                      {macro}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div
              className={`border-b transition-colors duration-150 ${
                isComposerFocused
                  ? 'border-[#6366F1]'
                  : 'border-[#E2E8F0] dark:border-slate-800'
              }`}
            >
              <textarea
                id="composer-reply-textarea"
                rows={2}
                value={replyText}
                onFocus={() => setIsComposerFocused(true)}
                onBlur={() => setIsComposerFocused(false)}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write your reply..."
                className="w-full p-2 bg-transparent text-[15px] font-[450] text-[#1A1A1A] dark:text-[#F8FAFC] placeholder-[#94A3B8] resize-none focus:outline-none border-0 ring-0 custom-scrollbar"
              />
            </div>

            {/* Action buttons footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-composer-macros"
                  onClick={() => setShowMacros(!showMacros)}
                  className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-white cursor-pointer transition-colors duration-150"
                >
                  Macros
                </button>
                <button
                  type="button"
                  id="btn-composer-attach-kb"
                  onClick={() => handleAttachKbSnippet()}
                  className="text-[12px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-white cursor-pointer transition-colors duration-150"
                >
                  Attach KB
                </button>
              </div>

              <button
                type="button"
                id="btn-send-composer-reply"
                onClick={handleSendMessage}
                disabled={!replyText.trim()}
                className={`px-4 py-1.5 rounded-[12px] text-[13px] font-[600] transition-all duration-150 cursor-pointer ${
                  replyText.trim()
                    ? 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-xs active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN (35%) — Knowledge Base (Single Article at a Time + Back)     */}
        {/* ========================================================================= */}
        <div
          id="live-chat-right-knowledge-base"
          className="w-full lg:w-[35%] shrink-0 bg-white dark:bg-[#111827] rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_1px_3px_rgba(99,102,241,0.05)] p-3.5 sm:p-4 flex flex-col h-full min-h-0 overflow-hidden transition-all duration-150"
        >
          {/* Panel Header */}
          <div className="pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
            <h2 className="text-[18px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
              Knowledge Base
            </h2>
            <p className="text-[13px] font-[450] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Interactive step-by-step procedures, visual schematics &amp; checklists
            </p>
          </div>

          {/* Search (shown in article list mode) */}
          {!openedKbId && (
            <div className="pt-2 pb-1">
              <div className="relative flex items-center border-b border-[#E2E8F0] dark:border-slate-800 focus-within:border-[#6366F1] transition-colors duration-150">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 mr-2" />
                <input
                  type="text"
                  id="search-procedures-input"
                  value={kbSearchQuery}
                  onChange={(e) => setKbSearchQuery(e.target.value)}
                  placeholder="Search procedures, error codes, refund policies, API docs..."
                  className="w-full py-1.5 bg-transparent text-[13px] font-[450] text-[#1A1A1A] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none border-0 ring-0"
                />
                {kbSearchQuery && (
                  <button onClick={() => setKbSearchQuery('')} className="p-1 text-[#94A3B8]">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scrollable Container: Either Article List OR Single Opened Article */}
          <div className="flex-1 min-h-0 overflow-y-auto mt-2 space-y-3.5 pr-0.5 custom-scrollbar">
            {!openedKbId ? (
              /* KB Article List (When no article is opened) */
              <div className="space-y-2">
                <div className="text-[11px] font-[600] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] px-1 flex items-center justify-between">
                  <span>Available Procedures</span>
                  <span>{filteredKbArticles.length} articles</span>
                </div>
                {filteredKbArticles.map((article) => {
                  return (
                    <button
                      key={article.id}
                      id={`kb-article-item-${article.id}`}
                      onClick={() => {
                        setOpenedKbId(article.id);
                        setSelectedKbId(article.id);
                        setActiveStep(1);
                      }}
                      className="w-full text-left p-3 rounded-[10px] transition-all duration-150 cursor-pointer border border-[#E2E8F0] dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-[#1E293B] hover:shadow-[0_2px_8px_rgba(99,102,241,0.08)] group"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[14px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] group-hover:text-[#6366F1] transition-colors truncate">
                          {article.title}
                        </span>
                        <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] shrink-0 font-[450]">
                          {article.readTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.08)',
                            color: '#6366F1',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                          }}
                          className="text-[11px] font-[500] px-2 py-0.2 rounded-[12px]"
                        >
                          {article.company}
                        </span>
                        <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                          {article.category}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] truncate mt-1 leading-snug">
                        {article.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-[500] text-[#6366F1] pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                        <span>{article.steps.length} interactive steps</span>
                        <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Open procedure &rarr;
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Single KB Article View (1 article open at a time with back navigation) */
              <div className="space-y-3">
                {/* Back button header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
                  <button
                    id="btn-back-to-kb-articles"
                    onClick={() => setOpenedKbId(null)}
                    className="inline-flex items-center gap-1.5 text-[12px] font-[600] text-[#6366F1] hover:text-[#4F46E5] px-2 py-1 -ml-1 rounded-[7px] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Articles</span>
                  </button>
                  <span className="text-[11px] font-[500] text-[#64748B] dark:text-[#94A3B8]">
                    {selectedKb.readTime}
                  </span>
                </div>

                {/* Article Container */}
                <div className="rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 bg-[#F8F9FA]/60 dark:bg-slate-900/40 p-3.5 space-y-3">
                  {/* Title & Attach */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                        {selectedKb.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.08)',
                            color: '#6366F1',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                          }}
                          className="text-[11px] font-[500] px-2 py-0.2 rounded-[12px]"
                        >
                          {selectedKb.company}
                        </span>
                        <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                          {selectedKb.category}
                        </span>
                      </div>
                    </div>

                    {/* Attach to Reply Button */}
                    <button
                      onClick={() =>
                        handleAttachKbSnippet(
                          `[KB: ${selectedKb.title}]\n${selectedKb.description}\nProcedure Reference: step 1-3 verified.`
                        )
                      }
                      className="text-[12px] font-[500] text-[#6366F1] hover:text-[#4F46E5] hover:underline cursor-pointer transition-colors shrink-0 mt-0.5"
                    >
                      Attach to Reply
                    </button>
                  </div>

                  <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    {selectedKb.description}
                  </p>

                  {/* Step-by-Step Workflow (3 steps, clean progress) */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between gap-1">
                      {selectedKb.steps.map((step) => (
                        <button
                          key={step.stepNumber}
                          onClick={() => setActiveStep(step.stepNumber)}
                          className={`flex-1 py-1 rounded-[7px] text-[11px] font-[600] text-center transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                            activeStep === step.stepNumber
                              ? 'bg-[#6366F1] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              activeStep === step.stepNumber ? 'bg-white' : 'bg-slate-400'
                            }`}
                          />
                          <span>Step {step.stepNumber}</span>
                        </button>
                      ))}
                    </div>

                    {/* Step Details */}
                    {selectedKb.steps.map((step) => {
                      if (step.stepNumber !== activeStep) return null;
                      return (
                        <div
                          key={step.stepNumber}
                          className="p-3 bg-white dark:bg-[#1E293B] rounded-[7px] border border-[#E2E8F0] dark:border-slate-800 text-[12px] space-y-1 animate-in fade-in duration-150"
                        >
                          <div className="font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                            {step.title}
                          </div>
                          <div className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                            {step.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Waybill Card (compact, clean) - rendered for shipping/logistics or when available */}
                  {selectedKb.waybillData && (
                    <div className="p-3 rounded-[7px] bg-[#1A1A1A] text-white space-y-1.5 font-mono text-[10px] shadow-sm">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span>{selectedKb.waybillData.code}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300">
                          DHL-EXP-48H
                        </span>
                      </div>
                      <div className="text-slate-300">
                        ORIGIN HUB: {selectedKb.waybillData.origin}
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>{selectedKb.waybillData.carrier}</span>
                        <span>{selectedKb.waybillData.weight}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-700">
                        DATAMATRIX: {selectedKb.waybillData.datamatrix}
                      </div>
                    </div>
                  )}

                  {/* SOP Compliance Checklist */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[12px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                      SOP Compliance Checklist
                    </div>

                    <div className="space-y-2">
                      {selectedKb.checklist.map((item, idx) => {
                        const key = `c1-${idx}`;
                        const isChecked = checklistState[key] ?? (idx === 0);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setChecklistState((prev) => ({ ...prev, [key]: !prev[key] }))
                            }
                            className="w-full text-left flex items-start gap-2 text-[13px] cursor-pointer"
                          >
                            <span className="shrink-0 mt-0.5">{isChecked ? '✅' : '⬜'}</span>
                            <span
                              className={`leading-snug text-[13px] ${
                                isChecked
                                  ? 'text-[#1A1A1A] dark:text-[#F8FAFC]'
                                  : 'text-[#64748B] dark:text-[#94A3B8]'
                              }`}
                            >
                              {item}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Info Card (bottom of right column) */}
            <div className="rounded-[12px] border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-[#1E293B] p-3 space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  {activeChat.name}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-[500] text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Online</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#64748B] dark:text-[#94A3B8]">
                  Customer
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366F1',
                    boxShadow: '0 0 12px rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                  }}
                  className="text-[11px] font-[500] px-2 py-0.2 rounded-[12px]"
                >
                  {activeChat.company}
                </span>
              </div>
              <div className="text-[13px] text-[#64748B] dark:text-[#94A3B8] font-mono pt-0.5">
                {activeChat.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING STICKY NOTE (Attio-inspired, refined, draggable)                 */}
      {/* ========================================================================= */}
      {isStickyNoteOpen && (
        <div
          id="floating-sticky-note"
          style={{
            left: `${stickyNotePos.x}px`,
            top: `${stickyNotePos.y}px`,
            backgroundColor: stickyTheme.hex,
            color: stickyTheme.textHex,
          }}
          className="fixed z-50 w-[360px] rounded-[28px] shadow-2xl p-5 select-none animate-in fade-in zoom-in-95 duration-150 transition-all border border-black/10"
        >
          {/* Header */}
          <div
            onMouseDown={handleMouseDown}
            className="flex items-center justify-between pb-2 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2 font-[600] text-[14px]" style={{ color: stickyTheme.textHex }}>
              <span className="text-base">📝</span>
              <span className="font-sans">Docket Note — {activeChat.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleTogglePinStickyNote}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeNote.pinned
                    ? 'bg-[#18181B] text-amber-400 shadow-xs'
                    : 'bg-black/10 hover:bg-black/20 text-[#1E1B18]'
                }`}
                title={activeNote.pinned ? 'Pinned note' : 'Pin note'}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsStickyNoteOpen(false)}
                className="w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-[#1E1B18] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Color palette selector within note */}
          <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
            {STICKY_NOTE_COLORS.slice(0, 6).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setStickyHex(c.hex);
                  saveStickyColorHex(c.hex);
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full border border-black/20 shrink-0 transition-transform ${
                  stickyHex.toLowerCase() === c.hex.toLowerCase()
                    ? 'ring-2 ring-[#18181B] scale-110 shadow-xs'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                title={c.name}
              />
            ))}
          </div>

          {/* Meta */}
          <div
            style={{ color: stickyTheme.subtextHex }}
            className="pb-2 text-[12px] font-medium flex items-center justify-between"
          >
            <span>
              Agent: <strong>{activeNote.agent}</strong>
            </span>
            <span>{activeNote.date}</span>
          </div>

          {/* Content */}
          <div className="py-2 text-[13px] space-y-2.5">
            {isEditingStickyNote ? (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: stickyTheme.textHex }}>
                    Reason for Contact:
                  </label>
                  <textarea
                    rows={2}
                    value={editReasonText}
                    onChange={(e) => setEditReasonText(e.target.value)}
                    className="w-full p-2.5 bg-white/90 dark:bg-slate-900/90 border border-black/15 rounded-[12px] text-[13px] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: stickyTheme.textHex }}>
                    Key Actions Taken (one per line):
                  </label>
                  <textarea
                    rows={3}
                    value={editActionsText}
                    onChange={(e) => setEditActionsText(e.target.value)}
                    className="w-full p-2.5 bg-white/90 dark:bg-slate-900/90 border border-black/15 rounded-[12px] text-[13px] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#18181B]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsEditingStickyNote(false)}
                    className="px-3 py-1.5 text-[12px] font-[500] rounded-[10px] bg-black/10 hover:bg-black/20 text-[#1E1B18] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveStickyNote}
                    className="px-4 py-1.5 text-[12px] font-[600] rounded-[10px] bg-[#18181B] text-white hover:bg-black cursor-pointer shadow-xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="font-[600] text-[12px]" style={{ color: stickyTheme.textHex }}>
                    Reason for Contact:
                  </div>
                  <div className="leading-snug mt-0.5 text-[14px] font-[500]" style={{ color: stickyTheme.textHex }}>
                    {activeNote.reasonForContact || 'This is Docket note.'}
                  </div>
                </div>

                <div>
                  <div className="font-[600] text-[12px]" style={{ color: stickyTheme.textHex }}>
                    Key Actions Taken:
                  </div>
                  <ul className="space-y-1 mt-1 font-[500] text-[13px]" style={{ color: stickyTheme.textHex }}>
                    {activeNote.keyActionsTaken.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          {!isEditingStickyNote && (
            <div
              className="pt-3 flex items-center justify-between text-[12px]"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingStickyNote(true)}
                  className="px-3 py-1.5 rounded-[10px] bg-black/10 hover:bg-black/20 text-[#1E1B18] transition-colors flex items-center gap-1.5 font-[500] cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDeleteStickyNote}
                  className="px-3 py-1.5 rounded-[10px] bg-black/10 hover:bg-black/20 text-[#1E1B18] transition-colors flex items-center gap-1.5 font-[500] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#18181B] text-white flex items-center justify-center shadow-xs">
                <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESCALATION MODAL (Centered overlay, backdrop blur, 16px radius)           */}
      {/* ========================================================================= */}
      {isEscalateModalOpen && (
        <div
          id="escalate-conversation-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-slate-700 p-5 space-y-4 animate-in zoom-in-95 duration-200 text-[#1A1A1A] dark:text-[#F8FAFC]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-slate-700">
              <div className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC] font-display">
                Escalate Conversation — {activeChat.name}
              </div>
              <button
                onClick={() => setEscalateModalOpen(false)}
                className="p-1 rounded-[7px] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {escalationSuccessMsg ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-[15px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Escalation Dispatched
                </div>
                <div className="text-[13px] text-[#64748B] dark:text-[#94A3B8]">{escalationSuccessMsg}</div>
              </div>
            ) : (
              <form onSubmit={handleConfirmEscalate} className="space-y-3.5">
                {/* Escalate To Radio Options */}
                <div className="space-y-2">
                  <label className="block text-[12px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                    Escalate to:
                  </label>
                  <div className="space-y-1.5 text-[13px] text-[#1A1A1A] dark:text-[#F8FAFC]">
                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-[7px] hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input
                        type="radio"
                        name="escalate-target"
                        checked={escalateTarget === 'engineering'}
                        onChange={() => setEscalateTarget('engineering')}
                        className="text-[#6366F1] focus:ring-[#6366F1]"
                      />
                      <span>Engineering Team</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-[7px] hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input
                        type="radio"
                        name="escalate-target"
                        checked={escalateTarget === 'support_manager'}
                        onChange={() => setEscalateTarget('support_manager')}
                        className="text-[#6366F1] focus:ring-[#6366F1]"
                      />
                      <span>Support Team (Manager)</span>
                    </label>

                    <div className="flex items-center gap-2 p-1.5 rounded-[7px] hover:bg-slate-50 dark:hover:bg-slate-800">
                      <label className="flex items-center gap-2 cursor-pointer shrink-0">
                        <input
                          type="radio"
                          name="escalate-target"
                          checked={escalateTarget === 'agent'}
                          onChange={() => setEscalateTarget('agent')}
                          className="text-[#6366F1] focus:ring-[#6366F1]"
                        />
                        <span>Specific Agent:</span>
                      </label>
                      <select
                        disabled={escalateTarget !== 'agent'}
                        value={escalateAgent}
                        onChange={(e) => setEscalateAgent(e.target.value)}
                        className="flex-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[12px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none disabled:opacity-50"
                      >
                        <option value="Sarah Jenkins">Sarah Jenkins (Tier 2)</option>
                        <option value="Michael Ross">Michael Ross (Logistics)</option>
                        <option value="Elena Rostova">Elena Rostova (DevOps)</option>
                        <option value="David Vance">David Vance (Fintech)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Severity Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                    Severity:
                  </label>
                  <select
                    value={escalateSeverity}
                    onChange={(e) => setEscalateSeverity(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[13px] font-[500] text-[#1A1A1A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                {/* Reason for Escalation */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                    Reason for Escalation: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={escalateReason}
                    onChange={(e) => setEscalateReason(e.target.value)}
                    placeholder="Describe why this conversation is being escalated..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700 rounded-[7px] text-[13px] text-[#1A1A1A] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:bg-white dark:focus:bg-slate-800 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0] dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setEscalateModalOpen(false)}
                    className="px-3.5 py-2 text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!escalateReason.trim()}
                    className="px-4 py-2 text-[13px] font-[600] bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-[7px] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Confirm Escalate
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CLOSE CHAT CONFIRMATION MODAL                                             */}
      {/* ========================================================================= */}
      {isCloseChatModalOpen && (
        <div
          id="close-chat-confirmation-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-slate-700 p-5 space-y-4 animate-in zoom-in-95 duration-150 text-[#1A1A1A] dark:text-[#F8FAFC]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/60 text-[#EF4444] flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-[600] text-[#1A1A1A] dark:text-[#F8FAFC]">
                  Are you sure you want to close the chat?
                </h3>
                <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Closing this session will end the active live conversation with{' '}
                  <strong className="text-[#1A1A1A] dark:text-white">{activeChat.name}</strong> ({activeChat.company}).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0] dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsCloseChatModalOpen(false)}
                className="px-3.5 py-1.5 text-[13px] font-[500] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[7px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-close-chat"
                onClick={handleConfirmCloseChat}
                className="px-4 py-1.5 text-[13px] font-[600] bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-[7px] shadow-xs transition-colors cursor-pointer"
              >
                Yes, Close Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
