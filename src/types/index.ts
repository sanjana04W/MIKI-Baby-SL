export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type ProductStatus = 'active' | 'archived';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Framed 8x10 Natural Wood", "Framed A3 White", "Unframed Print Only"
  price: number;
  stock: number;
}

export interface Product {
  productId: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  dimensions: string; // e.g. "A4 (21x30 cm) / A3 (30x42 cm)"
  material: string; // e.g. "300gsm Heavy Linen Cardstock & Eco Pine Frame"
  variants?: ProductVariant[];
  basePrice: number;
  salePrice?: number;
  images: string[];
  stockLevel: number;
  stockStatus: StockStatus;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isPersonalizable?: boolean;
  personalizationFields?: string[]; // e.g. ["Baby Name", "Birth Date", "Time of Birth", "Weight", "Height"]
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  parentId?: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  description?: string;
  image?: string;
}

export interface FrameSize {
  id: string;
  label: string;          // e.g. "A4 (21 x 29.7 cm)"
  widthMm?: number;
  heightMm?: number;
  frameType: string;      // e.g. "Wall Art Frame", "Canvas Stretched", "Door Plaque", "Growth Chart"
  displayOrder: number;
  status: 'active' | 'inactive';
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image: string;
  dimensions?: string;
  personalizationDetails?: string; // Custom name, DOB, stats
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  notes?: string;
  giftWrap?: boolean;
  giftNote?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Dispatched'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  orderId: string;
  customerId?: string;           // ID of the logged-in CustomerUser who placed the order
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  giftWrapFee?: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'COD';
  paymentStatus: 'pending' | 'collected';
  orderStatus: OrderStatus;
  cancellationReason?: string;
  internalNotes?: string;
  courierTrackingNo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  promoId: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerImage?: string;
}

export type AdminRole = 'owner' | 'staff';

export interface AdminPermissions {
  orders: boolean;
  products: boolean;
  inventory: boolean;
  customers: boolean;
  analytics: boolean;
  settings: boolean;
}

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  assignedPermissions: AdminPermissions;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId?: string;
  productSlug?: string;
  orderId?: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  createdAt?: string;
  verified: boolean;
  productName?: string;
  status?: "pending" | "approved" | "rejected";
  customerId?: string;
  title?: string;
}

export interface CustomerMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
  replyText?: string;
  repliedAt?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  createdAt: string;
  address?: string;
  district?: string;
}

export type AuditAction =
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'VARIANT_ADDED'
  | 'VARIANT_UPDATED'
  | 'VARIANT_DELETED'
  | 'STOCK_ADJUSTED'
  | 'FEATURED_TOGGLED'
  | 'CATEGORY_CREATED'
  | 'CATEGORY_UPDATED'
  | 'CATEGORY_DELETED'
  | 'FRAME_SIZE_CREATED'
  | 'FRAME_SIZE_UPDATED'
  | 'FRAME_SIZE_DELETED'
  | 'SETTINGS_UPDATED';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: AuditAction;
  performedBy: {
    name: string;
    email: string;
    role: AdminRole;
  };
  targetType: 'product' | 'category' | 'frame_size' | 'inventory' | 'settings';
  targetId: string;
  targetName: string;
  details: string;
  metadata?: Record<string, any>;
}