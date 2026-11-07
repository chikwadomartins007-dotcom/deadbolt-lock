import React from 'react';
import { PRODUCT_DATA } from '../data/productData';
import {
  Smartphone,
  Video,
  Radio,
  Camera,
  Film,
  Users,
  KeySquare,
  SlidersHorizontal,
  ArrowRight,
  Info,
} from 'lucide-react';

interface SmartphoneControlProps {
  onOrderClick: () => void;
}

export const SmartphoneControl: React.FC<SmartphoneControlProps> = ({ onOrderClick }) => {
  const features = [
    {
      title: 'Remote Unlocking',
      desc: 'Remote unlocking through the supported smartphone app with secure token verification.',
      icon: <Smartphone className="w-5 h-5 text-black" />,
    },
    {
      title: 'Real-Time Communication',
      desc: 'Real-time two-way audio communication with visitors standing outside your door.',
      icon: <Radio className="w-5 h-5 text-black" />,
    },
    {
      title: 'Visitor Video Viewing',
      desc: 'Visitor video viewing where supported, letting you see who is ringing before opening.',
      icon: <Video className="w-5 h-5 text-black" />,
    },
    {
      title: 'Photo Capture',
      desc: 'Instant visual snapshot capture whenever visitors ring the integrated doorbell.',
      icon: <Camera className="w-5 h-5 text-black" />,
    },
    {
      title: 'Video Recording',
      desc: 'Video recording clips of doorbell interactions stored in your mobile app log.',
      icon: <Film className="w-5 h-5 text-black" />,
    },
    {
      title: 'Access Management',
      desc: 'Register and manage authorized users, family members, or staff members easily.',
      icon: <Users className="w-5 h-5 text-black" />,
    },
    {
      title: 'Temporary Access Codes',
      desc: 'Generate time-limited or one-time passcodes for domestic staff, guests, or deliveries.',
      icon: <KeySquare className="w-5 h-5 text-black" />,
    },
    {
      title: 'Smart Lock Management',
      desc: 'Review unlock history logs, battery level status, and security settings remotely.',
      icon: <SlidersHorizontal className="w-5 h-5 text-black" />,
    },
  ];

  return (
    <section id="smartphone-control" className="py-24 bg-gray-50 border-t border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-white border-2 border-black/10 shadow-xl group">
              <div className="relative aspect-square sm:aspect-[4/3] bg-white flex items-center justify-center p-3">
                <img
                  src={PRODUCT_DATA.images.smartphone}
                  alt="Tuya smartphone app controlling Max Luxury Smart Lock"
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* In-app Feature Callout */}
              <div className="p-6 bg-white border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase">Supported App Ecosystem</span>
                  <span className="text-black bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded font-black">
                    Tuya / Smart Life
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <p className="text-xs text-gray-700 font-medium">
                    Live 1080p visitor streaming with instant push doorbell alerts directly to your phone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Feature Grid (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#FFF9D6] border border-[#F5C518] px-3.5 py-1 rounded-full text-black">
              <span>Remote Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
              CONTROL YOUR DOOR FROM YOUR SMARTPHONE.
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              Whether you're at home, at work, or away, enjoy greater convenience and control over access to your property.
            </p>

            {/* 8 Features Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-black transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-[#F5C518] shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="text-sm font-black text-black font-heading">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Honest Connectivity Note */}
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#997300] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-800 leading-relaxed">
                <strong className="text-black">Product Connectivity Note:</strong> Remote functions depend on the product's connectivity, configuration, and supported app features within your local Wi-Fi or gateway environment.
              </p>
            </div>

            {/* CTA with price clearly visible */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOrderClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-lg transition-all cursor-pointer group"
              >
                <span>GET YOUR SMART LOCK TODAY — ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
