import React, { useState } from 'react';
import { Send, Sparkles, Bot, User, X, MessageSquare } from 'lucide-react';

interface PublicLiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const PublicLiveChatModal: React.FC<PublicLiveChatModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! Welcome to KobNeti. I am your assistant. How can I help you today with MuuqWear, SomPay, GaarX, or our Enterprise Cloud Services?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: 'Just now',
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    const query = inputText.toLowerCase();
    setInputText('');

    setTimeout(() => {
      let reply =
        'Thank you for your question. A KobNeti solutions architect has been notified and can also follow up via email or phone.';

      if (query.includes('muuqwear') || query.includes('clothes') || query.includes('order') || query.includes('wear')) {
        reply =
          'MuuqWear is our flagship activewear and lifestyle line! Zenith Seamless sets are currently in stock with 2-day express global dispatch.';
      } else if (query.includes('sompay') || query.includes('payment') || query.includes('checkout') || query.includes('terminal')) {
        reply =
          'SomPay provides automated checkout, sub-second transaction routing, and multi-currency merchant ledger APIs. Would you like a demo sandbox key?';
      } else if (query.includes('gaarx') || query.includes('fleet') || query.includes('car') || query.includes('iot')) {
        reply =
          'GaarX provides high-frequency IoT telematics and real-time fleet diagnostics. It supports CAN-bus, OBD-II, and automated route dispatching.';
      } else if (query.includes('pricing') || query.includes('cost') || query.includes('enterprise')) {
        reply =
          'We offer tiered enterprise licensing and customized SLA packages. You can click "Get Started" to schedule a dedicated technical scoping session.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          timestamp: 'Just now',
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md animate-in slide-in-from-bottom-5">
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#4338CA] to-[#6366F1] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">KobNeti Live Assistant</div>
              <div className="text-[10px] text-indigo-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online & Ready
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white'
                    : 'bg-[#4338CA] text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#4338CA] text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Preset quick buttons */}
        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <button
            onClick={() => setInputText('Tell me about MuuqWear')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
          >
            MuuqWear
          </button>
          <button
            onClick={() => setInputText('How does SomPay work?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
          >
            SomPay APIs
          </button>
          <button
            onClick={() => setInputText('Enterprise SLA details')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
          >
            Enterprise SLA
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-indigo-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
