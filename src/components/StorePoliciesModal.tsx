import React, { useState } from 'react';
import { X, Truck, RotateCcw, Award, MapPin, Shield, Phone, Mail, Instagram, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { WHATSAPP_DISPLAY } from '../data/jordanLocations';

export type PolicyTab = 'shipping' | 'returns' | 'authenticity' | 'locations' | 'contact';

interface StorePoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialTab?: PolicyTab;
}

export const StorePoliciesModal: React.FC<StorePoliciesModalProps> = ({
  isOpen,
  onClose,
  language,
  initialTab = 'shipping',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#ebdcd5] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-[#faf5f2] border-b border-[#ebdcd5] flex items-center justify-between">
          <h3 className="text-lg font-black text-[#261714]">
            {language === 'ar' ? 'مركز معلومات وعناوين Miss2m Jordan' : 'Miss2m Jordan Info & Policies'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5e4741] hover:bg-[#faefe9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ebdcd5] bg-[#faf6f3] overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-3 flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'shipping'
                ? 'border-[#b87661] text-[#9c4c37] bg-white'
                : 'border-transparent text-[#78615a] hover:text-[#261714]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التوصيل والشحن' : 'Shipping'}</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-3 flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'returns'
                ? 'border-[#b87661] text-[#9c4c37] bg-white'
                : 'border-transparent text-[#78615a] hover:text-[#261714]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الاستبدال والاسترجاع' : 'Returns'}</span>
          </button>

          <button
            onClick={() => setActiveTab('authenticity')}
            className={`px-4 py-3 flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'authenticity'
                ? 'border-[#b87661] text-[#9c4c37] bg-white'
                : 'border-transparent text-[#78615a] hover:text-[#261714]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'شهادة الأصالة' : 'Authenticity'}</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-3 flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'locations'
                ? 'border-[#b87661] text-[#9c4c37] bg-white'
                : 'border-transparent text-[#78615a] hover:text-[#261714]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'نقاط البيع في الأردن' : 'Stores in Jordan'}</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-3 flex items-center gap-1.5 whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'contact'
                ? 'border-[#b87661] text-[#9c4c37] bg-white'
                : 'border-transparent text-[#78615a] hover:text-[#261714]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'اتصلي بنا' : 'Contact Us'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 text-xs text-[#523e38] space-y-4 max-h-[60vh] overflow-y-auto leading-relaxed">
          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-[#261714]">
                {language === 'ar' ? 'سياسة التوصيل داخل المملكة الأردنية الهاشمية' : 'Shipping Across Jordan'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'نوفر خدمة شحن سريعة وموثوقة تغطي كافة محافظات الأردن الـ 12 خلال 48 ساعة. رسوم التوصيل: 2 دينار أردني لمحافظتي عمّان والزرقاء، و3 دنانير أردنية لكافة المحافظات الأخرى (إربد، العقبة، البلقاء/السلط، جرش، عجلون، مادبا، الكرك، المفرق، معان، الطفيلة).'
                  : 'We offer fast and reliable delivery covering all 12 Jordanian governorates within 48 hours. Delivery fees: 2 JOD for Amman and Zarqa, and 3 JOD for all other governorates (Irbid, Aqaba, Balqa/Salt, Jerash, Ajloun, Madaba, Karak, Mafraq, Ma’an, Tafilah).'}
              </p>
              <div className="p-3 bg-[#faeee8] rounded-xl border border-[#ebd8ce] font-bold text-[#803d2b]">
                {language === 'ar'
                  ? '✨ التوصيل مجاني تماماً لجميع الطلبات التي تزيد قيمتها عن 20 دينار أردني!'
                  : '✨ FREE shipping on all orders over 20 JOD throughout Jordan!'}
              </div>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-[#261714]">
                {language === 'ar' ? 'سياسة الاستبدال والاسترجاع' : 'Exchange & Returns'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'حرصاً على سلامتك ولطبيعة مستحضرات التجميل والعناية الشخصية، يقبل الاستبدال أو الإرجاع في حال وصول المنتج بحالة غير سليمة أو تلف أثناء الشحن، أو استلام منتج مختلف عن المطلوب خلال 3 أيام من تاريخ الاستلام مع بقاء التغليف الأصلي دون فتح.'
                  : 'For hygiene and safety standards, cosmetic products are eligible for exchange/return within 3 days of delivery if arrived damaged, defective, or incorrect in unopened original packaging.'}
              </p>
            </div>
          )}

          {activeTab === 'authenticity' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-[#261714]">
                {language === 'ar' ? 'ضمان الأصالة 100% - صنع في تركيا' : '100% Authenticity Guarantee'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'جميع مستحضرات Miss2m Jordan مصنعة في أرقى مختبرات التجميل في تركيا بمطابقة كاملة للوائح ومعايير الجودة والسلامة الأوروبية (EU Cosmetic Regulations). المنتجات أصلية ومستوردة رسمياً وخالية من المواد الضارة.'
                  : 'All Miss2m Jordan cosmetic products are proudly formulated and manufactured in Turkey following rigorous European Union cosmetic safety regulations, 100% original and cruelty-free.'}
              </p>
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-[#261714]">
                {language === 'ar' ? 'نقاط البيع والموزعون المعتمدون في الأردن' : 'Points of Sale & Authorized Retailers in Jordan'}
              </h4>
              <p className="text-xs sm:text-sm text-[#5a423a] leading-relaxed">
                {language === 'ar'
                  ? 'لمعرفة أحدث نقاط البيع المعتمدة، والمتاجر والصيدليات الشريكة التي تتوفر بها مستحضرات Miss2m الأصلية في منطقتك، يرجى زيارة ومتابعة صفحتنا الرسمية على إنستغرام (@miss2m.jor)، حيث يتم تحديث قائمة الموزعين ونقاط البيع باستمرار في الهايلايت والمنشورات.'
                  : 'To find authorized retail locations, partner cosmetic stores, and pharmacies carrying authentic Miss2m products near you, please visit our official Instagram page (@miss2m.jor) where up-to-date points of sale and stockists are continuously shared in highlights and posts.'}
              </p>

              <div className="p-4 bg-gradient-to-r from-[#faf3f0] to-[#f5e9e2] rounded-2xl border border-[#ebd8ce] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-sm text-[#261714]">
                      @miss2m.jor
                    </div>
                    <div className="text-[11px] text-[#7d655f]">
                      {language === 'ar' ? 'الصفحة الرسمية على إنستغرام للأردن' : 'Official Jordan Instagram Page'}
                    </div>
                  </div>
                </div>

                <a
                  href="https://instagram.com/miss2m.jor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2743] to-[#bc1888] hover:from-[#c8203b] hover:to-[#a81478] text-white text-xs font-bold shadow-md shadow-[#dc2743]/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{language === 'ar' ? 'زيارة صفحة إنستغرام لمعرفة نقاط البيع' : 'Visit Instagram for Points of Sale'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-[#261714]">
                {language === 'ar' ? 'تواصل مع فريق Miss2m Jordan' : 'Contact Miss2m Jordan'}
              </h4>
              <p>
                {language === 'ar'
                  ? 'يسعدنا دائماً استقبال استفساراتك وتزويدك بالنصائح التجميلية المناسبة.'
                  : 'We are always glad to assist you with inquiries, beauty tips, and shade advice.'}
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#9c513e]" />
                  <span>{WHATSAPP_DISPLAY} (WhatsApp & Calls)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#9c513e]" />
                  <span>support@miss2mjordan.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#9c513e]" />
                  <span>Amman, Hashemite Kingdom of Jordan</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
