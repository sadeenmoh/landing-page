import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check, Heart } from 'lucide-react';
import { Product, Shade, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ProductCardProps {
  product: Product;
  language: Language;
  onAddToCart: (product: Product, shade?: Shade) => void;
  onQuickView: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onAddToCart,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(undefined);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const allShades = product.shades || [];
  const hasShades = allShades.length > 0;

  const getTotalStock = (): number => {
    if (hasShades) {
      return allShades.reduce((sum, s) => sum + (s.stock?? 0), 0);
    }
    return product.stock?? 0;
  };

  const totalStock = getTotalStock();
  const isProductOutOfStock = totalStock === 0;
  const isShadeOutOfStock = (shade: Shade): boolean => (shade.stock?? 0) === 0;

  const canAddSelected = (): boolean => {
    if (isProductOutOfStock) return false;
    if (hasShades) {
      if (!selectedShade) return true;
      return!isShadeOutOfStock(selectedShade);
    }
    return (product.stock?? 0) > 0;
  };

  const getImageForShade = (shade?: Shade) => {
    if (!shade) return product.image;
    const shadeWithImage = shade as any;
    if (shadeWithImage.image) return shadeWithImage.image;
    const shadeIndex = allShades.findIndex((s) => s.id === shade.id);
    if (product.gallery && product.gallery.length > 0 && shadeIndex >= 0) {
      return product.gallery[shadeIndex % product.gallery.length];
    }
    return product.image;
  };

  const shadeImage = getImageForShade(selectedShade);
  const displayImage = selectedShade
   ? shadeImage
    : isHovered && product.hoverImage
   ? product.hoverImage
    : product.image;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canAddSelected()) return;
    onAddToCart(product, selectedShade);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const getBadgeLabel = () => {
    if (isProductOutOfStock) return language === 'ar'? 'نفذت' : 'Sold out';
    if (product.badge === 'bestseller') return t.badgeBestseller;
    if (product.badge === 'new') return t.badgeNew;
    if (product.badge === 'trending') return t.badgeTrending;
    if (product.badge === 'featured') return t.badgeFeatured;
    return null;
  };

  const badgeText = getBadgeLabel();

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full ${
        isProductOutOfStock? 'border-red-200 opacity-80' : 'border-[#ebdcd5] hover:border-[#cb9e90]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* الصورة - تم اصلاح الارتفاع والمسار */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full h-52 sm:h-64 bg-white overflow-hidden cursor-pointer flex items-center justify-center"
      >
        <img
          src={displayImage}
          alt={language === 'ar'? product.nameAr : product.nameEn}
          className={`w-full h-full object-contain object-center p-3 transition-all duration-500 ease-out group-hover:scale-[1.03] ${
            isProductOutOfStock? 'grayscale-[0.6] opacity-70' : ''
          }`}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/placeholder.png';
          }}
        />

        {isProductOutOfStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-black shadow-lg">
              {language === 'ar'? 'نفذت الكمية' : 'OUT OF STOCK'}
            </span>
          </div>
        )}

        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {badgeText && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide shadow-sm ${
                isProductOutOfStock? 'bg-red-600 text-white' : 'bg-[#2c1c18] text-[#f7ece8]'
              }`}>
                {badgeText}
              </span>
            )}
            {!isProductOutOfStock && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#854d3e] border border-[#ebdcd5] backdrop-blur-sm">
                🇹🇷 TR
              </span>
            )}
          </div>

          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(product.id);
            }}
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              isWishlisted
               ? 'bg-[#fff0ed] text-[#c55d42] border border-[#f5b8a9] scale-105'
                : 'bg-white/90 hover:bg-white text-[#78615a] hover:text-[#c55d42] border border-[#ebdcd5] hover:scale-110 active:scale-95'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted? 'fill-[#c55d42] scale-110' : ''}`} />
          </button>
        </div>

        <div className="absolute inset-x-3 bottom-3 hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white text-[#2c1c18] text-xs font-bold shadow-lg backdrop-blur-sm flex items-center justify-center gap-1.5 border border-[#ebdcd5]"
          >
            <Eye className="w-3.5 h-3.5 text-[#a05742]" />
            <span>{t.quickView}</span>
          </button>
          <button
            onClick={handleQuickAdd}
            disabled={isAddedRecently ||!canAddSelected()}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold shadow-lg flex items-center justify-center gap-1.5 transition-colors ${
             !canAddSelected()
               ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isAddedRecently
               ? 'bg-emerald-600 text-white'
                : 'bg-[#2c1c18] hover:bg-[#462a22] text-[#f7ece8]'
            }`}
          >
            {!canAddSelected()? (
              <span>{language === 'ar'? 'نفذت' : 'Out'}</span>
            ) : isAddedRecently? (
              <><Check className="w-3.5 h-3.5" /><span>أضيفت</span></>
            ) : (
              <><ShoppingBag className="w-3.5 h-3.5" /><span>{t.quickAdd}</span></>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-[#876e67] mb-1">
            <span className="font-semibold text-[#a05742] truncate">
              {language === 'ar'? product.subcategoryAr : product.subcategoryEn}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#d48b3b] text-[#d48b3b]" />
              <span className="font-bold text-[#2c1c18]">{product.rating}</span>
              <span className="text-[11px] text-[#9c857e]">({product.reviewsCount})</span>
            </div>
          </div>

          <h4
            onClick={() => onQuickView(product)}
            className="text-sm sm:text-[15px] font-extrabold text-[#261714] hover:text-[#b87661] cursor-pointer transition-colors line-clamp-1 leading-tight"
          >
            {language === 'ar'? product.nameAr : product.nameEn}
          </h4>
          <p className="text-[12px] text-[#8e756e] line-clamp-1 font-medium">
            {language === 'ar'? product.nameEn : product.nameAr}
          </p>
          {isProductOutOfStock && (
            <p className="text-[12px] font-black mt-1 text-red-600">
              {language === 'ar'? 'نفذت الكمية' : 'Out of stock'}
            </p>
          )}
          {hasShades && selectedShade && isShadeOutOfStock(selectedShade) &&!isProductOutOfStock && (
            <p className="text-[12px] font-black mt-1 text-red-600">
              {language === 'ar'? 'هذه الدرجة نفذت' : 'This shade is out'}
            </p>
          )}
        </div>

        {hasShades && (
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] text-[#78615a] mb-1.5">
              <span className="font-medium truncate">
                {selectedShade? (language === 'ar'? selectedShade.nameAr : selectedShade.nameEn) : t.selectShade}
              </span>
              <span className="text-[11px] text-[#9c837b] flex-shrink-0 ml-2">
                {allShades.length} {t.shadesCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {allShades.map((shade) => {
                const isSelected = selectedShade?.id === shade.id;
                const out = isShadeOutOfStock(shade);
                return (
                  <button
                    key={shade.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (out) return;
                      setSelectedShade(shade);
                    }}
                    disabled={out}
                    title={`${language === 'ar'? shade.nameAr : shade.nameEn} ${out? (language === 'ar'? '- نفذت' : '- Out') : ''}`}
                    className={`relative w-6 h-6 rounded-full border transition-all duration-200 flex items-center justify-center ${
                      out
                       ? 'border-gray-300 opacity-40 cursor-not-allowed grayscale'
                        : isSelected
                       ? 'ring-2 ring-[#b87661] ring-offset-1 scale-110 border-white'
                        : 'border-[#dfc8bf] hover:scale-110 hover:border-[#b87661]'
                    }`}
                    style={{ backgroundColor: out? '#e5e5e5' : shade.hex }}
                  >
                    {out && (
                      <span className="absolute w-[1px] h-4 bg-red-600 rotate-45 rounded-full" />
                    )}
                    {isSelected &&!out && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full shadow-sm border border-black/20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[#f2e5df] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-black ${isProductOutOfStock? 'text-gray-400 line-through' : 'text-[#261714]'}`}>{product.price.toFixed(2)}</span>
            <span className="text-xs font-bold text-[#805345]">{t.currency}</span>
            {product.originalPrice &&!isProductOutOfStock && (
              <span className="text-[11px] text-[#a38b84] line-through">{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={isAddedRecently ||!canAddSelected()}
            className={`md:hidden p-2 rounded-xl transition-all shadow-sm ${
             !canAddSelected()? 'bg-gray-200 text-gray-400' : isAddedRecently? 'bg-emerald-600 text-white' : 'bg-[#2c1c18] text-[#f7ece8]'
            }`}
          >
            {!canAddSelected()? <span className="text-[10px] font-black">X</span> : isAddedRecently? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};