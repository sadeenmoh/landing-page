import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Tag, Sparkles, Truck } from 'lucide-react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { FREE_SHIPPING_THRESHOLD, WHATSAPP_PHONE } from '../data/jordanLocations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  language: Language;
  onProceedToCheckout: () => void;
  appliedPromoCode: string;
  promoDiscountPercent: number;
  onApplyPromoCode: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  language,
  onProceedToCheckout,
  appliedPromoCode,
  promoDiscountPercent,
  onApplyPromoCode,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);

  if (!isOpen) return null;

  // Computations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * promoDiscountPercent) / 100;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : 2.0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromoCode(promoInput.trim());
    if (success) {
      setPromoSuccess(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoSuccess(false);
    }
  };

  const handleWhatsAppDirectOrder = () => {
    if (items.length === 0) return;

    let text = `*مرحباً Miss2m Jordan! أرغب بطلب المنتجات التالية من المتجر:*\n\n`;
    items.forEach((item, index) => {
      const shadeName = item.selectedShade ? ` (درجة: ${item.selectedShade.nameAr})` : '';
      text += `${index + 1}. ${item.product.nameAr}${shadeName} - العدد: ${item.quantity} × ${item.product.price.toFixed(2)} د.أ\n`;
    });
    text += `\n*المجموع الفرعي:* ${subtotal.toFixed(2)} د.أ`;
    if (promoDiscountPercent > 0) {
      text += `\n*الخصم (${promoDiscountPercent}%):* -${discountAmount.toFixed(2)} د.أ`;
    }
    text += `\n*التوصيل:* ${deliveryFee === 0 ? 'مجاني' : deliveryFee.toFixed(2) + ' د.أ'}`;
    text += `\n*المجموع التقريبي:* ${total.toFixed(2)} د.أ\n\nأرجو تزويدي بالخطوات وتأكيد العنوان.`;

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

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#ebdcd5] animate-in slide-in-from-right duration-300"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#ebdcd5] bg-[#fbf6f3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#2c1c18] text-[#f7ece8] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#f5dbd2]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#261714]">
                  {t.cartTitle}
                </h3>
                <span className="text-xs text-[#7d645e] font-medium">
                  {items.length} {t.items}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#5e4741] hover:bg-[#faefe9] transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Banner */}
          <div className="px-5 py-3.5 bg-[#faeee8] border-b border-[#ebd8ce]">
            <div className="flex items-center justify-between text-xs font-bold text-[#45271f] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#9c513e]" />
                {isFreeDelivery
                  ? t.freeShippingQualified
                  : t.freeShippingRemaining.replace(
                      '{amount}',
                      amountNeededForFreeShipping.toFixed(2)
                    )}
              </span>
              <span className="text-[11px] font-black">{Math.round(progressPercent)}%</span>
            </div>

            <div className="w-full bg-[#e8d2c7] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#b87661] to-[#9c4c37] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#faf1ec] text-[#9c513e] flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 opacity-70" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#261714]">
                    {t.cartEmpty}
                  </h4>
                  <p className="text-xs text-[#7d655f] mt-1">
                    {language === 'ar'
                      ? 'مستحضرات Miss2m التركية بانتظار إضافة لمسة سحر إلى إطلالتك'
                      : 'Explore our Turkish makeup collection and fill your bag'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#2c1c18] text-[#f7ece8] text-xs font-bold hover:bg-[#462a22] transition-all shadow-md"
                >
                  {t.cartEmptyAction}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3.5 rounded-2xl bg-[#faf5f2] border border-[#ebdcd5] hover:border-[#cb9e90] transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.nameEn}
                    className="w-18 h-18 rounded-xl object-cover bg-white flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-extrabold text-[#261714] line-clamp-1">
                          {language === 'ar' ? item.product.nameAr : item.product.nameEn}
                        </h5>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#9e837b] hover:text-[#b84837] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedShade && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="w-3 h-3 rounded-full border border-white shadow-2xs inline-block"
                            style={{ backgroundColor: item.selectedShade.hex }}
                          />
                          <span className="text-[11px] text-[#7d655f] font-medium truncate">
                            {language === 'ar'
                              ? item.selectedShade.nameAr
                              : item.selectedShade.nameEn}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#ebd9cf]">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#dfc6bc] rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#faefe9] text-[#473631] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-black text-[#261714]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#faefe9] text-[#473631] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <span className="text-xs font-black text-[#261714]">
                        {(item.product.price * item.quantity).toFixed(2)} {t.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#ebdcd5] bg-[#fdfbf9] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className={`absolute top-2.5 w-3.5 h-3.5 text-[#9a847d] ${isRtl ? 'right-3' : 'left-3'}`} />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        setPromoError(false);
                      }}
                      placeholder={t.promoCodePlaceholder}
                      className="w-full text-xs font-medium uppercase bg-white border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl py-2 px-8 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#faeee8] hover:bg-[#f6dfd5] text-[#733626] font-extrabold text-xs rounded-xl border border-[#ebd2c6] transition-colors"
                  >
                    {t.applyCode}
                  </button>
                </div>

                {appliedPromoCode && (
                  <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {t.promoApplied.replace('{discount}', promoDiscountPercent.toString())} ({appliedPromoCode})
                    </span>
                  </div>
                )}
                {promoError && (
                  <div className="text-[11px] text-red-600 font-semibold">
                    {t.promoInvalid} (Try: BEAUTY10 or MISS2M)
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-[#ebdcd5]">
                <div className="flex justify-between text-[#614942]">
                  <span>{t.subtotal}</span>
                  <span className="font-bold">{subtotal.toFixed(2)} {t.currency}</span>
                </div>

                {promoDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{t.discount} ({promoDiscountPercent}%)</span>
                    <span>-{discountAmount.toFixed(2)} {t.currency}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#614942]">
                  <span>{t.delivery}</span>
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-700' : ''}`}>
                    {deliveryFee === 0 ? t.free : `${deliveryFee.toFixed(2)} ${t.currency}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-[#261714] pt-2 border-t border-[#ebdcd5]">
                  <span>{t.total}</span>
                  <span className="text-lg text-[#9c4c37]">
                    {total.toFixed(2)} {t.currency}
                  </span>
                </div>
              </div>

              {/* Checkout CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  id="cart-proceed-checkout-btn"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#2c1c18] hover:bg-[#462a22] text-[#f7ece8] text-sm font-extrabold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{t.proceedCheckout}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>

                {/* Direct WhatsApp Order Button */}
                <button
                  onClick={handleWhatsAppDirectOrder}
                  className="w-full py-2.5 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span>{t.orderViaWhatsApp}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
