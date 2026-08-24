import React, { useState, useRef, useEffect } from 'react';
import {
  Hash,
  Search,
  Plus,
  Bell,
  BellOff,
  Paperclip,
  Send,
  Users,
  Smile,
  AtSign,
  Ticket,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  CheckCheck,
  Check,
  Circle,
  MoreVertical,
  Reply,
  Copy,
  Info,
  X,
  FileText,
  Image as ImageIcon,
  Pin,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  role: string;
  statusText?: string;
}

interface Message {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  isSystem?: boolean;
  repliesCount?: number;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface Channel {
  id: string;
  name: string;
  membersCount: number;
  unreadCount?: number;
  isMuted?: boolean;
  topic?: string;
}

const MEMBERS: Member[] = [
  { id: 'm-1', name: 'Adeel D.', avatar: 'AD', status: 'online', role: 'Lead Architect', statusText: 'In flow' },
  { id: 'm-2', name: 'Leila H.', avatar: 'LH', status: 'online', role: 'Staff QA Engineer', statusText: 'Running test matrix' },
  { id: 'm-3', name: 'Mike C.', avatar: 'MC', status: 'away', role: 'Backend Lead', statusText: 'Back at 11am' },
  { id: 'm-4', name: 'Sarah K.', avatar: 'SK', status: 'online', role: 'DevOps / Release', statusText: 'Deploying hotfixes' },
];

const CHANNELS: Channel[] = [
  { id: 'general', name: 'general', membersCount: 12, unreadCount: 0 },
  { id: 'platform-eng', name: 'platform-eng', membersCount: 8, unreadCount: 0 },
  { id: 'muuqwear-support', name: 'muuqwear-support', membersCount: 5, unreadCount: 0 },
  { id: 'random', name: 'random', membersCount: 3, unreadCount: 0 },
  { id: 'qa', name: 'qa', membersCount: 2, isMuted: true, unreadCount: 0, topic: 'Quality Assurance & automated test execution' },
];

const INITIAL_MESSAGES_QA: Message[] = [
  {
    id: 'msg-sys-1',
    author: 'System',
    avatar: '🔔',
    time: '9:45 AM',
    content: '🔔 Leila H. mentioned you in #platform-eng',
    isSystem: true,
  },
  {
    id: 'msg-1',
    author: 'Adeel D.',
    avatar: 'AD',
    time: '10:05 AM',
    content: '@Sarah deploying today at 2 PM. Need QA sign-off first on ticket #4210.',
  },
  {
    id: 'msg-2',
    author: 'Sarah K.',
    avatar: 'SK',
    time: '10:10 AM',
    content: '@Adeel are we deploying the hotfix today or tomorrow?',
  },
  {
    id: 'msg-3',
    author: 'Mike C.',
    avatar: 'MC',
    time: '10:15 AM',
    content: "@Leila I can help with that. Let's pair on it after standup regarding #4210 verification.",
  },
  {
    id: 'msg-4',
    author: 'Leila H.',
    avatar: 'LH',
    time: '10:20 AM',
    content: 'Just ran the test suite. All passing except the 3DS verification test on #4210.',
    repliesCount: 2,
  },
  {
    id: 'msg-5',
    author: 'Adeel D.',
    avatar: 'AD',
    time: '10:23 AM',
    content: 'Hey team, quick update on the QA process for the checkout fix.',
    repliesCount: 2,
  },
];

interface ThreadReply {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
}

const THREAD_REPLIES: ThreadReply[] = [
  {
    id: 'th-1',
    author: 'Leila H.',
    avatar: 'LH',
    time: '10:24 AM',
    content: "I'll run the tests again after the fix.",
  },
  {
    id: 'th-2',
    author: 'Sarah K.',
    avatar: 'SK',
    time: '10:26 AM',
    content: 'Let me know if you need any help with that.',
  },
];

interface InternalChatViewProps {
  isNewChannelModalOpen?: boolean;
  onOpenNewChannelModal?: () => void;
  onCloseNewChannelModal?: () => void;
}

export const InternalChatView: React.FC<InternalChatViewProps> = ({
  isNewChannelModalOpen: externalNewChannelOpen,
  onOpenNewChannelModal: externalOpenNewChannel,
  onCloseNewChannelModal: externalCloseNewChannel,
}) => {
  const [activeChannelId, setActiveChannelId] = useState('qa');
  const [activeDmUser, setActiveDmUser] = useState<string | null>(null);
  const [channelSearch, setChannelSearch] = useState('');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES_QA);
  const [inputText, setInputText] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  // Modals & internal state
  const [internalNewChannelOpen, setInternalNewChannelOpen] = useState(false);
  const isNewChannelOpen = externalNewChannelOpen ?? internalNewChannelOpen;
  const openNewChannel = externalOpenNewChannel ?? (() => setInternalNewChannelOpen(true));
  const closeNewChannel = externalCloseNewChannel ?? (() => setInternalNewChannelOpen(false));

  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');

