import React, { useState, useEffect } from 'react';
import { PRODUCT_DATA } from '../data/productData';
import {
  ShieldCheck,
  Smartphone,
  Cpu,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Camera,
  Layers,
  Wrench,
  BatteryCharging,
  Fingerprint,
  Eye,
  Key,
  Bell,
  Sliders,
  Shield,
  Zap,
  Truck,
} from 'lucide-react';

interface HeroProps {
  onOrderClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onExploreClick }) => {
  const heroSlides = [
    {
      image: PRODUCT_DATA.bannerImage,
      title: 'A-01 Deadbolt Smart Lock Master Overview',
      badge: 'Official Master Banner',
      highlight: 'Sleek Design. Advanced Protection.',
    },
    {
      image: PRODUCT_DATA.images.main,
      title: 'Dual Panels & Tuya Mobile App',
      badge: '1/6 · Complete System',
      highlight: '3D Facial + Palm Vein + Smartphone Control',
    },
    {
      image: PRODUCT_DATA.images.biometrics,
      title: '8 Multi-Factor Unlocking Modes',
      badge: '2/6 · Smart Biometrics',
      highlight: 'Face, Palm Vein, Fingerprint, PIN & Card',
    },
    {
      image: PRODUCT_DATA.images.camera,
      title: 'Wide-Angle Cat’s Eye Visual Lens',
      badge: '3/6 · Visual Lens',
      highlight: 'Ultra-wide angle with zero front door blind spots',
    },
    {
      image: PRODUCT_DATA.images.smartphone,
      title: 'Tuya App Remote Door Release',
      badge: '4/6 · Mobile Ecosystem',
      highlight: 'Two-way visitor voice intercom & live capture',
    },
    {
      image: PRODUCT_DATA.images.parameters,
      title: '70mm x 420mm Precision Lock Body',
      badge: '5/6 · Parameters',
      highlight: 'Integrated HD screen & Type-C emergency power',
    },
    {
      image: PRODUCT_DATA.images.mortise,
      title: 'Standard 6068 Steel Security Mortise',
      badge: '6/6 · Heavy Duty Mortise',
      highlight: '24*240mm faceplate with universal left/right fit',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Automatically switch between images every 3.8s with continuous zoom
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  return (
    <section className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 bg-white text-[#101010] overflow-hidden border-b border-gray-200">
      {/* Subtle Cyan Ambient Glow on White */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-cyan-100/50 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Subtle Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage:
            'radial-gradient(#00A3C4 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* TOP BANNER CALLOUT: Lock Name Badge exactly as in Image */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border-2 border-[#00A3C4] shadow-sm text-xs font-mono font-black tracking-widest text-[#007A99] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#00A3C4] animate-pulse" />
            <span>A-01</span>
            <span className="text-gray-400">|</span>
            <span className="text-[#101010]">DEADBOLT TYPE SMART LOCK</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9D6] border border-[#F5C518] text-xs font-bold text-black shadow-sm">
            <Truck className="w-3.5 h-3.5 text-black" />
            <span>PAYMENT ON DELIVERY NATIONWIDE</span>
          </div>
        </div>

        {/* HERO GRID: 2 COLUMNS (HEADLINES + PRICE vs VISUAL ASSET + SLEEK PILLARS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column (7 cols): Exact Headlines from Graphic */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Headline from Image */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] font-heading">
              <span className="block text-[#101010]">SMART ACCESS.</span>
              <span className="block text-[#0088A8]">
                SECURE EVERY DAY.
              </span>
            </h1>

            {/* Sub-headline from Image */}
            <p className="text-lg sm:text-2xl text-gray-800 font-semibold leading-relaxed max-w-2xl">
              Advanced security meets modern convenience. Control access your way, anytime, anywhere.
            </p>

            {/* Secondary supporting paragraph */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl">
              Equipped with high-precision 3D facial recognition, palm vein sensor, semiconductor fingerprint reader, 4.0-inch HD interior screen, and Tuya smartphone control.
            </p>

            {/* PRICE CAPSULE (White Surface with Bold High Contrast) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-black shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#F5C518] text-black text-[11px] font-black uppercase px-4 py-1 rounded-bl-2xl tracking-wider shadow">
                PAY ON DELIVERY
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest font-black text-[#0088A8] mb-1 flex items-center gap-1.5 font-mono">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    SPECIAL PROMO PRICE:
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#101010] tabular-nums font-heading tracking-tight">
                      ₦{PRODUCT_DATA.sellingPrice.toLocaleString()}
                    </span>
                    <span className="text-lg sm:text-2xl line-through text-red-500 font-bold decoration-red-500 decoration-2 tabular-nums">
                      ₦{PRODUCT_DATA.regularPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-50 text-[#007A99] border border-cyan-200">
                    Instant ₦70k Off
                  </span>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#F5C518] text-black border border-black/20 shadow-sm">
                    Zero Prepayment
                  </span>
                </div>
              </div>

              {/* Delivery notice */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-700">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#0088A8]" />
                  Inspect & test before paying courier
                </span>
                <span className="text-black font-mono font-bold bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded">
                  Nationwide Delivery
                </span>
              </div>
            </div>

            {/* CTAs matching the image theme */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <button
                onClick={onOrderClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-black uppercase tracking-wider text-black bg-[#F5C518] hover:bg-[#E5B810] border-2 border-black rounded-2xl transition-all duration-200 shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
              >
                <span>UPGRADE YOUR SECURITY TODAY!</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-gray-800 hover:text-black bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-2xl transition-colors cursor-pointer"
              >
                <span>EXPLORE A-01 SPECS</span>
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Visual Asset + Sleek Design Pillars from Image */}
          <div className="lg:col-span-5 relative space-y-5">
            {/* Auto-Switching & Continuous Zooming Lock Showcase */}
            <div className="relative rounded-3xl bg-slate-50 border-2 border-black/10 p-4 shadow-xl">
              <div
                className="relative aspect-square sm:aspect-[4/3] bg-white rounded-2xl overflow-hidden flex items-center justify-center p-3 group border border-gray-200"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20 overflow-hidden">
                  <div
                    key={`hero-progress-${currentSlide}`}
                    className="h-full bg-[#0088A8]"
                    style={{
                      animation: isAutoPlaying ? 'progressFill 3.8s linear forwards' : 'none',
                      width: isAutoPlaying ? undefined : '100%',
                    }}
                  />
                </div>

                {/* Price tag badge */}
                <div className="absolute top-3 left-3 bg-black/90 text-white px-3 py-1.5 rounded-xl border border-gray-700 shadow-md flex items-center gap-2 z-20">
                  <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
                  <span className="text-xs font-bold text-gray-300">A-01 Only</span>
                  <span className="text-sm font-black text-[#F5C518]">₦180,000</span>
                </div>

                {/* Active badge */}
                <div className="absolute top-3 right-3 bg-cyan-900/90 text-white px-2.5 py-1 rounded-lg border border-cyan-400/40 text-[11px] font-bold z-20 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#F5C518]" />
                  <span>{heroSlides[currentSlide].badge}</span>
                </div>

                {/* CONTINUOUS ZOOM & AUTO-SWITCHING IMAGE */}
                <img
                  key={currentSlide}
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  className="max-h-full max-w-full object-contain animate-continuous-zoom"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right controls */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous view"
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-black text-black hover:text-[#F5C518] border border-gray-300 shadow transition-colors cursor-pointer z-20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next view"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-black text-black hover:text-[#F5C518] border border-gray-300 shadow transition-colors cursor-pointer z-20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Current slide caption */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/85 backdrop-blur-md text-white text-center border border-white/10 z-20">
                  <div className="text-xs font-black text-[#00D2FF] tracking-wide">
                    {heroSlides[currentSlide].title}
                  </div>
                  <div className="text-[11px] text-gray-300 truncate">
                    {heroSlides[currentSlide].highlight}
                  </div>
                </div>
              </div>

              {/* Slide dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? 'w-7 bg-[#0088A8]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* SLEEK DESIGN. ADVANCED PROTECTION. (Right-side Box from Image) */}
            <div className="p-5 rounded-3xl bg-slate-50 border-2 border-black/10 space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0088A8]" />
                <h3 className="text-base font-black tracking-wider text-black font-heading">
                  SLEEK DESIGN. <span className="text-[#0088A8]">ADVANCED PROTECTION.</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs sm:text-sm font-semibold text-gray-700">
                {PRODUCT_DATA.sidePillars.map((pillar, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4A017] shrink-0" />
                    <span>{pillar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 12 HARDWARE FEATURES GRID (Directly from the uploaded Image diagram) */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold tracking-widest text-[#0088A8] uppercase">
              Engineered Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#101010] mt-1 font-heading">
              12 ADVANCED HARDWARE CAPABILITIES
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PRODUCT_DATA.imageFeatureGrid.map((feat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-gray-200 hover:border-black hover:bg-white transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 text-[#0088A8] flex items-center justify-center mb-2 font-mono text-xs font-bold">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#101010] leading-tight uppercase">
                    {feat.label}
                  </h4>
                  <span className="text-[10px] text-gray-500 font-medium block mt-1">
                    {feat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5 BOTTOM PILLARS STRIP (Exact Bottom Banner from Image) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PRODUCT_DATA.bottomPillars.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-cyan-50 text-[#0088A8] border border-cyan-200 shrink-0">
                {idx === 0 && <Layers className="w-4 h-4" />}
                {idx === 1 && <Smartphone className="w-4 h-4" />}
                {idx === 2 && <ShieldCheck className="w-4 h-4" />}
                {idx === 3 && <Wrench className="w-4 h-4" />}
                {idx === 4 && <BatteryCharging className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-black text-[#101010] uppercase tracking-wider">
                  {p.title}
                </h4>
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
