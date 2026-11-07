import React from 'react';
import { Home, Building2, Briefcase, Hotel, ArrowRight } from 'lucide-react';
import { PRODUCT_DATA } from '../data/productData';

interface PropertySpacesProps {
  onOrderClick: () => void;
}

export const PropertySpaces: React.FC<PropertySpacesProps> = ({ onOrderClick }) => {
  const spaces = [
    {
      title: 'Luxury Homes & Villas',
      subtitle: 'Residential Elegance',
      description:
        'Deliver frictionless hands-free arrival for your family. No fumbling with keys while carrying groceries, toddlers, or work bags.',
      icon: <Home className="w-6 h-6 text-black" />,
      benefits: ['Instant 3D Face Scan Entry', 'Family Access Management', 'Tamper Alert Notifications'],
    },
    {
      title: 'Apartments & Short-Lets',
      subtitle: 'Airbnb & Rental Properties',
      description:
        'Eliminate in-person key handovers. Issue custom time-limited passcodes to guests via WhatsApp or SMS that expire automatically at checkout.',
      icon: <Building2 className="w-6 h-6 text-black" />,
      benefits: ['Remote Passcode Generation', 'Automated Check-in / Check-out', 'Zero Lost Key Replacements'],
    },
    {
      title: 'Offices & Executive Suites',
      subtitle: 'Commercial Workspaces',
      description:
        'Secure executive offices, conference rooms, and sensitive archives. Track employee attendance logs and restrict off-hours access.',
      icon: <Briefcase className="w-6 h-6 text-black" />,
      benefits: ['Up to 100 Fingerprint Users', 'Audit Trail of All Access', 'Dual Verification Authentication'],
    },
    {
      title: 'Hotels & Guest Lodges',
      subtitle: 'Hospitality Architecture',
      description:
        'Provide VIP guests with prestigious NFC card tap or temporary PIN access, setting a luxurious high-tech first impression.',
      icon: <Hotel className="w-6 h-6 text-black" />,
      benefits: ['Contactless RFID Keycards', 'Premium Obsidian & Gold Finish', 'Emergency Physical Key Backup'],
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#FFF9D6] border border-[#F5C518] px-3.5 py-1 rounded-full text-black mb-3">
            <span>Versatile Architectural Integration</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
            SMART SECURITY FOR EVERY MODERN SPACE.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 font-normal">
            Engineered to blend seamlessly with premium wooden entrance doors, high-security armored steel doors, and modern commercial entrances.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {spaces.map((space, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-gray-50 border-2 border-gray-200 hover:border-black transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-[#F5C518] border border-black/10 shadow-sm">
                    {space.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
                    {space.subtitle}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-black font-heading">
                  {space.title}
                </h3>

                <p className="mt-3 text-sm text-gray-600 leading-relaxed font-normal">
                  {space.description}
                </p>

                <div className="mt-6 pt-5 border-t border-gray-200 space-y-2">
                  {space.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-800 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#F5C518]" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 flex items-center justify-between border-t border-gray-200">
                <span className="text-sm font-black text-black">
                  ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}
                </span>
                <button
                  onClick={onOrderClick}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5C518] hover:bg-[#E5B810] text-black text-xs font-black uppercase tracking-wider rounded-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Select & Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
