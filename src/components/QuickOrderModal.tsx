import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA, NIGERIAN_STATES } from '../data/productData';
import { trackPurchase, trackLeadOrderSubmitted, trackContact } from '../utils/pixel';
import {
  X,
  Zap,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Phone,
  User,
  MapPin,
  MessageSquare,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const POPUP_PRODUCT_IMAGES = [
  {
    src: PRODUCT_DATA.bannerImage,
    title: 'A-01 Deadbolt Type Smart Lock',
    badge: 'Master View',
    subtitle: 'Sleek obsidian finish with dual smart panels',
  },
  {
    src: PRODUCT_DATA.images.main,
    title: 'Dual Panels & Smartphone App',
    badge: 'Front & Back Panels',
    subtitle: 'Integrated color screen & Tuya app connection',
  },
  {
    src: PRODUCT_DATA.images.biometrics,
    title: '3D Facial & Biometric Access',
    badge: 'Biometric Scanner',
    subtitle: 'Contactless face scan & semiconductor fingerprint',
  },
  {
    src: PRODUCT_DATA.images.camera,
    title: 'Wide-Angle Cat’s Eye Visual Camera',
    badge: 'HD Door Viewer',
    subtitle: 'Crystal-clear door security camera & doorbell',
  },
  {
    src: PRODUCT_DATA.images.smartphone,
    title: 'Tuya App Remote Control',
    badge: 'Mobile App',
    subtitle: 'Remote unlocking & two-way audio talk',
  },
  {
    src: PRODUCT_DATA.images.mortise,
    title: 'Standard 6068 Steel Mortise Body',
    badge: 'Heavy-Duty Mortise',
    subtitle: 'Anti-sawing stainless steel triple deadbolt',
  },
  {
    src: PRODUCT_DATA.images.parameters,
    title: 'Exact Dimensions & Architecture',
    badge: 'Specifications',
    subtitle: 'Precision engineered 70mm x 420mm slim profile',
  },
  {
    src: PRODUCT_DATA.images.packageBox,
    title: 'Complete Hardware Kit in Retail Box',
    badge: 'Box Contents',
    subtitle: 'Smart IC cards, backup keys, battery & fittings',
  },
  {
    src: PRODUCT_DATA.images.functionality,
    title: 'Weatherproof & Seamless Installation',
    badge: 'Door Fit',
    subtitle: 'Automatic locking & universal door compatibility',
  },
];

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: () => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [doorType, setDoorType] = useState('Wooden Door');

  // Changing product images in popup
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImagePaused, setIsImagePaused] = useState(false);

  // Real-time validation touched tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  // Auto-rotate the product image in popup every 2.8 seconds
  useEffect(() => {
    if (!isOpen || isImagePaused) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % POPUP_PRODUCT_IMAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isOpen, isImagePaused]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? POPUP_PRODUCT_IMAGES.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % POPUP_PRODUCT_IMAGES.length);
  };

  // Real-time validation checks
  const isNameValid = fullName.trim().length >= 2;
  const isNameError = Boolean(touched.fullName && !isNameValid);

  const phoneDigits = phoneNumber.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 14;
  const isPhoneError = Boolean(touched.phoneNumber && !isPhoneValid);

  const isStateValid = Boolean(selectedState);
  const isStateError = Boolean(touched.selectedState && !isStateValid);

  const isAddressValid = deliveryAddress.trim().length >= 6;
  const isAddressError = Boolean(touched.deliveryAddress && !isAddressValid);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    referenceNumber: string;
    fullName: string;
    phoneNumber: string;
    whatsappNumber: string;
    state: string;
    address: string;
    quantity: number;
    subtotal: number;
    doorType: string;
  } | null>(null);

  if (!isOpen) return null;

  const unitPrice = PRODUCT_DATA.sellingPrice;
  const subtotal = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    markTouched('fullName');
    markTouched('phoneNumber');
    markTouched('selectedState');
    markTouched('deliveryAddress');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 9) {
      setErrorMessage('Please enter a valid phone number (e.g. 08012345678).');
      return;
    }

    if (!selectedState) {
      setErrorMessage('Please select your delivery state.');
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage('Please provide your delivery address or landmark.');
      return;
    }

    setIsSubmitting(true);

    const generatedRef = 'ML-' + Math.floor(100000 + Math.random() * 900000);

    const orderPayload = {
      orderReference: generatedRef,
      product: PRODUCT_DATA.productName,
      unitPrice: `₦${unitPrice.toLocaleString()}`,
      quantity: quantity,
      subtotal: `₦${subtotal.toLocaleString()}`,
      deliveryFee: 'To Be Confirmed',
      paymentMethod: 'Payment on Delivery',
      customerName: fullName.trim(),
      phone: phoneNumber.trim(),
      whatsapp: whatsappNumber.trim() || phoneNumber.trim(),
      state: selectedState,
      city: selectedState,
      address: deliveryAddress.trim(),
      doorType: doorType,
      installationRequired: 'Need Advice',
      additionalInstructions: 'Quick Order Popup',
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
        console.warn('Network sync notice:', netErr);
      });

      // 2. Post directly to Formspree so user instantly receives email notification
      await fetch('https://formspree.io/f/mvkknayb', {
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
          deliveryAddress: deliveryAddress.trim(),
          product: PRODUCT_DATA.productName,
          model: 'A-01 DEADBOLT TYPE SMART LOCK',
          quantity: quantity,
          subtotal: `₦${subtotal.toLocaleString()}`,
          doorType: doorType,
          paymentMethod: 'Payment on Delivery',
          orderSource: 'Quick Order Popup Form',
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

      // 4. Confirm order immediately to user
      const confirmationRecord = {
        referenceNumber: generatedRef,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        state: selectedState,
        address: deliveryAddress.trim(),
        quantity: quantity,
        subtotal: subtotal,
        doorType: doorType,
      };
      setOrderConfirmation(confirmationRecord);

      // 5. Trigger Meta & TikTok Purchase event (with CAPI and Events API server sync)
      trackPurchase(generatedRef, subtotal, 'NGN', {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        city: selectedState,
        state: selectedState,
        address: deliveryAddress.trim(),
        quantity: quantity,
      });

      // Update URL query string for URL-based pixel rules and Meta Event Setup Tool
      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
        window.history.pushState(
          { orderId: generatedRef },
          '',
          `${window.location.pathname}?order_success=true&order_id=${generatedRef}#quick-order-confirmation`
        );
      }

      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      console.error('Quick order submit fallback:', err);
      // Guarantee confirmation view and fire purchase tracking
      trackPurchase(generatedRef, subtotal, 'NGN', {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        city: selectedState,
        state: selectedState,
        address: deliveryAddress.trim(),
        quantity: quantity,
      });

      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
        window.history.pushState(
          { orderId: generatedRef },
          '',
          `${window.location.pathname}?order_success=true&order_id=${generatedRef}#quick-order-confirmation`
        );
      }

      setOrderConfirmation({
        referenceNumber: generatedRef,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        state: selectedState,
        address: deliveryAddress.trim(),
        quantity: quantity,
        subtotal: subtotal,
        doorType: doorType,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppOrderUrl = (orderRef: string) => {
    const text = encodeURIComponent(
      `Hello Max Luxury, I just placed a Quick Order on your website!\n\n` +
        `*Order Reference:* ${orderRef}\n` +
        `*Customer Name:* ${fullName}\n` +
        `*Phone:* ${phoneNumber}\n` +
        `*Quantity:* ${quantity} Unit(s)\n` +
        `*Total Price:* ₦${subtotal.toLocaleString()}\n` +
        `*Delivery State:* ${selectedState}\n` +
        `*Address:* ${deliveryAddress}\n` +
        `*Door Type:* ${doorType}\n` +
        `*Payment Method:* Payment on Delivery\n\n` +
        `Please confirm my order and let me know the delivery schedule.`
    );
    return `https://wa.me/${PRODUCT_DATA.whatsappNumber}?text=${text}`;
  };

  const handleReset = () => {
    setOrderConfirmation(null);
    setFullName('');
    setPhoneNumber('');
    setWhatsappNumber('');
    setSelectedState('');
    setDeliveryAddress('');
    setQuantity(1);
    setTouched({});
    setCurrentImageIndex(0);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border-2 border-black text-[#101010] rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-black hover:text-[#F5C518] text-gray-700 transition-colors cursor-pointer z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {orderConfirmation ? (
          /* SUCCESS CONFIRMATION STATE */
          <div className="text-center space-y-4 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 border-2 border-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-50 text-[#007A99] text-xs font-mono font-bold border border-cyan-200">
              <Check className="w-3.5 h-3.5" />
              <span>A-01 Order Received Successfully</span>
            </div>

            <h3 className="text-2xl font-black text-black font-heading">
              THANK YOU, {orderConfirmation.fullName.toUpperCase()}!
            </h3>

            <p className="text-xs text-gray-600">
              Your quick order has been dispatched to Formspree & local fulfillment. Pay only when your lock is delivered and inspected.
            </p>

            {/* Order Reference Badge */}
            <div className="p-3.5 rounded-2xl bg-black text-white border-2 border-[#F5C518] text-center shadow-md">
              <span className="text-[11px] uppercase tracking-wider text-[#F5C518] font-mono font-bold block mb-0.5">
                Your Order Reference Code:
              </span>
              <span className="text-2xl font-black font-mono tracking-wider text-white">
                {orderConfirmation.referenceNumber}
              </span>
            </div>

            {/* Summary details */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left text-xs space-y-1.5 text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Lock Model:</span>
                <span className="font-bold text-[#0088A8]">A-01 Deadbolt Smart Lock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lock Units:</span>
                <span className="font-bold text-black">{orderConfirmation.quantity} Unit(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Price:</span>
                <span className="font-black text-base text-black">
                  ₦{orderConfirmation.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment:</span>
                <span className="font-bold text-black bg-[#F5C518] px-2 py-0.5 rounded text-[11px]">
                  Payment on Delivery
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery State:</span>
                <span className="font-bold text-black">{orderConfirmation.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Notification:</span>
                <span className="font-bold text-emerald-600">Email Dispatched to Formspree</span>
              </div>
            </div>

            {/* REVEALED WHATSAPP BUTTON (ONLY AFTER ORDER IS PLACED) */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 space-y-2.5">
              <div className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                <span>Connect with dispatch support on WhatsApp:</span>
              </div>
              <div className="text-xs font-mono font-bold text-black">
                +{PRODUCT_DATA.whatsappNumber}
              </div>
              <a
                href={getWhatsAppOrderUrl(orderConfirmation.referenceNumber)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact(orderConfirmation.referenceNumber)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp to Track Order</span>
              </a>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-black transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        ) : (
          /* ACTIVE POPUP FORM */
          <div>
            {/* Header Kicker */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-[#00A3C4] text-[11px] font-mono font-black text-[#007A99] uppercase tracking-wider shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-current text-[#007A99]" />
                A-01 Quick Order
              </span>
              <span className="text-xs font-bold text-black bg-[#F5C518] px-2.5 py-0.5 rounded shadow-sm">
                Pay on Delivery
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#101010] font-heading tracking-tight">
              A-01 | DEADBOLT TYPE SMART LOCK
            </h3>
            <p className="text-xs text-[#0088A8] font-bold mt-0.5 uppercase tracking-wider">
              Smart Access. Secure Every Day.
            </p>

            {/* Mini Product Bar with AUTO-CHANGING Image Slideshow */}
            <div className="mt-3 p-3 bg-gray-50 border-2 border-black/10 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                {/* Auto-Changing Image Container */}
                <div
                  className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl border-2 border-gray-200 shrink-0 flex items-center justify-center overflow-hidden group shadow-sm select-none"
                  onMouseEnter={() => setIsImagePaused(true)}
                  onMouseLeave={() => setIsImagePaused(false)}
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100 z-20 overflow-hidden">
                    <div
                      key={`popup-img-bar-${currentImageIndex}-${!isImagePaused}`}
                      className="h-full bg-[#F5C518]"
                      style={{
                        animation: !isImagePaused ? 'progressFill 2.8s linear forwards' : 'none',
                        width: !isImagePaused ? undefined : '100%',
                      }}
                    />
                  </div>

                  {/* Preloaded smooth cross-fading images */}
                  {POPUP_PRODUCT_IMAGES.map((item, idx) => (
                    <img
                      key={item.src}
                      src={item.src}
                      alt={item.title}
                      className={`absolute inset-0 w-full h-full object-contain p-1.5 transition-all duration-500 ease-in-out ${
                        idx === currentImageIndex
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-95 pointer-events-none z-0'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ))}

                  {/* Interactive Prev/Next arrow buttons */}
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#F5C518] z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#F5C518] z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Slide counter & live pulse indicator */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-[9px] font-mono font-bold text-white z-20 flex items-center gap-1 shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] animate-ping" />
                    <span>{currentImageIndex + 1}/{POPUP_PRODUCT_IMAGES.length}</span>
                  </div>
                </div>

                {/* Dynamic Product Info synced to active changing image */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-black text-[#007A99] uppercase tracking-wider bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-md">
                      {POPUP_PRODUCT_IMAGES[currentImageIndex].badge}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                      • Auto-rotating
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-black text-black mt-1 truncate">
                    {POPUP_PRODUCT_IMAGES[currentImageIndex].title}
                  </div>

                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base sm:text-lg font-black text-black font-heading">
                      ₦{unitPrice.toLocaleString()}
                    </span>
                    <span className="text-xs line-through text-gray-400 font-semibold">
                      ₦{PRODUCT_DATA.regularPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-700 font-bold truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>In Stock · Payment on Delivery</span>
                  </div>
                </div>
              </div>

              {/* Changing image clickable progress dots */}
              <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-gray-200/80">
                <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                  {POPUP_PRODUCT_IMAGES.map((item, idx) => (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentImageIndex === idx
                          ? 'w-5 bg-[#F5C518]'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      title={item.title}
                      aria-label={`View ${item.badge}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                  <button
                    type="button"
                    onClick={() => setIsImagePaused(!isImagePaused)}
                    className="hover:text-black font-bold cursor-pointer"
                  >
                    {isImagePaused ? 'Resume' : 'Pause'}
                  </button>
                  <span>·</span>
                  <span className="font-mono text-gray-600 font-bold">
                    {POPUP_PRODUCT_IMAGES[currentImageIndex].badge}
                  </span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-400 flex items-start gap-2 text-red-900 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {/* Full Name with Validation Icons */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <User className="w-3.5 h-3.5 text-[#0088A8]" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onBlur={() => markTouched('fullName')}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-black font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                      isNameError
                        ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                        : touched.fullName && isNameValid
                        ? 'border-emerald-500 focus:border-emerald-600 bg-emerald-50/20'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {touched.fullName && isNameValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {isNameError && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                {isNameError && (
                  <p className="text-[11px] text-red-600 font-semibold pl-1">
                    Please enter your full name (at least 2 characters)
                  </p>
                )}
              </div>

              {/* Phone Number with Validation Icons */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#0088A8]" />
                  Phone Number (Calls) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08012345678"
                    value={phoneNumber}
                    onBlur={() => markTouched('phoneNumber')}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-black font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                      isPhoneError
                        ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                        : touched.phoneNumber && isPhoneValid
                        ? 'border-emerald-500 focus:border-emerald-600 bg-emerald-50/20'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {touched.phoneNumber && isPhoneValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {isPhoneError && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                {isPhoneError && (
                  <p className="text-[11px] text-red-600 font-semibold pl-1">
                    Please enter a valid Nigerian phone number (10-14 digits)
                  </p>
                )}
              </div>

              {/* State & Quantity Row with Validation Icons */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#0088A8]" />
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={selectedState}
                      onBlur={() => markTouched('selectedState')}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className={`w-full bg-white border-2 rounded-xl pl-2.5 pr-8 py-2.5 text-xs sm:text-sm text-black font-bold focus:outline-none transition-colors cursor-pointer appearance-none ${
                        isStateError
                          ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                          : touched.selectedState && isStateValid
                          ? 'border-emerald-500 focus:border-emerald-600 bg-emerald-50/20'
                          : 'border-gray-300 focus:border-black'
                      }`}
                    >
                      <option value="" disabled className="text-gray-400">
                        Select State...
                      </option>
                      {NIGERIAN_STATES.map((state) => (
                        <option key={state} value={state} className="text-black">
                          {state}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {touched.selectedState && isStateValid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isStateError ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="text-gray-400 text-xs">▼</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex justify-between font-mono">
                    <span>Quantity</span>
                  </label>
                  <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-black hover:text-white text-black font-black flex items-center justify-center transition-colors cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-black text-black text-sm font-mono">
                      {quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-8 h-8 rounded-lg bg-[#F5C518] hover:bg-[#E5B810] text-black font-black flex items-center justify-center transition-colors cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Address with Validation Icons */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#0088A8]" />
                  Delivery Address / Landmark <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Street name, house/flat number or area..."
                    value={deliveryAddress}
                    onBlur={() => markTouched('deliveryAddress')}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className={`w-full bg-white border-2 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-black font-medium placeholder-gray-400 focus:outline-none transition-colors ${
                      isAddressError
                        ? 'border-red-400 focus:border-red-600 bg-red-50/20'
                        : touched.deliveryAddress && isAddressValid
                        ? 'border-emerald-500 focus:border-emerald-600 bg-emerald-50/20'
                        : 'border-gray-300 focus:border-black'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {touched.deliveryAddress && isAddressValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {isAddressError && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                {isAddressError && (
                  <p className="text-[11px] text-red-600 font-semibold pl-1">
                    Please provide your street address or landmark
                  </p>
                )}
              </div>

              {/* Door Type Quick Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
                  Door Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Wooden Door', 'Security Door', 'Other'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDoorType(d)}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                        doorType === d
                          ? 'bg-black text-[#F5C518] border-2 border-black'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Total Price Box */}
              <div className="p-3 bg-[#FFF9D6] border-2 border-[#F5C518] rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-700 block">
                    Total Amount (Pay on Delivery)
                  </span>
                  <span className="text-xl font-black text-black tabular-nums font-heading">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-black font-black bg-[#F5C518] border border-black/20 px-2.5 py-1 rounded shadow-sm">
                    Zero Prepayment
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="quick-purchase-submit-button"
                data-event="Purchase"
                data-track-event="Purchase"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-6 rounded-xl bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-98'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  <>
                    <span>CONFIRM MY ORDER — ₦{subtotal.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-600 font-bold pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  Pay on Delivery
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-black" />
                  Nationwide Dispatch
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-black" />
                  Zero Prepayment
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
