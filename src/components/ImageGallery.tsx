import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA } from '../data/productData';
import { Maximize2, X, ChevronLeft, ChevronRight, CheckCircle2, Play, Pause, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
  bulletPoints: string[];
}

export const ImageGallery: React.FC = () => {
  const galleryItems: GalleryItem[] = [
    {
      id: 'a01-master-banner',
      title: 'A-01 Deadbolt Type Smart Lock: Master Specification Banner',
      category: '00 · Official Model Master Overview',
      image: PRODUCT_DATA.bannerImage,
      caption: 'Official specification and feature diagram: Smart Access. Secure Every Day. Features 12 hardware callouts including Face Recognition Cat Eye Camera, 4.0" interior screen, semiconductor fingerprint, and Tuya app.',
      bulletPoints: [
        'Model: A-01 Deadbolt Type Smart Lock with sleek obsidian design',
        '12 Core hardware modules: Facial cat eye camera, display screen, semiconductor fingerprint sensor',
        '5 Security pillars: Multiple Access, Smart Control, Reliable Security, Easy Installation, Emergency Ready',
      ],
    },
    {
      id: 'main-panels',
      title: 'Complete Dual Panel System & Tuya Mobile App',
      category: '01 · Interior & Exterior Panels',
      image: PRODUCT_DATA.images.main,
      caption: 'Official dual lock panels with integrated color display screen, facial recognition camera, illuminated keypad, and companion smartphone control application.',
      bulletPoints: [
        'Exterior panel with optical facial camera, palm vein recognition, and numeric keypad',
        'Interior panel with high-definition digital viewer screen and manual knob',
        'Tuya Smart ecosystem integration for remote door release and monitoring',
      ],
    },
    {
      id: 'unlock-biometrics',
      title: 'Multiple Smart Unlocking Methods',
      category: '02 · Contactless & Biometric Access',
      image: PRODUCT_DATA.images.biometrics,
      caption: 'Clear breakdown of supported unlocking modes: Face recognition, Palm Vein, Fingerprint, Password PIN, NFC access card, Physical key, Combination, and App unlock.',
      bulletPoints: [
        '3D Facial detection and sub-dermal palm vein biometric scanning',
        'High-precision optical fingerprint sensor for immediate verification',
        'Touch PIN keypad, NFC card swipe, and emergency mechanical keyhole',
      ],
    },
    {
      id: 'camera-lens',
      title: 'Wide Angle Cat’s Eye Visual Lens',
      category: '03 · Integrated Door Viewer',
      image: PRODUCT_DATA.images.camera,
      caption: 'Super wide-angle visual cat’s eye lens optical system designed to expand front door visibility and capture crystal-clear visitor images.',
      bulletPoints: [
        'Super wide-angle lens with expanded field of view',
        'Visual cat’s eye lens design eliminating blind spots outside your door',
        'Instant visitor image capture transmitted directly to your screen and phone',
      ],
    },
    {
      id: 'mortise-engineering',
      title: 'Standard 6068 Security Mortise Dimensions',
      category: '04 · 24*240 (60 68) Mortise Specifications',
      image: PRODUCT_DATA.images.mortise,
      caption: 'Engineered heavy-duty anti-theft mortise with standard 24mm x 240mm faceplate, 60mm backset, and 68mm center distance with universal left/right adjustment.',
      bulletPoints: [
        'Faceplate Width: 24 mm | Faceplate Length: 240 mm',
        'Backset: 60 mm | Center Distance: 68 mm',
        'Universal reversible latch adjustable for both left and right swinging doors',
      ],
    },
    {
      id: 'smartphone-remote',
      title: 'Tuya App Remote Unlocking & Two-Way Visitor Talk',
      category: '05 · Mobile Ecosystem & Live Video',
      image: PRODUCT_DATA.images.smartphone,
      caption: 'Real-time visitor voice communication, live camera streaming, photo capture, video recording, and remote door unlock from your smartphone.',
      bulletPoints: [
        'Real-time talk to the visitor standing outside your door',
        'Volume control, voice change, photo capture, and video recording',
        'Long press to unlock or lock securely from anywhere',
      ],
    },
    {
      id: 'parameter-size',
      title: 'Lock Dimensions (70mm x 420mm) & Component Layout',
      category: '06 · Parameter Specifications',
      image: PRODUCT_DATA.images.parameters,
      caption: 'Detailed parameter sizing and callout diagram of both panels including battery compartment, HD display, one-click buttons, mechanical handle, and Type-C emergency port.',
      bulletPoints: [
        'Overall panel dimensions: 70 mm width x 420 mm height',
        'Interior: Battery compartment, HD display, one-click unlock/lock, mechanical handle',
        'Exterior: Cat eye camera, facial module, fingerprint, display, keypad, NFC card area, Type-C port',
      ],
    },
    {
      id: 'package-contents',
      title: 'Complete Hardware Package & Accessories in Box',
      category: '07 · Box Contents & Hardware Kit',
      image: PRODUCT_DATA.images.packageBox,
      caption: 'Everything included in the retail box: 2x RFID cards, 6068 security mortise, high-security lock cylinder + keys, USB cable, rechargeable power battery, screws kit, and lock panels.',
      bulletPoints: [
        '2x Smart IC Cards & Class-C Lock Cylinder with backup physical keys',
        'Rechargeable lithium battery pack & USB charging cable',
        'Full set of installation screws, spindles, and custom retail packaging box',
      ],
    },
    {
      id: 'functionality-safety',
      title: 'Functionality & Door Installation Overview',
      category: '08 · Functionality & Safety',
      image: PRODUCT_DATA.images.functionality,
      caption: 'Installed smart lock on door illustrating key features: Daily waterproof design, automatic locking, remote video viewing, and multi-method access.',
      bulletPoints: [
        'Daily waterproof protective casing suitable for residential entrances',
        'Automatic locking bolt engagement upon door closing',
        '6068 heavy-duty security lock body integration',
      ],
    },
    {
      id: 'quality-testing',
      title: 'Tested Durability & Factory Certifications',
      category: '09 · Reliability & Testing',
      image: PRODUCT_DATA.images.certifications,
      caption: 'Extensive reliability benchmarks: 10,000+ hour battery life, 250k service life operations, 72-hour high/low temperature testing, and CE / FCC / RoHS / ISO compliance.',
      bulletPoints: [
        '250,000 service life test cycles for lasting durability',
        '72-hour high and low temperature climate chamber resilience',
        'Certified by CE, FCC, EMC, RoHS, and ISO standards',
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeItem = galleryItems[activeIndex];

  // Continuous auto-switching timer
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryItems.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, galleryItems.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-20 bg-white border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest bg-cyan-950/80 border border-[#00D2FF] px-4 py-1.5 rounded-full text-[#00D2FF] mb-3 shadow-sm">
            <span>MODEL: A-01 · OFFICIAL GALLERY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-heading">
            A-01 OFFICIAL PRODUCT GALLERY.
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Smart Access. Secure Every Day. Examine the exact A-01 Deadbolt Type Smart Lock hardware, official diagrams, and dimension schematics. The gallery automatically rotates through all perspectives with continuous zoom.
          </p>

          {/* Continuous Auto-Rotate & Zoom Controller Pill */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-black text-[#F5C518] border-black shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-ping" />
                  <Pause className="w-3.5 h-3.5" />
                  <span>Auto-Switching & Zooming (Active)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Auto-Switch & Zoom</span>
                </>
              )}
            </button>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              (Hover pauses, leave resumes)
            </span>
          </div>
        </div>

        {/* Interactive Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50 border-2 border-black/10 rounded-3xl p-6 sm:p-8 shadow-lg">
          {/* Main Visual Display (7 cols) with Continuous Zoom */}
          <div className="lg:col-span-7 relative group">
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border-2 border-gray-200 flex items-center justify-center p-3 shadow-inner"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Top Continuous Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 z-20 overflow-hidden">
                <div
                  key={`gallery-progress-${activeIndex}-${isAutoPlaying && !isHovered}`}
                  className="h-full bg-[#F5C518]"
                  style={{
                    animation:
                      isAutoPlaying && !isHovered ? 'progressFill 3.8s linear forwards' : 'none',
                    width: isAutoPlaying && !isHovered ? undefined : '100%',
                  }}
                />
              </div>

              {/* CONTINUOUS ZOOMING & AUTO-CHANGING IMAGE */}
              <img
                key={activeIndex}
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-full max-w-full object-contain animate-continuous-zoom cursor-pointer"
                onClick={() => setLightboxOpen(true)}
                referrerPolicy="no-referrer"
              />

              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/80 backdrop-blur-md text-white hover:text-[#F5C518] hover:bg-black transition-all border border-white/20 shadow-lg cursor-pointer z-20"
                title="Click to enlarge image"
                aria-label="Enlarge image"
              >
                <Maximize2 className="w-5 h-5" />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-black text-black hover:text-[#F5C518] transition-colors border border-gray-300 cursor-pointer shadow-md z-20"
                aria-label="Previous view"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-black text-black hover:text-[#F5C518] transition-colors border border-gray-300 cursor-pointer shadow-md z-20"
                aria-label="Next view"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-4 text-xs font-mono font-bold text-black bg-white/90 px-3 py-1 rounded-md border border-gray-300 shadow-sm z-20 flex items-center gap-2">
                <span>View {activeIndex + 1} of {galleryItems.length}</span>
                <span className="text-gray-400">·</span>
                <span className="text-[#997300] font-bold">Auto-Zoom</span>
              </div>
            </div>
          </div>

          {/* Details & Features of Selected View (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#997300] bg-yellow-100 px-2.5 py-1 rounded-md">
                {activeItem.category}
              </span>
              <h3 className="text-2xl font-black text-black mt-2 font-heading">
                {activeItem.title}
              </h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                {activeItem.caption}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {activeItem.bulletPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#F5C518] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-800 font-medium leading-snug">{point}</span>
                </div>
              ))}
            </div>

            {/* Price & Fast Order Trigger */}
            <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase block">Special Price</span>
                <span className="text-lg font-black text-black">₦180,000</span>
              </div>
              <a
                href="#order-form"
                className="px-4 py-2 bg-[#F5C518] hover:bg-[#E5B810] text-black font-black text-xs uppercase tracking-wider rounded-lg transition-transform active:scale-95"
              >
                Order This Lock
              </a>
            </div>

            {/* Thumbnail Selectors Grid */}
            <div className="pt-2 border-t border-gray-200">
              <span className="text-xs uppercase tracking-wider text-gray-700 font-bold block mb-2">
                All Product Perspectives ({galleryItems.length} views):
              </span>
              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
                {galleryItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white p-0.5 ${
                      activeIndex === idx
                        ? 'border-black scale-105 shadow-md ring-2 ring-[#F5C518]'
                        : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
            <div>
              <span className="text-xs text-[#F5C518] font-mono block">{activeItem.category}</span>
              <h4 className="text-lg font-bold font-heading">{activeItem.title}</h4>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Centered Image */}
          <div className="relative flex-1 flex items-center justify-center py-4 max-w-5xl mx-auto w-full">
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-[#F5C518] transition-colors cursor-pointer z-10"
              aria-label="Previous view"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="bg-white rounded-2xl p-4 max-h-[75vh] max-w-full flex items-center justify-center shadow-2xl overflow-hidden relative">
              <img
                key={`lb-${activeIndex}`}
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[70vh] max-w-full object-contain animate-continuous-zoom"
                referrerPolicy="no-referrer"
              />
            </div>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-[#F5C518] transition-colors cursor-pointer z-10"
              aria-label="Next view"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption & Controls */}
          <div className="max-w-2xl mx-auto text-center text-neutral-300 text-sm pb-2">
            <p className="text-xs sm:text-sm text-gray-200">{activeItem.caption}</p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs text-[#F5C518] font-bold cursor-pointer"
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Pause Slideshow' : 'Auto Play Slideshow'}</span>
              </button>
              <div className="flex items-center gap-1.5">
                {galleryItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeIndex === i ? 'bg-[#F5C518] w-6' : 'bg-neutral-600 hover:bg-neutral-400 w-2'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
