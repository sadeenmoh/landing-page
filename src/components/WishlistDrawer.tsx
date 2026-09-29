import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Sparkles, MessageCircle, Eye, Check } from 'lucide-react';
import { Product, Shade, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { WHATSAPP_PHONE } from '../data/jordanLocations';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  language: Language;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, shade?: Shade) => void;
  onAddAllToCart: () => void;
  onClearWishlist: () => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  language,
  onToggleWishlist,
  onAddToCart,
  onAddAllToCart,
  onClearWishlist,
  onQuickView,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Filter products that are in the wishlist
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));
  const totalValue = wishlistedProducts.reduce((acc, p) => acc + p.price, 0);

  const handleAddItem = (product: Product) => {
    onAddToCart(product);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleWhatsAppWishlist = () => {
    if (wishlistedProducts.length === 0) return;

    let text = `*مرحباً Miss2m Jordan! هذه قائمة منتجاتي المفضلة من المتجر وأود الاستفسار عنها / طلبها:*\n\n`;
    wishlistedProducts.forEach((p, idx) => {
      text += `${idx + 1}. *${p.nameAr}* (${p.nameEn}) - ${p.price.toFixed(2)} د.أ\n`;
    });
    text += `\n*القيمة الإجمالية:* ${totalValue.toFixed(2)} د.أ\n\nأرجو إفادتي بتوفر كافة الدرجات وطريقة الطلب والتوصيل. شكراً لكم!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container */}
      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div
          id="wishlist-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#ebdcd5] animate-in slide-in-from-right duration-300"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#ebdcd5] bg-[#fbf6f3] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#faefe9] text-[#c55d42] border border-[#f0c2b5] flex items-center justify-center shadow-xs">
                <Heart className="w-5 h-5 fill-[#c55d42]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2c1c18] flex items-center gap-2">
                  <span>{t.wishlistTitle}</span>
                  <span className="text-xs bg-[#f4dfd7] text-[#934c38] px-2 py-0.5 rounded-full font-bold">
                    {wishlistedProducts.length}
                  </span>
                </h3>
                <p className="text-[11px] text-[#8e756e]">Miss2m Jordan • Feel Beauty On You</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#6b554e] hover:bg-[#faefe9] hover:text-[#2c1c18] transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistedProducts.length === 0 ? (
              /* Empty Wishlist State */
              <div className="text-center py-16 px-4 space-y-4 flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#fcf5f2] border-2 border-dashed border-[#ebdcd5] flex items-center justify-center text-[#c55d42]">
                    <Heart className="w-10 h-10 text-[#d9a394]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                    <Sparkles className="w-5 h-5 text-[#b87661]" />
                  </div>
                </div>

                <div className="max-w-xs">
                  <h4 className="text-lg font-black text-[#2c1c18]">{t.wishlistEmpty}</h4>
                  <p className="text-xs text-[#806963] mt-2 leading-relaxed">
                    {t.wishlistEmptyDesc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('product-showcase-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-3 px-6 py-3 rounded-full bg-[#2c1c18] text-[#f7ece8] hover:bg-[#462a22] text-xs font-extrabold shadow-md transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#f5dbd2]" />
                  <span>{t.wishlistExploreAction}</span>
                </button>
              </div>
            ) : (
              /* Wishlist Items List */
              <>
                {/* Wishlist Utilities Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-[#f2e5df] text-xs">
                  <button
                    onClick={onAddAllToCart}
                    className="font-bold text-[#a05742] hover:text-[#7f3d2b] flex items-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t.addAllToCart}</span>
                  </button>

                  <button
                    onClick={onClearWishlist}
                    className="text-[#967d76] hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.clearWishlist}</span>
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {wishlistedProducts.map((product) => {
                    const isAdded = !!addedItemIds[product.id];

                    return (
                      <div
                        key={product.id}
                        className="p-3.5 rounded-2xl bg-[#faf7f5] hover:bg-[#f8f2ee] border border-[#ebdcd5] transition-all flex gap-3.5 group relative"
                      >
                        {/* Product Image */}
                        <div
                          onClick={() => {
                            onQuickView(product);
                            onClose();
                          }}
                          className="relative w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 cursor-pointer border border-[#ebdcd5]"
                        >
                          <img
                            src={product.image}
                            alt={product.nameEn}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 right-1 text-[9px] bg-white/90 text-[#854d3e] font-bold px-1 rounded shadow-2xs">
                            🇹🇷 TR
                          </span>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-[10px] font-bold text-[#a05742] uppercase tracking-wider">
                                {language === 'ar' ? product.subcategoryAr : product.subcategoryEn}
                              </span>

                              {/* Remove Heart Button */}
                              <button
                                onClick={() => onToggleWishlist(product.id)}
                                className="p-1 rounded-full text-[#c55d42] hover:bg-[#faefe9] transition-colors"
                                title={t.removeFromWishlist}
                                aria-label={t.removeFromWishlist}
                              >
                                <Heart className="w-4 h-4 fill-[#c55d42]" />
                              </button>
                            </div>

                            <h4
                              onClick={() => {
                                onQuickView(product);
                                onClose();
                              }}
                              className="text-xs sm:text-sm font-extrabold text-[#261714] truncate hover:text-[#b87661] cursor-pointer"
                            >
                              {language === 'ar' ? product.nameAr : product.nameEn}
                            </h4>
                            <p className="text-[11px] text-[#8e756e] truncate">
                              {language === 'ar' ? product.nameEn : product.nameAr}
                            </p>
                          </div>

                          {/* Price & Actions */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#ebdcd5]">
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-black text-[#261714]">
                                {product.price.toFixed(2)}
                              </span>
                              <span className="text-[11px] font-bold text-[#805345]">
                                {t.currency}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Quick View Button */}
                              <button
                                onClick={() => {
                                  onQuickView(product);
                                  onClose();
                                }}
                                className="p-1.5 rounded-lg text-[#614d47] hover:bg-[#faefe9] hover:text-[#2c1c18] transition-colors"
                                title={t.quickView}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Add to Bag Button */}
                              <button
                                onClick={() => handleAddItem(product)}
                                disabled={isAdded}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                                  isAdded
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-[#2c1c18] hover:bg-[#462a22] text-[#f7ece8]'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>{language === 'ar' ? 'أضيفت' : 'Added'}</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag className="w-3 h-3 text-[#f5dbd2]" />
                                    <span>{language === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer Actions (When items present) */}
          {wishlistedProducts.length > 0 && (
            <div className="p-5 border-t border-[#ebdcd5] bg-[#fbf6f3] space-y-3">
              {/* Value Summary */}
              <div className="flex items-center justify-between text-xs text-[#523e38]">
                <span>{language === 'ar' ? 'القيمة الإجمالية للمفضلة:' : 'Total Wishlist Value:'}</span>
                <span className="text-sm font-extrabold text-[#261714]">
                  {totalValue.toFixed(2)} {t.currency}
                </span>
              </div>

              {/* Add All to Cart Button */}
              <button
                onClick={onAddAllToCart}
                className="w-full py-3 px-4 rounded-2xl bg-[#2c1c18] hover:bg-[#462a22] active:scale-[0.99] text-[#f7ece8] text-xs sm:text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#f5dbd2]" />
                <span>{t.addAllToCart}</span>
              </button>

              {/* Order via WhatsApp */}
              <button
                onClick={handleWhatsAppWishlist}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{t.wishlistShareWhatsApp}</span>
              </button>

              {/* Continue shopping link */}
              <button
                onClick={onClose}
                className="w-full text-center text-xs font-medium text-[#7a645d] hover:text-[#2c1c18] pt-1"
              >
                {t.continueShopping}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
