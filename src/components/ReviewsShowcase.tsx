import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquarePlus,
  Sparkles,
  Quote,
  CheckCircle2,
  Award,
  Heart,
  MapPin,
} from 'lucide-react';
import { Language, CustomerReview } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ReviewsShowcaseProps {
  language: Language;
  reviews: CustomerReview[];
  onOpenReviewModal: () => void;
  onLikeReview: (reviewId: string) => void;
}

export const ReviewsShowcase: React.FC<ReviewsShowcaseProps> = ({
  language,
  reviews,
  onOpenReviewModal,
  onLikeReview,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [activeCategory, setActiveCategory] = useState<'all' | 'foundation' | 'lips' | 'spray' | 'fivestar'>('all');
  const [likedReviews, setLikedReviews] = useState<string[]>([]);

  const filteredReviews = reviews.filter((rev) => {
    if (activeCategory === 'fivestar') return rev.rating === 5;
    if (activeCategory === 'foundation') {
      const p = (rev.productNameAr + ' ' + (rev.productNameEn || '') + ' ' + rev.comment).toLowerCase();
      return p.includes('أساس') || p.includes('فاونديشن') || p.includes('foundation') || p.includes('كونسيلر') || p.includes('concealer');
    }
    if (activeCategory === 'lips') {
      const p = (rev.productNameAr + ' ' + (rev.productNameEn || '') + ' ' + rev.comment).toLowerCase();
      return p.includes('شفاه') || p.includes('روج') || p.includes('lipstick') || p.includes('lip');
    }
    if (activeCategory === 'spray') {
      const p = (rev.productNameAr + ' ' + (rev.productNameEn || '') + ' ' + rev.comment).toLowerCase();
      return p.includes('مثبت') || p.includes('spray') || p.includes('مسكارا') || p.includes('mascara') || p.includes('برايمر') || p.includes('primer');
    }
    return true;
  });

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const handleLike = (id: string) => {
    if (likedReviews.includes(id)) return;
    setLikedReviews((prev) => [...prev, id]);
    onLikeReview(id);
  };

  return (
    <section
      id="reviews-showcase-section"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#faf6f3] via-[#f7eee9] to-[#faf5f2] border-t border-[#ebdcd5] relative overflow-hidden"
    >
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#f3d9ce]/35 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#f8e4dc]/40 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#9c513e] border border-[#ebdcd5] text-xs font-black shadow-xs">
            <Sparkles className="w-4 h-4 text-[#c55d42]" />
            <span>
              {language === 'ar'
                ? 'قسم آراء عملائنا وتجاربهم الحقيقية في الأردن'
                : 'Customer Reviews & Real Experiences in Jordan'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#261714] tracking-tight">
            {language === 'ar'
              ? 'تجارب حقيقية تعكس ثقة سيدات الأردن بمستحضرات Miss2m'
              : 'Real Experiences & Genuine Feedback from Jordanian Beauties'}
          </h2>

          <p className="text-xs sm:text-sm text-[#78615b] leading-relaxed">
            {language === 'ar'
              ? 'شاركتنا عميلاتنا في عمّان وإربد والزرقاء والسلط والعقبة آراءهن الصادقة بعد تجربة كريم الأساس، أحمر الشفاه المخملي، مثبتات المكياج، والمسكارا التركية الأصلية.'
              : 'Authentic reviews and real beauty results shared by customers across Amman, Irbid, Zarqa, As-Salt, and Aqaba enjoying authentic Turkish cosmetics.'}
          </p>
        </div>

        {/* 3 Trust & Satisfaction Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-4xl mx-auto">
          {/* Metric 1 */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#ebdcd5] shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-black text-xl flex-shrink-0 border border-amber-200">
              ★
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#261714]">{averageRating}</span>
                <span className="text-xs font-bold text-[#806963]">/ 5.0</span>
              </div>
              <p className="text-[11px] text-[#735e58] font-bold">
                {language === 'ar' ? 'متوسط تقييم المتجر والمستحضرات' : 'Overall Product & Store Rating'}
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#ebdcd5] shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-[#261714]">100%</div>
              <p className="text-[11px] text-[#735e58] font-bold">
                {language === 'ar' ? 'تقييمات موثقة بأرقام الطلبات الحقيقية' : 'Verified Orders & Authentic Purchases'}
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#ebdcd5] shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#c55d42] flex items-center justify-center flex-shrink-0 border border-rose-200">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-[#261714]">+1 Star ⭐</div>
              <p className="text-[11px] text-[#735e58] font-bold">
                {language === 'ar' ? 'نجمة فورية في نادي الولاء لكل تقييم' : 'Instant Star Earned per Review'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Write Review Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-[#2c1c18] text-white shadow-xs'
                  : 'bg-white text-[#5c463f] hover:bg-[#faefe9] border border-[#ebdcd5]'
              }`}
            >
              {language === 'ar' ? 'كافة التقييمات' : 'All Reviews'} ({reviews.length})
            </button>

            <button
              onClick={() => setActiveCategory('foundation')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === 'foundation'
                  ? 'bg-[#2c1c18] text-white shadow-xs'
                  : 'bg-white text-[#5c463f] hover:bg-[#faefe9] border border-[#ebdcd5]'
              }`}
            >
              {language === 'ar' ? 'الفاونديشن والكونسيلر' : 'Foundation & Concealer'}
            </button>

            <button
              onClick={() => setActiveCategory('lips')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === 'lips'
                  ? 'bg-[#2c1c18] text-white shadow-xs'
                  : 'bg-white text-[#5c463f] hover:bg-[#faefe9] border border-[#ebdcd5]'
              }`}
            >
              {language === 'ar' ? 'الروج المخملي' : 'Velvet Lipsticks'}
            </button>

            <button
              onClick={() => setActiveCategory('spray')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === 'spray'
                  ? 'bg-[#2c1c18] text-white shadow-xs'
                  : 'bg-white text-[#5c463f] hover:bg-[#faefe9] border border-[#ebdcd5]'
              }`}
            >
              {language === 'ar' ? 'المثبت والمسكارا والبرايمر' : 'Setting Spray & Eyes'}
            </button>

            <button
              onClick={() => setActiveCategory('fivestar')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                activeCategory === 'fivestar'
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'bg-white text-[#5c463f] hover:bg-[#faefe9] border border-[#ebdcd5]'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{language === 'ar' ? '5 نجوم ممتازة' : '5-Stars'}</span>
            </button>
          </div>

          {/* Write a Review Button */}
          <button
            onClick={onOpenReviewModal}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c55d42] to-[#b34932] hover:from-[#b34932] hover:to-[#9c3a24] text-white font-extrabold text-xs shadow-md shadow-[#c55d42]/20 flex items-center justify-center gap-2 active:scale-98 transition-all flex-shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{language === 'ar' ? 'شاركينا رأيك واكسبي نجمة ⭐' : 'Write a Review & Earn Star ⭐'}</span>
          </button>
        </div>

        {/* Testimonials Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.map((rev) => {
            const isLiked = likedReviews.includes(rev.id);
            const displayLikes = (rev.likesCount || 0) + (isLiked ? 1 : 0);

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ebdcd5] hover:border-[#c59a85]/60 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Decorative subtle quotation mark */}
                <Quote className="w-12 h-12 text-[#f3e6e0]/60 absolute top-4 left-4 -scale-x-100 pointer-events-none" />

                <div className="space-y-3.5 relative z-10">
                  {/* Reviewer Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar initial badge */}
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f3dbd1] via-[#fceae4] to-[#f3dbd1] text-[#9c4c37] font-black text-sm flex items-center justify-center border border-[#ebdcd5] shadow-xs flex-shrink-0">
                        {rev.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-extrabold text-sm text-[#261714]">
                            {rev.name}
                          </h4>
                          {rev.city && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-[#856c64] bg-[#faf5f2] px-1.5 py-0.5 rounded-full border border-[#ebdcd5]">
                              <MapPin className="w-2.5 h-2.5 text-[#c55d42]" />
                              <span>{rev.city}</span>
                            </span>
                          )}
                        </div>

                        {/* Order Number & Verified Purchase Tag */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-[#7d655f] bg-[#faf5f2] px-1.5 py-0.5 rounded border border-[#ebdcd5] font-bold">
                            {rev.orderNumber}
                          </span>

                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{language === 'ar' ? 'شراء موثق' : 'Verified'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-0.5 flex-shrink-0 bg-amber-50/80 px-2 py-1 rounded-xl border border-amber-200/80">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Product reviewed pill */}
                  {(rev.productNameAr || rev.productNameEn) && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8c4837] bg-rose-50/80 px-2.5 py-1 rounded-xl border border-rose-200/50">
                      <Sparkles className="w-3 h-3 text-[#c55d42]" />
                      <span>{language === 'ar' ? rev.productNameAr : rev.productNameEn}</span>
                    </div>
                  )}

                  {/* Review Text */}
                  <p className="text-xs sm:text-[13px] text-[#38241f] leading-relaxed font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Footer: Date & Helpful Button */}
                <div className="pt-3.5 mt-4 border-t border-[#f2e6e0] flex items-center justify-between text-xs text-[#8f756e] relative z-10">
                  <span className="text-[11px]">{rev.date}</span>

                  <button
                    onClick={() => handleLike(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      isLiked
                        ? 'bg-rose-50 text-[#c55d42] border border-rose-200'
                        : 'hover:bg-[#faf5f2] text-[#7d655f]'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#c55d42]' : ''}`} />
                    <span>{language === 'ar' ? 'مفيد' : 'Helpful'}</span>
                    <span>({displayLikes})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
