export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type UserRole = "owner" | "manager" | "cashier" | "kitchen" | "delivery" | "support";

export type Permission =
  | "products.read" | "products.create" | "products.update" | "products.delete"
  | "orders.read" | "orders.update" | "orders.cancel"
  | "customers.read" | "customers.update"
  | "coupons.manage" | "payments.read" | "payments.update"
  | "reports.read" | "team.manage" | "settings.manage" | "store.manage";

export interface User {
  id: string;
  firebase_uid: string;
  store_id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  status: "active" | "inactive";
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: "open" | "closed" | "paused";
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  sale_price: number;
  cost_price?: number;
  promotional_price?: number;
  stock_quantity?: number;
  manage_stock: boolean;
  min_stock_alert?: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  category_id?: string;
  category?: Category;
  created_at: string;
}

export type OrderStatus =
  | "pending" | "accepted" | "preparing" | "ready"
  | "out_for_delivery" | "delivered" | "completed"
  | "canceled" | "refunded";

export type PaymentMethod =
  | "cash" | "pix" | "card_on_delivery" | "card_online" | "transfer" | "other";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  notes?: string;
  addons?: { name: string; price: number }[];
  variation?: { name: string; price: number };
}

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Order {
  id: string;
  order_number?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  order_type: "delivery" | "pickup" | "dine_in";
  customer_name: string;
  customer_phone?: string;
  customer_id?: string;
  delivery_address?: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  delivery_fee?: number;
  total: number;
  coupon_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  total_orders?: number;
  total_spent?: number;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_value?: number;
  max_discount?: number;
  usage_limit?: number;
  usage_count: number;
  starts_at?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: Permission[];
  status: "active" | "inactive";
  created_at: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  min_order?: number;
  estimated_time?: string;
  is_active: boolean;
}

export interface Banner {
  id: string;
  title?: string;
  image_url: string;
  link_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DashboardData {
  orders_today: number;
  revenue_today: number;
  active_products: number;
  pending_orders: number;
  recent_orders?: Order[];
}

export interface SalesReport {
  period: string;
  total_orders: number;
  total_revenue: number;
  avg_ticket: number;
  data: { date: string; orders: number; revenue: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
