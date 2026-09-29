export type Language = 'ar' | 'en';

export interface Shade {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  previewImage?: string;
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
  badge?: 'bestseller' | 'new' | 'featured' | 'trending';
  descriptionAr: string;
  descriptionEn: string;
  keyBenefitsAr: string[];
  keyBenefitsEn: string[];
  ingredientsAr: string;
  ingredientsEn: string;
  shades: Shade[];
  origin: string; // "Made in Turkey"
  inStock: boolean;
}

export interface CartItem {
  id: string; // product.id + '-' + (selectedShade?.id || 'default')
  product: Product;
  selectedShade?: Shade;
  quantity: number;
}

export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  deliveryFee: number; // in JOD (0 if cart total >= 20 JOD)
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
  rating: number; // 1 to 5
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
  id: string; // e.g. #M2M-8492
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