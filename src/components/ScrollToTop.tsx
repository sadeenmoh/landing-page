import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-28 md:bottom-32 right-4 md:right-6 z-40 w-12 h-12 rounded-full bg-[#2c1c18] text-white shadow-xl border border-[#ebdcd5] flex items-center justify-center hover:bg-[#462a22] hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Scroll to top"
      title="العودة للأعلى"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
