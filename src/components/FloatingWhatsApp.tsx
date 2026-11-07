import React, { useState } from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${PRODUCT_DATA.whatsappNumber}?text=${encodeURIComponent(
    PRODUCT_DATA.defaultWhatsappMessage
  )}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="relative bg-[#1A1A1A] border border-white/15 text-white rounded-2xl p-3 shadow-2xl max-w-xs text-xs animate-in fade-in duration-300 hidden sm:block">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-neutral-400 hover:text-white p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[#F5C518]">Max Luxury Sales Support</span>
          </div>
          <p className="text-neutral-300 text-[11px] leading-snug">
            Need advice on price, delivery or door fit? Chat with us live on WhatsApp.
          </p>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-full shadow-2xl shadow-emerald-950/80 hover:scale-105 active:scale-95 transition-all group"
        aria-label="Chat with Max Luxury on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
