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
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(
    product.shades.length > 0 ? product.shades[0] : undefined
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedShade);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const getBadgeLabel = () => {
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
      className="group relative bg-white rounded-3xl border border-[#ebdcd5] hover:border-[#cb9e90] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area with Hover Alternate Angle */}
      <div
        onClick={() => onQuickView(product)}
        className="relative aspect-square w-full bg-[#fbf5f2] overflow-hidden cursor-pointer"
      >
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={language === 'ar' ? product.nameAr : product.nameEn}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges & Wishlist Heart Action */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {badgeText && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide shadow-sm bg-[#2c1c18] text-[#f7ece8]">
                {badgeText}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#854d3e] border border-[#ebdcd5] backdrop-blur-xs">
              🇹🇷 TR
            </span>
          </div>

          {/* Wishlist Button */}
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
            title={isWishlisted ? t.removeFromWishlist : t.addToWishlist}
            aria-label={isWishlisted ? t.removeFromWishlist : t.addToWishlist}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isWishlisted ? 'fill-[#c55d42] scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Floating Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white text-[#2c1c18] text-xs font-bold shadow-lg backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors border border-[#ebdcd5]"
            title={t.quickView}
          >
            <Eye className="w-3.5 h-3.5 text-[#a05742]" />
            <span>{t.quickView}</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={isAddedRecently}
            className={`py-2.5 px-4 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-1.5 ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2c1c18] hover:bg-[#462a22] text-[#f7ece8]'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'أضيفت' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#f5dbd2]" />
                <span>{t.quickAdd}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Subcategory & Rating */}
          <div className="flex items-center justify-between text-xs text-[#876e67] mb-1">
            <span className="font-semibold text-[#a05742]">
              {language === 'ar' ? product.subcategoryAr : product.subcategoryEn}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#d48b3b] text-[#d48b3b]" />
              <span className="font-bold text-[#2c1c18]">{product.rating}</span>
              <span className="text-[10px] text-[#9c857e]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Titles (Primary + Bilingual Sub) */}
          <h4
            onClick={() => onQuickView(product)}
            className="text-sm sm:text-base font-extrabold text-[#261714] hover:text-[#b87661] cursor-pointer transition-colors line-clamp-1"
          >
            {language === 'ar' ? product.nameAr : product.nameEn}
          </h4>
          <p className="text-[11px] text-[#8e756e] line-clamp-1 font-medium">
            {language === 'ar' ? product.nameEn : product.nameAr}
          </p>
        </div>

        {/* Shades Palette Picker (if product has shades) */}
        {product.shades.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] text-[#78615a] mb-1.5">
              <span className="font-medium">
                {selectedShade
                  ? language === 'ar'
                    ? selectedShade.nameAr
                    : selectedShade.nameEn
                  : t.selectShade}
              </span>
              <span className="text-[10px] text-[#9c837b]">
                {product.shades.length} {t.shadesCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.shades.map((shade) => {
                const isShadeSelected = selectedShade?.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShade(shade);
                    }}
                    title={language === 'ar' ? shade.nameAr : shade.nameEn}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      isShadeSelected
                        ? 'ring-2 ring-[#b87661] ring-offset-1 scale-110 border-white'
                        : 'border-[#dfc8bf] hover:scale-105'
                    }`}
                    style={{ backgroundColor: shade.hex }}
                    aria-label={shade.nameEn}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Price and Mobile Add Button */}
        <div className="pt-2 border-t border-[#f2e5df] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-[#261714]">
              {product.price.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-[#805345]">{t.currency}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#a38b84] line-through">
                {product.originalPrice.toFixed(2)} {t.currency}
              </span>
            )}
          </div>

          {/* Mobile direct add button */}
          <button
            onClick={handleQuickAdd}
            disabled={isAddedRecently}
            className={`md:hidden p-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2c1c18] text-[#f7ece8] active:bg-[#462a22]'
            }`}
            aria-label="Add to cart"
          >
            {isAddedRecently ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-[#f5dbd2]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
