import React from 'react';
import { PRODUCT_DATA } from '../data/productData';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Headphones,
  CheckCircle,
  Package,
  ArrowRight,
} from 'lucide-react';

interface BrandBenefitsProps {
  onOrderClick: () => void;
}

export const BrandBenefits: React.FC<BrandBenefitsProps> = ({ onOrderClick }) => {
  const benefits = [
    {
      title: 'Precision SUS 304 Stainless Steel Mortise',
      desc: 'Engineered with solid multi-bolt internal deadbolts that provide robust mechanical resistance and structural integrity behind the biometric sensors.',
      icon: <Layers className="w-6 h-6 text-black" />,
    },
    {
      title: 'Under 0.4s High-Speed Biometric Response',
      desc: 'Advanced semiconductor fingerprint sensors and 3D facial recognition cameras authenticate legitimate users in fractions of a second.',
      icon: <Cpu className="w-6 h-6 text-black" />,
    },
    {
      title: 'Local Support & Installation Guidance',
      desc: 'Professional assistance for door measurement verification, installation guidance, and operational assistance across Nigerian cities.',
      icon: <Headphones className="w-6 h-6 text-black" />,
    },
    {
      title: 'Inspection Before Payment',
      desc: 'We support Payment on Delivery for eligible regions so you can inspect your package and verify the smart lock contents before making payment.',
      icon: <ShieldCheck className="w-6 h-6 text-black" />,
    },
  ];

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#FFF9D6] border border-[#F5C518] px-3.5 py-1 rounded-full text-black mb-3">
            <span>Verified Engineering & Reliability</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
            WHY CUSTOMERS CHOOSE MAX LUXURY.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 font-normal">
            Engineered with uncompromising hardware standards, premium obsidian-gold finishing, and authentic local customer service.
          </p>
        </div>

        {/* Visual Factory Testing & Certifications Graphic */}
        <div className="mb-12 bg-white rounded-3xl p-4 sm:p-6 border-2 border-black/10 max-w-4xl mx-auto shadow-md">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center">
            <img
              src={PRODUCT_DATA.images.certifications}
              alt="Max Luxury Smart Lock 10+ Year OEM/ODM Factory, Battery Life, Durability Testing and Certifications"
              className="max-h-full max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Brand Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-black transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="p-3 rounded-xl bg-[#F5C518] w-fit mb-5 border border-black/10 shadow-sm">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-black text-black font-heading">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {benefit.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs text-black font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Max Luxury Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Order Callout (NO WHATSAPP HERE) */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-black text-white border-2 border-[#F5C518] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5C518] text-black flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white font-heading">
                Ready to Upgrade Your Door Security?
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Special Offer: <span className="text-[#F5C518] font-bold text-sm">₦{PRODUCT_DATA.sellingPrice.toLocaleString()}</span> with Payment on Delivery across Nigeria.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOrderClick}
              className="px-6 py-3.5 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Order Now — Pay on Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
