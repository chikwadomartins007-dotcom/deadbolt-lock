import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (scrollHeight > 0) {
            const progress = (scrollTop / scrollHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to handle initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3.5px] bg-transparent pointer-events-none"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(scrollProgress)}
    >
      <div
        className="h-full bg-gradient-to-r from-[#D4A017] via-[#F5C518] to-[#FFCC00] shadow-[0_0_10px_rgba(245,197,24,0.8)] transition-[width] duration-75 ease-out will-change-[width]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
