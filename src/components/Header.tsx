import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { Shield, Zap, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onOrderClick: () => void;
  onQuickOrderClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrderClick, onQuickOrderClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 shadow-md'
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (single element with A-01 identity) */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-[#101010] whitespace-nowrap shrink-0 group"
          >
            <div className="px-2 py-1 rounded-lg bg-cyan-50 border-2 border-[#00A3C4] text-[#007A99] font-mono font-black text-xs sm:text-sm tracking-wider shadow-sm">
              A-01
            </div>
            <div className="flex flex-col">
              <span className="font-heading tracking-widest text-sm sm:text-base font-extrabold text-[#101010] leading-none">
                MAX <span className="text-[#0088A8]">LUXURY</span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider text-gray-500 leading-tight">
                DEADBOLT SMART LOCK
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wider uppercase text-gray-700">
            <a
              href="#unlocking-methods"
              className="hover:text-black transition-colors whitespace-nowrap shrink-0"
            >
              8 Access Modes
            </a>
            <a
              href="#smartphone-control"
              className="hover:text-black transition-colors whitespace-nowrap shrink-0"
            >
              Tuya & Camera
            </a>
            <a
              href="#specifications"
              className="hover:text-black transition-colors whitespace-nowrap shrink-0"
            >
              6068 Mortise
            </a>
            <a
              href="#pricing"
              className="hover:text-black transition-colors whitespace-nowrap shrink-0"
            >
              Promo Deal
            </a>
            <a
              href="#faqs"
              className="hover:text-black transition-colors whitespace-nowrap shrink-0"
            >
              FAQs
            </a>
          </nav>

          {/* Zone 3: 1 primary action with bold price & fast checkout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Promo Price
              </span>
              <span className="text-base font-extrabold text-[#101010] tabular-nums font-heading leading-tight">
                ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}
              </span>
            </div>

            <button
              onClick={onQuickOrderClick || onOrderClick}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs uppercase tracking-wider font-extrabold text-black bg-[#F5C518] hover:bg-[#E5B810] border-2 border-black rounded-xl transition-all duration-200 shadow-md hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Quick Order (Pay on Delivery)</span>
            </button>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-black focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 mt-2 space-y-3 shadow-2xl text-black">
          <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">A-01 Promo Offer:</span>
            <span className="text-lg font-black text-black tabular-nums">₦{PRODUCT_DATA.sellingPrice.toLocaleString()}</span>
          </div>
          <a
            href="#unlocking-methods"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-black py-1"
          >
            8 Ways to Unlock
          </a>
          <a
            href="#smartphone-control"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-black py-1"
          >
            Smartphone App & Camera
          </a>
          <a
            href="#specifications"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-black py-1"
          >
            Technical & Mortise Specs
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-black py-1"
          >
            Pricing & Package Box
          </a>
          <a
            href="#faqs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-700 hover:text-black py-1"
          >
            Frequently Asked Questions
          </a>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onQuickOrderClick) onQuickOrderClick();
                else onOrderClick();
              }}
              className="w-full py-3.5 text-xs uppercase tracking-wider font-black text-black bg-[#F5C518] hover:bg-[#E5B810] rounded-xl text-center shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-black"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now — ₦{PRODUCT_DATA.sellingPrice.toLocaleString()} (Pay on Delivery)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
