import React, { useState, useEffect } from 'react';
import { X, Star, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Language, Product, CustomerReview } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { JORDAN_GOVERNORATES } from '../data/jordanLocations';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  language: Language;
  prefilledOrderNumber?: string;
  prefilledCustomerName?: string;
  prefilledCustomerPhone?: string;
  onSubmitReview: (
    review: Omit<CustomerReview, 'id' | 'date' | 'isVerifiedPurchase' | 'likesCount'>,
    phone?: string
  ) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  products,
  language,
  prefilledOrderNumber = '',
  prefilledCustomerName = '',
  prefilledCustomerPhone = '',
  onSubmitReview,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [name, setName] = useState(prefilledCustomerName);
  const [orderNumber, setOrderNumber] = useState(prefilledOrderNumber);
  const [phone, setPhone] = useState(prefilledCustomerPhone);
  const [selectedProductId, setSelectedProductId] = useState<string>('general');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [city, setCity] = useState(isRtl ? 'عمان' : 'Amman');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (prefilledCustomerName) setName(prefilledCustomerName);
      if (prefilledOrderNumber) setOrderNumber(prefilledOrderNumber);
      if (prefilledCustomerPhone) setPhone(prefilledCustomerPhone);
    }
  }, [isOpen, prefilledCustomerName, prefilledOrderNumber, prefilledCustomerPhone]);

  if (!isOpen) return null;

  const ratingLabelsAr = ['', 'ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز ورائع ★'];
  const ratingLabelsEn = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent ★'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال اسمك' : 'Please enter your name');
      return;
    }

    if (!orderNumber.trim()) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى إدخال رقم الطلب (مثال: #M2M-8492 أو #M2M-1042) لتوثيق التقييم وكسب النجمة'
          : 'Please enter your order number (e.g., #M2M-8492) to verify purchase and earn your star'
      );
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى كتابة تعليق قصير يوضح تجربتك مع المستحضر'
          : 'Please provide a brief comment describing your experience'
      );
      return;
    }

    setErrorMsg('');

    let prodNameAr: string | undefined = undefined;
    let prodNameEn: string | undefined = undefined;

    if (selectedProductId !== 'general') {
      const prod = products.find((p) => p.id === selectedProductId);
      if (prod) {
        prodNameAr = prod.nameAr;
        prodNameEn = prod.nameEn;
      }
    }

    onSubmitReview({
      name: name.trim(),
      orderNumber: orderNumber.trim().toUpperCase(),
      productId: selectedProductId !== 'general' ? selectedProductId : undefined,
      productNameAr: prodNameAr,
      productNameEn: prodNameEn,
      rating,
      comment: comment.trim(),
      city: city.trim(),
    }, phone.trim());

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setComment('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        id="review-modal-card"
        className="bg-white rounded-3xl shadow-2xl border border-[#ebdcd5] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#faf5f2] via-[#f7eee9] to-[#faf5f2] border-b border-[#ebdcd5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c55d42]/10 border border-[#c55d42]/20 flex items-center justify-center text-[#c55d42]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#261714]">
                {t.reviewModalTitle}
              </h3>
              <p className="text-xs text-[#806963] mt-0.5">
                {t.reviewModalSub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#634e48] hover:bg-white/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-[#261714]">
                {language === 'ar' ? 'تم استلام تقييمك بنجاح!' : 'Review Submitted Successfully!'}
              </h4>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>
                  {language === 'ar'
                    ? 'كسبتِ +1 نجمة في رصيد نادي Miss2m ⭐'
                    : 'You earned +1 Star in Miss2m Star Club ⭐'}
                </span>
              </div>
              <p className="text-xs text-[#7d655f]">
                {language === 'ar'
                  ? 'تمت إضافة تقييمك إلى قسم التقييمات العامة مع شارة التوثيق.'
                  : 'Your review was published in the reviews showcase with verified status.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reward incentive banner */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-xs">
                  ★
                </div>
                <div className="text-xs">
                  <span className="font-extrabold text-amber-950 block">
                    {language === 'ar' ? 'مكافأة فورية: +1 نجمة' : 'Instant Reward: +1 Star'}
                  </span>
                  <span className="text-amber-800 text-[11px]">
                    {t.orderVerifiedHint}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                  {errorMsg}
                </div>
              )}

              {/* Full Name & Order Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#473631] mb-1">
                    {t.reviewerNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.reviewerNamePlaceholder}
                    className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3 py-2 text-xs text-[#2c1c18] focus:outline-none focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#473631]">
                      {t.orderNumberLabel} *
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      {language === 'ar' ? 'توثيق' : 'Verified'}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder={t.orderNumberPlaceholder}
                    className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3 py-2 text-xs text-[#2c1c18] focus:outline-none focus:bg-white uppercase font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Phone number field to tie stars to customer account */}
              <div>
                <label className="block text-xs font-bold text-[#473631] mb-1">
                  {language === 'ar' ? 'رقم الهاتف (لإيداع النجمة في رصيدك)' : 'Phone Number (to claim star to your account)'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: 0791234567' : 'e.g. 0791234567'}
                  className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3 py-2 text-xs text-[#2c1c18] focus:outline-none focus:bg-white transition-colors"
                  dir="ltr"
                />
              </div>

              {/* Product Select & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#473631] mb-1">
                    {t.productSelectLabel}
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3 py-2 text-xs text-[#2c1c18] focus:outline-none focus:bg-white transition-colors"
                  >
                    <option value="general">{t.generalBrandOption}</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {language === 'ar' ? p.nameAr : p.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#473631] mb-1">
                    {t.cityLabel}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3 py-2 text-xs text-[#2c1c18] focus:outline-none focus:bg-white transition-colors"
                  >
                    {JORDAN_GOVERNORATES.map((g) => (
                      <option key={g.id} value={language === 'ar' ? g.nameAr : g.nameEn}>
                        {language === 'ar' ? g.nameAr : g.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Star Rating Interactive Selector */}
              <div>
                <label className="block text-xs font-bold text-[#473631] mb-1.5">
                  {t.ratingLabel} *
                </label>
                <div className="flex items-center gap-3 bg-[#faf5f2] border border-[#ebdcd5] rounded-xl p-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starIndex) => {
                      const isFilled = (hoverRating || rating) >= starIndex;
                      return (
                        <button
                          key={starIndex}
                          type="button"
                          onClick={() => setRating(starIndex)}
                          onMouseEnter={() => setHoverRating(starIndex)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 hover:scale-115 active:scale-95 transition-transform"
                          aria-label={`Rate ${starIndex} stars`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]'
                                : 'text-[#c7b5ae]'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs font-black text-[#9c513e]">
                    {language === 'ar'
                      ? ratingLabelsAr[hoverRating || rating]
                      : ratingLabelsEn[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-bold text-[#473631] mb-1">
                  {t.commentLabel} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.commentPlaceholder}
                  className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl p-3 text-xs text-[#2c1c18] focus:outline-none focus:bg-white resize-none transition-colors"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#c55d42] to-[#b34932] hover:from-[#b34932] hover:to-[#9c3a24] text-white font-black text-xs shadow-lg shadow-[#c55d42]/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>{t.submitReviewAction}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-[#f2e6e1] hover:bg-[#ebdcd5] text-[#523d37] font-bold text-xs transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
