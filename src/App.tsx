/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA } from './data/productData';
import { initAllPixels, trackViewContent, trackInitiateCheckout, trackPurchase } from './utils/pixel';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ImageGallery } from './components/ImageGallery';
import { UnlockingMethods } from './components/UnlockingMethods';
import { SmartphoneControl } from './components/SmartphoneControl';
import { VisitorCamera } from './components/VisitorCamera';
import { LockComparison } from './components/LockComparison';
import { PropertySpaces } from './components/PropertySpaces';
import { TechnicalSpecs } from './components/TechnicalSpecs';
import { PricingSection } from './components/PricingSection';
import { OrderForm } from './components/OrderForm';
import { QuickOrderModal } from './components/QuickOrderModal';
import { BrandBenefits } from './components/BrandBenefits';
import { FaqSection } from './components/FaqSection';
import { StickyMobileBar } from './components/StickyMobileBar';
import { Footer } from './components/Footer';
import { ScrollProgressBar } from './components/ScrollProgressBar';

export default function App() {
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [hasCompletedOrder, setHasCompletedOrder] = useState(false);

  useEffect(() => {
    // Initialize both Meta Pixel (1690563088540181) and TikTok Pixel (DBNK5NJC77U6CGRG7ETG)
    initAllPixels();
    trackViewContent(PRODUCT_DATA.productName, PRODUCT_DATA.sellingPrice, 'NGN');

    // Enable instant test trigger when URL has ?test_purchase=1
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('test_purchase') === '1' || searchParams.get('test_purchase') === 'true') {
        const testRef = 'ML-TEST-' + Math.floor(100000 + Math.random() * 900000);
        trackPurchase(testRef, PRODUCT_DATA.sellingPrice, 'NGN', {
          fullName: 'Test Buyer',
          phoneNumber: '08147778029',
          city: 'Lagos',
          state: 'Lagos',
          quantity: 1,
        });
      }
    }
  }, []);

  const openQuickOrder = () => {
    trackInitiateCheckout(PRODUCT_DATA.sellingPrice, 'NGN', 1);
    setIsQuickOrderOpen(true);
  };

  // Automatically show the quick order pop-up every 35 seconds
  useEffect(() => {
    if (hasCompletedOrder) return;

    if (!isQuickOrderOpen) {
      const timer = setTimeout(() => {
        if (!hasCompletedOrder) {
          openQuickOrder();
        }
      }, 35000); // 35 seconds

      return () => clearTimeout(timer);
    }
  }, [isQuickOrderOpen, hasCompletedOrder]);

  const scrollToOrder = () => {
    trackInitiateCheckout(PRODUCT_DATA.sellingPrice, 'NGN', 1);
    const element = document.getElementById('order-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToFeatures = () => {
    const element = document.getElementById('unlocking-methods');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#101010] flex flex-col selection:bg-[#F5C518] selection:text-[#101010]">
      {/* Sticky Gold Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Top Navigation */}
      <Header onOrderClick={scrollToOrder} onQuickOrderClick={openQuickOrder} />

      <main className="flex-1">
        {/* 1. Hero Section: First Impression with High-Contrast Price */}
        <Hero onOrderClick={openQuickOrder} onExploreClick={scrollToFeatures} />

        {/* 2. Official Product Image Gallery */}
        <ImageGallery />

        {/* 3. 8 Smart Ways to Unlock Door */}
        <UnlockingMethods onOrderClick={openQuickOrder} />

        {/* 4. Remote Smartphone Control (Tuya App) */}
        <SmartphoneControl onOrderClick={openQuickOrder} />

        {/* 5. Advanced Visitor Door Camera */}
        <VisitorCamera onOrderClick={openQuickOrder} />

        {/* 6. Why Choose Max Luxury (Traditional vs Smart Lock) */}
        <LockComparison onOrderClick={openQuickOrder} />

        {/* 7. Perfect for Modern Properties */}
        <PropertySpaces onOrderClick={openQuickOrder} />

        {/* 8. Technical Mortise Specifications */}
        <TechnicalSpecs onOrderClick={openQuickOrder} />

        {/* 9. Product Price and Special Offer */}
        <PricingSection onOrderClick={openQuickOrder} />

        {/* 10. High-Converting Customer Order Form (WhatsApp appears only after order is placed) */}
        <OrderForm />

        {/* 11. Customer Reviews / Brand Benefits */}
        <BrandBenefits onOrderClick={openQuickOrder} />

        {/* 12. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Floating Quick Order Action Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={openQuickOrder}
          className="flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-black text-white hover:bg-neutral-900 border-2 border-[#F5C518] shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
          title="Open Quick 30-Second Order Form"
          aria-label="Open Quick Order Form"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5C518] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F5C518]"></span>
          </span>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
            ⚡ Quick Order <span className="text-[#F5C518]">· ₦180k</span>
          </span>
        </button>
      </div>

      {/* Quick Order Pop-Up Modal */}
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        onOrderSuccess={() => setHasCompletedOrder(true)}
      />

      {/* Sticky Mobile Buy Bar */}
      <StickyMobileBar onOrderClick={scrollToOrder} onQuickOrderClick={openQuickOrder} />

      {/* Sophisticated Luxury Footer */}
      <Footer onOrderClick={openQuickOrder} />
    </div>
  );
}
