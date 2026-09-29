import React, { useState } from 'react';
import { X, Sparkles, Star, Gift, Copy, Check, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  voucherCode: string;
  onApplyToCart: (code: string) => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  onClose,
  language,
  voucherCode,
  onApplyToCart,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApplyToCart(voucherCode);
    setApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        id="celebration-modal-card"
        className="relative bg-white rounded-3xl shadow-2xl border-2 border-amber-300 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Decorative Golden Starburst Header */}
        <div className="relative bg-gradient-to-br from-[#2c1c18] via-[#452720] to-[#2c1c18] p-6 text-center text-white overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-[#2c1c18] mx-auto flex items-center justify-center shadow-lg shadow-amber-400/30 animate-bounce">
              <Gift className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'مستوى النخبة في نادي Miss2m' : 'Miss2m Elite Milestone'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-amber-100">
              {t.celebrationCongratulations}
            </h3>
            
            <p className="text-xs text-[#eedfd9] max-w-xs mx-auto leading-relaxed">
              {t.celebrationVoucherDesc}
            </p>
          </div>
        </div>

        {/* Voucher Display Body */}
        <div className="p-6 space-y-5 bg-[#faf7f5]">
          {/* Coupon Ticket Box */}
          <div className="relative border-2 border-dashed border-[#c59a85] bg-gradient-to-r from-[#fff9f6] to-[#fff4ef] rounded-2xl p-4 sm:p-5 text-center shadow-sm">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#9c513e]">
              {language === 'ar' ? 'خصم فوري 20% على كامل مشترياتك' : 'Exclusive 20% OFF Your Order'}
            </div>

            <div className="my-2.5 flex items-center justify-center gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#2c1c18] tracking-widest bg-white px-4 py-1.5 rounded-xl border border-[#ebdcd5] shadow-xs">
                {voucherCode}
              </span>
            </div>

            <p className="text-[11px] text-[#7d655f]">
              {language === 'ar'
                ? 'صالح لجميع مستحضرات التجميل والمكياج التركي في متجر Miss2m'
                : 'Valid across all Miss2m authentic cosmetics'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleApply}
              disabled={applied}
              className={`w-full py-3.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                applied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-[#c55d42] to-[#b34932] hover:from-[#b34932] hover:to-[#9c3a24] text-white active:scale-98 shadow-[#c55d42]/20'
              }`}
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.voucherAppliedSuccess}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.applyVoucherToCart}</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#faefe9] border border-[#ebdcd5] text-[#473631] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{t.codeCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#9c513e]" />
                  <span>{t.copyCode}</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-[#8a726b] hover:text-[#2c1c18] font-bold pt-1"
          >
            {language === 'ar' ? 'إغلاق ومتابعة التسوق' : 'Close and continue shopping'}
          </button>
        </div>
      </div>
    </div>
  );
};
