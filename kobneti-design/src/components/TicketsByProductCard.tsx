import React, { useState } from 'react';
import { ExternalLink, Layers, Sparkles } from 'lucide-react';
import { ProductTicket } from '../types';

interface TicketsByProductCardProps {
  products: ProductTicket[];
  onViewAll: () => void;
}

export const TicketsByProductCard: React.FC<TicketsByProductCardProps> = ({
  products,
  onViewAll,
}) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Maximum value for horizontal bar calculation
  const maxTickets = Math.max(...products.map((p) => p.tickets), 50);

  return (
    <div
      id="tickets-by-product-card"
      className="bg-white rounded-[16px] p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">
            Tickets by Product
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Active workload distribution across 5 linked services
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6366F1] hover:text-indigo-700 hover:underline transition-colors px-2 py-1 rounded-md hover:bg-indigo-50"
        >
          <span>View all</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4">
        {products.map((item) => {
          const percentage = (item.tickets / maxTickets) * 100;
          const isHovered = hoveredProduct === item.name;

          return (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredProduct(item.name)}
              onMouseLeave={() => setHoveredProduct(null)}
              className={`p-2 rounded-xl transition-all ${
                isHovered ? 'bg-slate-50' : ''
              }`}
            >
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
                  <span className="font-medium text-[#0F172A]">{item.name}</span>
                  {item.slaStatus === 'At Risk' && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                      SLA Warning
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B]">
                    {item.openCount} active
                  </span>
                  <span className="font-semibold text-[#0F172A] w-7 text-right">
                    {item.tickets}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 relative">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out bg-[#6366F1]"
                  style={{
                    width: `${Math.max(percentage, 6)}%`,
                    opacity: isHovered ? 1 : 0.9,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
          <span>Total: 128 tickets assigned across platform</span>
        </div>
        <span className="text-slate-400">Updated 2m ago</span>
      </div>
    </div>
  );
};
