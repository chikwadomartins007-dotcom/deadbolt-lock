import React, { useState, useEffect } from 'react';
import { Gift, Clock, Sparkles } from 'lucide-react';

const PROMO_DURATION_MS = 48 * 60 * 60 * 1000; // 2 Days (48 Hours)
const STORAGE_KEY = 'ml_xmas_2day_promo_end';

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function getPromoEndTimestamp(): number {
  if (typeof window === 'undefined') {
    return Date.now() + PROMO_DURATION_MS;
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? Number(saved) : 0;
    const now = Date.now();
    if (parsed && Number.isFinite(parsed) && parsed > now + 1000) {
      return parsed;
    }
    const nextEnd = now + PROMO_DURATION_MS;
    window.localStorage.setItem(STORAGE_KEY, String(nextEnd));
    return nextEnd;
  } catch {
    return Date.now() + PROMO_DURATION_MS;
  }
}

function calculateTimeLeft(endTimestamp: number): TimeLeft {
  const now = Date.now();
  let diff = endTimestamp - now;

  if (diff <= 0) {
    // Restart fresh 48-hour cycle cleanly if expired
    const renewed = now + PROMO_DURATION_MS;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(renewed));
      } catch {
        // ignore storage errors
      }
    }
    diff = PROMO_DURATION_MS;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

interface ChristmasPromoCountdownProps {
  variant?: 'banner' | 'card' | 'compact';
  className?: string;
}

export const ChristmasPromoCountdown: React.FC<ChristmasPromoCountdownProps> = ({
  variant = 'banner',
  className = '',
}) => {
  const [endTimestamp, setEndTimestamp] = useState<number>(() => getPromoEndTimestamp());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(endTimestamp));

  useEffect(() => {
    const syncAndTick = () => {
      const now = Date.now();
      if (endTimestamp <= now) {
        const renewed = getPromoEndTimestamp();
        setEndTimestamp(renewed);
        setTimeLeft(calculateTimeLeft(renewed));
      } else {
        setTimeLeft(calculateTimeLeft(endTimestamp));
      }
    };

    syncAndTick();
    const timer = window.setInterval(syncAndTick, 1000);
    return () => window.clearInterval(timer);
  }, [endTimestamp]);

  if (variant === 'compact') {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#7F1D1D] via-[#101010] to-[#064E3B] text-white border border-[#F5C518]/70 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
          <Gift className="w-3.5 h-3.5 text-[#F5C518] shrink-0" />
          <span className="text-[#F5C518]">2-Day Christmas Promo</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs font-black tabular-nums">
          <span className="px-1.5 py-0.5 rounded bg-white/15 border border-white/20 text-white">
            {timeLeft.days}d
          </span>
          <span className="text-[#F5C518]">:</span>
          <span className="px-1.5 py-0.5 rounded bg-white/15 border border-white/20 text-white">
            {timeLeft.hours}h
          </span>
          <span className="text-[#F5C518]">:</span>
          <span className="px-1.5 py-0.5 rounded bg-white/15 border border-white/20 text-white">
            {timeLeft.minutes}m
          </span>
          <span className="text-[#F5C518]">:</span>
          <span className="px-1.5 py-0.5 rounded bg-[#F5C518] text-black">
            {timeLeft.seconds}s
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`p-3.5 rounded-xl bg-gradient-to-r from-[#7F1D1D] via-[#141414] to-[#064E3B] border border-[#F5C518]/60 text-white space-y-2 ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#F5C518]">
            <Gift className="w-3.5 h-3.5 shrink-0" />
            <span>2-Day Christmas Promo Ends In</span>
          </span>
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/15 text-emerald-200 border border-white/20">
            48H Limited
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hrs' },
            { value: timeLeft.minutes, label: 'Mins' },
            { value: timeLeft.seconds, label: 'Secs' },
          ].map((unit, idx) => (
            <div
              key={unit.label}
              className={`py-1.5 px-1 rounded-lg border ${
                idx === 3
                  ? 'bg-[#F5C518] text-black border-[#F5C518]'
                  : 'bg-black/60 text-white border-white/15'
              }`}
            >
              <div className="text-lg sm:text-xl font-black font-mono tabular-nums leading-none">
                {unit.value}
              </div>
              <div
                className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${
                  idx === 3 ? 'text-black/80' : 'text-gray-300'
                }`}
              >
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#7F1D1D] via-[#111111] to-[#064E3B] text-white border-2 border-black shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-start sm:items-center gap-2.5">
        <div className="p-2 rounded-xl bg-[#F5C518] text-black shrink-0 shadow">
          <Gift className="w-4 h-4" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#F5C518] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              2-DAY CHRISTMAS PROMO
            </span>
            <span className="text-[10px] font-mono font-bold bg-white/15 text-emerald-200 px-2 py-0.5 rounded border border-white/20">
              48-Hour Festive Deal
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-200 font-medium mt-0.5">
            ₦160,000 Xmas Price + Extra ₦5,000 Off Each on 2+ Locks
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Clock className="w-3.5 h-3.5 text-[#F5C518] hidden sm:block mr-0.5" />
        {[
          { value: timeLeft.days, label: 'D' },
          { value: timeLeft.hours, label: 'H' },
          { value: timeLeft.minutes, label: 'M' },
          { value: timeLeft.seconds, label: 'S' },
        ].map((unit, idx) => (
          <div
            key={unit.label}
            className={`min-w-[44px] py-1 px-1.5 rounded-lg text-center border ${
              idx === 3
                ? 'bg-[#F5C518] text-black border-[#F5C518]'
                : 'bg-black/60 text-white border-white/20'
            }`}
          >
            <div className="text-sm sm:text-base font-black font-mono tabular-nums leading-none">
              {unit.value}
            </div>
            <div
              className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${
                idx === 3 ? 'text-black/80' : 'text-gray-300'
              }`}
            >
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
