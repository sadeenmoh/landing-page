import React from 'react';
import { CategoryType, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles } from 'lucide-react';

interface CategoriesNavProps {
  language: Language;
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (category: CategoryType | 'all') => void;
}

export const CategoriesNav: React.FC<CategoriesNavProps> = ({
  language,
  selectedCategory,
  onSelectCategory,
}) => {
  const t = TRANSLATIONS[language];

  const categoryItems = [
    {
      id: 'face' as const,
      title: t.categoryFaceTitle,
      subtitle: t.categoryFaceSub,
      tag: language === 'ar'? 'فاونديشن ومثبت' : 'Foundation & Mist',
      image: 'https://cdn.phototourl.com/member/2026-09-27-22751244-fc1e-495b-9447-5308027e1dd6.jpg',
    },
    {
      id: 'lips' as const,
      title: t.categoryLipsTitle,
      // هون التعديل المطلوب
      subtitle: language === 'ar'
       ? 'أحمر شفاه • ملمع شفاه • محدد شفاه • زيت مغذي • قلوس مات • قلوس شاين'
        : 'Lipstick • Gloss • Liner • Nourishing Oil • Matte Gloss • Shine Gloss',
      tag: language === 'ar'? 'أحمر شفاه وجلوس' : 'Matte & Gloss',
      image: 'https://cdn.phototourl.com/member/2026-09-27-e8cdef11-6e4d-460f-893b-6669a366bca2.jpg',
    },
    {
      id: 'eyes' as const,
      title: t.categoryEyesTitle,
      subtitle: t.categoryEyesSub,
      tag: language === 'ar'? 'ماسكارا وباليت' : 'Lashes & Shadows',
      image: 'https://cdn.phototourl.com/member/2026-09-27-aa0186e8-8d8d-4d43-bd13-621277db1484.jpg',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-[#ebdcd5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9c513e] bg-[#faefe9] px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Miss2m Jordan Categories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#261714]">
            {t.categoriesSectionTitle}
          </h2>
          <p className="text-sm text-[#735a53] mt-1 font-normal">
            {t.categoriesSectionSub}
          </p>
        </div>

        {/* Circular & Grid Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categoryItems.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const el = document.getElementById('product-showcase-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative text-start p-5 sm:p-6 rounded-3xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer ${
                  isSelected
                   ? 'bg-[#faefe9] border-2 border-[#b87661] shadow-xl shadow-[#b87661]/10 scale-[1.02]'
                    : 'bg-[#faf6f3] hover:bg-[#faefe9] border border-[#ebdcd5] hover:border-[#c59a85] hover:shadow-md'
                }`}
                id={`category-card-${cat.id}`}
              >
                {/* Circular Image Container with Rose-Gold Outer Ring */}
                <div className="relative mb-4">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 transition-all duration-300 ${
                      isSelected
                       ? 'ring-4 ring-[#b87661] ring-offset-2 ring-offset-[#faefe9]'
                        : 'ring-2 ring-[#dfc6bc] group-hover:ring-[#c59a85]'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Title & Tag */}
                <h3 className="text-lg sm:text-xl font-extrabold text-[#261714] group-hover:text-[#a05742] transition-colors">
                  {cat.title}
                </h3>
                <span className="text-xs font-bold text-[#9c513e] bg-white/90 px-3 py-1 rounded-full mt-1.5 border border-[#ebdcd5]">
                  {cat.tag}
                </span>

                {/* Subtitle / items preview */}
                <p className="text-xs sm:text-sm text-[#7d655f] mt-2.5 line-clamp-3 leading-relaxed">
                  {cat.subtitle}
                </p>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="w-8 h-1 bg-[#b87661] rounded-full mt-3"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};