import React, { useState } from 'react';
import { X, Star, Sparkles, Gift, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight, ShoppingBag, Phone, UserCheck, RefreshCw, KeyRound } from 'lucide-react';
import { Language, StarRewardHistory } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface StarClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  totalStars: number;
  unlockedVouchers: string[];
  history: StarRewardHistory[];
  identifiedPhone: string | null;
  customerName?: string;
  isNewCustomer?: boolean;
  onIdentifyCustomer: (phoneOrOrder: string) => void;
  onClearIdentity: () => void;
  onOpenReviewModal: () => void;
  onOpenCelebrationModal: (code: string) => void;
  onShopNow: () => void;
}

export const StarClubModal: React.FC<StarClubModalProps> = ({
  isOpen,
  onClose,
  language,
  totalStars,
  unlockedVouchers,
  history,
  identifiedPhone,
  customerName,
  isNewCustomer,
  onIdentifyCustomer,
  onClearIdentity,
  onOpenReviewModal,
  onOpenCelebrationModal,
  onShopNow,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [inputIdentifier, setInputIdentifier] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingNumber, setIsChangingNumber] = useState(false);

  if (!isOpen) return null;

  const maxGoal = 10;
  const currentProgressCount = totalStars % maxGoal === 0 && totalStars > 0 ? maxGoal : totalStars % maxGoal;
  const progressPercent = Math.min(100, Math.round((currentProgressCount / maxGoal) * 100));
  const starsRemaining = Math.max(0, maxGoal - currentProgressCount);
  const hasUnlockedVouchers = unlockedVouchers.length > 0;

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputIdentifier.trim();
    if (!clean || clean.length < 3) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى إدخال رقم هاتف صالح أو رقم طلب (مثال: 0791234567 أو #M2M-8492)'
          : 'Please enter a valid phone number or order number (e.g. 0791234567 or #M2M-8492)'
      );
      return;
    }
    setErrorMsg('');
    setIsChangingNumber(false);
    onIdentifyCustomer(clean);
  };

  const showLookupForm = !identifiedPhone || isChangingNumber;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        id="star-club-modal-card"
        className="bg-white rounded-3xl shadow-2xl border border-[#ebdcd5] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2c1c18] via-[#43251e] to-[#2c1c18] text-white border-b border-[#ebdcd5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#2c1c18] flex items-center justify-center font-black text-lg shadow-md shadow-amber-400/20">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#faf2ee]">
                  {t.starClubTitle}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  {language === 'ar' ? 'مكافآت الولاء' : 'Rewards'}
                </span>
              </div>
              <p className="text-xs text-[#d6c1b8] mt-0.5">
                {t.starClubSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Customer Identification Status or Lookup Form */}
          {showLookupForm ? (
            <div className="bg-gradient-to-br from-[#fff9f6] to-[#faeee8] border-2 border-amber-300/80 rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-[#2c1c18] flex items-center justify-center font-black text-sm flex-shrink-0 shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#261714]">
                    {t.lookupCustomerTitle}
                  </h4>
                  <p className="text-xs text-[#78615b] mt-0.5 leading-relaxed">
                    {t.lookupCustomerPrompt}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLookupSubmit} className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#523d37] mb-1">
                    {t.phoneOrOrderLabel}
                  </label>
                  <input
                    type="text"
                    value={inputIdentifier}
                    onChange={(e) => setInputIdentifier(e.target.value)}
                    placeholder={t.phoneOrOrderPlaceholder}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-[#ebdcd5] focus:outline-hidden focus:border-[#9c513e] focus:ring-2 focus:ring-[#9c513e]/20 text-xs font-bold text-[#261714] placeholder-[#a89088]"
                    dir="ltr"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c55d42] to-[#b34932] hover:from-[#b34932] hover:to-[#9c3a24] text-white font-extrabold text-xs shadow-md shadow-[#c55d42]/20 transition-all active:scale-98"
                  >
                    {t.viewBalanceBtn}
                  </button>
                  {identifiedPhone && (
                    <button
                      type="button"
                      onClick={() => setIsChangingNumber(false)}
                      className="py-2.5 px-3 rounded-xl bg-white border border-[#ebdcd5] text-xs font-bold text-[#5c4740] hover:bg-[#faf5f2]"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  )}
                </div>
              </form>

              <div className="p-2.5 rounded-xl bg-white/70 border border-amber-200/60 text-[11px] text-[#7d655f] leading-snug">
                {language === 'ar'
                  ? '✨ إذا كان هذا أول استخدام لكِ، سيبدأ رصيدك بـ 0 نجوم وسيمكنك تجميع النجوم فوراً مع كل طلب مؤكد (+1) وكل تقييم موثق (+1)!'
                  : '✨ First time here? Your balance starts at 0 stars. You can earn stars with each confirmed order (+1) and verified review (+1)!'}
              </div>
            </div>
          ) : (
            /* Active Customer Header Badge */
            <div className="bg-[#faf5f2] border border-[#ebdcd5] rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#876f67] block">
                    {t.activeCustomerBadge}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono font-black text-xs text-[#261714]">
                      {identifiedPhone}
                    </span>
                    {customerName && (
                      <span className="text-xs font-bold text-[#9c513e]">
                        ({customerName})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsChangingNumber(true)}
                className="text-[11px] font-extrabold text-[#9c513e] hover:text-[#7d3625] underline flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t.switchAccountBtn}</span>
              </button>
            </div>
          )}

          {/* New Customer Welcoming Banner if applicable */}
          {isNewCustomer && !showLookupForm && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2 font-black">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t.welcomeNewCustomer}</span>
              </div>
            </div>
          )}

          {/* Main Loyalty Star Tracker Card */}
          <div className="bg-gradient-to-br from-[#faf4f0] via-[#f7eee9] to-[#faf0ea] border border-[#ebdcd5] rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9c513e]">
                  {t.starsTracker}
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#261714]">
                    {totalStars}
                  </span>
                  <span className="text-xs font-bold text-[#7d655f]">
                    {t.starsCollected}
                  </span>
                </div>
              </div>

              {/* Goal Badge */}
              <div className="text-end">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black">
                  <Gift className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.milestoneGoal}</span>
                </span>
                <p className="text-[10px] font-bold text-[#8f756e] mt-1">
                  {totalStars === 0
                    ? (language === 'ar' ? 'ابدئي بجمع النجوم الآن!' : 'Start collecting stars now!')
                    : starsRemaining === 0
                    ? (language === 'ar' ? '🎉 تم تحقيق الهدف!' : '🎉 Goal Achieved!')
                    : t.starsRemaining.replace('{count}', String(starsRemaining))}
                </p>
              </div>
            </div>

            {/* Visual 10-Star Tokens Rack */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 py-3">
              {Array.from({ length: 10 }).map((_, index) => {
                const isEarned = index < currentProgressCount;
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                      isEarned
                        ? 'bg-gradient-to-tr from-amber-400 to-amber-300 text-[#2c1c18] shadow-sm shadow-amber-400/40 scale-105 border border-amber-300'
                        : 'bg-white/80 border border-[#e8d5cc] text-[#b8a199]'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isEarned ? 'fill-[#2c1c18] text-[#2c1c18]' : 'text-[#c2aba3]'
                      }`}
                    />
                    <span className="text-[9px] font-black mt-0.5">
                      {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-[11px] font-bold text-[#7a645d]">
                <span>
                  {language === 'ar'
                    ? `${currentProgressCount} من أصل 10 نجوم`
                    : `${currentProgressCount} of 10 Stars`}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white border border-[#ebdcd5] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-[#e08369] to-[#c55d42] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Unlocked Voucher Card if available */}
          {hasUnlockedVouchers ? (
            <div className="bg-gradient-to-r from-[#2c1c18] to-[#452720] text-white rounded-3xl p-5 shadow-lg border border-amber-300/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-[#2c1c18] flex items-center justify-center font-black">
                    ★
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-200">
                      {t.voucherUnlocked}
                    </h4>
                    <p className="text-[11px] text-[#e8d2c9]">
                      {language === 'ar' ? 'جاهز للاستخدام في سلتك' : 'Ready to use on your bag'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenCelebrationModal(unlockedVouchers[0])}
                  className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#2c1c18] font-black text-xs transition-colors shadow-xs"
                >
                  {t.claimVoucher}
                </button>
              </div>

              <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-[#e2cdc6]">{t.voucherCode}</span>
                <span className="font-mono font-black text-amber-300 text-sm tracking-wider">
                  {unlockedVouchers[0]}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-400 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                🎁
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-amber-950">
                  {language === 'ar'
                    ? 'اجمعي 10 نجوم وافتحي قسيمة الخصم 20%!'
                    : 'Collect 10 stars to unlock your 20% voucher!'}
                </p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  {t.starsRemaining.replace('{count}', String(starsRemaining))}
                </p>
              </div>
            </div>
          )}

          {/* Reward System Rules */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#4d3832]">
              {t.howToEarnTitle}
            </h4>

            <div className="space-y-2">
              {/* Rule 1: Order Confirmed */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#faf5f2] border border-[#ebdcd5]">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-800 flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                  1★
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#261714]">
                    {language === 'ar' ? 'تأكيد وشحن الطلب' : 'Order Confirmed & Dispatched'}
                  </p>
                  <p className="text-[11px] text-[#7a645d] mt-0.5 leading-relaxed">
                    {t.rule2Order}
                  </p>
                </div>
              </div>

              {/* Rule 2: Verified Review */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#faf5f2] border border-[#ebdcd5]">
                <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-800 flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                  1★
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#261714]">
                    {language === 'ar' ? 'تقييم موثق برقم الطلب' : 'Verified Review with Order #'}
                  </p>
                  <p className="text-[11px] text-[#7a645d] mt-0.5 leading-relaxed">
                    {t.rule1Review}
                  </p>
                </div>
              </div>

              {/* Rule 3: 10 Stars Milestone */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#fff8f5] border border-[#f0c2b2]">
                <div className="w-7 h-7 rounded-full bg-[#c55d42]/20 text-[#c55d42] flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                  20%
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#9c513e]">
                    {language === 'ar' ? 'مكافأة الوصول للهدف' : 'Milestone Reward'}
                  </p>
                  <p className="text-[11px] text-[#7a645d] mt-0.5 leading-relaxed">
                    {t.rule3Reward}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Star Activity History */}
          {history.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#4d3832]">
                {t.starHistoryTitle}
              </h4>
              <div className="divide-y divide-[#ebdcd5] border border-[#ebdcd5] rounded-2xl overflow-hidden bg-white">
                {history.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#2c1c18]">
                        {language === 'ar' ? item.reasonAr : item.reasonEn}
                      </p>
                      {item.orderNumber && (
                        <span className="text-[10px] text-[#8a726b] font-mono">
                          {item.orderNumber} • {item.date}
                        </span>
                      )}
                    </div>
                    <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      +{item.stars} ★
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Call To Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenReviewModal();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#c55d42] to-[#b34932] hover:from-[#b34932] hover:to-[#9c3a24] text-white font-black text-xs shadow-md shadow-[#c55d42]/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>{t.submitReviewBtn}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onShopNow();
              }}
              className="py-3 px-4 rounded-xl bg-[#2c1c18] hover:bg-[#402923] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'ar' ? 'تسوقي لكسب نجوم' : 'Shop Cosmetics'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
