import React from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { Eye, Moon, Bell, ArrowRight } from 'lucide-react';

interface VisitorCameraProps {
  onOrderClick: () => void;
}

export const VisitorCamera: React.FC<VisitorCameraProps> = ({ onOrderClick }) => {
  return (
    <section className="py-24 bg-white border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Details & Split-Screen Copy (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#FFF9D6] border border-[#F5C518] px-3.5 py-1 rounded-full text-black">
              <span>Integrated Visual Door Viewer</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
              SEE WHO IS AT YOUR DOOR.
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              Never open your door blindly. The Max Luxury Smart Lock features an integrated wide-angle visual door viewer designed to help you verify visitors with crystal clarity before granting access.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="p-2.5 rounded-xl bg-[#F5C518] text-black shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black font-heading">
                    170° Wide-Angle Optical Lens
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Specially engineered optical glass covers a wide perimeter outside your entrance, eliminating common blind spots where visitors might stand out of view.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="p-2.5 rounded-xl bg-[#F5C518] text-black shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black font-heading">
                    Infrared Night Vision Sensor
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Integrated infrared illumination automatically activates in low-light environments, ensuring clear visitor identification even in completely dark hallways or unlit porches.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="p-2.5 rounded-xl bg-[#F5C518] text-black shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black font-heading">
                    Integrated Electronic Doorbell
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    When guests ring the touch doorbell, the system wakes the camera instantly, transmitting visual verification to the interior digital screen and your connected smartphone.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOrderClick}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-[#F5C518] text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                <span>Upgrade Door Security — ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Macro Optical Lens Image (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-white border-2 border-black/10 shadow-xl group">
              <div className="relative aspect-square sm:aspect-[4/3] bg-white flex items-center justify-center p-3">
                <img
                  src={PRODUCT_DATA.images.camera}
                  alt="High-definition wide-angle optical camera lens on Max Luxury Smart Lock"
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#997300] font-bold">
                    Optical Grade Visual Sensor
                  </div>
                  <div className="text-sm font-black text-black mt-0.5 font-heading">
                    Super Wide Angle Visual Cat's Eye Lens
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-black bg-[#F5C518] px-2.5 py-1 rounded-md border border-black/10">
                    170° Field of View
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
