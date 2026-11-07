import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { ShoppingBag, Zap } from 'lucide-react';

interface StickyMobileBarProps {
  onOrderClick: () => void;
  onQuickOrderClick?: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onOrderClick, onQuickOrderClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear when scrolled past hero
      setVisible(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-black px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200 text-[#101010]">
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-[#0088A8]">
          <span>A-01 PROMO</span>
          <span>·</span>
          <span className="text-black bg-yellow-200 px-1 rounded">PAY ON DELIVERY</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-lg font-black text-black tabular-nums font-heading">
            ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}
          </span>
          <span className="text-xs line-through text-red-500 font-semibold tabular-nums">
            ₦250k
          </span>
        </div>
      </div>

      <button
        onClick={onQuickOrderClick || onOrderClick}
        className="px-5 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
      >
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>Quick Order</span>
      </button>
    </div>
  );
};
