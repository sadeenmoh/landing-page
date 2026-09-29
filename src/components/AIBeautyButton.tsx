import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AIBeautyButtonProps {
  language: Language;
  onOpenAIAssistant: () => void;
}

export const AIBeautyButton: React.FC<AIBeautyButtonProps> = ({ language, onOpenAIAssistant }) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`fixed bottom-6 ${isRtl ? 'right-6' : 'left-6'} z-40 flex flex-col ${
        isRtl ? 'items-end' : 'items-start'
      }`}
      id="ai-beauty-floating-container"
    >
      {/* Tooltip on hover */}
      {isHovered && (
        <div
          className="mb-2.5 px-3 py-1.5 rounded-xl bg-[#2c1c18] text-[#faf2ee] text-[11px] font-bold shadow-xl border border-[#c59a85]/40 animate-in fade-in zoom-in-95 pointer-events-none whitespace-nowrap"
          role="tooltip"
        >
          {t.aiAssistantTooltip}
        </div>
      )}

      {/* Main Floating Button in Sophisticated Rose Gold / Deep Purple */}
      <button
        id="ai-beauty-assistant-floating-btn"
        onClick={onOpenAIAssistant}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#5a183b] via-[#782350] to-[#9c386b] hover:from-[#4c1331] hover:via-[#661d44] hover:to-[#872e5b] text-white px-4 py-3.5 rounded-full shadow-[0_8px_25px_rgba(120,35,80,0.45)] hover:shadow-[0_12px_32px_rgba(120,35,80,0.6)] active:scale-95 transition-all duration-300 border border-rose-300/40"
        aria-label={t.aiAssistantButtonText}
        title={t.aiAssistantTooltip}
      >
        {/* Glowing Futuristic Sparkle / AI Orb */}
        <span className="relative flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-300 via-rose-300 to-pink-200 text-[#5a183b] flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 fill-[#5a183b] text-[#5a183b] group-hover:rotate-12 group-hover:scale-110 transition-transform" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
        </span>

        {/* Button Label */}
        <span className="text-xs font-black tracking-wide hidden sm:inline-block text-rose-50">
          {t.aiAssistantButtonText}
        </span>
      </button>
    </div>
  );
};
