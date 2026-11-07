import React, { useState } from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className="py-24 bg-white border-t border-gray-200 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#FFF9D6] border border-[#F5C518] px-3.5 py-1 rounded-full text-black mb-3">
            <span>Customer Clarifications</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
            FREQUENTLY ASKED QUESTIONS.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 font-normal">
            Clear, transparent answers to common questions about features, door compatibility, payment on delivery, and installation.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {PRODUCT_DATA.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-gray-50 border-2 border-gray-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-yellow-50/30 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-black text-black font-heading">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-full transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-black text-[#F5C518]' : 'bg-gray-200 text-black'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-200 bg-white animate-in fade-in duration-200 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Order Assistance Box (NO WHATSAPP SHOWN BEFORE ORDER) */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs uppercase tracking-wider text-black font-black block">
              Ready to Order with Zero Prepayment?
            </span>
            <p className="text-sm text-gray-600 mt-0.5">
              Lock in your promotional price of <strong className="text-black">₦{PRODUCT_DATA.sellingPrice.toLocaleString()}</strong> today. Pay on delivery after inspecting the lock.
            </p>
          </div>

          <a
            href="#order-form"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-xs uppercase tracking-wider border border-black shadow-md transition-all shrink-0"
          >
            <span>Proceed to Order Form</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
