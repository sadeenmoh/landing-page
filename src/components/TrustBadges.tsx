import React from 'react';
import { Award, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface TrustBadgesProps {
  language: Language;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const features = [
    {
      icon: Award,
      title: t.trust1Title,
      desc: t.trust1Desc,
      tag: language === 'ar' ? 'معايير أوروبية' : 'EU Certified',
      flag: '🇹🇷',
    },
    {
      icon: ShieldCheck,
      title: t.trust2Title,
      desc: t.trust2Desc,
      tag: language === 'ar' ? 'آمن ومختبر جلدياً' : 'Dermatologist Tested',
      flag: '✨',
    },
    {
      icon: Truck,
      title: t.trust3Title,
      desc: t.trust3Desc,
      tag: language === 'ar' ? 'خلال 48 ساعة' : 'Within 48 Hours',
      flag: '🇯🇴',
    },
    {
      icon: CreditCard,
      title: t.trust4Title,
      desc: t.trust4Desc,
      tag: language === 'ar' ? 'كاش أو كليك' : 'COD & CliQ',
      flag: '💳',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-[#ebdcd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#261714]">
            {t.trustTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#78615a] mt-2">
            {language === 'ar'
              ? 'نهتم بأدق التفاصيل لنضمن لك تجربة جمال تركية استثنائية من المعمل إلى باب منزلك في الأردن'
              : 'Dedicated to providing an unmatched Turkish cosmetics experience delivered right to your door in Jordan'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-[#faf5f2] hover:bg-[#faeee9] border border-[#ebdcd5] hover:border-[#cb9e90] transition-all duration-300 flex flex-col items-center text-center shadow-xs hover:shadow-md"
              >
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-white text-[#9c513e] flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform relative">
                  <Icon className="w-7 h-7" />
                  <span className="absolute -top-1.5 -right-1.5 text-sm">
                    {feature.flag}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#261714] mb-1">
                  {feature.title}
                </h3>
                <span className="text-[11px] font-bold text-[#a05742] bg-white px-2.5 py-0.5 rounded-full mb-3 border border-[#ebdcd5]">
                  {feature.tag}
                </span>
                <p className="text-xs text-[#735c55] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
