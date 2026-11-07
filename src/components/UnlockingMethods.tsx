import React, { useState } from 'react';
import { PRODUCT_DATA } from '../data/productData';
import {
  ScanFace,
  Hand,
  Fingerprint,
  KeyRound,
  CreditCard,
  Key,
  ShieldCheck,
  Smartphone,
  CheckCircle,
  Lock,
  Unlock,
  ArrowRight,
} from 'lucide-react';

interface UnlockingMethodsProps {
  onOrderClick: () => void;
}

export const UnlockingMethods: React.FC<UnlockingMethodsProps> = ({ onOrderClick }) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('facial');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ScanFace':
        return <ScanFace className="w-6 h-6 text-black" />;
      case 'Hand':
        return <Hand className="w-6 h-6 text-black" />;
      case 'Fingerprint':
        return <Fingerprint className="w-6 h-6 text-black" />;
      case 'KeyRound':
        return <KeyRound className="w-6 h-6 text-black" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-black" />;
      case 'Key':
        return <Key className="w-6 h-6 text-black" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-black" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-black" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-black" />;
    }
  };

  const handleSelectMethod = (id: string) => {
    setSelectedMethodId(id);
    setIsUnlocked(true);
    setTimeout(() => {
      setIsUnlocked(false);
    }, 2500);
  };

  const activeMethod = PRODUCT_DATA.unlockingMethods.find((m) => m.id === selectedMethodId) || PRODUCT_DATA.unlockingMethods[0];

  return (
    <section id="unlocking-methods" className="py-24 bg-white border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest bg-cyan-950/80 border border-[#00D2FF] px-4 py-1.5 rounded-full text-[#00D2FF] mb-3 shadow-sm">
            <span>A-01 MULTIPLE ACCESS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
            8 SMART WAYS TO UNLOCK YOUR DOOR.
          </h2>
          <p className="mt-4 text-lg text-gray-800 font-bold">
            Smart Access. Secure Every Day.
          </p>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            Choose how you enter every time with model A-01. Seamless 3D biometric recognition for everyday convenience, backup PINs for trusted guests, and mechanical keys for peace of mind.
          </p>
        </div>

        {/* Official Unlocking Methods Graphic Banner */}
        <div className="mb-14 bg-white rounded-3xl p-4 sm:p-6 border-2 border-black/10 max-w-4xl mx-auto shadow-lg">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] flex items-center justify-center">
            <img
              src={PRODUCT_DATA.images.biometrics}
              alt="Multiple Smart Unlocking Methods - Face, Palm Vein, Fingerprint, Password, NFC card, Key, Combination, App"
              className="max-h-full max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* 8 Smart Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCT_DATA.unlockingMethods.map((method, index) => {
            const isSelected = selectedMethodId === method.id;
            return (
              <div
                key={method.id}
                onClick={() => handleSelectMethod(method.id)}
                className={`relative rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-yellow-50/70 border-2 border-black shadow-lg ring-2 ring-[#F5C518]'
                    : 'bg-white border-2 border-gray-200 hover:border-black hover:bg-gray-50 hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-[#F5C518] border border-black/10 shadow-sm">
                      {getIcon(method.iconName)}
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-500">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Tag */}
                  <h3 className="text-lg font-black text-black font-heading">
                    {method.name}
                  </h3>
                  <div className="mt-1 text-[11px] font-bold text-[#997300] uppercase tracking-wider">
                    {method.tag}
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    {method.description}
                  </p>
                </div>

                {/* Bottom strip */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Speed: {method.speed}</span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                    {isSelected ? 'Simulating' : 'Click to test'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Biometric Simulator Panel */}
        <div className="mt-12 bg-black text-white border-2 border-[#F5C518] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isUnlocked ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-400' : 'bg-[#F5C518] text-black'
            }`}>
              {isUnlocked ? <Unlock className="w-7 h-7 animate-bounce" /> : <Lock className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Active Simulation:
                </span>
                <span className="text-xs font-black text-[#F5C518]">
                  {activeMethod.name}
                </span>
              </div>
              <p className="text-base font-black text-white mt-0.5 font-heading">
                {isUnlocked ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Authenticated & Door Unlocked
                  </span>
                ) : (
                  <span>Ready for {activeMethod.name} authentication</span>
                )}
              </p>
              <p className="text-xs text-gray-300 mt-1">
                {activeMethod.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
            <button
              onClick={() => handleSelectMethod(selectedMethodId)}
              className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider text-white border border-white/20 cursor-pointer transition-colors"
            >
              Retest Simulation
            </button>
            <button
              onClick={onOrderClick}
              className="flex-1 md:flex-initial px-6 py-3.5 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>Order Now — ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