  // Mention & Ticket autocomplete popup
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [ticketModalId, setTicketModalId] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Input Change for Autocomplete Triggers
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    const lastWord = val.split(/\s+/).pop() || '';
    if (lastWord.startsWith('@')) {
      setShowMentionPopup(true);
      setShowTicketPopup(false);
    } else if (lastWord.startsWith('#')) {
      setShowTicketPopup(true);
      setShowMentionPopup(false);
    } else {
      setShowMentionPopup(false);
      setShowTicketPopup(false);
    }
  };

  const insertMention = (name: string) => {
    const words = inputText.split(/\s+/);
    words.pop();
    const newText = [...words, `@${name.split(' ')[0]} `].join(' ');
    setInputText(newText);
    setShowMentionPopup(false);
  };

  const insertTicket = (ticketNum: string) => {
    const words = inputText.split(/\s+/);
    words.pop();
    const newText = [...words, `#${ticketNum} `].join(' ');
    setInputText(newText);
    setShowTicketPopup(false);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      author: 'Adeel D.',
      avatar: 'AD',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: inputText.trim(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setShowMentionPopup(false);
    setShowTicketPopup(false);

    // If @ mention used, show toast simulating notification trigger
    if (inputText.includes('@Leila') || inputText.includes('@Mike') || inputText.includes('@Sarah')) {
      showToast('Notification dispatched to mentioned team members');
    }
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const formattedName = newChannelName.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const newChan: Channel = {
      id: formattedName,
      name: formattedName,
      membersCount: 1,
      unreadCount: 0,
      topic: newChannelDesc.trim() || 'General discussion',
    };

    CHANNELS.push(newChan);
    setActiveChannelId(formattedName);
    setActiveDmUser(null);
    showToast(`Created channel #${formattedName}`);
    setNewChannelName('');
    setNewChannelDesc('');
    closeNewChannel();
  };

  // Helper to render message content with highlighted @mentions and clickable #ticket chips
  const renderFormattedMessage = (content: string) => {
    const parts = content.split(/(#[0-9]{3,5}|@[A-Za-z]+)/g);

    return parts.map((part, index) => {
      if (part.match(/^#[0-9]{3,5}$/)) {
        return (
          <button
            key={index}
            onClick={() => setTicketModalId(part)}
            className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-indigo-50 text-[#6366F1] border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-colors cursor-pointer active:scale-95 shadow-2xs"
            title="View Ticket Details"
          >
            <Ticket className="w-3 h-3" />
            <span>{part}</span>
          </button>
        );
      }
      if (part.match(/^@[A-Za-z]+$/)) {
        return (
          <span
            key={index}
            className="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold text-[11px] bg-indigo-50 text-[#6366F1] border border-indigo-100"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const filteredChannels = CHANNELS.filter((c) =>
    c.name.toLowerCase().includes(channelSearch.toLowerCase())
  );

  return (
    <div
      id="internal-chat-root"
      className="w-full flex-1 flex flex-col space-y-4 pb-4 animate-in fade-in duration-150"
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] dark:bg-[#1E293B] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 border border-slate-700 dark:border-indigo-500/30">
          <CheckCircle2 className="w-4 h-4 text-[#818CF8]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER                                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-[28px] font-[600] tracking-tight font-display text-[#0F172A] dark:text-[#F8FAFC]">
            Internal Chat
          </h1>
          <p className="text-[15px] text-[#64748B] dark:text-[#94A3B8] font-medium">
            Real-time communication with your team.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="page-header-new-channel-btn"
            onClick={openNewChannel}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-[#F8FAFC] text-xs font-semibold shadow-2xs transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-[#94A3B8]" />
            <span>+ New Channel</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3-COLUMN WORKSPACE LAYOUT (Channels / Messages / Members)                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[660px] bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[rgba(99,102,241,0.25)] shadow-xs overflow-hidden">
        
        {/* ========================================================================= */}
        {/* COLUMN 1 (~25% / lg:col-span-3) — Channels & Direct Messages               */}
        {/* ========================================================================= */}
        <div
          id="chat-col-channels"
          className="lg:col-span-3 border-r border-[#E2E8F0] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-3.5 flex flex-col justify-between overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-4">
            {/* Search channels */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search channels..."
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#818CF8] shadow-2xs"
              />
            </div>

            {/* SECTION: Channels */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[14px] font-[600] font-display uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Channels
                </span>
                <button
                  onClick={openNewChannel}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Create Channel"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0.5">
                {filteredChannels.map((c) => {
                  const isActive = activeChannelId === c.id && activeDmUser === null;
                  return (
                    <button
                      key={c.id}
                      id={`channel-item-${c.id}`}
                      onClick={() => {
                        setActiveChannelId(c.id);
                        setActiveDmUser(null);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[16px] font-[600] transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A] shadow-xs font-bold'
                          : 'text-slate-700 dark:text-[#94A3B8] hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Hash className={`w-4 h-4 ${isActive ? 'text-white dark:text-[#0F172A]' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                          isActive
                            ? 'bg-indigo-700/60 dark:bg-indigo-900/60 text-white dark:text-[#0F172A]'
                            : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-[#94A3B8]'
                        }`}
                      >
                        {c.membersCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION: Direct Messages */}
            <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
              <div className="flex items-center justify-between px-1">
                <span className="text-[14px] font-[600] font-display uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Direct Messages
                </span>
              </div>

              <div className="space-y-0.5">
                {MEMBERS.map((m) => {
                  const isActive = activeDmUser === m.id;
                  return (
                    <button
                      key={m.id}
                      id={`dm-member-${m.id}`}
                      onClick={() => {
                        setActiveDmUser(m.id);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-[#6366F1] dark:text-[#818CF8] font-bold border border-indigo-200 dark:border-indigo-800/40'
                          : 'text-slate-700 dark:text-[#94A3B8] hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                            {m.avatar}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
                              m.status === 'online'
                                ? 'bg-emerald-500'
                                : m.status === 'away'
                                ? 'bg-amber-400'
                                : 'bg-slate-300'
                            }`}
                          />
                        </div>
                        <span className="truncate">{m.name}</span>
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {m.status === 'online' ? '🟢' : m.status === 'away' ? '🟡' : '🔴'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* User connection card */}
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A] flex items-center justify-center font-bold text-[11px]">
                  AD
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
              </div>
              <div>
                <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-tight">Adeel D.</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">🟢 Connected</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2 (~50% / lg:col-span-6) — Message Thread & Composer                */}
        {/* ========================================================================= */}
        <div
          id="chat-col-thread"
          className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-[#1E293B] overflow-hidden border-r border-[#E2E8F0] dark:border-slate-800"
        >
          {/* Channel Header */}
          <div className="p-3.5 px-5 border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/40 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center font-bold text-xs">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-[600] font-display text-[#0F172A] dark:text-[#F8FAFC]">
                    {activeDmUser ? MEMBERS.find((m) => m.id === activeDmUser)?.name : `#${activeChannelId}`}
                  </h2>
                  <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] font-medium">· 2 members</span>
                </div>
                <p className="text-[12px] text-[#94A3B8]">
                  {activeChannelId === 'qa'
                    ? 'Quality Assurance & automated test execution'
                    : 'Real-time internal communication'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="toggle-channel-mute-btn"
                onClick={() => {
                  setIsMuted(!isMuted);
                  showToast(isMuted ? 'Channel notifications unmuted' : 'Channel notifications muted');
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#94A3B8] border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-indigo-50 dark:bg-indigo-950/50 text-[#6366F1] dark:text-[#818CF8] border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100'
                }`}
              >
                {isMuted ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                <span>{isMuted ? '🔔 Muted' : 'Active'}</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 custom-scrollbar">
            {messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div
                    key={msg.id}
                    className="flex items-center justify-center my-3 text-xs"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-[#94A3B8] font-medium text-[12px]">
                      <span>{msg.content}</span>
                      <span className="text-slate-400 font-mono text-[11px]">· {msg.time}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className="flex items-start gap-3 group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 p-2.5 rounded-xl transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      msg.author === 'Adeel D.'
                        ? 'bg-[#6366F1] text-white'
                        : msg.author === 'Leila H.'
                        ? 'bg-purple-600 text-white'
                        : msg.author === 'Mike C.'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {msg.avatar}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-[600] text-[14px] text-[#0F172A] dark:text-[#F8FAFC]">{msg.author}</span>
                      <span className="text-[12px] font-mono text-[#94A3B8]">{msg.time}</span>
                    </div>

                    <div className="text-[15px] font-[450] text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed">
                      {renderFormattedMessage(msg.content)}
                    </div>

                    {msg.repliesCount && (
                      <div className="pt-2">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-800 space-y-2">
                          <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#6366F1] dark:text-[#818CF8]">
                            <Reply className="w-3.5 h-3.5" />
                            <span>{msg.repliesCount} Thread Replies:</span>
                          </div>
                          <div className="pl-4 space-y-1.5 border-l-2 border-indigo-200 dark:border-indigo-900">
                            {THREAD_REPLIES.map((th) => (
                              <div key={th.id} className="text-[13px]">
                                <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{th.author}: </span>
                                <span className="text-[#64748B] dark:text-[#94A3B8]">{th.content}</span>
                                <span className="text-[11px] text-slate-400 font-mono ml-2">{th.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Autocomplete suggestions popups */}
          {showMentionPopup && (
            <div className="mx-4 mb-2 p-2 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-700 shadow-xl space-y-1 text-xs animate-in slide-in-from-bottom-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 block">
                Mention Team Member
              </span>
              <div className="grid grid-cols-2 gap-1">
                {MEMBERS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => insertMention(m.name)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors cursor-pointer text-xs"
                  >
                    <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">@{m.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-[#94A3B8]">({m.role})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showTicketPopup && (
            <div className="mx-4 mb-2 p-2 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-700 shadow-xl space-y-1 text-xs animate-in slide-in-from-bottom-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 block">
                Reference Ticket
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => insertTicket('4210')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer text-xs"
                >
                  <span className="font-mono font-bold text-[#6366F1] dark:text-[#818CF8]">#4210</span>
                  <span className="text-slate-600 dark:text-[#94A3B8] truncate ml-2">Checkout 3DS payment auth timeout error</span>
                </button>
                <button
                  onClick={() => insertTicket('4209')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer text-xs"
                >
                  <span className="font-mono font-bold text-[#6366F1] dark:text-[#818CF8]">#4209</span>
                  <span className="text-slate-600 dark:text-[#94A3B8] truncate ml-2">GaarX real-time driver telemetry lag</span>
                </button>
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="p-3 bg-slate-50/80 dark:bg-slate-900/40 border-t border-[#E2E8F0] dark:border-slate-800">
            <form onSubmit={handleSendMessage} className="space-y-2">
              <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E2E8F0] dark:border-slate-700 shadow-2xs focus-within:border-[#818CF8] focus-within:ring-1 focus-within:ring-[#818CF8]/20 transition-all p-2.5">
                <textarea
                  id="chat-composer-textarea"
                  rows={2}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Message #${activeChannelId}... (Type @ for team or # for tickets)`}
                  className="w-full text-[15px] font-[450] text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 bg-transparent resize-none focus:outline-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowMentionPopup(!showMentionPopup)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
                      title="Mention Member (@)"
                    >
                      <AtSign className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTicketPopup(!showTicketPopup)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
                      title="Reference Ticket (#)"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Attachment dialog opened (supports logs, images, and clips)')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Attach File</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    id="chat-send-btn"
                    disabled={!inputText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6366F1] dark:bg-[#818CF8] hover:bg-[#4F46E5] dark:hover:bg-[#A5B4FC] disabled:opacity-40 text-white dark:text-[#0F172A] text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3 (~25% / lg:col-span-3) — Members                                  */}
        {/* ========================================================================= */}
        <div
          id="chat-col-members"
          className="lg:col-span-3 bg-slate-50/40 dark:bg-slate-900/30 p-3.5 space-y-4 overflow-y-auto custom-scrollbar flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
              <span className="text-[14px] font-[600] font-display uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Members
              </span>
              <span className="text-[11px] font-semibold text-emerald-500">3 online</span>
            </div>

            <div className="space-y-2 text-xs">
              {MEMBERS.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/40 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">
                        {m.status === 'online' ? '🟢' : m.status === 'away' ? '🟡' : '🔴'}
                      </span>
                      <span className="font-[600] text-[13px] text-[#0F172A] dark:text-[#F8FAFC]">{m.name}</span>
                    </div>
                  </div>
                  <div className="text-[13px] text-[#64748B] dark:text-[#94A3B8] pl-3.5">{m.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Connection badge */}
          <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">WebSocket</span>
            </div>
            <span className="font-mono text-[10px] text-[#6366F1] dark:text-[#818CF8]">12ms</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* NEW CHANNEL MODAL                                                         */}
      {/* ========================================================================= */}
      {isNewChannelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="new-channel-modal"
            className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-[#6366F1] dark:text-[#818CF8]" />
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Create New Channel</h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Add a workspace discussion channel</p>
                </div>
              </div>
              <button
                onClick={closeNewChannel}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Channel Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-mono text-slate-400 text-xs">#</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. releases-2026"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#818CF8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Topic / Purpose (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Discussions regarding QA builds and test results"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#818CF8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeNewChannel}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6366F1] dark:bg-[#818CF8] hover:bg-[#4F46E5] dark:hover:bg-[#A5B4FC] text-white dark:text-[#0F172A] text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TICKET POPUP MODAL (When clicking #4210)                                   */}
      {/* ========================================================================= */}
      {ticketModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 text-[#6366F1] dark:text-[#818CF8] flex items-center justify-center font-bold text-xs shadow-2xs">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Ticket {ticketModalId}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      P1 - Critical
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">MuuqWear E-Commerce · Checkout Gateway</p>
                </div>
              </div>
              <button
                onClick={() => setTicketModalId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-sm mb-1">
                  Checkout 3DS verification timeout on European cards
                </h4>
                <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-[#E2E8F0] dark:border-slate-800">
                  Customers with 3D Secure enabled banking cards encounter a gateway timeout during step 2 authentication. Hotfix PR ready for deploy.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Assignee
                  </span>
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Leila H. (QA Staff)</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Status
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">In QA Review</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E2E8F0] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex items-center justify-end">
              <button
                onClick={() => setTicketModalId(null)}
                className="px-4 py-1.5 rounded-xl bg-[#6366F1] dark:bg-[#818CF8] text-white dark:text-[#0F172A] text-xs font-bold hover:bg-[#4F46E5] dark:hover:bg-[#A5B4FC] transition-colors cursor-pointer"
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
