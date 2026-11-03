export type Category = {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  variantType: 'Color' | 'Size' | 'Material' | 'Style';
  variantValue: string;
  priceAdjustment: number;
  imageUrl?: string | null;
  isActive: boolean;
  stockQuantity: number;
};

export type ProductImage = {
  id: string;
  productId: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  fullDescription: string;
  regularPrice: number;
  salePrice?: number | null;
  weightInGrams: number;
  dimensionsCm: {
    length: number;
    breadth: number;
    height: number;
  };
  specifications: ProductSpecification[];
  careInstructions?: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  primaryImage: string;
  galleryImages: string[];
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type PricingBreakdown = {
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  couponError?: string;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  maxStock: number;
};

export type Cart = {
  id?: string;
  userId?: string | null;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  shippingFee: number;
  taxAmount: number;
  total: number;
};

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  timesUsed: number;
  isActive: boolean;
  startsAt: string;
  expiresAt?: string | null;
};

export type UserAddress = {
  id: string;
  userId?: string;
  fullName: string;
  mobile: string;
  email?: string;
  houseNumber: string;
  street: string;
  area?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'office' | 'other';
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'UNPAID'
  | 'AUTHORIZED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type OrderItem = {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: 'UNFULFILLED' | 'PROCESSING' | 'FULFILLED' | 'CANCELLED';
  currency: 'INR';
  subtotalAmount: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'RAZORPAY' | 'COD';
  shippingAddress: UserAddress;
  billingAddress: UserAddress;
  items: OrderItem[];
  couponCode?: string | null;
  notes?: string;
  shipment?: {
    courierName?: string;
    awbCode?: string;
    status?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ProductReview = {
  id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  headline?: string;
  reviewText: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
};

export type HomepageBanner = {
  id: string;
  bannerType: 'hero' | 'promo' | 'announcement';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl: string;
  buttonText?: string;
  displayOrder: number;
  isActive: boolean;
};
