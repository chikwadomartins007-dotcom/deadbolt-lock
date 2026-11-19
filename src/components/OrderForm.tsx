import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA, NIGERIAN_STATES, calculateOrderPricing } from '../data/productData';
import {
  trackPurchase,
  trackLeadOrderSubmitted,
  trackContact,
  getFbp,
  getFbc,
  getTestEventCode,
  getTtclid,
} from '../utils/pixel';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  MessageSquare,
  Lock,
  ArrowRight,
  RotateCcw,
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Building,
  Check,
} from 'lucide-react';
import { ChristmasPromoCountdown } from './ChristmasPromoCountdown';

interface OrderFormProps {
  onSuccess?: () => void;
  selectedQuantity?: number;
  onQuantityChange?: (qty: number) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSuccess,
  selectedQuantity,
  onQuantityChange,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState(selectedQuantity || 1);

  useEffect(() => {
    if (typeof selectedQuantity === 'number' && selectedQuantity >= 1) {
      setQuantity(selectedQuantity);
    }
  }, [selectedQuantity]);

  const updateQuantity = (nextQty: number) => {
    const clamped = Math.max(1, Math.min(10, nextQty));
    setQuantity(clamped);
    if (onQuantityChange) onQuantityChange(clamped);
  };
  const [doorType, setDoorType] = useState('Wooden Door');
  const [installationRequired, setInstallationRequired] = useState<'Yes' | 'No' | 'Need Advice'>('Need Advice');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    referenceNumber: string;
    fullName: string;
    phoneNumber: string;
    whatsappNumber: string;
    state: string;
    city: string;
    address: string;
    quantity: number;
    subtotal: number;
    doorType: string;
    installation: string;
    timestamp: string;
  } | null>(null);

  // Dynamic calculations (₦5,000 off per product when buying 2+)
  const pricing = calculateOrderPricing(quantity);
  const unitPrice = pricing.effectiveUnitPrice;
  const baseUnitPrice = pricing.baseUnitPrice;
  const subtotal = pricing.subtotal;

  // Real-time validation touched tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Real-time validation checks
  const isNameValid = fullName.trim().length >= 2;
  const isNameError = Boolean(touched.fullName && !isNameValid);

  const phoneDigits = phoneNumber.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 14;
  const isPhoneError = Boolean(touched.phoneNumber && !isPhoneValid);

  const whatsappDigits = whatsappNumber.replace(/\D/g, '');
  const isWhatsappValid = Boolean(whatsappNumber && whatsappDigits.length >= 10 && whatsappDigits.length <= 14);
  const isWhatsappError = Boolean(touched.whatsappNumber && whatsappNumber.length > 0 && !isWhatsappValid);

  const isStateValid = Boolean(selectedState);
  const isStateError = Boolean(touched.selectedState && !isStateValid);

  const isCityValid = Boolean(city.trim().length >= 2);

  const isAddressValid = deliveryAddress.trim().length >= 8;
  const isAddressError = Boolean(touched.deliveryAddress && !isAddressValid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Mark all as touched on submit attempt
    markTouched('fullName');
    markTouched('phoneNumber');
    markTouched('selectedState');
    markTouched('deliveryAddress');

    // Friendly validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 9) {
      setErrorMessage('Please enter a valid phone number (e.g. 08012345678) so our dispatch team can contact you.');
      return;
    }

    if (!selectedState) {
      setErrorMessage('Please select your state in Nigeria for delivery.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage('Please provide your delivery address or nearest landmark.');
      return;
    }

    setIsSubmitting(true);

    const generatedRef = 'ML-' + Math.floor(100000 + Math.random() * 900000);

    const orderPayload = {
      orderReference: generatedRef,
      product: PRODUCT_DATA.productName,
      unitPrice: `₦${unitPrice.toLocaleString()}`,
      quantity: quantity,
      bulkDiscount: pricing.hasBulkDiscount ? `₦${pricing.totalBulkDiscount.toLocaleString()} (₦5,000 off each)` : 'None',
      subtotal: `₦${subtotal.toLocaleString()}`,
      deliveryFee: 'To Be Confirmed',
      paymentMethod: 'Payment on Delivery',
      customerName: fullName.trim(),
      phone: phoneNumber.trim(),
      whatsapp: whatsappNumber.trim() || phoneNumber.trim(),
      state: selectedState,
      city: city.trim() || selectedState,
      address: deliveryAddress.trim(),
      doorType: doorType,
      installationRequired: installationRequired,
      additionalInstructions: additionalInstructions.trim() || 'None',
      fbp: getFbp(),
      fbc: getFbc(),
      ttclid: getTtclid(),
      testEventCode: getTestEventCode(),
      eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      clientUserAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      submittedAt: new Date().toISOString(),
    };

    try {
      // 1. Post to local server endpoint /api/orders
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(orderPayload),
      }).catch((netErr) => {
        console.warn('Network sync notice (order saved locally):', netErr);
      });

      // 2. Post directly to Formspree for instant email delivery to merchant
      const formspreeUrl = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mzereloe';
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New A-01 Smart Lock Order [${generatedRef}] - ${fullName.trim()} (${selectedState})`,
          orderReference: generatedRef,
          customerName: fullName.trim(),
          phone: phoneNumber.trim(),
          whatsapp: whatsappNumber.trim() || phoneNumber.trim(),
          deliveryState: selectedState,
          deliveryCity: city.trim() || selectedState,
          deliveryAddress: deliveryAddress.trim(),
          product: PRODUCT_DATA.productName,
          model: 'A-01 DEADBOLT TYPE SMART LOCK',
          quantity: quantity,
          unitPrice: `₦${unitPrice.toLocaleString()}`,
          bulkDiscount: pricing.hasBulkDiscount ? `₦${pricing.totalBulkDiscount.toLocaleString()} (₦5,000 off each)` : 'None',
          subtotal: `₦${subtotal.toLocaleString()}`,
          doorType: doorType,
          installationRequired: installationRequired,
          additionalInstructions: additionalInstructions.trim() || 'None',
          paymentMethod: 'Payment on Delivery',
          orderSource: 'Main Landing Page Order Form',
          submittedAt: new Date().toLocaleString(),
        }),
      }).catch((formspreeErr) => {
        console.warn('Formspree direct email notification notice:', formspreeErr);
      });

      // 3. Save in browser localStorage for offline durability
      try {
        const stored = JSON.parse(localStorage.getItem('ml_placed_orders') || '[]');
        stored.unshift(orderPayload);
        localStorage.setItem('ml_placed_orders', JSON.stringify(stored.slice(0, 15)));
      } catch (storageErr) {
        console.warn('Storage notice:', storageErr);
      }

      // 3. Confirm order immediately to user
      const confirmationRecord = {
        referenceNumber: generatedRef,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        state: selectedState,
        city: city.trim() || selectedState,
        address: deliveryAddress.trim(),
        quantity: quantity,
        subtotal: subtotal,
        doorType: doorType,
        installation: installationRequired,
        timestamp: new Date().toLocaleString(),
      };
      setOrderConfirmation(confirmationRecord);

      // 4. Fire Meta & TikTok Purchase event (with CAPI and Events API server sync)
      trackPurchase(generatedRef, subtotal, 'NGN', {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        city: city.trim() || selectedState,
        state: selectedState,
        address: deliveryAddress.trim(),
        quantity: quantity,
      });

      // Update URL query string for URL-based pixel rules and Meta Event Setup Tool
      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
        window.history.pushState(
          { orderId: generatedRef },
          '',
          `${window.location.pathname}?order_success=true&order_id=${generatedRef}#order-confirmation`
        );
      }

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error('Order submission fallback triggered:', err);
      // Guarantee order confirmation view and fire tracking even if network hiccups
      trackPurchase(generatedRef, subtotal, 'NGN', {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        city: city.trim() || selectedState,
        state: selectedState,
        address: deliveryAddress.trim(),
        quantity: quantity,
      });

      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
        window.history.pushState(
          { orderId: generatedRef },
          '',
          `${window.location.pathname}?order_success=true&order_id=${generatedRef}#order-confirmation`
        );
      }

      const fallbackConfirmation = {
        referenceNumber: generatedRef,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        state: selectedState,
        city: city.trim() || selectedState,
        address: deliveryAddress.trim(),
        quantity: quantity,
        subtotal: subtotal,
        doorType: doorType,
        installation: installationRequired,
        timestamp: new Date().toLocaleString(),
      };
      setOrderConfirmation(fallbackConfirmation);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppOrderUrl = (orderRef: string) => {
    const text = encodeURIComponent(
      `Hello Max Luxury, I just placed an order on your website!\n\n` +
        `*Order Reference:* ${orderRef}\n` +
        `*Customer Name:* ${fullName}\n` +
        `*Phone:* ${phoneNumber}\n` +
        `*Quantity:* ${quantity} Unit(s)\n` +
        `*Total Price:* ₦${subtotal.toLocaleString()}\n` +
        `*State & City:* ${selectedState}, ${city}\n` +
        `*Delivery Address:* ${deliveryAddress}\n` +
        `*Door Type:* ${doorType}\n` +
        `*Installation:* ${installationRequired}\n` +
        `*Payment Method:* Payment on Delivery\n\n` +
        `Please confirm my order and let me know the delivery schedule.`
    );
    return `https://wa.me/${PRODUCT_DATA.whatsappNumber}?text=${text}`;
  };

  const resetForm = () => {
    setOrderConfirmation(null);
    setFullName('');
    setPhoneNumber('');
    setWhatsappNumber('');
    setSelectedState('');
    setCity('');
    setDeliveryAddress('');
    setQuantity(1);
    setAdditionalInstructions('');
    setErrorMessage(null);
  };

  return (
    <section id="order-form" className="py-24 bg-white border-t border-gray-200 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest bg-cyan-950/80 border border-[#00D2FF] px-4 py-1.5 rounded-full text-[#00D2FF] mb-3 shadow-sm">
            <span>MODEL: A-01 · FAST 1-MINUTE CHECKOUT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-heading">
            ORDER YOUR A-01 DEADBOLT SMART LOCK.
          </h2>
          <p className="mt-3 text-base text-gray-700 font-medium">
            Smart Access. Secure Every Day. Lock in your A-01 during our 2-Day Christmas Promo at <strong className="text-black bg-[#FFF9D6] border border-[#F5C518] px-2 py-0.5 rounded">₦{unitPrice.toLocaleString()}</strong>. Pay only after delivery and physical inspection.
          </p>
        </div>

        {/* 2-Day Christmas Promo Urgency Strip */}
        <ChristmasPromoCountdown variant="banner" className="mb-8" />

        {/* 3 Quick Step Indicator */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-center">
          <div className="p-3 bg-gray-50 border-2 border-black/10 rounded-2xl">
            <span className="text-xs font-black text-black block">1. Enter Delivery Address</span>
            <span className="text-[11px] text-gray-500">Takes 60 seconds</span>
          </div>
          <div className="p-3 bg-gray-50 border-2 border-black/10 rounded-2xl">
            <span className="text-xs font-black text-black block">2. Fast Dispatch</span>
            <span className="text-[11px] text-gray-500">To your city</span>
          </div>
          <div className="p-3 bg-[#FFF9D6] border-2 border-[#F5C518] rounded-2xl">
            <span className="text-xs font-black text-black block">3. Inspect & Pay on Delivery</span>
            <span className="text-[11px] text-[#997300] font-bold">Zero risk</span>
          </div>
        </div>

        {/* Successful Confirmation Screen (WHATSAPP SHOWS ONLY HERE AFTER ORDER IS PLACED) */}
        {orderConfirmation ? (
          <div className="bg-white border-2 border-black rounded-3xl p-8 sm:p-12 shadow-2xl relative animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-black font-heading">
                ORDER RECEIVED SUCCESSFULLY!
              </h3>

              <p className="text-sm text-gray-700">
                Thank you, <strong className="text-black">{orderConfirmation.fullName}</strong>. Your order has been placed successfully.
              </p>

              {/* Order Reference Box */}
              <div className="p-4 rounded-2xl bg-black text-white border-2 border-[#F5C518] text-center shadow-md">
                <span className="text-xs uppercase tracking-wider text-[#F5C518] font-bold block mb-1">
                  Your Order Reference Number:
                </span>
                <span className="text-3xl font-black text-white font-mono tracking-wider">
                  {orderConfirmation.referenceNumber}
                </span>
              </div>

              {/* Itemized Order Summary */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-left space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Product:</span>
                  <span className="font-bold text-black">{PRODUCT_DATA.productName}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Quantity:</span>
                  <span className="font-bold text-black">{orderConfirmation.quantity} Unit(s)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-black text-xl text-black tabular-nums">
                    ₦{orderConfirmation.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee:</span>
                  <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">To Be Confirmed via Call</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method:</span>
                  <span className="font-bold text-black">Payment on Delivery</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Door Type:</span>
                  <span className="font-bold text-black">{orderConfirmation.doorType}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Destination:</span>
                  <span className="font-bold text-black text-right max-w-xs">
                    {orderConfirmation.address}, {orderConfirmation.city}, {orderConfirmation.state}
                  </span>
                </div>
              </div>

              {/* REVEALED WHATSAPP BUTTON (ONLY AFTER ORDER IS PLACED) */}
              <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 space-y-3">
                <div className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Connect with dispatch support on WhatsApp with your Order Reference</span>
                </div>

                <div className="text-center font-bold text-xs text-gray-600">
                  Official Support WhatsApp: <span className="text-black font-mono font-bold text-sm">+{PRODUCT_DATA.whatsappNumber}</span>
                </div>

                <a
                  href={getWhatsAppOrderUrl(orderConfirmation.referenceNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContact(orderConfirmation.referenceNumber)}
                  className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Chat on WhatsApp to Track Order</span>
                </a>
              </div>

              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer pt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Place another order</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Order Form - CLEAN, EASY & FRICTIONLESS */
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 border-2 border-black rounded-3xl p-6 sm:p-10 shadow-2xl relative"
          >
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-400 flex items-start gap-3 text-red-900 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Please check your details:</strong>
                  {errorMessage}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Quick 1-Tap Package Selector: 1, 2, or 3 Products */}
              <div className="md:col-span-2 p-4 sm:p-5 rounded-2xl bg-white border-2 border-black/15 space-y-3 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-black uppercase tracking-wider">
                    Step 1 · Choose How Many Locks You Need
                  </span>
                  <span className="text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded">
                    ₦5,000 OFF each when buying 2+
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { qty: 1, label: '1 Product', desc: 'Single Entrance Door', tag: null },
                    { qty: 2, label: '2 Products', desc: '₦155,000 each · Save ₦10k', tag: 'Save ₦10,000' },
                    { qty: 3, label: '3 Products', desc: '₦155,000 each · Save ₦15k', tag: 'Save ₦15,000' },
                  ].map((option) => {
                    const isSelected = quantity === option.qty;
                    const optPricing = calculateOrderPricing(option.qty);
                    return (
                      <button
                        key={option.qty}
                        type="button"
                        onClick={() => updateQuantity(option.qty)}
                        className={`relative p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center sm:flex-col sm:items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-black text-white border-[#F5C518] shadow-lg ring-2 ring-[#F5C518]/40'
                            : 'bg-gray-50 text-black border-gray-300 hover:border-black hover:bg-white'
                        }`}
                      >
                        {option.tag && (
                          <span
                            className={`sm:absolute sm:-top-2.5 sm:right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isSelected ? 'bg-[#F5C518] text-black' : 'bg-black text-[#F5C518]'
                            }`}
                          >
                            {option.tag}
                          </span>
                        )}
                        <div>
                          <div className="text-sm font-black flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#F5C518] bg-[#F5C518]' : 'border-gray-400'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                            </span>
                            <span>{option.label}</span>
                          </div>
                          <div className={`text-[11px] pl-6 mt-0.5 ${isSelected ? 'text-emerald-300 font-bold' : 'text-gray-600'}`}>
                            {option.desc}
                          </div>
                        </div>
                        <div className="text-right sm:text-left sm:pl-6">
                          {optPricing.hasBulkDiscount && (
                            <span className="text-[11px] line-through text-red-400 font-bold mr-2 tabular-nums">
                              ₦{optPricing.regularSubtotal.toLocaleString()}
                            </span>
                          )}
                          <span
                            className={`text-base sm:text-lg font-black tabular-nums ${
                              isSelected ? 'text-[#F5C518]' : 'text-black'
                            }`}
                          >
                            ₦{optPricing.subtotal.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-black" />
                    Full Name <span className="text-red-500">*</span>
                  </span>
                  {isNameValid && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Valid
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onBlur={() => markTouched('fullName')}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!touched.fullName) markTouched('fullName');
                    }}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 pr-11 text-sm text-black font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                      isNameError
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : isNameValid
                        ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                        : 'border-gray-300 focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isNameValid && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isNameError && <AlertCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </div>
                {isNameError && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Please enter your full name (at least 2 letters).
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-black" />
                    Phone Number (Calls) <span className="text-red-500">*</span>
                  </span>
                  {isPhoneValid && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Valid Phone
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08012345678"
                    value={phoneNumber}
                    onBlur={() => markTouched('phoneNumber')}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (!touched.phoneNumber) markTouched('phoneNumber');
                    }}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 pr-11 text-sm text-black font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                      isPhoneError
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : isPhoneValid
                        ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                        : 'border-gray-300 focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isPhoneValid && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isPhoneError && <AlertCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </div>
                {isPhoneError && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Enter a valid 10–14 digit Nigerian phone number.
                  </p>
                )}
              </div>

              {/* Optional WhatsApp Number of customer */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-black" />
                    WhatsApp Number (Optional)
                  </span>
                  {isWhatsappValid && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Valid
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 08012345678 (If different from call number)"
                    value={whatsappNumber}
                    onBlur={() => markTouched('whatsappNumber')}
                    onChange={(e) => {
                      setWhatsappNumber(e.target.value);
                      if (e.target.value) markTouched('whatsappNumber');
                    }}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 pr-11 text-sm text-black font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                      isWhatsappError
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                        : isWhatsappValid
                        ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isWhatsappValid && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isWhatsappError && <AlertCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </div>
                {isWhatsappError && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Please enter at least 10 digits for WhatsApp.
                  </p>
                )}
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-black" />
                    Delivery State <span className="text-red-500">*</span>
                  </span>
                  {isStateValid && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Selected
                    </span>
                  )}
                </label>
                <div className="relative">
                  <select
                    required
                    value={selectedState}
                    onBlur={() => markTouched('selectedState')}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      markTouched('selectedState');
                    }}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 pr-11 text-sm text-black font-bold focus:outline-none transition-colors appearance-none cursor-pointer ${
                      isStateError
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                        : isStateValid
                        ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  >
                    <option value="" disabled>
                      Select Your State in Nigeria...
                    </option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
                    {isStateValid && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isStateError && <AlertCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </div>
                {isStateError && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Please choose a delivery state.
                  </p>
                )}
              </div>

              {/* City / Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-black" />
                    City / Area (Optional)
                  </span>
                  {isCityValid && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Recorded
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Ikeja, Lekki, Wuse 2, Garki, Port Harcourt, etc."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 pr-11 text-sm text-black font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                      isCityValid ? 'border-emerald-500 bg-emerald-50/20' : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  {isCityValid && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Quantity Stepper (for 4+ or fine adjustment) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black flex items-center justify-between uppercase tracking-wider">
                  <span>Exact Quantity</span>
                  <span className="text-xs text-black font-black bg-[#F5C518] px-2 py-0.5 rounded">
                    {quantity} {quantity === 1 ? 'Product' : 'Products'}
                  </span>
                </label>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-300 rounded-xl p-1.5">
                  <button
                    type="button"
                    onClick={() => updateQuantity(quantity - 1)}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-black font-black flex items-center justify-center transition-colors cursor-pointer text-lg"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-black text-black text-lg tabular-nums">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-[#F5C518] hover:bg-[#E5B810] text-black font-black flex items-center justify-center transition-colors cursor-pointer text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Full Delivery Address */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-black text-black flex items-center justify-between uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-black" />
                    Full Delivery Address <span className="text-red-500">*</span>
                  </span>
                  {isAddressValid && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Address Ready
                    </span>
                  )}
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={2}
                    placeholder="Street name, house/apartment number, estate name or nearby landmark..."
                    value={deliveryAddress}
                    onBlur={() => markTouched('deliveryAddress')}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      if (!touched.deliveryAddress) markTouched('deliveryAddress');
                    }}
                    className={`w-full bg-white border-2 rounded-xl px-4 py-3 pr-11 text-sm text-black font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                      isAddressError
                        ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : isAddressValid
                        ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
                        : 'border-gray-300 focus:border-black focus:ring-1 focus:ring-black'
                    }`}
                  />
                  <div className="absolute right-3.5 top-3 pointer-events-none">
                    {isAddressValid && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isAddressError && <AlertCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </div>
                {isAddressError && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Please provide your complete street address or nearest landmark (at least 8 characters).
                  </p>
                )}
              </div>

              {/* Door Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black uppercase tracking-wider">Door Type</label>
                <select
                  value={doorType}
                  onChange={(e) => setDoorType(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-black font-bold focus:border-black focus:outline-none"
                >
                  <option value="Wooden Door">Wooden Entrance Door</option>
                  <option value="Security Metal Door">Security / Armored Steel Door</option>
                  <option value="Aluminum Door">Aluminum Profile Door</option>
                  <option value="Composite Door">Composite Door</option>
                  <option value="Other">Other / Not Sure Yet</option>
                </select>
              </div>

              {/* Installation Required? */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black uppercase tracking-wider">Installation Required?</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Yes', 'No', 'Need Advice'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInstallationRequired(opt)}
                      className={`py-3 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        installationRequired === opt
                          ? 'bg-black text-[#F5C518] shadow-md border-2 border-black'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-black'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Instructions */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-black text-black flex items-center gap-1.5 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  Special Instructions / Preferred Time (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before dispatch, morning delivery preferred, etc."
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-black font-medium placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* UNMISSABLE ORDER SUMMARY BOX WITH VERY CLEAR PRICE */}
            <div className="mt-8 p-6 rounded-2xl bg-white border-2 border-black shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h4 className="text-xs uppercase tracking-wider font-black text-black font-heading flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-black" />
                  Your Order Calculation
                </h4>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Payment on Delivery
                </span>
              </div>

              <div className="divide-y divide-gray-100 text-xs sm:text-sm">
                <div className="py-2 flex justify-between text-gray-700">
                  <span>Product:</span>
                  <span className="font-bold text-black">{PRODUCT_DATA.productName}</span>
                </div>
                <div className="py-2 flex justify-between text-gray-700">
                  <span>Unit Price:</span>
                  <span className="font-bold text-black tabular-nums">
                    {pricing.hasBulkDiscount && (
                      <span className="line-through text-gray-400 mr-2 font-medium">
                        ₦{baseUnitPrice.toLocaleString()}
                      </span>
                    )}
                    ₦{unitPrice.toLocaleString()}
                  </span>
                </div>
                <div className="py-2 flex justify-between text-gray-700">
                  <span>Selected Quantity:</span>
                  <span className="font-bold text-black tabular-nums">{quantity} Unit(s)</span>
                </div>
                {pricing.hasBulkDiscount && (
                  <div className="py-2 flex justify-between text-emerald-700 bg-emerald-50/70 px-2 rounded-lg">
                    <span className="font-bold">Multi-Unit Bundle Discount (₦5k/lock):</span>
                    <span className="font-black tabular-nums">
                      -₦{pricing.totalBulkDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="py-3 flex justify-between items-baseline text-black bg-yellow-50 px-3 rounded-xl border border-yellow-200 my-1">
                  <span className="font-black text-sm uppercase">Total Subtotal:</span>
                  <div className="text-right">
                    {pricing.hasBulkDiscount && (
                      <span className="text-xs line-through text-gray-500 font-bold mr-2 tabular-nums">
                        ₦{pricing.regularSubtotal.toLocaleString()}
                      </span>
                    )}
                    <span className="font-black text-2xl sm:text-3xl text-black tabular-nums font-heading">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="py-2 flex justify-between items-center text-gray-700">
                  <span>Delivery Fee:</span>
                  <span className="font-bold text-amber-800 text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    To Be Confirmed via Call
                  </span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-gray-500">
                * Delivery fee is confirmed based on your exact location before order dispatch. You only pay after you physically inspect the lock.
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 space-y-4">
              <button
                type="submit"
                id="main-purchase-submit-button"
                data-event="Purchase"
                data-track-event="Purchase"
                disabled={isSubmitting}
                className={`w-full py-4 px-8 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-lg uppercase tracking-wider border-2 border-black shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Recording Your Order...
                  </span>
                ) : (
                  <>
                    <span>PLACE MY ORDER NOW — ₦{subtotal.toLocaleString()} (PAY ON DELIVERY)</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600 font-bold pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  Inspect Before Paying
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-black" />
                  Fast Nationwide Dispatch
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-black" />
                  Zero Upfront Payment
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
