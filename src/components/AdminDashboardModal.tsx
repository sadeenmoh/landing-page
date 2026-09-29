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
} from 'lucide-react';
import { Language, CustomerReview, OrderRecord } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { WHATSAPP_PHONE } from '../data/jordanLocations';

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
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews'>('orders');

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Reviews filters
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    // Default master password or admin password
    if (clean === 'miss2m2026' || clean === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        localStorage.setItem('miss2m_admin_session', 'true');
      } catch {
        // ignore
      }
    } else {
      setAuthError(
        language === 'ar'
          ? 'كلمة المرور غير صحيحة. كلمة المرور الافتراضية: miss2m2026'
          : 'Invalid password. Default password is: miss2m2026'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    try {
      localStorage.removeItem('miss2m_admin_session');
    } catch {
      // ignore
    }
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
        className="bg-[#faf7f5] rounded-3xl shadow-2xl border border-[#ebdcd5] w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
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
                  ? 'إدارة الطلبات ومتابعة التوصيل والإشراف على تقييمات العميلات'
                  : 'Manage customer orders, track delivery status & moderate reviews'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-rose-200 hover:text-white border border-rose-300/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title={language === 'ar' ? 'تسجيل الخروج' : 'Log out'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Logout'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {!isAuthenticated ? (
          /* Password Protected Login View */
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
                  ? 'هذه المنطقة مخصصة لفريق إدارة وإشراف Miss2m الأردن لمتابعة الطلبات وتعديل حالتها والتحكم بالتقييمات.'
                  : 'Restricted area for Miss2m Jordan staff to oversee orders, toggle dispatch statuses, and moderate customer reviews.'}
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
                  placeholder={language === 'ar' ? 'أدخلي كلمة المرور (افتراضي: miss2m2026)' : 'Enter password (default: miss2m2026)'}
                  className="w-full py-3 px-4 rounded-2xl bg-white border border-[#ebdcd5] focus:outline-hidden focus:border-[#9c513e] focus:ring-2 focus:ring-[#9c513e]/20 text-xs sm:text-sm text-[#261714] placeholder-[#a68f86]"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#c55d42] via-[#b34932] to-[#9c3a24] hover:from-[#b34932] hover:to-[#87321e] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#c55d42]/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>{language === 'ar' ? 'دخول لوحة التحكم' : 'Access Admin Dashboard'}</span>
              </button>
            </form>

            <div className="text-[11px] text-[#9c847d] bg-[#f0e4dd]/60 px-3.5 py-2 rounded-xl border border-[#ebdcd5]">
              🔑 {language === 'ar' ? 'كلمة المرور الافتراضية للتجربة:' : 'Default Demo Password:'}{' '}
              <span className="font-mono font-bold text-[#261714]">miss2m2026</span>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Top Navigation Tabs */}
            <div className="bg-white border-b border-[#ebdcd5] px-4 sm:px-6 pt-3 flex items-center gap-3">
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 px-3 font-black text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'orders'
                    ? 'border-[#c55d42] text-[#c55d42]'
                    : 'border-transparent text-[#78615b] hover:text-[#261714]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                  {totalOrdersCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 px-3 font-black text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'reviews'
                    ? 'border-[#c55d42] text-[#c55d42]'
                    : 'border-transparent text-[#78615b] hover:text-[#261714]'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>{language === 'ar' ? 'إشراف وتقييمات العميلات' : 'Customer Reviews'}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-black">
                  {reviews.length}
                </span>
              </button>
            </div>

            {/* Tab 1: Orders Management */}
            {activeTab === 'orders' && (
              <div className="p-4 sm:p-6 space-y-6 flex-1">
                {/* Orders Summary Stat Cards */}
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
                      <span className="text-[11px] font-bold">{language === 'ar' ? 'قيد المعالجة' : 'Pending / Processing'}</span>
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-amber-950">{pendingOrdersCount}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-800">
                      <span className="text-[11px] font-bold">{language === 'ar' ? 'تم الاستلام' : 'Delivered / Completed'}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-950">{deliveredOrdersCount}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#ebdcd5] shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-[#856c64]">
                      <span className="text-[11px] font-bold">{language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</span>
                      <DollarSign className="w-4 h-4 text-[#261714]" />
                    </div>
                    <div className="text-2xl font-black text-[#9c4c37]">
                      {totalRevenue.toFixed(2)} <span className="text-xs font-bold text-[#69534c]">{t.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#ebdcd5] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  {/* Status Toggle Pills */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setOrderStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        orderStatusFilter === 'all'
                          ? 'bg-[#2c1c18] text-white shadow-xs'
                          : 'bg-[#faf5f2] text-[#69524a] hover:bg-[#faefe8]'
                      }`}
                    >
                      {language === 'ar' ? 'كافة الطلبات' : 'All Orders'} ({totalOrdersCount})
                    </button>

                    <button
                      onClick={() => setOrderStatusFilter('pending')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        orderStatusFilter === 'pending'
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'قيد المعالجة' : 'Pending'}</span>
                      <span>({pendingOrdersCount})</span>
                    </button>

                    <button
                      onClick={() => setOrderStatusFilter('delivered')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        orderStatusFilter === 'delivered'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تم الاستلام' : 'Delivered'}</span>
                      <span>({deliveredOrdersCount})</span>
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className={`w-4 h-4 text-[#8f756e] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder={language === 'ar' ? 'بحث برقم الطلب، الاسم، أو الهاتف...' : 'Search by order #, name, phone...'}
                      className={`w-full py-2 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-[#faf5f2] border border-[#ebdcd5] text-xs text-[#261714] placeholder-[#9c847d] focus:outline-hidden focus:border-[#9c513e]`}
                    />
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3.5">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-[#ebdcd5] space-y-2">
                      <ShoppingBag className="w-10 h-10 text-[#c2aba2] mx-auto" />
                      <p className="font-bold text-sm text-[#4d3933]">
                        {language === 'ar' ? 'لا توجد طلبات مطابقة للفلتر المحدد' : 'No orders found matching criteria'}
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const isDelivered = order.status === 'delivered';
                      const formattedDate = new Date(order.createdAt).toLocaleString(isRtl ? 'ar-JO' : 'en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      });

                      return (
                        <div
                          key={order.id}
                          className={`bg-white rounded-3xl border transition-all p-5 shadow-xs space-y-4 ${
                            isDelivered ? 'border-[#ebdcd5]' : 'border-amber-300 shadow-amber-400/5'
                          }`}
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#f0e3dc]">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-base text-[#9c4c37] bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                                {order.id}
                              </span>
                              <span className="text-xs text-[#876f67]">
                                {formattedDate}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Current Status Pill */}
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                                  isDelivered
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                }`}
                              >
                                {isDelivered ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>{language === 'ar' ? 'تم الاستلام والتوصيل' : 'Delivered / Completed'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                                    <span>{language === 'ar' ? 'قيد المعالجة والتجهيز' : 'Pending / Processing'}</span>
                                  </>
                                )}
                              </span>

                              {/* Toggle Status Action */}
                              <button
                                onClick={() =>
                                  onUpdateOrderStatus(order.id, isDelivered ? 'pending' : 'delivered')
                                }
                                className="px-3 py-1 rounded-xl bg-[#faf5f2] hover:bg-[#f2e6e0] border border-[#ebdcd5] text-xs font-extrabold text-[#473631] transition-colors"
                              >
                                {isDelivered
                                  ? (language === 'ar' ? 'إعادة إلى قيد المعالجة' : 'Mark as Pending')
                                  : (language === 'ar' ? 'تأكيد التسليم ✓' : 'Mark as Delivered ✓')}
                              </button>

                              {/* Delete Order Action */}
                              <button
                                onClick={() => {
                                  if (window.confirm(language === 'ar' ? `هل أنتِ متأكدة من حذف الطلب ${order.id}؟` : `Delete order ${order.id}?`)) {
                                    onDeleteOrder(order.id);
                                  }
                                }}
                                className="p-1.5 text-[#b09289] hover:text-red-600 rounded-lg transition-colors"
                                title={language === 'ar' ? 'حذف الطلب' : 'Delete order'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Customer & Destination Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#faf5f2] p-3.5 rounded-2xl border border-[#ebdcd5]">
                            <div>
                              <span className="text-[10px] font-bold text-[#806963] block">
                                {language === 'ar' ? 'اسم العميلة:' : 'Customer Name:'}
                              </span>
                              <span className="font-extrabold text-sm text-[#261714]">
                                {order.customerName}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-[#806963] block">
                                {language === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono font-bold text-xs text-[#261714]">
                                  {order.phone}
                                </span>
                                <a
                                  href={`https://wa.me/962${order.phone.replace(/^0+/, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:text-emerald-800"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-[#806963] block">
                                {language === 'ar' ? 'المحافظة والعنوان:' : 'Governorate & Address:'}
                              </span>
                              <span className="font-bold text-xs text-[#261714]">
                                📍 {isRtl ? order.governorateNameAr : order.governorateNameEn} - {order.areaAndStreet}
                              </span>
                            </div>
                          </div>

                          {/* Items Ordered List */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-extrabold text-[#70564e] block">
                              {language === 'ar' ? 'المستحضرات المطلوبة:' : 'Ordered Items:'}
                            </span>
                            <div className="divide-y divide-[#f2e6e0] border border-[#ebdcd5] rounded-2xl overflow-hidden bg-white">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#f4ece7] text-[#4d3832] font-black text-[10px] flex items-center justify-center flex-shrink-0">
                                      {it.quantity}x
                                    </span>
                                    <div>
                                      <span className="font-bold text-[#261714]">
                                        {isRtl ? it.productNameAr : it.productNameEn}
                                      </span>
                                      {(it.shadeNameAr || it.shadeNameEn) && (
                                        <span className="text-[11px] text-[#8c746e] mx-1 font-medium">
                                          ({isRtl ? it.shadeNameAr : it.shadeNameEn})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="font-bold text-[#261714]">
                                    {(it.price * it.quantity).toFixed(2)} {t.currency}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Financials & Notes */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                            <div>
                              {order.notes ? (
                                <span className="text-[11px] text-[#806963] italic">
                                  "{order.notes}"
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#a68f86]">
                                  {language === 'ar' ? 'طريقة الدفع:' : 'Payment:'}{' '}
                                  <span className="font-bold text-[#261714]">
                                    {order.paymentMethod === 'cliq' ? 'CliQ فوري' : 'دفع نقدياً عند الاستلام (COD)'}
                                  </span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-3 text-end">
                              {order.discount > 0 && (
                                <span className="text-[11px] text-emerald-700 font-bold">
                                  {language === 'ar' ? 'خصم:' : 'Discount:'} -{order.discount.toFixed(2)} {t.currency}
                                </span>
                              )}
                              <span className="text-[11px] text-[#806963]">
                                {language === 'ar' ? 'التوصيل:' : 'Delivery:'}{' '}
                                {order.deliveryFee === 0 ? t.free : `${order.deliveryFee.toFixed(2)} ${t.currency}`}
                              </span>
                              <div className="font-black text-base text-[#9c4c37]">
                                {order.total.toFixed(2)} {t.currency}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Customer Reviews Moderation */}
            {activeTab === 'reviews' && (
              <div className="p-4 sm:p-6 space-y-6 flex-1">
                {/* Reviews Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#ebdcd5] shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-[#856c64] block">
                      {language === 'ar' ? 'إجمالي التقييمات المنشورة' : 'Published Reviews'}
                    </span>
                    <div className="text-2xl font-black text-[#261714]">{reviews.length}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-amber-800 block">
                      {language === 'ar' ? 'متوسط تقييم المتجر' : 'Average Star Rating'}
                    </span>
                    <div className="text-2xl font-black text-amber-950 flex items-center gap-1.5">
                      <span>★ {averageRating}</span>
                      <span className="text-xs font-bold text-amber-800">/ 5.0</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 block">
                      {language === 'ar' ? 'تقييمات موثقة بالشراء' : 'Verified Purchases'}
                    </span>
                    <div className="text-2xl font-black text-emerald-950">
                      {reviews.filter((r) => r.isVerifiedPurchase).length}
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#ebdcd5] flex items-center justify-between shadow-2xs">
                  <div className="relative w-full">
                    <Search className={`w-4 h-4 text-[#8f756e] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
                    <input
                      type="text"
                      value={reviewSearchQuery}
                      onChange={(e) => setReviewSearchQuery(e.target.value)}
                      placeholder={language === 'ar' ? 'بحث باسم العميلة، رقم الطلب، أو نص التقييم...' : 'Search by reviewer name, order #, or comment...'}
                      className={`w-full py-2 ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl bg-[#faf5f2] border border-[#ebdcd5] text-xs text-[#261714] placeholder-[#9c847d] focus:outline-hidden focus:border-[#9c513e]`}
                    />
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-3">
                  {filteredReviews.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-[#ebdcd5] space-y-2">
                      <Star className="w-10 h-10 text-[#c2aba2] mx-auto" />
                      <p className="font-bold text-sm text-[#4d3933]">
                        {language === 'ar' ? 'لا توجد تقييمات مطابقة لبحثك' : 'No reviews found'}
                      </p>
                    </div>
                  ) : (
                    filteredReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-white rounded-3xl border border-[#ebdcd5] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4 group hover:border-[#c55d42]/50 transition-colors"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-extrabold text-sm text-[#261714]">
                              {rev.name}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#8c5344] bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                              {rev.orderNumber}
                            </span>
                            {rev.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
                                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                {language === 'ar' ? 'مشتري موثق' : 'Verified Purchase'}
                              </span>
                            )}
                            <span className="text-[11px] text-[#9c847d]">
                              • {rev.date} {rev.city && `(${rev.city})`}
                            </span>
                          </div>

                          {/* Star Rating Display */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-[#d9c5bd]'
                                }`}
                              />
                            ))}
                            {rev.productNameAr && (
                              <span className="text-[11px] font-bold text-[#806963] mx-2">
                                | {isRtl ? rev.productNameAr : rev.productNameEn}
                              </span>
                            )}
                          </div>

                          {/* Review Comment Text */}
                          <p className="text-xs sm:text-sm text-[#4d3630] leading-relaxed bg-[#faf6f3] p-3 rounded-2xl border border-[#f0e3dc]">
                            "{rev.comment}"
                          </p>
                        </div>

                        {/* Direct Delete Review Button */}
                        <div className="w-full sm:w-auto flex sm:flex-col justify-end gap-2">
                          <button
                            onClick={() => {
                              if (window.confirm(language === 'ar' ? `هل أنتِ متأكدة من حذف تقييم ${rev.name} (${rev.orderNumber}) نهائياً؟` : `Delete review from ${rev.name}?`)) {
                                onDeleteReview(rev.id);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                            title={language === 'ar' ? 'حذف هذا التقييم' : 'Delete review'}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>{language === 'ar' ? 'حذف التقييم' : 'Delete Review'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
