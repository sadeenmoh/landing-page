import React, { useState, useEffect } from 'react';
import { Language, CategoryType, Product, Shade, CartItem, CustomerReview, CustomerStarAccount, StarRewardHistory, OrderRecord } from './types';
import { PRODUCTS } from './data/products';
import { INITIAL_REVIEWS } from './data/reviewsData';
import {
  getCustomerAccount,
  getActiveCustomerId,
  setActiveCustomerId,
  clearActiveCustomerId,
  awardStarsToCustomer,
} from './services/customerStarService';
import { getOrders, addOrder, updateOrderStatus, deleteOrder } from './services/ordersService';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesNav } from './components/CategoriesNav';
import { ProductShowcase } from './components/ProductShowcase';
import { StarRewardsSection } from './components/StarRewardsSection';
import { ReviewsShowcase } from './components/ReviewsShowcase';
import { TrustBadges } from './components/TrustBadges';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { ReviewModal } from './components/ReviewModal';
import { StarClubModal } from './components/StarClubModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { AIBeautyButton } from './components/AIBeautyButton';
import { BeautyAssistantModal } from './components/BeautyAssistantModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { InstagramFeed } from './components/InstagramFeed';
import { Footer } from './components/Footer';
import { StorePoliciesModal, PolicyTab } from './components/StorePoliciesModal';
import { CheckCircle } from 'lucide-react';

