import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Globe, Menu, X, ChevronDown, Heart, Star } from 'lucide-react';
import { Language, CategoryType, Product } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { FREE_SHIPPING_THRESHOLD } from '../data/jordanLocations';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  starCount: number;
  onOpenStarClub: () => void;
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (category: CategoryType | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  starCount,
  onOpenStarClub,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  products,
  onSelectProduct,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
  ? products.filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.nameAr.toLowerCase().includes(q) ||
            p.nameEn.toLowerCase().includes(q) ||
            p.subcategoryAr.toLowerCase().includes(q) ||
            p.subcategoryEn.toLowerCase().includes(q) ||
            p.descriptionAr.toLowerCase().includes(q) ||
            p.descriptionEn.toLowerCase().includes(q)
          );
        }).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current &&!searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'all' as const, label: t.navAll },
    { id: 'face' as const, label: t.navFace },
    { id: 'lips' as const, label: t.navLips },
    { id: 'eyes' as const, label: t.navEyes },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#ebdcd5] shadow-[0_4px_20px_-10px_rgba(200,160,150,0.15)]">
      {/* الشريط الأسود فقط - واضح ونظيف */}
      <div className="w-full bg-[#2c1c18] text-[#f7ece8] px-4 py-2 text-xs md:text-sm font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 bg-[#f7ece8] text-[#2c1c18] px-3 py-1 rounded-full text- md:text-xs font-black tracking-wide shadow-sm flex-shrink-0">
              <span className="text-sm">🇹🇷</span>
              {language === 'ar'? 'صنع في تركيا' : 'Made in Turkey'}
            </span>
            <span className="truncate">
              {language === 'ar'
              ? `Feel Beauty On You | توصيل مجاني للطلبات فوق ${FREE_SHIPPING_THRESHOLD} د.أ`
                : `Feel Beauty On You | Free delivery over ${FREE_SHIPPING_THRESHOLD} JOD`}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-[#e8c9bd]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {language === 'ar'? 'توصيل خلال 48 ساعة لجميع مدن الأردن' : 'Delivery within 48 hours across Jordan'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar - بدون الشريط الأخضر هون لأنه صار تحت المربع */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-1 md:gap-4">
          <div className="flex items-center gap-1 sm:gap-3">
            <button id="mobile-menu-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1.5 rounded-lg text-[#3d2a25] hover:bg-[#faefe9] transition-colors">
              {mobileMenuOpen? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div onClick={() => { onSelectCategory('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="cursor-pointer flex flex-col items-start sm:items-center select-none group" id="brand-logo-container">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight text-[#2c1c18] group-hover:text-[#b87661] transition-colors">
                  Miss<span className="text-[#b87661]">2m</span>
                </span>
                <span className="hidden sm:inline-block text- uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#f7ebe6] text-[#915645] border border-[#eedcd5]">
                  {language === 'ar'? 'الأردن' : 'Jordan'}
                </span>
              </div>
              <span className="text- sm:text- uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#8e766f] font-semibold">Cosmetics • Turkey</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            <div className="relative">
              <button id="categories-dropdown-btn" onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)} onBlur={() => setTimeout(() => setCategoriesDropdownOpen(false), 200)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#3d2a25] hover:text-[#b87661] rounded-lg transition-colors">
                <span>{t.navCategories}</span><ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              {categoriesDropdownOpen && (
                <div className="absolute top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-[#ebdcd5] py-2 z-50">
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => { onSelectCategory(cat.id); setCategoriesDropdownOpen(false); }} className={`w-full text-start px-4 py-2 text-sm transition-colors flex items-center justify-between ${selectedCategory === cat.id? 'bg-[#faefe9] text-[#a05742] font-bold' : 'text-[#473631] hover:bg-[#faf4f1]'}`}>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => onSelectCategory('face')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCategory === 'face'? 'text-[#a05742] font-bold bg-[#faefe9]' : 'text-[#473631] hover:text-[#b87661]'}`}>{t.navFace}</button>
            <button onClick={() => onSelectCategory('lips')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCategory === 'lips'? 'text-[#a05742] font-bold bg-[#faefe9]' : 'text-[#473631] hover:text-[#b87661]'}`}>{t.navLips}</button>
            <button onClick={() => onSelectCategory('eyes')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCategory === 'eyes'? 'text-[#a05742] font-bold bg-[#faefe9]' : 'text-[#473631] hover:text-[#b87661]'}`}>{t.navEyes}</button>
          </div>

          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-xs lg:max-w-md mx-2">
            <div className="relative">
              <input id="search-products-input" type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} onFocus={() => setSearchFocused(true)} placeholder={t.searchPlaceholder} className="w-full bg-[#f8f3f0] hover:bg-[#f5ede9] focus:bg-white text-xs md:text-sm text-[#2c1c18] placeholder-[#9a867f] rounded-full py-2 px-9 border border-[#ebdcd5] focus:border-[#c59a85] focus:outline-none transition-all" />
              <Search className={`absolute top-2.5 w-4 h-4 text-[#9a867f] ${isRtl? 'right-3.5' : 'left-3.5'}`} />
              {searchQuery && (<button onClick={() => onSearchChange('')} className={`absolute top-2 p-0.5 rounded-full hover:bg-[#e8d6ce] text-[#7a655e] ${isRtl? 'left-3' : 'right-3'}`}><X className="w-3.5 h-3.5" /></button>)}
            </div>
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-[#ebdcd5] p-2 z-50 max-h-96 overflow-y-auto">
                <div className="text- font-bold text-[#8f756e] px-3 py-1.5 uppercase tracking-wider">{language === 'ar'? 'نتائج البحث المقترحة' : 'Suggested Products'}</div>
                {searchResults.length > 0? (searchResults.map((product) => (<div key={product.id} onClick={() => { onSelectProduct(product); setSearchFocused(false); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#faf3ef] cursor-pointer transition-colors"><img src={product.image} alt={product.nameEn} className="w-10 h-10 rounded-lg object-cover bg-[#f5ede9] flex-shrink-0" /><div className="flex-1 min-w-0"><div className="text-xs font-bold text-[#2c1c18] truncate">{language === 'ar'? product.nameAr : product.nameEn}</div><div className="text-xs font-extrabold text-[#9c513e]">{product.price.toFixed(2)} {t.currency}</div></div></div>))) : (<div className="text-center py-4 text-xs text-[#8f756e]">{language === 'ar'? 'لا توجد نتائج مطابقة لبحثك' : 'No matching products found'}</div>)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => { const inputEl = document.getElementById('mobile-search-input') as HTMLInputElement; if (inputEl) inputEl.focus(); }} className="md:hidden p-2 rounded-full bg-[#f8f3f0] text-[#473631]"><Search className="w-4 h-4" /></button>
            <button id="language-switcher-btn" onClick={onToggleLanguage} className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-bold text-[#473631] bg-[#f8f3f0] hover:bg-[#faefe9] border border-[#ebdcd5] transition-all"><Globe className="w-3.5 h-3.5 text-[#a05742]" /><span className="uppercase">{language === 'ar'? 'EN' : 'ع'}</span></button>
            <button id="header-star-club-trigger-btn" onClick={onOpenStarClub} className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 text-[#473631] border border-amber-300 transition-all"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /><span className="text-xs font-black text-amber-950">{starCount}</span></button>
            <button id="header-wishlist-trigger-btn" onClick={onOpenWishlist} className="relative p-2 rounded-full bg-[#f8f3f0] hover:bg-[#faefe9] text-[#473631] border border-[#ebdcd5] transition-all flex items-center justify-center"><Heart className={`w-4 h-4 ${wishlistCount > 0? 'fill-[#c55d42] text-[#c55d42]' : 'text-[#57433d]'}`} />{wishlistCount > 0 && (<span className="absolute -top-1 -right-1 bg-[#c55d42] text-white text- font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">{wishlistCount}</span>)}</button>
            <button id="shopping-cart-drawer-trigger" onClick={onOpenCart} className="relative p-2 rounded-full bg-[#2c1c18] text-[#f7ece8] hover:bg-[#422923] transition-all shadow-md flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-[#f5dbd2]" />{cartCount > 0 && (<span className="absolute -top-1 -right-1 bg-[#c55d42] text-white text- font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">{cartCount}</span>)}</button>
          </div>
        </div>
        <div className="block md:hidden pb-3 pt-1">
          <div className="relative">
            <input id="mobile-search-input" type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-[#f8f3f0] text-xs text-[#2c1c18] placeholder-[#9a867f] rounded-full py-2 px-9 border border-[#ebdcd5] focus:outline-none" />
            <Search className={`absolute top-2.5 w-4 h-4 text-[#9a867f] ${isRtl? 'right-3.5' : 'left-3.5'}`} />
            {searchQuery && (<button onClick={() => onSearchChange('')} className={`absolute top-2 p-0.5 rounded-full text-[#7a655e] ${isRtl? 'left-3' : 'right-3'}`}><X className="w-3.5 h-3.5" /></button>)}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#ebdcd5] px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <button onClick={() => { setMobileMenuOpen(false); onOpenStarClub(); }} className="w-full text-start px-3 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-50 to-orange-50 text-[#854d0e] border border-amber-200 flex items-center justify-between"><div className="flex items-center gap-2"><Star className="w-4 h-4 fill-amber-400 text-amber-500" /><span>{t.starClubTitle}</span></div><span className="text-xs bg-amber-400 text-[#2c1c18] font-black px-2 py-0.5 rounded-full">{starCount} ★</span></button>
          <div className="text-xs font-bold uppercase tracking-wider text-[#8f756e] px-2 mb-1 pt-1">{t.navCategories}</div>
          {categories.map((cat) => (<button key={cat.id} onClick={() => { onSelectCategory(cat.id); setMobileMenuOpen(false); }} className={`w-full text-start px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${selectedCategory === cat.id? 'bg-[#faefe9] text-[#a05742] font-bold' : 'text-[#473631]'}`}><span>{cat.label}</span></button>))}
        </div>
      )}
    </header>
  );
};