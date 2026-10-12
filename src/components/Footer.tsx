import React from 'react';
import { Instagram, Facebook, Mail, MapPin, Sparkles, Heart, ShieldCheck, Phone } from 'lucide-react';
import { Language, CategoryType } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { PolicyTab } from './StorePoliciesModal';

interface FooterProps {
  language: Language;
  onOpenPolicy: (tab: PolicyTab) => void;
  onSelectCategory: (cat: CategoryType | 'all') => void;
  onOpenAdminDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenPolicy,
  onSelectCategory,
  onOpenAdminDashboard,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-[#241714] text-[#f7ece8] pt-16 pb-12 border-t border-[#3d2722]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#3d2722]">
          {/* Col 1: Brand presentation & About */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-white">
                Miss<span className="text-[#c59a85]">2m</span>
              </span>
              <span className="text- font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-[#3d2722] text-[#e8c2b4] border border-[#54362f]">
                {language === 'ar'? 'الأردن' : 'Jordan'}
              </span>
            </div>

            <p className="text-xs text-[#c4aca5] leading-relaxed max-w-sm">
              {t.footerAbout}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/miss2m.jor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#36231f] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-[#f7ece8] hover:text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="Instagram @miss2m.jor"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/miss2m.jor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#36231f] hover:bg-[#1877F2] text-[#f7ece8] hover:text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#e8c2b4]">
              {t.navCategories}
            </h4>
            <ul className="space-y-2 text-xs text-[#c4aca5]">
              <li>
                <button onClick={() => { onSelectCategory('face'); window.scrollTo({ top: 700, behavior: 'smooth' }); }} className="hover:text-white transition-colors">{t.navFace}</button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('lips'); window.scrollTo({ top: 700, behavior: 'smooth' }); }} className="hover:text-white transition-colors">{t.navLips}</button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('eyes'); window.scrollTo({ top: 700, behavior: 'smooth' }); }} className="hover:text-white transition-colors">{t.navEyes}</button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('bestsellers'); window.scrollTo({ top: 700, behavior: 'smooth' }); }} className="hover:text-white transition-colors flex items-center gap-1"><span>{t.navBestSellers}</span><span className="text-[#c59a85]">★</span></button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#e8c2b4]">{t.footerCustomerCare}</h4>
            <ul className="space-y-2 text-xs text-[#c4aca5]">
              <li><button onClick={() => onOpenPolicy('shipping')} className="hover:text-white transition-colors text-start">{t.footerPolicyShipping}</button></li>
              <li><button onClick={() => onOpenPolicy('returns')} className="hover:text-white transition-colors text-start">{t.footerPolicyReturns}</button></li>
              <li><button onClick={() => onOpenPolicy('authenticity')} className="hover:text-white transition-colors text-start">{t.footerPolicyAuthentic}</button></li>
              <li><button onClick={() => onOpenPolicy('locations')} className="hover:text-white transition-colors text-start">{t.footerLocations}</button></li>
            </ul>
          </div>

          {/* Col 4: Contact info - تم التعديل هنا واضافة رقم التلفون */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#e8c2b4]">
              {language === 'ar'? 'التواصل ومناطق الخدمة' : 'Contact & Jordan Reach'}
            </h4>
            <div className="space-y-2.5 text-xs text-[#c4aca5]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c59a85] flex-shrink-0 mt-0.5" />
                <span>{language === 'ar'? 'عمّان، المملكة الأردنية الهاشمية' : 'Amman, Jordan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c59a85] flex-shrink-0" />
                <span>support@miss2mjordan.com</span>
              </div>
              {/* --- رقم التلفون الجديد --- */}
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c59a85] flex-shrink-0" />
                <a href="tel:079773906" dir="ltr" className="hover:text-white transition-colors font-bold text-[#f7ece8] text-sm">
                  079773906
                </a>
              </div>
              <div className="p-2.5 rounded-xl bg-[#33201c] border border-[#4a2e28] text- text-[#dec2b9] mt-2">
                {t.footerStockistsList}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9e837b]">
          <div className="flex items-center gap-4">
            <p>{t.footerRights}</p>
            <button onClick={onOpenAdminDashboard} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#33201c] hover:bg-[#472d27] text-[#c2aba3] hover:text-[#faefe8] transition-colors border border-[#4a2e28] text- font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar'? 'لوحة الإدارة' : 'Admin Login'}</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span>Made in Turkey with</span>
            <Heart className="w-3.5 h-3.5 fill-[#c55d42] text-[#c55d42]" />
            <span>for Jordan</span>
          </div>
          
        </div>
      </div>
    </footer>
  );
};