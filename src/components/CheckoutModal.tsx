import React, { useState } from 'react';
import { X, CheckCircle2, Truck, CreditCard, Banknote, ShieldCheck, ExternalLink, Star, Sparkles } from 'lucide-react';
import { CartItem, Language, CheckoutForm, OrderRecord } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  JORDAN_GOVERNORATES,
  FREE_SHIPPING_THRESHOLD,
  CLIQ_ALIAS,
  WHATSAPP_PHONE,
  WHATSAPP_DISPLAY,
} from '../data/jordanLocations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  onOrderSuccess: (
    orderId: string,
    customerName: string,
    customerPhone?: string,
    newOrderRecord?: OrderRecord
  ) => void;
  onOpenReviewWithOrder?: (orderId: string, customerName: string, customerPhone?: string) => void;
  promoDiscountPercent: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  language,
  onOrderSuccess,
  onOpenReviewWithOrder,
  promoDiscountPercent,
}) => {
  const t = TRANSLATIONS[language];
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    governorate: 'amman',
    areaAndStreet: '',
    notes: '',
    paymentMethod: 'cod',
  });

  const [submittedOrder, setSubmittedOrder] = useState<{
    orderId: string;
    total: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    governorateName: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedGov =
    JORDAN_GOVERNORATES.find((g) => g.id === form.governorate) || JORDAN_GOVERNORATES[0];

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * promoDiscountPercent) / 100;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : selectedGov.deliveryFee;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى كتابة الاسم الكامل' : 'Please enter your full name');
      return;
    }
    if (!form.phone.trim() || form.phone.length < 9) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى إدخال رقم هاتف أردني صحيح (مثال: 0791234567)'
          : 'Please enter a valid Jordanian phone number'
      );
      return;
    }
    if (!form.areaAndStreet.trim()) {
      setErrorMsg(
        language === 'ar'
          ? 'يرجى كتابة تفاصيل المنطقة والشارع لتسهيل وصول المندوب'
          : 'Please enter your area and street address'
      );
      return;
    }

    setErrorMsg('');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `#M2M-${randomNum}`;

    setSubmittedOrder({
      orderId,
      total,
      subtotal,
      deliveryFee,
      discount: discountAmount,
      governorateName: language === 'ar' ? selectedGov.nameAr : selectedGov.nameEn,
    });

    const newOrderRecord: OrderRecord = {
      id: orderId,
      customerName: form.fullName.trim(),
      phone: form.phone.trim(),
      governorate: form.governorate,
      governorateNameAr: selectedGov.nameAr,
      governorateNameEn: selectedGov.nameEn,
      areaAndStreet: form.areaAndStreet.trim(),
      notes: form.notes?.trim() || undefined,
      paymentMethod: form.paymentMethod,
      items: items.map((it) => ({
        productId: it.product.id,
        productNameAr: it.product.nameAr,
        productNameEn: it.product.nameEn,
        shadeNameAr: it.selectedShade?.nameAr,
        shadeNameEn: it.selectedShade?.nameEn,
        quantity: it.quantity,
        price: it.product.price,
      })),
      subtotal,
      deliveryFee,
      discount: discountAmount,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onOrderSuccess(orderId, form.fullName.trim(), form.phone.trim(), newOrderRecord);
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!submittedOrder) return;

    let message = `*طلب جديد عبر متجر Miss2m Jordan*\n`;
    message += `*رقم الطلب:* ${submittedOrder.orderId}\n`;
    message += `*اسم العميل:* ${form.fullName}\n`;
    message += `*رقم الهاتف:* ${form.phone}\n`;
    message += `*المحافظة:* ${submittedOrder.governorateName}\n`;
    message += `*العنوان:* ${form.areaAndStreet}\n`;
    if (form.notes) message += `*ملاحظات:* ${form.notes}\n`;
    message += `*طريقة الدفع:* ${form.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'كليك (CliQ)'}\n\n`;

    message += `*المنتجات المطلوبة:*\n`;
    items.forEach((item, idx) => {
      const shade = item.selectedShade ? ` (${item.selectedShade.nameAr})` : '';
      message += `${idx + 1}. ${item.product.nameAr}${shade} - الكمية: ${item.quantity}\n`;
    });

    message += `\n*المجموع الكلي:* ${submittedOrder.total.toFixed(2)} د.أ (${submittedOrder.deliveryFee === 0 ? 'توصيل مجاني' : 'شامل التوصيل'})\n\n`;
    message += `أرجو تأكيد تجهيز وشحن الطلب. شكراً لكم!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        id="checkout-modal-container"
        className="bg-white rounded-3xl shadow-2xl border border-[#ebdcd5] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#faf5f2] border-b border-[#ebdcd5] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🇯🇴</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#261714]">
                {submittedOrder ? t.orderSuccessTitle : t.checkoutTitle}
              </h3>
            </div>
            <p className="text-xs text-[#7d655f] mt-1">
              {submittedOrder ? t.orderSuccessSub : t.checkoutSub}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#5e4741] hover:bg-[#faefe9] transition-colors"
            aria-label="Close Checkout Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6">
          {submittedOrder ? (
            /* Order Success Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <div className="text-xs uppercase font-bold text-[#806963] tracking-widest">
                  {t.orderNumber}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#261714] tracking-tight">
                  {submittedOrder.orderId}
                </div>
              </div>

              {/* Order Details Receipt Box */}
              <div className="bg-[#faf5f2] border border-[#ebdcd5] rounded-2xl p-4 text-start text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#7d655f]">{t.fullName}:</span>
                  <span className="font-bold text-[#261714]">{form.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d655f]">{t.phone}:</span>
                  <span className="font-bold text-[#261714]">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d655f]">{t.governorate}:</span>
                  <span className="font-bold text-[#261714]">
                    {submittedOrder.governorateName} ({language === 'ar' ? selectedGov.deliveryTimeAr : selectedGov.deliveryTimeEn})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d655f]">{t.paymentMethodTitle}:</span>
                  <span className="font-bold text-[#261714]">
                    {form.paymentMethod === 'cod' ? t.payCod : t.payCliq}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#ebdcd5] flex justify-between font-black text-sm text-[#261714]">
                  <span>{t.total}:</span>
                  <span className="text-base text-[#9c4c37]">
                    {submittedOrder.total.toFixed(2)} {t.currency}
                  </span>
                </div>
              </div>

              {/* CliQ Reminder if selected */}
              {form.paymentMethod === 'cliq' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 max-w-md mx-auto">
                  <p className="font-bold mb-1">
                    {language === 'ar' ? 'معلومات التحويل عبر كليك (CliQ):' : 'CliQ Payment Info:'}
                  </p>
                  <p>
                    {language === 'ar' ? 'الاسم المستعار (Alias):' : 'Alias:'}{' '}
                    <strong className="text-sm bg-white px-2 py-0.5 rounded border border-amber-300 font-mono">
                      {CLIQ_ALIAS}
                    </strong>
                  </p>
                </div>
              )}

              {/* Post-Checkout Celebratory Star Reward Prompt */}
              <div className="bg-gradient-to-br from-[#fff9f5] via-amber-50 to-[#fdf2ec] border-2 border-amber-300 rounded-3xl p-5 text-start max-w-md mx-auto shadow-md space-y-3 relative overflow-hidden animate-in zoom-in-95">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-[#2c1c18] flex items-center justify-center font-black text-xl flex-shrink-0 shadow-md shadow-amber-400/30 animate-pulse">
                    ★
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-300/50 text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      {language === 'ar' ? 'مكافأة ولاء نادي Miss2m' : 'Miss2m Star Loyalty Reward'}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[#261714]">
                      {language === 'ar'
                        ? 'أكدي طلبك واحصلي على نجمة! ⭐'
                        : 'Confirm your order and get a star! ⭐'}
                    </h4>
                    <p className="text-xs text-[#735850] leading-relaxed">
                      {language === 'ar'
                        ? `مبارك تأكيد طلبك (${submittedOrder.orderId}) يا ${form.fullName}! شاركينا تقييمك السريع برقم طلبك واسمك واحصلي فوراً على نجمة جديدة في رصيدك للوصول إلى هدف الـ 10 نجوم وقسيمة الخصم 20%!`
                        : `Congratulations on your order (${submittedOrder.orderId}), ${form.fullName}! Share a quick review with your order number and name to claim your star toward your 10-star goal and 20% discount voucher!`}
                    </p>
                  </div>
                </div>

                {/* Order Number & Name Tag */}
                <div className="bg-white/90 border border-amber-200/90 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#876a62] block font-bold">
                      {language === 'ar' ? 'رقم الطلب لتوثيق التقييم:' : 'Order Number to Claim:'}
                    </span>
                    <span className="font-mono font-black text-[#9c513e] text-sm">
                      {submittedOrder.orderId}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="text-[10px] text-[#876a62] block font-bold">
                      {language === 'ar' ? 'الاسم المسجل:' : 'Customer Name:'}
                    </span>
                    <span className="font-bold text-[#261714]">
                      {form.fullName}
                    </span>
                  </div>
                </div>

                {onOpenReviewWithOrder && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenReviewWithOrder(submittedOrder.orderId, form.fullName, form.phone);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#c55d42] via-[#b34932] to-[#9c3a24] hover:from-[#b34932] hover:to-[#87321e] text-white font-black text-xs shadow-lg shadow-[#c55d42]/25 flex items-center justify-center gap-2 active:scale-98 transition-all group"
                  >
                    <Star className="w-4 h-4 fill-amber-300 text-amber-300 group-hover:rotate-12 transition-transform" />
                    <span>
                      {language === 'ar'
                        ? 'أكدي طلبك واحصلي على نجمة! (إضافة تقييم الآن)'
                        : 'Confirm your order and get a star! (Submit Review)'}
                    </span>
                  </button>
                )}
              </div>

              {/* WhatsApp Receipt Action */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                <button
                  onClick={handleSendWhatsAppConfirmation}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t.openWhatsAppReceipt}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-2xl bg-[#2c1c18] text-[#f7ece8] font-bold text-xs hover:bg-[#422b25] transition-colors"
                >
                  {t.continueShopping}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#473631] mb-1.5">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1c18] focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#473631] mb-1.5">
                    {t.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={t.phonePlaceholder}
                    className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1c18] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Governorate Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#473631] mb-1.5 flex items-center justify-between">
                  <span>{t.governorate} *</span>
                  <span className="text-[11px] font-normal text-[#856b64]">
                    {language === 'ar' ? selectedGov.deliveryTimeAr : selectedGov.deliveryTimeEn}
                  </span>
                </label>
                <select
                  value={form.governorate}
                  onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                  className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1c18] font-semibold focus:outline-none focus:bg-white cursor-pointer"
                >
                  {JORDAN_GOVERNORATES.map((gov) => (
                    <option key={gov.id} value={gov.id}>
                      {language === 'ar' ? gov.nameAr : gov.nameEn} — (
                      {isFreeDelivery
                        ? t.free
                        : `${gov.deliveryFee.toFixed(2)} ${t.currency}`}
                      )
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Street Address */}
              <div>
                <label className="block text-xs font-bold text-[#473631] mb-1.5">
                  {t.areaAndStreet} *
                </label>
                <input
                  type="text"
                  required
                  value={form.areaAndStreet}
                  onChange={(e) => setForm({ ...form, areaAndStreet: e.target.value })}
                  placeholder={t.areaPlaceholder}
                  className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1c18] focus:outline-none focus:bg-white"
                />
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold text-[#473631] mb-1.5">
                  {t.notes}
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={t.notesPlaceholder}
                  className="w-full bg-[#faf5f2] border border-[#ebdcd5] focus:border-[#c59a85] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1c18] focus:outline-none focus:bg-white"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#473631] mb-2">
                  {t.paymentMethodTitle}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* COD */}
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      form.paymentMethod === 'cod'
                        ? 'border-[#b87661] bg-[#faefe9] shadow-xs'
                        : 'border-[#ebdcd5] bg-[#faf5f2] hover:bg-[#faeee9]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setForm({ ...form, paymentMethod: 'cod' })}
                      className="text-[#b87661] focus:ring-[#b87661]"
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-[#9c513e]" />
                      <div>
                        <div className="text-xs font-extrabold text-[#261714]">{t.payCod}</div>
                        <div className="text-[10px] text-[#7d655f]">
                          {language === 'ar' ? 'عند وصول المندوب لباب بيتك' : 'Pay when courier arrives'}
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* CliQ */}
                  <label
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                      form.paymentMethod === 'cliq'
                        ? 'border-[#b87661] bg-[#faefe9] shadow-xs'
                        : 'border-[#ebdcd5] bg-[#faf5f2] hover:bg-[#faeee9]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cliq"
                      checked={form.paymentMethod === 'cliq'}
                      onChange={() => setForm({ ...form, paymentMethod: 'cliq' })}
                      className="text-[#b87661] focus:ring-[#b87661]"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#9c513e]" />
                      <div>
                        <div className="text-xs font-extrabold text-[#261714]">{t.payCliq}</div>
                        <div className="text-[10px] text-[#7d655f]">
                          Alias: <strong className="font-mono">{CLIQ_ALIAS}</strong>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {form.paymentMethod === 'cliq' && (
                  <p className="text-[11px] text-[#805345] bg-[#fbf0eb] p-2.5 rounded-xl border border-[#ebd8ce] mt-2 font-medium">
                    {t.cliqInstructions}
                  </p>
                )}
              </div>

              {/* Order Summary Recap */}
              <div className="bg-[#faf5f2] border border-[#ebdcd5] rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#634f49]">
                  <span>{t.subtotal}</span>
                  <span className="font-bold">{subtotal.toFixed(2)} {t.currency}</span>
                </div>
                {promoDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{t.discount} ({promoDiscountPercent}%)</span>
                    <span>-{discountAmount.toFixed(2)} {t.currency}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#634f49]">
                  <span>{t.delivery} ({language === 'ar' ? selectedGov.nameAr : selectedGov.nameEn})</span>
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-700' : ''}`}>
                    {deliveryFee === 0 ? t.free : `${deliveryFee.toFixed(2)} ${t.currency}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#ebdcd5] flex justify-between font-black text-sm text-[#261714]">
                  <span>{t.total}</span>
                  <span className="text-base text-[#9c4c37]">
                    {total.toFixed(2)} {t.currency}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#2c1c18] hover:bg-[#462a22] text-[#f7ece8] text-sm font-extrabold shadow-xl hover:shadow-2xl transition-all active:scale-98"
              >
                {t.confirmOrder} ({total.toFixed(2)} {t.currency})
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
