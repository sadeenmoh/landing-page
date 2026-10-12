import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  ShoppingBag,
  Star,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Search,
  Filter,
  LogOut,
  ChevronDown,
  Sparkles,
  CreditCard,
  DollarSign,
  TrendingUp,
  PackageCheck,
  ExternalLink,
  MessageCircle,
  Package,
  AlertTriangle,
  Edit3,
  Save,
} from 'lucide-react';
import { Language, CustomerReview, OrderRecord, Product, Shade } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { WHATSAPP_PHONE } from '../data/jordanLocations';
import { PRODUCTS } from '../data/products';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'delivered') => void;
  onDeleteOrder: (orderId: string) => void;
  reviews: CustomerReview[];
  onDeleteReview: (reviewId: string) => void;
}

const PRODUCTS_STOCK_KEY = 'miss2m_products_stock';

// دوال مساعدة للمخزون
const getTotalStock = (product: Product): number => {
  if (product.shades && product.shades.length > 0) {
    return product.shades.reduce((sum, s) => sum + (s.stock ?? 0), 0);
  }
  return product.stock ?? 0;
};

const isOutOfStock = (product: Product): boolean => getTotalStock(product) === 0;

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  language,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  reviews,
  onDeleteReview,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('miss2m_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'stock'>('orders');

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Reviews filters
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

  // Stock management - مع دعم shades
  const [productsStock, setProductsStock] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STOCK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Product[];
        // هجرة للبيانات القديمة: اذا shade ما اله stock اعطيه 35
        return parsed.map(p => {
          if (p.shades && p.shades.length > 0) {
            const shadesWithStock = p.shades.map((s: any) => ({
              ...s,
              stock: s.stock ?? 35,
            }));
            const total = shadesWithStock.reduce((sum: number, s: any) => sum + (s.stock ?? 0), 0);
            return { ...p, shades: shadesWithStock, stock: total, inStock: total > 0 };
          }
          return {
            ...p,
            stock: (p as any).stock ?? 35,
            inStock: ((p as any).stock ?? 35) > 0
          };
        });
      }
    } catch {}
    // تحميل أول مرة من PRODUCTS
    return PRODUCTS.map(p => {
      if (p.shades && p.shades.length > 0) {
        const shadesWithStock = p.shades.map((s: any) => ({
          ...s,
          stock: s.stock ?? 35,
        }));
        const total = shadesWithStock.reduce((sum: number, s: any) => sum + (s.stock ?? 0), 0);
        return { ...p, shades: shadesWithStock, stock: total, inStock: total > 0 };
      }
      return {
        ...p,
        stock: (p as any).stock ?? 35,
        inStock: ((p as any).stock ?? 35) > 0
      };
    });
  });
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // حفظ المخزون عند التغيير
  useEffect(() => {
    localStorage.setItem(PRODUCTS_STOCK_KEY, JSON.stringify(productsStock));
  }, [productsStock]);

  // للمنتجات بدون درجات
  const updateStock = (productId: string, newStock: number) => {
    setProductsStock(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, stock: newStock, inStock: newStock > 0 }
        : p
    ));
  };

  // الجديد: تحديث مخزون درجة معينة
  const updateShadeStock = (productId: string, shadeId: string, newStock: number) => {
    setProductsStock(prev => prev.map(p => {
      if (p.id !== productId) return p;
      if (!p.shades) return p;
      
      const updatedShades = p.shades.map(s => 
        s.id === shadeId ? { ...s, stock: Math.max(0, newStock) } : s
      );
      const totalStock = updatedShades.reduce((sum, s) => sum + (s.stock ?? 0), 0);
      
      return {
        ...p,
        shades: updatedShades,
        stock: totalStock,
        inStock: totalStock > 0
      };
    }));
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    if (clean === 'miss2m2026' || clean === '9592') {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        localStorage.setItem('miss2m_admin_session', 'true');
      } catch {}
    } else {
      setAuthError(
        language === 'ar'
          ? 'كلمة المرور غير صحيحة، حاولي مرة أخرى.'
          : 'Invalid password. Please try again.'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    try {
      localStorage.removeItem('miss2m_admin_session');
    } catch {}
  };

  // Orders Calculations
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = orders.filter((ord) => {
    if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchName = ord.customerName.toLowerCase().includes(q);
      const matchPhone = ord.phone.includes(q);
      const matchGov = (ord.governorateNameAr + ' ' + ord.governorateNameEn).toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchGov;
    }
    return true;
  });

  // Stock Calculations - الجديد يحسب المجموع
  const totalProducts = productsStock.length;
  const outOfStockCount = productsStock.filter(p => getTotalStock(p) === 0).length;
  const lowStockCount = productsStock.filter(p => {
    const total = getTotalStock(p);
    return total > 0 && total < 5;
  }).length;
  const inStockCount = productsStock.filter(p => getTotalStock(p) >= 5).length;

  const filteredProductsStock = productsStock.filter((product) => {
    const total = getTotalStock(product);
    if (stockFilter === 'out' && total !== 0) return false;
    if (stockFilter === 'low' && (total === 0 || total >= 5)) return false;
    if (stockSearchQuery.trim()) {
      const q = stockSearchQuery.toLowerCase();
      return (
        product.nameAr.toLowerCase().includes(q) ||
        product.nameEn.toLowerCase().includes(q) ||
        product.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Reviews Calculations
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const filteredReviews = reviews.filter((rev) => {
    if (!reviewSearchQuery.trim()) return true;
    const q = reviewSearchQuery.toLowerCase();
    const matchName = rev.name.toLowerCase().includes(q);
    const matchOrder = rev.orderNumber.toLowerCase().includes(q);
    const matchComment = rev.comment.toLowerCase().includes(q);
    const matchProd = (rev.productNameAr || '' + ' ' + (rev.productNameEn || '')).toLowerCase().includes(q);
    return matchName || matchOrder || matchComment || matchProd;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        id="admin-dashboard-modal-card"
        className="bg-[#faf7f5] rounded-3xl shadow-2xl border border-[#ebdcd5] w-full max-w-6xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#261714] via-[#3a201b] to-[#261714] text-white border-b border-[#ebdcd5] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-[#c55d42] text-white flex items-center justify-center font-black shadow-md flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#faf2ee]">
                  {language === 'ar' ? 'لوحة تحكم إدارة Miss2m الأردن' : 'Miss2m Jordan Admin Portal'}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-xs text-[#d6c1b8] mt-0.5">
                {language === 'ar'
                  ? 'إدارة الطلبات والمخزون وتقييمات العميلات'
                  : 'Manage orders, stock & reviews'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-rose-200 hover:text-white border border-rose-300/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Logout'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#2c1c18] to-[#613b32] text-amber-300 flex items-center justify-center shadow-xl border border-amber-300/30">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-[#261714]">
                {language === 'ar' ? 'تسجيل دخول الإدارة' : 'Admin Authorization Required'}
              </h4>
              <p className="text-xs sm:text-sm text-[#78615b] leading-relaxed">
                {language === 'ar'
                  ? 'هذه المنطقة مخصصة لفريق إدارة Miss2m'
                  : 'Restricted area for Miss2m Jordan staff'}
              </p>
            </div>
            {authError && (
              <div className="w-full p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {authError}
              </div>
            )}
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label className="block text-start text-xs font-bold text-[#543f38] mb-1.5">
                  {language === 'ar' ? 'كلمة مرور لوحة التحكم' : 'Admin Security Password'}
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخلي كلمة المرور' : 'Enter admin password'}
                  className="w-full py-3 px-4 rounded-2xl bg-white border border-[#ebdcd5] focus:outline-hidden focus:border-[#9c513e] focus:ring-2 focus:ring-[#9c513e]/20 text-xs sm:text-sm text-[#261714] placeholder-[#a68f86]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#c55d42] via-[#b34932] to-[#9c3a24] text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{language === 'ar' ? 'دخول لوحة التحكم' : 'Access Admin Dashboard'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Top Navigation Tabs */}
            <div className="bg-white border-b border-[#ebdcd5] px-4 sm:px-6 pt-3 flex items-center gap-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 px-3 font-black text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-[#c55d42] text-[#c55d42]'
                    : 'border-transparent text-[#78615b] hover:text-[#261714]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'ar' ? 'الطلبات' : 'Orders'}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                  {totalOrdersCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('stock')}
                className={`pb-3 px-3 font-black text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'stock'
                    ? 'border-[#c55d42] text-[#c55d42]'
                    : 'border-transparent text-[#78615b] hover:text-[#261714]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{language === 'ar' ? 'المخزون' : 'Stock'}</span>
                {outOfStockCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-900 text-[10px] font-black animate-pulse">
                    {outOfStockCount} نفذ
                  </span>
                )}
                {lowStockCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[10px] font-black">
                    {lowStockCount} قليل
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 px-3 font-black text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'border-[#c55d42] text-[#c55d42]'
                    : 'border-transparent text-[#78615b] hover:text-[#261714]'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>{language === 'ar' ? 'التقييمات' : 'Reviews'}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-black">
                  {reviews.length}
                </span>
              </button>
            </div>

            {/* Tab 1: Orders Management */}
            {activeTab === 'orders' && (
              <div className="p-4 sm:p-6 space-y-6 flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#ebdcd5] shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-[#856c64]">
                      <span className="text-[11px] font-bold">{language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}</span>
                      <ShoppingBag className="w-4 h-4 text-[#9c513e]" />
                    </div>
                    <div className="text-2xl font-black text-[#261714]">{totalOrdersCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-amber-800">
                      <span className="text-[11px] font-bold">{language === 'ar' ? 'قيد المعالجة' : 'Pending'}</span>
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-amber-950">{pendingOrdersCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-800">
                      <span className="text-[11px] font-bold">{language === 'ar' ? 'تم الاستلام' : 'Delivered'}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-950">{deliveredOrdersCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#ebdcd5] shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-[#856c64]">
                      <span className="text-[11px] font-bold">{language === 'ar' ? 'الإيرادات' : 'Revenue'}</span>
                      <DollarSign className="w-4 h-4 text-[#261714]" />
                    </div>
                    <div className="text-2xl font-black text-[#9c4c37]">
                      {totalRevenue.toFixed(2)} <span className="text-xs font-bold text-[#69534c]">{t.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#ebdcd5] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <button onClick={() => setOrderStatusFilter('all')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${orderStatusFilter === 'all' ? 'bg-[#2c1c18] text-white' : 'bg-[#faf5f2] text-[#69524a]'}`}>
                      {language === 'ar' ? 'الكل' : 'All'} ({totalOrdersCount})
                    </button>
                    <button onClick={() => setOrderStatusFilter('pending')} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${orderStatusFilter === 'pending' ? 'bg-amber-400 text-amber-950' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
                      <Clock className="w-3.5 h-3.5" /> {language === 'ar' ? 'قيد المعالجة' : 'Pending'} ({pendingOrdersCount})
                    </button>
                    <button onClick={() => setOrderStatusFilter('delivered')} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${orderStatusFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'ar' ? 'تم' : 'Delivered'} ({deliveredOrdersCount})
                    </button>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className={`w-4 h-4 text-[#8f756e] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
                    <input type="text" value={orderSearchQuery} onChange={(e) => setOrderSearchQuery(e.target.value)} placeholder={language === 'ar' ? 'بحث...' : 'Search...'} className={`w-full py-2 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-[#faf5f2] border border-[#ebdcd5] text-xs`} />
                  </div>
                </div>

                <div className="space-y-3.5">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-[#ebdcd5]"><ShoppingBag className="w-10 h-10 text-[#c2aba2] mx-auto" /><p className="font-bold text-sm text-[#4d3933]">لا توجد طلبات</p></div>
                  ) : (
                    filteredOrders.map((order) => {
                      const isDelivered = order.status === 'delivered';
                      const formattedDate = new Date(order.createdAt).toLocaleString(isRtl ? 'ar-JO' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });
                      return (
                        <div key={order.id} className={`bg-white rounded-3xl border p-5 shadow-xs space-y-4 ${isDelivered ? 'border-[#ebdcd5]' : 'border-amber-300'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#f0e3dc]">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-base text-[#9c4c37] bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">{order.id}</span>
                              <span className="text-xs text-[#876f67]">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${isDelivered ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}>
                                {isDelivered ? <><CheckCircle2 className="w-3.5 h-3.5" /><span>تم الاستلام</span></> : <><Clock className="w-3.5 h-3.5" /><span>قيد المعالجة</span></>}
                              </span>
                              <button onClick={() => onUpdateOrderStatus(order.id, isDelivered ? 'pending' : 'delivered')} className="px-3 py-1 rounded-xl bg-[#faf5f2] border border-[#ebdcd5] text-xs font-extrabold">
                                {isDelivered ? 'إعادة لمعالجة' : 'تأكيد التسليم ✓'}
                              </button>
                              <button onClick={() => { if (window.confirm(`حذف ${order.id}؟`)) onDeleteOrder(order.id); }} className="p-1.5 text-[#b09289] hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#faf5f2] p-3.5 rounded-2xl border border-[#ebdcd5]">
                            <div><span className="text-[10px] font-bold text-[#806963] block">اسم العميلة:</span><span className="font-extrabold text-sm">{order.customerName}</span></div>
                            <div><span className="text-[10px] font-bold text-[#806963] block">رقم الهاتف:</span><span className="font-mono font-bold">{order.phone}</span></div>
                            <div><span className="text-[10px] font-bold text-[#806963] block">العنوان:</span><span className="font-bold">📍 {isRtl ? order.governorateNameAr : order.governorateNameEn} - {order.areaAndStreet}</span></div>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-extrabold text-[#70564e] block">المستحضرات:</span>
                            <div className="divide-y divide-[#f2e6e0] border border-[#ebdcd5] rounded-2xl overflow-hidden bg-white">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#f4ece7] font-black text-[10px] flex items-center justify-center">{it.quantity}x</span>
                                    <span className="font-bold">{isRtl ? it.productNameAr : it.productNameEn} {(it.shadeNameAr || it.shadeNameEn) && `(${isRtl ? it.shadeNameAr : it.shadeNameEn})`}</span>
                                  </div>
                                  <span className="font-bold">{(it.price * it.quantity).toFixed(2)} {t.currency}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-1 text-xs">
                            <span className="text-[11px] text-[#806963] italic">{order.notes || (order.paymentMethod === 'cliq' ? 'CliQ' : 'COD')}</span>
                            <div className="font-black text-base text-[#9c4c37]">{order.total.toFixed(2)} {t.currency}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Stock Management - UPDATED FOR SHADES */}
            {activeTab === 'stock' && (
              <div className="p-4 sm:p-6 space-y-6 flex-1">
                {/* Stock Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-[#ebdcd5] space-y-1">
                    <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-[#856c64]">إجمالي المنتجات</span><Package className="w-4 h-4 text-[#9c513e]" /></div>
                    <div className="text-2xl font-black">{totalProducts}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-emerald-800">متوفر</span><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                    <div className="text-2xl font-black text-emerald-950">{inStockCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1">
                    <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-orange-800">كمية قليلة (&lt;5)</span><AlertTriangle className="w-4 h-4 text-orange-600" /></div>
                    <div className="text-2xl font-black text-orange-950">{lowStockCount}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                    <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-red-800">نفذت الكمية</span><Trash2 className="w-4 h-4 text-red-600" /></div>
                    <div className="text-2xl font-black text-red-950">{outOfStockCount}</div>
                  </div>
                </div>

                {/* Stock Filters */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#ebdcd5] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setStockFilter('all')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${stockFilter === 'all' ? 'bg-[#2c1c18] text-white' : 'bg-[#faf5f2] text-[#69524a]'}`}>الكل ({totalProducts})</button>
                    <button onClick={() => setStockFilter('low')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${stockFilter === 'low' ? 'bg-orange-400 text-orange-950' : 'bg-orange-50 text-orange-900 border border-orange-200'}`}>قليل ({lowStockCount})</button>
                    <button onClick={() => setStockFilter('out')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${stockFilter === 'out' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-900 border border-red-200'}`}>نفذ ({outOfStockCount})</button>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className={`w-4 h-4 text-[#8f756e] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
                    <input type="text" value={stockSearchQuery} onChange={(e) => setStockSearchQuery(e.target.value)} placeholder="بحث باسم المنتج..." className={`w-full py-2 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-[#faf5f2] border border-[#ebdcd5] text-xs`} />
                  </div>
                </div>

                {/* Products Stock Table */}
                <div className="bg-white rounded-3xl border border-[#ebdcd5] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-[#faf5f2] border-b border-[#ebdcd5]">
                        <tr className="text-[11px] font-black text-[#70564e]">
                          <th className="p-3 text-start w-[30%]">المنتج</th>
                          <th className="p-3 text-start">الدرجات / المخزون</th>
                          <th className="p-3 text-center w-[15%]">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2e6e0]">
                        {filteredProductsStock.map((product) => {
                          const total = getTotalStock(product);
                          return (
                            <tr key={product.id} className="hover:bg-[#faf5f2]/30 align-top">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img src={product.image} alt={product.nameAr} className="w-12 h-12 rounded-xl object-cover border border-[#ebdcd5]" />
                                  <div>
                                    <div className="font-bold text-[#261714] text-xs leading-tight">{isRtl ? product.nameAr : product.nameEn}</div>
                                    <div className="text-[10px] text-[#8c746e] font-mono mt-1">{product.id}</div>
                                    {total === 0 ? (
                                      <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 text-[10px] font-black">نفذت</span>
                                    ) : (
                                      <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black">متوفر - المجموع {total}</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                {product.shades && product.shades.length > 0 ? (
                                  <div className="space-y-2">
                                    {product.shades.map((shade) => (
                                      <div key={shade.id} className="flex items-center gap-2 bg-[#faf7f5] border border-[#f0e3dc] rounded-xl p-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                          <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: shade.hex }} title={shade.hex} />
                                          <div className="flex-1 min-w-0">
                                            <div className="font-bold text-[11px] truncate">{isRtl ? shade.nameAr : shade.nameEn}</div>
                                            <div className="text-[10px] text-[#8c746e]">{shade.id}</div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                          <button 
                                            onClick={() => updateShadeStock(product.id, shade.id, (shade.stock ?? 0) - 1)} 
                                            className="w-7 h-7 rounded-lg bg-white border border-[#ebdcd5] hover:bg-[#2c1c18] hover:text-white font-black flex items-center justify-center"
                                          >-</button>
                                          <input
                                            type="number"
                                            min="0"
                                            value={shade.stock ?? 0}
                                            onChange={(e) => updateShadeStock(product.id, shade.id, parseInt(e.target.value) || 0)}
                                            className={`w-16 border rounded-lg px-1 py-1 text-center font-black text-xs ${
                                              (shade.stock ?? 0) === 0 ? 'border-red-300 bg-red-50 text-red-700' :
                                              (shade.stock ?? 0) < 5 ? 'border-orange-300 bg-orange-50 text-orange-700' :
                                              'border-[#ebdcd5] bg-white'
                                            }`}
                                          />
                                          <button 
                                            onClick={() => updateShadeStock(product.id, shade.id, (shade.stock ?? 0) + 1)} 
                                            className="w-7 h-7 rounded-lg bg-white border border-[#ebdcd5] hover:bg-[#2c1c18] hover:text-white font-black flex items-center justify-center"
                                          >+</button>
                                        </div>

                                        {(shade.stock ?? 0) === 0 ? (
                                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black whitespace-nowrap">نفذت</span>
                                        ) : (
                                          <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold whitespace-nowrap">متوفر ({shade.stock})</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  // منتج بدون درجات - الواجهة القديمة
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => updateStock(product.id, (product.stock ?? 0) + 1)} className="w-7 h-7 rounded-lg bg-[#faf5f2] border border-[#ebdcd5] hover:bg-[#2c1c18] hover:text-white font-black">+</button>
                                      <input
                                        type="number"
                                        min="0"
                                        value={product.stock ?? 0}
                                        onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                                        className={`w-20 border rounded-xl px-2 py-1.5 text-center font-black text-sm ${
                                          (product.stock ?? 0) === 0 ? 'border-red-300 bg-red-50 text-red-700' :
                                          (product.stock ?? 0) < 5 ? 'border-orange-300 bg-orange-50 text-orange-700' :
                                          'border-[#ebdcd5] bg-white'
                                        }`}
                                      />
                                      <button onClick={() => updateStock(product.id, Math.max(0, (product.stock ?? 0) - 1))} className="w-7 h-7 rounded-lg bg-[#faf5f2] border border-[#ebdcd5] hover:bg-[#2c1c18] hover:text-white font-black">-</button>
                                    </div>
                                    {(product.stock ?? 0) === 0 ? (
                                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200 text-[10px] font-black">نفذت</span>
                                    ) : (product.stock ?? 0) < 5 ? (
                                      <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-black">قليل</span>
                                    ) : (
                                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black">متوفر</span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className={`text-sm font-black px-3 py-2 rounded-xl border inline-block min-w-[60px] ${
                                  total === 0 ? 'bg-red-50 text-red-700 border-red-200' :
                                  total < 5 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  'bg-white text-[#261714] border-[#ebdcd5]'
                                }`}>
                                  {total}
                                </div>
                                {product.shades && product.shades.length > 0 && (
                                  <div className="text-[10px] text-[#8c746e] mt-1">مجموع الدرجات</div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-900">
                  <span className="font-black">💡 كيف بشتغل هلأ:</span> كل درجة الها مخزون لحال. اذا حطيتي 0 لدرجة معينة، بتظهر "نفذت" بس لتلك الدرجة في المتجر. اذا كل الدرجات صارت 0، المنتج كامل بصير "نفذت". المجموع ينحسب تلقائي.
                </div>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="p-4 sm:p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-[#ebdcd5]"><span className="text-[11px] font-bold text-[#856c64] block">التقييمات</span><div className="text-2xl font-black">{reviews.length}</div></div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200"><span className="text-[11px] font-bold text-amber-800 block">متوسط التقييم</span><div className="text-2xl font-black">★ {averageRating}</div></div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200"><span className="text-[11px] font-bold text-emerald-800 block">موثقة</span><div className="text-2xl font-black">{reviews.filter((r) => r.isVerifiedPurchase).length}</div></div>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#ebdcd5]">
                  <div className="relative w-full">
                    <Search className={`w-4 h-4 text-[#8f756e] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
                    <input type="text" value={reviewSearchQuery} onChange={(e) => setReviewSearchQuery(e.target.value)} placeholder="بحث..." className={`w-full py-2 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-[#faf5f2] border border-[#ebdcd5] text-xs`} />
                  </div>
                </div>
                <div className="space-y-3">
                  {filteredReviews.map((rev) => (
                    <div key={rev.id} className="bg-white rounded-3xl border border-[#ebdcd5] p-4 flex justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2"><span className="font-extrabold text-sm">{rev.name}</span><span className="font-mono text-xs bg-rose-50 px-2 py-0.5 rounded-lg border">{rev.orderNumber}</span></div>
                        <div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-[#d9c5bd]'}`} />))}</div>
                        <p className="text-xs bg-[#faf6f3] p-3 rounded-2xl border">"{rev.comment}"</p>
                      </div>
                      <button onClick={() => { if (window.confirm(`حذف تقييم ${rev.name}؟`)) onDeleteReview(rev.id); }} className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-xs font-black flex items-center gap-1.5"><Trash2 className="w-4 h-4" /> حذف</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
