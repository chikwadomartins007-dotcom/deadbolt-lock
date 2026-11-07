import React from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { Shield, MapPin, ArrowUp, ShoppingBag, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOrderClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOrderClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white border-t-2 border-[#F5C518] text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-[#F5C518] flex items-center justify-center text-black">
                <Shield className="w-4 h-4 fill-current stroke-[2.5]" />
              </div>
              <span className="font-heading tracking-widest text-lg font-black text-white">
                MAX <span className="text-[#F5C518]">LUXURY</span>
              </span>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              {PRODUCT_DATA.tagline} Premium biometric security door locks with 3D facial recognition, palm vein detection, fingerprint scanning, and Tuya smartphone control across Nigeria.
            </p>

            <div className="pt-2 text-xs text-gray-500">
              Official Partner Store ·{' '}
              <a
                href="https://www.maxluxurybathrooms.shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#F5C518] underline transition-colors"
              >
                Max Luxury
              </a>
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#unlocking-methods" className="hover:text-[#F5C518] transition-colors">
                  8 Smart Ways to Unlock
                </a>
              </li>
              <li>
                <a href="#smartphone-control" className="hover:text-[#F5C518] transition-colors">
                  Tuya App & Smartphone Control
                </a>
              </li>
              <li>
                <a href="#specifications" className="hover:text-[#F5C518] transition-colors">
                  6068 Mortise Specifications
                </a>
              </li>
              <li>
                <a href="#why-max-luxury" className="hover:text-[#F5C518] transition-colors">
                  Traditional vs Max Luxury
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-[#F5C518] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Sales & Support Notice (3 cols - NO PRE-ORDER WHATSAPP NUMBER) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-heading">
              Order & Delivery Terms
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>Special Promo Price: ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>Payment on Delivery (Zero Prepayment)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>Nationwide Dispatch across Nigeria</span>
              </div>
              <p className="text-[11px] text-gray-400 pt-1 leading-snug">
                * Note: Dedicated dispatch & WhatsApp tracking details are provided instantly on your order confirmation screen upon checkout.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOrderClick}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Place Your Order Now</span>
              </button>
            </div>
          </div>

          {/* Back to top (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between items-start lg:items-end">
            <button
              onClick={scrollToTop}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
              aria-label="Scroll to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4 text-[#F5C518]" />
            </button>

            <div className="text-[11px] text-gray-400 mt-6 lg:mt-0 text-left lg:text-right font-medium">
              Verified Payment on Delivery
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} MAX LUXURY. All rights reserved.
          </div>
          <div className="text-center sm:text-right">
            Max Luxury Smart Security Door Lock · Advanced Biometric & Smartphone Access
          </div>
        </div>
      </div>
    </footer>
  );
};
