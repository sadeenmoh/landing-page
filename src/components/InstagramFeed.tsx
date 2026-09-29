import React from 'react';
import { Instagram } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface InstagramFeedProps {
  language: Language;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <section className="py-10 bg-[#faf5f2] border-t border-[#ebdcd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9c513e] mb-1">
              <span>{t.instagramHandle}</span>
              <Instagram className="w-4 h-4 text-[#E1306C]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#261714]">
              {t.instagramTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#7d655f] mt-1">
              {t.instagramSub}
            </p>
          </div>

          <a
            href="https://instagram.com/miss2m.jor"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            <span>{t.instagramFollow}</span>
          </a>
        </div>
      </div>
    </section>
  );
};