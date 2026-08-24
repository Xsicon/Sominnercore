import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Ticket,
  Code2,
  Users,
  Box,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: string, title: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mockSearchResults = [
    {
      id: 'res-1',
      category: 'Tickets',
      title: '#4210 Checkout failure on Safari',
      subtitle: 'Product: MuuqWear • Priority: High • Assigned to Adeel D.',
      icon: Ticket,
      color: 'text-[#6366F1]',
      bg: 'bg-indigo-50',
    },
    {
      id: 'res-2',
      category: 'Tickets',
      title: '#3981 Latency spike in webhook listener',
      subtitle: 'Product: Salguri • SLA window: 15m remaining',
      icon: Ticket,
      color: 'text-[#B95F00]',
      bg: 'bg-amber-50',
    },
    {
      id: 'res-3',
      category: 'Tasks',
      title: 'ENG-23 Implement OAuth v2 refresh rotation',
      subtitle: 'Assigned to Leila H. • In Review',
      icon: Code2,
      color: 'text-[#3B82F6]',
      bg: 'bg-blue-50',
    },
    {
      id: 'res-4',
      category: 'Products',
      title: 'MuuqWear E-Commerce Stack',
      subtitle: '42 open tickets • 99.4% SLA health',
      icon: Box,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      id: 'res-5',
      category: 'Users',
      title: 'Ibrahim M. (Lead Support Engineer)',
      subtitle: 'Support & Escalations Manager • Active now',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const filtered = mockSearchResults.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#6366F1]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets, tasks, users, products..."
            autoFocus
            className="w-full text-base text-[#0F172A] placeholder-[#64748B] outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto divide-y divide-slate-100">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item.category, item.title);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#0F172A] group-hover:text-[#6366F1] transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#64748B] truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#6366F1] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Search across 5 products and operations services</span>
          <div className="flex gap-2">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border rounded">ESC</kbd> to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
