import React, { useState } from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { Ruler, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface TechnicalSpecsProps {
  onOrderClick: () => void;
}

export const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ onOrderClick }) => {
  const [doorThickness, setDoorThickness] = useState('40-60mm');
  const [doorMaterial, setDoorMaterial] = useState('Wooden');
  const [swingDirection, setSwingDirection] = useState('Right Inward');
  const [activeSpecImage, setActiveSpecImage] = useState<'mortise' | 'parameters'>('mortise');

  return (
    <section id="specifications" className="py-24 bg-gray-50 border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#FFF9D6] border border-[#F5C518] px-3.5 py-1 rounded-full text-black mb-3">
            <span>Engineering & Dimensions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
            PRODUCT TECHNICAL SPECIFICATIONS.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 font-normal">
            Precision-engineered 6068 security mortise lock body built with SUS 304 solid stainless steel.
          </p>
        </div>

        {/* 2-Column Split: Image on Left, Dimensions Table & Compatibility Tool on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Technical Schematic Display (6 cols) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-white border-2 border-black/10 shadow-xl group">
              {/* Tab Selector */}
              <div className="p-2 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
                <button
                  onClick={() => setActiveSpecImage('mortise')}
                  className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    activeSpecImage === 'mortise'
                      ? 'bg-[#F5C518] text-black shadow-sm'
                      : 'text-gray-600 hover:text-black bg-white'
                  }`}
                >
                  Mortise 24*240 (60 68)
                </button>
                <button
                  onClick={() => setActiveSpecImage('parameters')}
                  className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    activeSpecImage === 'parameters'
                      ? 'bg-[#F5C518] text-black shadow-sm'
                      : 'text-gray-600 hover:text-black bg-white'
                  }`}
                >
                  Panel Size 70*420 mm
                </button>
              </div>

              <div className="relative aspect-square sm:aspect-[4/3] bg-white flex items-center justify-center p-3">
                <img
                  src={
                    activeSpecImage === 'mortise'
                      ? PRODUCT_DATA.images.mortise
                      : PRODUCT_DATA.images.parameters
                  }
                  alt={
                    activeSpecImage === 'mortise'
                      ? '6068 Stainless Steel Security Mortise Lock Body Specifications'
                      : 'Lock Panel Parameter Dimensions (70x420mm)'
                  }
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#997300] font-bold">
                      {activeSpecImage === 'mortise' ? 'Mortise Specifications' : 'Panel Parameters'}
                    </span>
                    <h3 className="text-sm font-black text-black mt-0.5 font-heading">
                      {activeSpecImage === 'mortise'
                        ? 'Standard 24*240 (60 68) Dimensions'
                        : '70 mm Width x 420 mm Total Height'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-black bg-[#F5C518] px-2.5 py-1 rounded-md border border-black/10">
                    Universal L/R Reversible
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Advertised Dimensions Table (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl bg-white border-2 border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-black text-white flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-black flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#F5C518]" />
                  Advertised Mortise Dimensions
                </span>
                <span className="text-xs text-[#F5C518] font-bold">Standard 6068 Format</span>
              </div>

              <div className="divide-y divide-gray-200">
                {PRODUCT_DATA.mortiseDimensions.map((spec, i) => (
                  <div key={i} className="p-4 flex items-center justify-between text-sm hover:bg-yellow-50/30">
                    <div>
                      <span className="font-bold text-black block text-xs sm:text-sm">
                        {spec.label}
                      </span>
                      <span className="text-xs text-gray-500">{spec.detail}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm sm:text-base font-black text-black tabular-nums font-mono">
                        {spec.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Notice */}
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#997300] shrink-0 mt-0.5" />
              <div className="text-xs text-gray-800 leading-relaxed font-medium">
                <strong className="text-black block mb-0.5">Measurement Verification:</strong>
                Customers must verify their door dimensions and existing lock cavity before ordering. You can specify your door type in the order form below.
              </div>
            </div>

            {/* Quick Interactive Door Compatibility Form */}
            <div className="p-5 rounded-2xl bg-white border-2 border-black/10 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider font-black text-black font-heading">
                  Quick Door Fit Pre-Check:
                </h4>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Highly Adaptable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-gray-600 font-bold block mb-1">Door Thickness</label>
                  <select
                    value={doorThickness}
                    onChange={(e) => setDoorThickness(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-black font-medium focus:border-black focus:outline-none"
                  >
                    <option value="35-40mm">35 mm - 40 mm</option>
                    <option value="40-60mm">40 mm - 60 mm (Most Common)</option>
                    <option value="60-90mm">60 mm - 90 mm</option>
                    <option value="90mm+">Above 90 mm</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-600 font-bold block mb-1">Door Material</label>
                  <select
                    value={doorMaterial}
                    onChange={(e) => setDoorMaterial(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-black font-medium focus:border-black focus:outline-none"
                  >
                    <option value="Wooden">Solid / Flush Wood</option>
                    <option value="Metal">Armored / Security Steel</option>
                    <option value="Aluminum">Aluminum Frame</option>
                    <option value="Composite">Composite / Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-600 font-bold block mb-1">Opening Swing</label>
                  <select
                    value={swingDirection}
                    onChange={(e) => setSwingDirection(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-black font-medium focus:border-black focus:outline-none"
                  >
                    <option value="Right Inward">Right Inward Push</option>
                    <option value="Left Inward">Left Inward Push</option>
                    <option value="Right Outward">Right Outward Pull</option>
                    <option value="Left Outward">Left Outward Pull</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-gray-600 font-medium">
                  Latch Direction is fully reversible on installation.
                </span>
                <button
                  onClick={onOrderClick}
                  className="px-5 py-2.5 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-xs uppercase tracking-wider border border-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Order — ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
