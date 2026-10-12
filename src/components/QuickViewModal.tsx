import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, Heart, Sparkles, Plus, Minus, ArrowLeft, AlertTriangle } from 'lucide-react';
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

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedShade, setSelectedShade] = useState<Shade | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image || product.gallery?.[0] || '');
      if (product.shades && product.shades.length > 0) {
        const firstAvailable = product.shades.find(s => (s.stock ?? 0) > 0) || product.shades[0];
        setSelectedShade(firstAvailable);
      } else {
        setSelectedShade(undefined);
      }
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product?.id]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  const getImageForShade = (shade?: Shade) => {
    if (!product || !shade) return product?.image || '';
    const shadeWithImage = shade as any;
    if (shadeWithImage.image) return shadeWithImage.image;
    const allShades = product.shades || [];
    const shadeIndex = allShades.findIndex((s) => s.id === shade.id);
    if (product.gallery && product.gallery.length > 0 && shadeIndex >= 0) {
      return product.gallery[shadeIndex % product.gallery.length];
    }
    return product.image;
  };

  const handleShadeSelect = (shade: Shade) => {
    if ((shade.stock ?? 0) === 0) return;
    setSelectedShade(shade);
    setQuantity(1);
    const newImage = getImageForShade(shade);
    if (newImage) setActiveImage(newImage);
  };

  if (!isOpen || !product) return null;

  const allShades = product.shades || [];
  const hasShades = allShades.length > 0;

  const getTotalStock = (): number => {
    if (hasShades) {
      return allShades.reduce((sum, s) => sum + (s.stock ?? 0), 0);
    }
    return product.stock ?? 0;
  };

  const totalStock = getTotalStock();
  const isProductOutOfStock = totalStock === 0;
  const isShadeOutOfStock = (shade: Shade) => (shade.stock ?? 0) === 0;
  
  const currentStock = hasShades ? (selectedShade?.stock ?? 0) : (product.stock ?? 0);
  const canAdd = !isProductOutOfStock && currentStock > 0 && quantity <= currentStock;

  const handleAdd = () => {
    if (!canAdd) return;
    onAddToCart(product, selectedShade, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty < 1) return;
    if (newQty > currentStock) return;
    setQuantity(newQty);
  };

  const imagesList = [
    product.image,
   ...(product.gallery || []),
    product.hoverImage
  ].filter(Boolean) as string[];

  const uniqueImages = Array.from(new Set(imagesList));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-0 md:p-6 overflow-y-auto">
      <div className="bg-white w-full md:max-w-3xl md:rounded-3xl shadow-2xl border border-[#ebdcd5] flex flex-col overflow-hidden animate-in zoom-in-95 relative max-h- md:max-h-">

        <div className="absolute top-4 left-4 right-4 z-30 flex justify-between">
          <button onClick={onClose} className="w-10 h-10 bg-white rounded-full shadow-md border border-[#ebdcd5] flex items-center justify-center hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-[#2c1c18]" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => onToggleWishlist?.(product.id)} className={`w-10 h-10 rounded-full shadow-md flex items-center justify-center border transition-all ${isWishlisted? 'bg-[#fff0ed] text-[#c55d42] border-[#f5b8a9]' : 'bg-white text-[#57433d] border-[#ebdcd5]'}`}>
              <Heart className={`w-5 h-5 ${isWishlisted? 'fill-[#c55d42]' : ''}`} />
            </button>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#ebdcd5] shadow-md flex items-center justify-center md:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 pt-16 md:pt-6 bg-[#faf5f2] border-b md:border-b-0 md:border-r border-[#ebdcd5]">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-inner mb-4 flex items-center justify-center">
                <img src={activeImage || product.image} alt={product.nameEn} className={`w-full h-full object-contain object-center p-2 transition-all duration-500 ${isProductOutOfStock ? 'grayscale opacity-60' : ''}`} />
                {product.origin && (
                  <div className="absolute top-3 left-3 bg-white/90 text-[#9c513e] text- font-black px-2.5 py-1 rounded-full border border-[#ebdcd5]">{product.origin}</div>
                )}
                {isProductOutOfStock && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-red-600 text-white text-xs font-black shadow-lg">
                      {language === 'ar' ? 'نفذت الكمية' : 'OUT OF STOCK'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-white p-1 transition-all ${
                      activeImage === img? 'border-[#b87661] ring-2 ring-[#dfc6bc] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
              <p className="text- text-[#9c857e] mt-1">{uniqueImages.length} صور</p>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between text-xs text-[#806963] mb-1">
                  <span className="font-bold text-[#a05742] uppercase">{language === 'ar'? product.subcategoryAr : product.subcategoryEn}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#d48b3b] text-[#d48b3b]" />
                    <span className="font-extrabold text-[#261714]">{product.rating}</span>
                    <span className="text-">({product.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#261714] leading-snug">{language === 'ar'? product.nameAr : product.nameEn}</h3>

                <div className="flex items-baseline gap-2 mt-3 pb-3 border-b border-[#ebdcd5]">
                  <span className={`text-2xl font-black ${isProductOutOfStock ? 'text-gray-400 line-through' : ''}`}>{product.price.toFixed(2)}</span>
                  <span className="text-xs font-bold text-[#9c513e]">{t.currency}</span>
                  {product.originalPrice && !isProductOutOfStock ? <span className="text-xs line-through text-[#a08b84]">{product.originalPrice.toFixed(2)}</span> : null}
                </div>

                {/* حالة المخزون - بدون ارقام */}
                <div className="mt-3">
                  {isProductOutOfStock ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-black">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{language === 'ar' ? 'نفذت الكمية' : 'Out of stock'}</span>
                    </div>
                  ) : hasShades && selectedShade && isShadeOutOfStock(selectedShade) ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-black">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{language === 'ar' ? `الدرجة ${selectedShade.nameAr} نفذت` : `Shade ${selectedShade.nameEn} out of stock`}</span>
                    </div>
                  ) : null}
                </div>

                {hasShades && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#473631]">
                        {language === 'ar'? 'اختاري الدرجة:' : 'Choose Shade:'}
                        <span className="text-[#b87661] ms-1">{selectedShade? (language === 'ar'? selectedShade.nameAr : selectedShade.nameEn) : ''}</span>
                      </span>
                      <span className="text- text-[#9c857e]">{allShades.length} {language === 'ar'? 'لون' : 'shades'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allShades.map((shade) => {
                        const isSelected = selectedShade?.id === shade.id;
                        const out = isShadeOutOfStock(shade);
                        return (
                          <button 
                            key={shade.id} 
                            onClick={() => handleShadeSelect(shade)} 
                            disabled={out}
                            title={out ? (language === 'ar' ? 'نفذت' : 'Out of stock') : (language === 'ar' ? shade.nameAr : shade.nameEn)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs transition-all ${
                              out
                                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through opacity-60'
                                : isSelected
                                ? 'border-[#b87661] bg-[#faefe9] font-bold ring-1 ring-[#b87661]'
                                : 'border-[#ebdcd5] bg-white hover:border-[#cb9e90]'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full border border-white shadow-sm flex-shrink-0" style={{ backgroundColor: out ? '#ccc' : shade.hex }} />
                            <span className="max-w- truncate">{language === 'ar'? shade.nameAr : shade.nameEn}</span>
                            {out && (
                              <span className="text-[10px] bg-red-100 text-red-600 border border-red-200 rounded-full px-1.5 font-black">{language === 'ar' ? 'نفذت' : 'Out'}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#ebdcd5]">
                  <p className="text- text-[#634e48] leading-relaxed">{language === 'ar'? product.descriptionAr : product.descriptionEn}</p>
                  {product.keyBenefitsAr && product.keyBenefitsAr.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(language === 'ar'? product.keyBenefitsAr : product.keyBenefitsEn).slice(0, 4).map((b, i) => (
                        <span key={i} className="text- bg-[#faf5f2] border border-[#ebdcd5] px-2.5 py-1 rounded-full text-[#806963] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#b87661]" /> {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#ebdcd5] mt-auto pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#dfc6bc] rounded-2xl bg-white p-1">
                    <button 
                      onClick={() => handleQuantityChange(-1)} 
                      disabled={quantity <= 1}
                      className="p-1.5 hover:bg-[#faefe9] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
                    ><Minus className="w-4 h-4" /></button>
                    <span className="px-4 text-xs font-extrabold min-w- text-center">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)} 
                      disabled={quantity >= currentStock}
                      className="p-1.5 hover:bg-[#faefe9] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
                    ><Plus className="w-4 h-4" /></button>
                  </div>
                  <button 
                    onClick={handleAdd} 
                    disabled={!canAdd || isAdded} 
                    className={`flex-1 py-3.5 rounded-2xl text-sm font-extrabold shadow-lg flex items-center justify-center gap-2 transition-all ${
                      !canAdd
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#2c1c18] text-white hover:bg-[#3a2520]'
                    }`}
                  >
                    {!canAdd ? (
                      <>{language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}</>
                    ) : isAdded ? (
                      <><Check className="w-4 h-4" /> {language === 'ar'? 'تمت الإضافة' : 'Added'}</>
                    ) : (
                      <><ShoppingBag className="w-4 h-4" /> {t.quickAdd} — {(product.price * quantity).toFixed(2)} {t.currency}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};