import React from 'react';
import { Star, Sparkles, Gift, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, MessageSquarePlus, Award } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface StarRewardsSectionProps {
  language: Language;
  totalStars: number;
  unlockedVouchers: string[];
  identifiedPhone?: string | null;
  onOpenStarClub: () => void;
  onOpenReviewModal: () => void;
  onOpenCelebrationModal: (code: string) => void;
}

export const StarRewardsSection: React.FC<StarRewardsSectionProps> = ({
  language,
  totalStars,
  unlockedVouchers,
  identifiedPhone,
  onOpenStarClub,
  onOpenReviewModal,
  onOpenCelebrationModal,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const maxGoal = 10;
  const currentProgressCount = totalStars % maxGoal === 0 && totalStars > 0 ? maxGoal : totalStars % maxGoal;
  const progressPercent = Math.min(100, Math.round((currentProgressCount / maxGoal) * 100));
  const starsRemaining = Math.max(0, maxGoal - currentProgressCount);
  const hasUnlockedVouchers = unlockedVouchers.length > 0;

  return (
    <section id="star-rewards-section" className="py-14 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#faf7f5] via-[#f7ede8] to-[#faf5f2]">
      {/* Background ambient accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#f3d9ce]/40 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#f7e4dc]/50 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Main Banner Card */}
        <div className="bg-gradient-to-br from-[#2c1c18] via-[#3a201b] to-[#2c1c18] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#c59a85]/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text & Rules */}
          <div className="space-y-4 max-w-xl text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-black">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'برنامج ولاء عميلات Miss2m' : 'Miss2m VIP Star Rewards'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#faf2ee] tracking-tight leading-tight">
              {t.starClubTitle}
            </h2>

            <p className="text-xs sm:text-sm text-[#ecd9d2] leading-relaxed">
              {t.starClubSubtitle}
            </p>

            {/* Quick 3-Step Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-start">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1★
                </span>
                <span className="text-[11px] font-bold text-[#faf0eb]">
                  {language === 'ar' ? 'تأكيد الطلب (+1 نجمة)' : 'Order Confirmed (+1)'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-400/30 text-amber-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1★
                </span>
                <span className="text-[11px] font-bold text-[#faf0eb]">
                  {language === 'ar' ? 'تقييم موثق (+1 نجمة)' : 'Verified Review (+1)'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-rose-400/30 text-rose-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  20%
                </span>
                <span className="text-[11px] font-bold text-[#faf0eb]">
                  {language === 'ar' ? '10 نجوم = خصم 20%' : '10 Stars = 20% OFF'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Live Tracker Card */}
          <div className="w-full lg:w-96 bg-white text-[#261714] rounded-3xl p-6 shadow-2xl border border-amber-200/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#9c513e]">
                    {t.starsTracker}
                  </span>
                  {identifiedPhone && (
                    <span className="text-[10px] font-mono font-bold bg-[#faf5f2] border border-[#ebdcd5] text-[#806963] px-1.5 py-0.2 rounded-full">
                      {identifiedPhone}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black text-[#261714]">
                    {totalStars}
                  </span>
                  <span className="text-xs font-bold text-[#7d655f]">
                    {t.starsCollected}
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-[#2c1c18] flex items-center justify-center font-black text-xl shadow-md shadow-amber-400/30">
                ★
              </div>
            </div>

            {/* Progress to 10 Stars */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-extrabold text-[#735e58]">
                <span>
                  {language === 'ar'
                    ? `${currentProgressCount} من 10 نجوم`
                    : `${currentProgressCount} of 10 Stars`}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#f4ebe6] overflow-hidden p-0.5 border border-[#e8d5cc]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-[#e08369] to-[#c55d42] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-[#8a726b] text-center font-bold pt-0.5">
                {starsRemaining === 0
                  ? (language === 'ar' ? '🎉 تم فتح قسيمة الخصم 20%!' : '🎉 20% Voucher Unlocked!')
                  : t.starsRemaining.replace('{count}', String(starsRemaining))}
              </p>
            </div>

            {/* Unlocked Voucher Preview if ready */}
            {hasUnlockedVouchers && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-center space-y-1">
                <span className="text-[10px] font-black text-amber-900 block">
                  {t.voucherUnlocked}
                </span>
                <button
                  onClick={() => onOpenCelebrationModal(unlockedVouchers[0])}
                  className="w-full py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#2c1c18] font-black text-xs transition-colors"
                >
                  {t.claimVoucher} ({unlockedVouchers[0]})
                </button>
              </div>
            )}

            {/* Section CTA Buttons */}
            <div className="space-y-2 pt-1">
              <button
                id="open-star-club-widget-btn"
                onClick={onOpenStarClub}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2c1c18] hover:bg-[#402923] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>{t.viewStarClub}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onOpenReviewModal}
                className="w-full py-2.5 px-4 rounded-xl bg-[#faefe9] hover:bg-[#f5e3da] text-[#9c513e] font-extrabold text-xs flex items-center justify-center gap-2 transition-all border border-[#ebdcd5]"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{t.submitReviewBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
