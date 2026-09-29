import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Heart, Sparkles, Plus, Minus } from 'lucide-react';
import { Product, Shade, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddToCart: (product: Product, shade?: Shade, quantity?: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  language,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const t = TRANSLATIONS[language];
  if (!isOpen || !product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(
    product.shades.length > 0 ? product.shades[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedShade, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const imagesList = product.gallery && product.gallery.length > 0
    ? [product.image, ...product.gallery.filter((img) => img !== product.image)]
    : [product.image, product.hoverImage];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        id="quick-view-modal-container"
        className="bg-white rounded-3xl shadow-2xl border border-[#ebdcd5] w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 relative"
      >
        {/* Top Header Actions (Wishlist & Close) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => onToggleWishlist?.(product.id)}
            className={`p-2 rounded-full shadow-md transition-all ${
              isWishlisted
                ? 'bg-[#fff0ed] text-[#c55d42] border border-[#f5b8a9] scale-105'
                : 'bg-white/90 hover:bg-white text-[#57433d] hover:text-[#c55d42] border border-[#ebdcd5] hover:scale-105 active:scale-95'
            }`}
            title={isWishlisted ? t.removeFromWishlist : t.addToWishlist}
            aria-label={isWishlisted ? t.removeFromWishlist : t.addToWishlist}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#c55d42]' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#4a3630] border border-[#ebdcd5] shadow-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-[#faf5f2] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#ebdcd5]">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-inner mb-4">
              <img
                src={activeImage}
                alt={product.nameEn}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#9c513e] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#ebdcd5]">
                {product.origin}
              </div>
            </div>

            {/* Thumbnail switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                    activeImage === img
                      ? 'border-[#b87661] ring-2 ring-[#dfc6bc]'
                      : 'border-transparent hover:border-[#ebdcd5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="p-6 flex flex-col justify-between space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#806963] mb-1">
                <span className="font-bold text-[#a05742] uppercase tracking-wider">
                  {language === 'ar' ? product.subcategoryAr : product.subcategoryEn}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#d48b3b] text-[#d48b3b]" />
                  <span className="font-extrabold text-[#261714]">{product.rating}</span>
                  <span className="text-[11px] text-[#9c857e]">
                    ({product.reviewsCount} {t.reviews})
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[#261714] leading-snug">
                {language === 'ar' ? product.nameAr : product.nameEn}
              </h3>
              <p className="text-xs text-[#8e756e] font-semibold mt-0.5">
                {language === 'ar' ? product.nameEn : product.nameAr}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-3 pb-3 border-b border-[#ebdcd5]">
                <span className="text-2xl font-black text-[#261714]">
                  {product.price.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-[#9c513e]">{t.currency}</span>
                {product.originalPrice && (
                  <span className="text-xs text-[#a08b84] line-through">
                    {product.originalPrice.toFixed(2)} {t.currency}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#634e48] leading-relaxed mt-3">
                {language === 'ar' ? product.descriptionAr : product.descriptionEn}
              </p>

              {/* Shades Picker if available */}
              {product.shades.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#ebdcd5]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#473631] mb-2">
                    <span>
                      {t.selectShade}{' '}
                      <span className="text-[#a05742]">
                        {selectedShade
                          ? language === 'ar'
                            ? selectedShade.nameAr
                            : selectedShade.nameEn
                          : ''}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {product.shades.map((shade) => {
                      const isSel = selectedShade?.id === shade.id;
                      return (
                        <button
                          key={shade.id}
                          onClick={() => setSelectedShade(shade)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs transition-all ${
                            isSel
                              ? 'border-[#b87661] bg-[#faefe9] font-bold text-[#6d3425] shadow-xs'
                              : 'border-[#ebdcd5] bg-white text-[#523e38] hover:border-[#c59a85]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: shade.hex }}
                          />
                          <span>{language === 'ar' ? shade.nameAr : shade.nameEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Benefits */}
              <div className="mt-4 pt-3 border-t border-[#ebdcd5]">
                <h5 className="text-xs font-extrabold text-[#261714] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#b87661]" />
                  <span>{language === 'ar' ? 'مميزات المستحضر:' : 'Key Features:'}</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-[#634e48]">
                  {(language === 'ar' ? product.keyBenefitsAr : product.keyBenefitsEn).map(
                    (benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Ingredients */}
              <div className="mt-3 text-[11px] text-[#806963] bg-[#faf5f2] p-2.5 rounded-xl border border-[#ebdcd5]">
                <strong className="text-[#4a3630] block mb-0.5">{t.keyIngredients}:</strong>
                {language === 'ar' ? product.ingredientsAr : product.ingredientsEn}
              </div>
            </div>

            {/* Quantity and Add to Cart CTA */}
            <div className="pt-4 border-t border-[#ebdcd5] space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#dfc6bc] rounded-2xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 hover:bg-[#faefe9] rounded-xl text-[#473631]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-extrabold text-[#261714]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 hover:bg-[#faefe9] rounded-xl text-[#473631]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  disabled={isAdded}
                  className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#2c1c18] hover:bg-[#462a22] text-[#f7ece8]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تمت الإضافة للسلة بنجاح' : 'Added to Bag!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#f5dbd2]" />
                      <span>
                        {t.quickAdd} — {(product.price * quantity).toFixed(2)} {t.currency}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};