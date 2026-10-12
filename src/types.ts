export type Language = 'ar' | 'en';

export interface Shade {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  previewImage?: string;
  image?: string;
  stock: number; // <--- الجديد: مخزون كل درجة لحال
}

export type CategoryType = 'face' | 'lips' | 'eyes' | 'nails' | 'bestsellers';

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  category: CategoryType;
  subcategoryAr: string;
  subcategoryEn: string;
  price: number; // in JOD
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  hoverImage: string;
  gallery: string[];
  
  shades?: Shade[];
  badge?: 'bestseller' | 'new' | 'featured' | 'trending';
  
  descriptionAr: string;
  descriptionEn: string;
  keyBenefitsAr: string[];
  keyBenefitsEn: string[];
  ingredientsAr: string;
  ingredientsEn: string;
  
  origin: string;
  stock: number; // للمنتجات اللي ما الها درجات، و للمنتجات اللي الها درجات رح ينحسب مجموع درجاتها تلقائيا
  inStock: boolean; // رح ينحسب تلقائيا: اذا stock > 0
}

export interface CartItem {
  id: string;
  product: Product;
  selectedShade?: Shade;
  quantity: number;
}

export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  deliveryFee: number;
  deliveryTimeAr: string;
  deliveryTimeEn: string;
}

export interface CheckoutForm {
  fullName: string;
  phone: string;
  governorate: string;
  areaAndStreet: string;
  notes: string;
  paymentMethod: 'cod' | 'cliq';
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export interface CustomerReview {
  id: string;
  name: string;
  orderNumber: string;
  rating: number;
  comment: string;
  productId?: string;
  productNameAr?: string;
  productNameEn?: string;
  isVerifiedPurchase: boolean;
  date: string;
  city?: string;
  likesCount?: number;
}

export interface StarRewardHistory {
  id: string;
  reasonAr: string;
  reasonEn: string;
  stars: number;
  date: string;
  orderNumber?: string;
}

export interface StarClubData {
  totalStars: number;
  unlockedVouchers: string[];
  history: StarRewardHistory[];
}

export interface CustomerStarAccount {
  phone: string;
  orderNumber?: string;
  name?: string;
  totalStars: number;
  unlockedVouchers: string[];
  history: StarRewardHistory[];
  createdAt?: string;
  isNewUser?: boolean;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedProductIds?: string[];
  quickReplies?: string[];
}

export interface OrderItemSummary {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  shadeNameAr?: string;
  shadeNameEn?: string;
  quantity: number;
  price: number;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  governorate: string;
  governorateNameAr: string;
  governorateNameEn: string;
  areaAndStreet: string;
  notes?: string;
  paymentMethod: 'cod' | 'cliq';
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'delivered';
  createdAt: string;
}

// ===== دوال مساعدة للمخزون =====
export const getProductTotalStock = (product: Product): number => {
  if (product.shades && product.shades.length > 0) {
    return product.shades.reduce((sum, shade) => sum + (shade.stock || 0), 0);
  }
  return product.stock || 0;
};

export const isProductOutOfStock = (product: Product): boolean => {
  return getProductTotalStock(product) === 0;
};

export const isShadeOutOfStock = (shade: Shade): boolean => {
  return (shade.stock || 0) === 0;
};

export const getShadeStockStatus = (shade: Shade): { textAr: string; textEn: string; available: boolean } => {
  if (shade.stock === 0) {
    return { textAr: 'نفذت', textEn: 'Out of stock', available: false };
  }
  return { textAr: `متوفر (${shade.stock})`, textEn: `In stock (${shade.stock})`, available: true };
};
