import React from 'react';
import { Sparkles, ArrowDown, ShieldCheck, Truck, Award } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroProps {
  language: Language;
  onShopNowClick: () => void;
  onBestSellersClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onShopNowClick,
  onBestSellersClick,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdfbf9] via-[#f7eee9] to-[#faf5f1] border-b border-[#ebdcd5] py-8 sm:py-12 lg:py-20">
      <div className="absolute top-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-[#f3ded6] rounded-full blur-3xl opacity-60 pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 left-10 w-64 h-64 sm:w-80 sm:h-80 bg-[#fae8dc] rounded-full blur-3xl opacity-50 pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#ebd2c7] shadow-sm backdrop-blur-sm mx-auto lg:mx-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c55d42] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b85237]"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#6d3a2c]">
                {t.heroBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#261714] tracking-tight leading-[1.25]">
              {t.heroTitle}
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-[#5e4740] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                id="hero-shop-now-cta-btn"
                onClick={onShopNowClick}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-[#2c1c18] hover:bg-[#462a22] text-[#f7ece8] text-base font-bold shadow-xl shadow-[#2c1c18]/15 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>{t.heroCta}</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                id="hero-bestsellers-cta-btn"
                onClick={onBestSellersClick}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-full bg-white hover:bg-[#faefe9] text-[#473631] hover:text-[#914734] text-base font-bold border border-[#dfc6bc] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#b87661]" />
                <span>{t.heroSecondary}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex flex-col gap-4 mt-4 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto px-2 sm:px-0">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#e8845f] aspect-[4/5] group">
                <img
                  src="https://cdn.phototourl.com/member/2026-09-29-e4bb802f-0423-48cf-b754-93c999778d02.png"
                  alt="Miss2m"
                  className="w-full h-full object-cover object-center scale-[1.08] group-hover:scale-[1.12] transition-transform duration-700"
                />
                <div className="absolute bottom-4 inset-x-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#edd5cb] shadow-lg text-[#2c1c18]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text- sm:text-xs font-bold text-[#a05742] uppercase tracking-wider">
                        {language === 'ar'? 'تشكيلة الموسم الجديد' : 'New Season Collection'}
                      </div>
                      <div className="text-xs sm:text-base font-extrabold text-[#261714]">
                        {language === 'ar'? 'مجموعة ميس تو إم الحريرية' : 'Miss2m Silk Velvet Range'}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#fcedea] text-[#9c4c37] text- sm:text-xs font-black">
                        {language === 'ar'? 'صنع في تركيا 🇹🇷' : 'Made in Turkey 🇹🇷'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`absolute -top-3 sm:-top-4 ${isRtl? 'right-0 sm:-right-4' : 'left-0 sm:-left-4'} z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-[#ebd8d0] flex items-center gap-2.5`}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#faefe9] flex items-center justify-center text-sm sm:text-lg">💄</div>
                <div>
                  <div className="text- sm:text- font-bold text-[#806861]">{language === 'ar'? 'الأكثر طلباً' : 'Top Trend'}</div>
                  <div className="text- sm:text-xs font-black text-[#261714]">{language === 'ar'? 'أحمر شفاه مات 16H' : 'Velvet Matte 16H'}</div>
                </div>
              </div>

              <div className={`absolute -bottom-3 sm:-bottom-4 ${isRtl? 'left-0 sm:-left-4' : 'right-0 sm:-right-4'} z-20 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xl border border-[#ebd8d0] flex items-center gap-2`}>
                <span className="text-[#a05742] text-xs sm:text-sm">★★★★★</span>
                <span className="text- sm:text-xs font-black text-[#261714]">4.9 / 5</span>
              </div>
            </div>

            {/* NEW: الثقة تحت المربع مباشرة */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto grid grid-cols-3 gap-2">
              <div className="bg-white border border-[#e9d5cb] rounded-2xl px-2 py-3 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#eef5ee] flex items-center justify-center mb-1.5 text-sm">🇹🇷</div>
                <div className="text- sm:text- font-black text-[#1f4d2e] leading-tight">
                  {language === 'ar'? 'صنع في تركيا' : 'Made in Turkey'}
                </div>
                <div className="text- sm:text- text-[#5a7a62] mt-0.5">
                  {language === 'ar'? 'معايير أوروبية' : 'EU Standards'}
                </div>
              </div>

              <div className="bg-white border border-[#e9d5cb] rounded-2xl px-2 py-3 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#faefe9] flex items-center justify-center mb-1.5">
                  <Truck className="w-4 h-4 text-[#9c513e]" />
                </div>
                <div className="text- sm:text- font-black text-[#2c1c18] leading-tight">
                  {language === 'ar'? 'توصيل مجاني' : 'Free Delivery'}
                </div>
                <div className="text- sm:text- text-[#7d655f] mt-0.5">
                  {language === 'ar'? 'للطلبات +20 د.أ' : 'Over 20 JOD'}
                </div>
              </div>

              <div className="bg-white border border-[#e9d5cb] rounded-2xl px-2 py-3 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#faefe9] flex items-center justify-center mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#9c513e]" />
                </div>
                <div className="text- sm:text- font-black text-[#2c1c18] leading-tight">
                  {language === 'ar'? '100% أصلية' : '100% Original'}
                </div>
                <div className="text- sm:text- text-[#7d655f] mt-0.5">
                  {language === 'ar'? 'مضمونة' : 'Guaranteed'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};