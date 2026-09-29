import React, { useState } from 'react';
import { MessageCircle, X, ShoppingBag, HeartHandshake, Sparkles } from 'lucide-react';
import { Language, CartItem } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { WHATSAPP_PHONE, WHATSAPP_DISPLAY } from '../data/jordanLocations';

interface WhatsAppButtonProps {
  language: Language;
  cartItems: CartItem[];
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ language, cartItems }) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpenGeneralChat = () => {
    const greeting = language === 'ar'
      ? 'مرحباً Miss2m Jordan! أود الاستفسار عن مستحضرات التجميل والدرجات المناسبة لبشرتي.'
      : 'Hello Miss2m Jordan! I would like to inquire about cosmetics and shade recommendations.';
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(greeting)}`, '_blank');
    setMenuOpen(false);
  };

  const handleOpenCartChat = () => {
    if (cartItems.length === 0) {
      handleOpenGeneralChat();
      return;
    }

    let text = `*مرحباً Miss2m Jordan! أرغب بالطلب المباشر من المتجر:*\n\n`;
    cartItems.forEach((item, idx) => {
      const shade = item.selectedShade ? ` (${item.selectedShade.nameAr})` : '';
      text += `${idx + 1}. ${item.product.nameAr}${shade} - الكمية: ${item.quantity}\n`;
    });
    text += `\nأرجو المساعدة في استكمال الطلب والتوصيل. شكراً لكم!`;

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
    setMenuOpen(false);
  };

  return (
    <div
      className={`fixed bottom-6 ${isRtl ? 'right-6' : 'left-6'} z-40 flex flex-col items-end`}
      id="whatsapp-floating-container"
    >
      {/* Quick Action Popup Menu */}
      {menuOpen && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl border border-[#ebdcd5] p-3.5 w-72 animate-in zoom-in-95 duration-200 text-[#261714]">
          <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd5] mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black">Miss2m Jordan WhatsApp</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 text-[#8e756e] hover:text-[#261714] rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-[#78615a] mb-3 leading-snug">
            {language === 'ar'
              ? 'أهلاً بك! خبيراتنا متواجدات لمساعدتك في اختيار درجات المكياج وتأكيد طلباتك مباشرة.'
              : 'Welcome! Our beauty specialists are ready to assist with shade recommendations and instant orders.'}
          </p>

          <div className="space-y-2">
            {cartItems.length > 0 && (
              <button
                onClick={handleOpenCartChat}
                className="w-full text-start p-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-xs font-bold text-[#128C7E] flex items-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                <span className="line-clamp-1">{t.waOrderCartPrompt} ({cartItems.length})</span>
              </button>
            )}

            <button
              onClick={handleOpenGeneralChat}
              className="w-full text-start p-2.5 rounded-xl bg-[#faf5f2] hover:bg-[#faefe9] border border-[#ebdcd5] text-xs font-bold text-[#473631] flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#b87661]" />
              <span>{t.waChatPrompt}</span>
            </button>
          </div>

          <div className="text-[10px] text-center text-[#9c847d] mt-2.5 pt-2 border-t border-[#ebdcd5]">
            {WHATSAPP_DISPLAY} • Jordan
          </div>
        </div>
      )}

      {/* Main Floating WhatsApp Bubble */}
      <button
        id="whatsapp-floating-bubble-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3.5 rounded-full shadow-2xl hover:shadow-[0_8px_30px_rgb(37,211,102,0.4)] active:scale-95 transition-all duration-300"
        aria-label="Contact on WhatsApp"
      >
        <span className="relative flex items-center justify-center">
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-100"></span>
          </span>
        </span>

        <span className="text-xs font-black tracking-wide hidden sm:inline-block">
          {language === 'ar' ? 'طلب فوري عبر واتساب' : 'WhatsApp Order'}
        </span>
      </button>
    </div>
  );
};
