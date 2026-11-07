import React from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { X, Check, Shield, ArrowRight } from 'lucide-react';

interface LockComparisonProps {
  onOrderClick: () => void;
}

export const LockComparison: React.FC<LockComparisonProps> = ({ onOrderClick }) => {
  const comparisonRows = [
    {
      feature: 'Primary Access Method',
      traditional: 'Depend mainly on physical brass keys',
      maxLuxury: '8 smart unlocking modes: Face, Palm, Fingerprint, PIN, App & Key',
    },
    {
      feature: 'Key Misplacement & Lockouts',
      traditional: 'Lost keys cause severe stress, costly locksmith bills & door damage',
      maxLuxury: 'Never get locked out — unlock in 0.3s with your face, palm or fingerprint',
    },
    {
      feature: 'Access Management & Sharing',
      traditional: 'Must physically cut duplicate keys; zero tracking of who has access',
      maxLuxury: 'Create temporary visitor PINs or register/delete users instantly in app',
    },
    {
      feature: 'Visitor Verification & Intercom',
      traditional: 'No built-in camera or audio; must walk to door or peephole',
      maxLuxury: 'Integrated wide-angle optical camera & two-way smartphone video communication',
    },
    {
      feature: 'Aesthetics & Curb Appeal',
      traditional: 'Standard industrial hardware with exposed screws and tarnished metal',
      maxLuxury: 'Sleek obsidian black finish with electroplated luxury gold accent trim',
    },
    {
      feature: 'Family & Staff Convenience',
      traditional: 'Juggling heavy keychains with groceries or packages in hand',
      maxLuxury: 'Hands-free contactless facial recognition as you approach the door',
    },
  ];

  return (
    <section id="why-max-luxury" className="py-24 bg-gray-50 border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest bg-cyan-950/80 border border-[#00D2FF] px-4 py-1.5 rounded-full text-[#00D2FF] mb-3 shadow-sm">
            <span>A-01 RELIABLE SECURITY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
            ORDINARY LOCKS ARE A THING OF THE PAST.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 font-normal">
            See why homeowners, Airbnb hosts, and business executives across Nigeria are retiring bulky keychains and upgrading to the <strong className="text-black">A-01 Deadbolt Type Smart Lock</strong>.
          </p>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop & Tablet Table */}
          <div className="hidden md:block rounded-3xl overflow-hidden border-2 border-black/10 bg-white shadow-xl">
            <div className="grid grid-cols-12 bg-black text-white p-6 text-sm font-bold font-heading">
              <div className="col-span-4 text-gray-300 uppercase tracking-wider text-xs">
                Key Comparison Area
              </div>
              <div className="col-span-4 text-gray-300 uppercase tracking-wider text-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Ordinary Traditional Locks
              </div>
              <div className="col-span-4 text-[#00D2FF] uppercase tracking-wider text-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D2FF]" />
                A-01 Deadbolt Smart Lock
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {comparisonRows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 p-6 items-center text-sm hover:bg-yellow-50/40 transition-colors"
                >
                  <div className="col-span-4 font-black text-black text-xs sm:text-sm font-heading pr-4">
                    {row.feature}
                  </div>
                  <div className="col-span-4 text-gray-600 text-xs sm:text-sm pr-4 flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{row.traditional}</span>
                  </div>
                  <div className="col-span-4 text-black text-xs sm:text-sm flex items-start gap-2.5 font-bold">
                    <Check className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5 stroke-[3]" />
                    <span>{row.maxLuxury}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Comparison Cards */}
          <div className="md:hidden space-y-4">
            {comparisonRows.map((row, index) => (
              <div key={index} className="p-5 rounded-2xl bg-white border-2 border-gray-200 space-y-3 shadow-sm">
                <h4 className="text-sm font-black text-black uppercase tracking-wider font-heading">
                  {row.feature}
                </h4>

                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-gray-800 flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-700 block mb-0.5">Traditional Lock:</span>
                    {row.traditional}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-black flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#997300] shrink-0 mt-0.5 stroke-[3]" />
                  <div>
                    <span className="font-bold text-black block mb-0.5">A-01 Deadbolt Smart Lock:</span>
                    {row.maxLuxury}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing & Order banner strip */}
          <div className="mt-8 p-6 rounded-2xl bg-[#FFF9D6] border-2 border-[#F5C518] flex items-center justify-between flex-wrap gap-4 shadow-md">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-black block">
                SPECIAL PRICE: ₦{PRODUCT_DATA.sellingPrice.toLocaleString()} (PAY ON DELIVERY)
              </span>
              <p className="text-xs text-gray-700 mt-0.5">
                Inspect physical lock at your doorstep before handing payment to delivery dispatch.
              </p>
            </div>
            <button
              onClick={onOrderClick}
              className="px-6 py-3 rounded-xl bg-black hover:bg-neutral-800 text-[#F5C518] text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
