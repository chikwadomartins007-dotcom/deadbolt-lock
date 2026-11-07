import React from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { Check, Truck, Package, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

interface PricingSectionProps {
  onOrderClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOrderClick }) => {
  return (
    <section id="pricing" className="py-24 bg-white text-[#101010] border-t border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-[#00A3C4] text-xs font-mono font-black text-[#007A99] tracking-widest uppercase mb-3 shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Official Launch Offer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#101010] tracking-tight font-heading">
            UPGRADE YOUR SECURITY TODAY!
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 font-normal">
            Secure the genuine <strong className="text-black">A-01 Deadbolt Type Smart Lock</strong> at the exclusive promo rate. Payment on delivery nationwide.
          </p>
        </div>

        {/* Pricing Card & What's In The Box Container */}
        <div className="max-w-5xl mx-auto bg-slate-50 border-2 border-black rounded-3xl p-6 sm:p-12 shadow-xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Pricing & CTAs (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-[11px] font-mono font-bold text-[#007A99] uppercase mb-2">
                  <span>MODEL: A-01</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#101010] font-heading">
                  A-01 | DEADBOLT TYPE SMART LOCK
                </h3>
                <p className="text-xs text-[#0088A8] font-bold mt-1 uppercase tracking-wider">
                  SMART ACCESS. SECURE EVERY DAY.
                </p>
              </div>

              {/* Price Display Card - HIGH VISIBILITY MATCHING GRAPHIC */}
              <div className="p-6 rounded-2xl bg-black text-white border-2 border-[#F5C518] shadow-lg space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span className="font-medium">Regular Price:</span>
                  <span className="line-through text-gray-400 font-bold decoration-red-500 decoration-2 tabular-nums text-base">
                    ₦{PRODUCT_DATA.regularPrice.toLocaleString()}
                  </span>
                </div>

                <div className="pt-1 flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-[#00D2FF] font-mono font-black">
                    PROMO OFFER PRICE:
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-[#F5C518] drop-shadow-[0_0_20px_rgba(245,197,24,0.4)] tabular-nums font-heading tracking-tight">
                      ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-black bg-[#F5C518] px-2.5 py-1 rounded-lg">
                      SAVE ₦70,000
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-gray-200">
                  <span className="font-medium">Terms:</span>
                  <span className="font-black text-black bg-[#F5C518] px-3 py-1 rounded-md text-xs uppercase tracking-wider shadow">
                    Payment on Delivery
                  </span>
                </div>
              </div>

              {/* Sleek 5 Pillars from the Image */}
              <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-1.5 text-xs text-gray-800 shadow-sm">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0088A8] mb-1">
                  SLEEK DESIGN. ADVANCED PROTECTION.
                </div>
                {PRODUCT_DATA.sidePillars.slice(0, 3).map((pillar, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
                    <span className="font-medium">{pillar}</span>
                  </div>
                ))}
              </div>

              {/* Huge CTA Button */}
              <div>
                <button
                  onClick={onOrderClick}
                  className="w-full py-4 px-6 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-base uppercase tracking-wider border-2 border-black shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <span>UPGRADE YOUR SECURITY TODAY!</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Required Delivery & Installation Statement */}
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-300 flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#997300] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  <strong className="text-black">Delivery Note:</strong> Delivery availability, installation options, and delivery fees are confirmed with the customer upon phone verification.
                </p>
              </div>
            </div>

            {/* Right: What's in the Box & Key Features (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-[#0088A8]" />
                  <h4 className="text-sm font-black text-[#101010] uppercase tracking-wider font-heading">
                    What's In The Package
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-black bg-[#FFF9D6] border border-[#F5C518] px-2 py-0.5 rounded">
                  Complete Set
                </span>
              </div>

              {/* Uploaded Package Box Image */}
              <div className="relative aspect-[16/10] bg-gray-50 rounded-xl overflow-hidden p-2 flex items-center justify-center border border-gray-200">
                <img
                  src={PRODUCT_DATA.images.packageBox}
                  alt="A-01 Deadbolt Smart Lock Package Contents and Accessories"
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                {PRODUCT_DATA.packageContents.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-gray-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[11px] text-gray-500 font-bold block">Inspection</span>
                  <span className="text-xs font-black text-black">Check Before Paying</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200">
                  <span className="text-[11px] text-[#007A99] font-bold block">Delivery</span>
                  <span className="text-xs font-black text-black">Nationwide Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