export default function App() {
  // Primary language default is Arabic (RTL)
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals and Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isStarClubOpen, setIsStarClubOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [celebrationVoucherCode, setCelebrationVoucherCode] = useState('STAR20');
  const [prefilledOrderNumber, setPrefilledOrderNumber] = useState('');
  const [prefilledCustomerName, setPrefilledCustomerName] = useState('');
  const [prefilledCustomerPhone, setPrefilledCustomerPhone] = useState('');

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState<PolicyTab>('shipping');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart & Promo
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('miss2m_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('miss2m_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer Reviews state
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('miss2m_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Orders Management state
  const [orders, setOrders] = useState<OrderRecord[]>(() => getOrders());

  // Customer-Specific Star Rewards Account
  const [identifiedCustomerId, setIdentifiedCustomerId] = useState<string | null>(() => getActiveCustomerId());
  const [customerAccount, setCustomerAccount] = useState<CustomerStarAccount | null>(() => {
    const savedId = getActiveCustomerId();
    if (savedId) {
      return getCustomerAccount(savedId).account;
    }
    return null;
  });
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('miss2m_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Save wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('miss2m_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // Save reviews changes
  useEffect(() => {
    try {
      localStorage.setItem('miss2m_reviews', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  // Synchronize document direction and lang with active language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Identify Customer by Phone Number or Order Number
  const handleIdentifyCustomer = (phoneOrOrder: string) => {
    const { account, isNew } = getCustomerAccount(phoneOrOrder);
    setIdentifiedCustomerId(account.phone);
    setCustomerAccount(account);
    setIsNewCustomer(isNew);
    setActiveCustomerId(account.phone);

    if (isNew) {
      showToast(
        language === 'ar'
          ? `أهلاً بكِ! تم فتح حساب نجوم جديد برقم (${account.phone}) برصيد 0 نجوم ⭐`
          : `Welcome! New Star account started with 0 stars ⭐`
      );
    } else {
      showToast(
        language === 'ar'
          ? `أهلاً بعودتك! رصيد نجومك المرتبط برقمك: ${account.totalStars} ⭐`
          : `Welcome back! Your star balance: ${account.totalStars} ⭐`
      );
    }
  };

  const handleClearCustomerIdentity = () => {
    clearActiveCustomerId();
    setIdentifiedCustomerId(null);
    setCustomerAccount(null);
    setIsNewCustomer(false);
    showToast(
      language === 'ar' ? 'تم تسجيل الخروج من حساب النجوم' : 'Signed out of Star account'
    );
  };

  // Cart operations
  const handleAddToCart = (product: Product, shade?: Shade, quantity: number = 1) => {
    const targetShade = shade || (product.shades && product.shades.length > 0 ? product.shades[0] : undefined);
    const cartItemId = `${product.id}-${targetShade ? targetShade.id : 'default'}`;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === cartItemId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prevItems,
        {
          id: cartItemId,
          product,
          selectedShade: targetShade,
          quantity,
        },
      ];
    });

    const name = language === 'ar' ? product.nameAr : product.nameEn;
    showToast(
      language === 'ar'
        ? `تمت إضافة "${name}" إلى سلة المشتريات`
        : `Added "${name}" to your shopping bag`
    );
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const prodName = product
      ? (language === 'ar' ? product.nameAr : product.nameEn)
      : '';

    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(
          language === 'ar'
            ? `تمت إزالة "${prodName}" من المفضلة`
            : `Removed "${prodName}" from your wishlist`
        );
        return prev.filter((id) => id !== productId);
      } else {
        showToast(
          language === 'ar'
            ? `تمت إضافة "${prodName}" إلى المفضلة ❤️`
            : `Added "${prodName}" to your wishlist ❤️`
        );
        return [...prev, productId];
      }
    });
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    showToast(
      language === 'ar' ? 'تم تفريغ قائمة المفضلة' : 'Wishlist cleared'
    );
  };

  const handleAddAllWishlistToCart = () => {
    const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
    if (wishlistedProducts.length === 0) return;

    wishlistedProducts.forEach((product) => {
      handleAddToCart(product, undefined, 1);
    });

    showToast(
      language === 'ar'
        ? 'تمت إضافة جميع مستحضرات المفضلة إلى السلة ✨'
        : 'All wishlist items added to bag ✨'
    );
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Review submission tied to customer account
  const handleSubmitReview = (
    reviewData: Omit<CustomerReview, 'id' | 'date' | 'isVerifiedPurchase' | 'likesCount'>,
    reviewerPhone?: string
  ) => {
    const newReview: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isVerifiedPurchase: true,
      likesCount: 0,
    };

    setReviews((prev) => [newReview, ...prev]);

    const targetIdentifier = reviewerPhone || identifiedCustomerId || reviewData.orderNumber;
    const { updatedAccount, milestoneUnlocked } = awardStarsToCustomer(
      targetIdentifier,
      1,
      `تقييم موثق برقم الطلب ${reviewData.orderNumber}`,
      `Verified review for order ${reviewData.orderNumber}`,
      reviewData.orderNumber,
      reviewData.name
    );

    setIdentifiedCustomerId(updatedAccount.phone);
    setCustomerAccount(updatedAccount);
    setIsNewCustomer(false);

    if (milestoneUnlocked) {
      setTimeout(() => {
        setCelebrationVoucherCode('STAR20');
        setIsCelebrationOpen(true);
      }, 500);
    }

    showToast(
      language === 'ar'
        ? `شكراً لكِ! تم نشر تقييمك واحتساب +1 نجمة. رصيدك الآن: ${updatedAccount.totalStars} ⭐`
        : `Thank you! Your review was published and +1 Star added. Balance: ${updatedAccount.totalStars} ⭐`
    );
  };

  // Order confirmation tied to customer phone and saved to orders list
  const handleOrderSuccess = (
    orderId: string,
    customerName: string,
    customerPhone?: string,
    newOrderRecord?: OrderRecord
  ) => {
    setCartItems([]);
    localStorage.removeItem('miss2m_cart');

    if (newOrderRecord) {
      const updatedOrders = addOrder(newOrderRecord);
      setOrders(updatedOrders);
    }

    const targetIdentifier = customerPhone || identifiedCustomerId || orderId;
    const { updatedAccount, milestoneUnlocked } = awardStarsToCustomer(
      targetIdentifier,
      1,
      `بونص تأكيد وشحن الطلب ${orderId}`,
      `Bonus for confirmed order ${orderId}`,
      orderId,
      customerName
    );

    setIdentifiedCustomerId(updatedAccount.phone);
    setCustomerAccount(updatedAccount);
    setIsNewCustomer(false);

    if (milestoneUnlocked) {
      setTimeout(() => {
        setCelebrationVoucherCode('STAR20');
        setIsCelebrationOpen(true);
      }, 500);
    }

    showToast(
      language === 'ar'
        ? `تم تأكيد طلبك (${orderId}) وكسبتِ +1 نجمة بونص! رصيدك: ${updatedAccount.totalStars} ⭐`
        : `Order confirmed (${orderId})! You earned +1 Star! Balance: ${updatedAccount.totalStars} ⭐`
    );
  };

  const handleOpenReviewWithPrefill = (orderId: string, customerName: string, customerPhone?: string) => {
    setPrefilledOrderNumber(orderId);
    setPrefilledCustomerName(customerName);
    setPrefilledCustomerPhone(customerPhone || identifiedCustomerId || '');
    setIsReviewModalOpen(true);
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likesCount: (r.likesCount || 0) + 1 } : r))
    );
  };

  // Admin Dashboard actions
  const handleUpdateOrderStatus = (orderId: string, status: 'pending' | 'delivered') => {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
    showToast(
      language === 'ar'
        ? `تم تحديث حالة الطلب ${orderId} إلى: ${status === 'delivered' ? 'تم الاستلام والتوصيل' : 'قيد المعالجة'}`
        : `Order ${orderId} status changed to: ${status}`
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = deleteOrder(orderId);
    setOrders(updated);
    showToast(
      language === 'ar'
        ? `تم حذف الطلب ${orderId} بنجاح`
        : `Order ${orderId} removed`
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== reviewId);
      try {
        localStorage.setItem('miss2m_reviews', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(
      language === 'ar' ? 'تم حذف التقييم بنجاح' : 'Review removed successfully'
    );
  };

  const handleApplyVoucherToCart = (code: string) => {
    setAppliedPromoCode(code);
    setPromoDiscountPercent(20);
    showToast(
      language === 'ar'
        ? `تم تفعيل قسيمة الخصم 20% (${code}) بنجاح على سلتك! 🎉`
        : `20% OFF voucher (${code}) successfully applied to your bag! 🎉`
    );
  };

  const handleApplyPromoCode = (code: string): boolean => {
    const upper = code.trim().toUpperCase();
    if (upper === 'BEAUTY10') {
      setAppliedPromoCode('BEAUTY10');
      setPromoDiscountPercent(10);
      return true;
    } else if (upper === 'MISS2M') {
      setAppliedPromoCode('MISS2M');
      setPromoDiscountPercent(15);
      return true;
    } else if (
      upper === 'STAR20' ||
      (customerAccount && customerAccount.unlockedVouchers.includes(upper))
    ) {
      setAppliedPromoCode(upper);
      setPromoDiscountPercent(20);
      return true;
    }
    return false;
  };

  const handleOpenPolicy = (tab: PolicyTab) => {
    setActivePolicyTab(tab);
    setPolicyModalOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Dynamic customer values
  const currentTotalStars = customerAccount ? customerAccount.totalStars : 0;
  const currentUnlockedVouchers = customerAccount ? customerAccount.unlockedVouchers : [];
  const currentHistory = customerAccount ? customerAccount.history : [];

  return (
    <div className="min-h-screen bg-[#faf7f5] text-[#241714] flex flex-col selection:bg-[#e8c2b4] selection:text-[#3d2019]">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#2c1c18] text-[#f7ece8] px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-200 border border-[#ebdcd5]">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Announcement */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        starCount={currentTotalStars}
        onOpenStarClub={() => setIsStarClubOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={PRODUCTS}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          language={language}
          onShopNowClick={() => {
            const el = document.getElementById('product-showcase-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onBestSellersClick={() => {
            setSelectedCategory('bestsellers');
            const el = document.getElementById('product-showcase-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Categories Navigation */}
        <CategoriesNav
          language={language}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Product Showcase */}
        <ProductShowcase
          products={PRODUCTS}
          language={language}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />

        {/* Miss2m Star Club & Loyalty Rewards Section */}
        <StarRewardsSection
          language={language}
          totalStars={currentTotalStars}
          unlockedVouchers={currentUnlockedVouchers}
          identifiedPhone={identifiedCustomerId}
          onOpenStarClub={() => setIsStarClubOpen(true)}
          onOpenReviewModal={() => {
            setPrefilledOrderNumber('');
            setPrefilledCustomerName('');
            setPrefilledCustomerPhone(identifiedCustomerId || '');
            setIsReviewModalOpen(true);
          }}
          onOpenCelebrationModal={(code) => {
            setCelebrationVoucherCode(code);
            setIsCelebrationOpen(true);
          }}
        />

        {/* Public Customer Reviews Showcase Grid */}
        <ReviewsShowcase
          language={language}
          reviews={reviews}
          onOpenReviewModal={() => {
            setPrefilledOrderNumber('');
            setPrefilledCustomerName('');
            setPrefilledCustomerPhone(identifiedCustomerId || '');
            setIsReviewModalOpen(true);
          }}
          onLikeReview={handleLikeReview}
        />

        {/* Features & Trust Badges */}
        <TrustBadges language={language} />

        {/* Instagram Feed Preview */}
        <InstagramFeed language={language} />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenPolicy={handleOpenPolicy}
        onSelectCategory={setSelectedCategory}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        language={language}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromoCode={appliedPromoCode}
        promoDiscountPercent={promoDiscountPercent}
        onApplyPromoCode={handleApplyPromoCode}
      />

      {/* Dedicated Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={PRODUCTS}
        language={language}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onAddAllToCart={handleAddAllWishlistToCart}
        onClearWishlist={handleClearWishlist}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Jordan Checkout Modal with Star Rewards Integration */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        language={language}
        onOrderSuccess={handleOrderSuccess}
        onOpenReviewWithOrder={handleOpenReviewWithPrefill}
        promoDiscountPercent={promoDiscountPercent}
      />

      {/* Product Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        language={language}
        onAddToCart={handleAddToCart}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Customer Review & Star Earning Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        products={PRODUCTS}
        language={language}
        prefilledOrderNumber={prefilledOrderNumber}
        prefilledCustomerName={prefilledCustomerName}
        prefilledCustomerPhone={prefilledCustomerPhone}
        onSubmitReview={handleSubmitReview}
      />

      {/* Miss2m Star Club Loyalty Tracker Modal with Phone / Order Lookup */}
      <StarClubModal
        isOpen={isStarClubOpen}
        onClose={() => setIsStarClubOpen(false)}
        language={language}
        totalStars={currentTotalStars}
        unlockedVouchers={currentUnlockedVouchers}
        history={currentHistory}
        identifiedPhone={identifiedCustomerId}
        customerName={customerAccount?.name}
        isNewCustomer={isNewCustomer}
        onIdentifyCustomer={handleIdentifyCustomer}
        onClearIdentity={handleClearCustomerIdentity}
        onOpenReviewModal={() => {
          setPrefilledOrderNumber('');
          setPrefilledCustomerName('');
          setPrefilledCustomerPhone(identifiedCustomerId || '');
          setIsReviewModalOpen(true);
        }}
        onOpenCelebrationModal={(code) => {
          setCelebrationVoucherCode(code);
          setIsCelebrationOpen(true);
        }}
        onShopNow={() => {
          const el = document.getElementById('product-showcase-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 10-Star Milestone Celebration Modal */}
      <MilestoneCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        language={language}
        voucherCode={celebrationVoucherCode}
        onApplyToCart={handleApplyVoucherToCart}
      />

      {/* AI Beauty Assistant Modal */}
      <BeautyAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        language={language}
        products={PRODUCTS}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Secure Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        language={language}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        reviews={reviews}
        onDeleteReview={handleDeleteReview}
      />

      {/* Store Policies Modal */}
      <StorePoliciesModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        language={language}
        initialTab={activePolicyTab}
      />

      {/* Modern AI Beauty Assistant Floating Action Button */}
      <AIBeautyButton
        language={language}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
      />
    </div>
  );
}
