import React, { useState, useMemo } from 'react';
import { Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Product, CategoryType, SortOption, Language, Shade } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { ProductCard } from './ProductCard';

interface ProductShowcaseProps {
  products: Product[];
  language: Language;
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (category: CategoryType | 'all') => void;
  searchQuery: string;
  onClearSearch: () => void;
  onAddToCart: (product: Product, shade?: Shade) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
  language,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  onAddToCart,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
}) => {
  const t = TRANSLATIONS[language];
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filterTabs = [
    { id: 'all' as const, label: t.filterAll },
    { id: 'face' as const, label: t.navFace },
    { id: 'lips' as const, label: t.navLips },
    { id: 'eyes' as const, label: t.navEyes },
  ];

  // Filter & Sort computation - FIXED for optional shades
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query - FIXED: shades can be undefined
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const allShades = p.shades || [];
        return (
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.subcategoryAr.toLowerCase().includes(q) ||
          p.subcategoryEn.toLowerCase().includes(q) ||
          p.descriptionAr.toLowerCase().includes(q) ||
          p.descriptionEn.toLowerCase().includes(q) ||
          allShades.some(
            (s) => s.nameAr.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q)
          )
        );
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="product-showcase-section" className="py-16 bg-[#faf7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9c513e] bg-[#f7ebe6] px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Feel Beauty On You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#261714]">
              {t.showcaseTitle}
            </h2>
            <p className="text-sm text-[#78615a] mt-1 font-normal">
              {t.showcaseSub}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#856b64]" />
            <span className="text-xs font-bold text-[#634e48]">{t.sortBy}:</span>
            <select
              id="product-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-[#dfc9bf] text-xs font-bold text-[#2c1c18] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c59a85] cursor-pointer shadow-2xs"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="price-asc">{t.sortPriceAsc}</option>
              <option value="price-desc">{t.sortPriceDesc}</option>
              <option value="rating">{t.sortRating}</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2c1c18] text-[#f7ece8] shadow-md scale-102'
                    : 'bg-white text-[#57433d] hover:bg-[#faefe9] border border-[#ebdcd5]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Query Active Notification */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faefe9] border border-[#ebd2c7] mb-6">
            <span className="text-xs text-[#6e3e30] font-medium">
              {language === 'ar' ? (
                <>نتائج البحث عن: <strong>"{searchQuery}"</strong> ({filteredProducts.length} مستحضر)</>
              ) : (
                <>Search results for: <strong>"{searchQuery}"</strong> ({filteredProducts.length} products)</>
              )}
            </span>
            <button
              onClick={onClearSearch}
              className="flex items-center gap-1 text-xs font-bold text-[#9c513e] hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إلغاء البحث' : 'Clear Search'}</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#ebdcd5] p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#faefe9] text-[#9c513e] mx-auto flex items-center justify-center text-2xl mb-4">
              💄
            </div>
            <h3 className="text-lg font-black text-[#261714]">
              {language === 'ar' ? 'لم يتم العثور على مستحضرات' : 'No cosmetics found'}
            </h3>
            <p className="text-xs text-[#78615a] mt-1 mb-5">
              {language === 'ar'
                ? 'جربي البحث بكلمات مختلفة أو إزالة الفلاتر الحالية'
                : 'Try adjusting your search terms or clearing the selected category'}
            </p>
            <button
              onClick={() => {
                onClearSearch();
                onSelectCategory('all');
              }}
              className="px-6 py-2.5 rounded-full bg-[#2c1c18] text-[#f7ece8] text-xs font-bold hover:bg-[#462a22] transition-colors"
            >
              {language === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};