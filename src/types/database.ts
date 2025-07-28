// VenturesRoom Database Types

// Enums
export type UserRole = "client" | "startup" | "structure" | "admin";
export type LinkStatus = "pending" | "accepted" | "rejected";
export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";
export type StructureType =
  | "incubator"
  | "accelerator"
  | "investor"
  | "mentor"
  | "consultant";

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// User entity
export interface AuthUser extends BaseEntity {
  email: string;
  full_name: string;
  phone?: string;
  country?: string;
  role: UserRole;
  avatar_url?: string;
  is_approved: boolean;
  bio?: string;
  website?: string;
  linkedin_url?: string;
}

// Startup entity
export interface Startup extends BaseEntity {
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  founded_date?: string;
  industry?: string;
  stage?: string;
  location?: string;
  team_size?: number;
  created_by: string;
  is_approved: boolean;
  total_funding: number;
}

// Product entity
export interface Product extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  features?: string[];
  startup_id: string;
  is_active: boolean;
  stock_quantity: number;
}

// Structure entity
export interface Structure extends BaseEntity {
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  structure_type: StructureType;
  location?: string;
  established_year?: number;
  focus_areas?: string[];
  created_by: string;
  is_approved: boolean;
}

// Startup-Structure Link entity
export interface StartupStructureLink extends BaseEntity {
  startup_id: string;
  structure_id: string;
  status: LinkStatus;
  invited_by: string;
  invitation_message?: string;
  response_message?: string;
  invited_at: string;
  responded_at?: string;
}

// Commission entity
export interface Commission extends BaseEntity {
  startup_id: string;
  structure_id: string;
  percentage: number;
  is_active: boolean;
}

// Support Link entity
export interface SupportLink extends BaseEntity {
  startup_id: string;
  url: string;
  label: string;
  icon?: string;
  order_index: number;
}

// Client Order entity
export interface ClientOrder extends BaseEntity {
  client_id: string;
  product_id: string;
  startup_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: OrderStatus;
  order_notes?: string;
}

// VIP Club Discount entity
export interface VipClubDiscount extends BaseEntity {
  startup_id: string;
  discount_code?: string;
  percentage_discount: number;
  max_uses?: number;
  used_count: number;
  valid_until?: string;
  is_active: boolean;
}

// Commission Payment entity
export interface CommissionPayment extends BaseEntity {
  order_id: string;
  structure_id: string;
  startup_id: string;
  commission_rate: number;
  commission_amount: number;
  is_paid: boolean;
  paid_at?: string;
}

// Notification entity
export interface Notification extends BaseEntity {
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_id?: string;
}

// Extended entities with relations
export interface StartupWithProducts extends Startup {
  products?: Product[];
  support_links?: SupportLink[];
  user?: AuthUser;
}

export interface ProductWithStartup extends Product {
  startup?: Startup;
}

export interface ClientOrderWithDetails extends ClientOrder {
  product?: Product;
  startup?: Startup;
}

export interface StartupStructureLinkWithDetails extends StartupStructureLink {
  startup?: Startup;
  structure?: Structure;
  invited_by_user?: AuthUser;
}

export interface CommissionWithDetails extends Commission {
  startup?: Startup;
  structure?: Structure;
}

// KPI and dashboard data types
export interface StartupKPIs {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  commissionPaid: number;
  structuresLinked: number;
  topSellingProduct?: Product;
  activeDiscounts: number;
  averageProductPrice: number;
}

export interface StructureKPIs {
  startupsSupported: number;
  invitationsSent: number;
  invitationsPending: number;
  invitationsAccepted: number;
  totalCommissionsEarned: number;
  totalProductsFromStartups: number;
  ordersFromSupportedStartups: number;
  mostActiveStartup?: Startup;
  averageStartupResponseTime: number;
  averageCommissionRate: number;
}

export interface AdminKPIs {
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
  totalStartups: number;
  totalStructures: number;
  totalProducts: number;
  totalOrders: number;
  globalRevenue: number;
  globalCommissions: number;
  signupsThisMonth: number;
  mostActiveStartup?: Startup;
  vipDiscountsIssued: number;
  activeStructureStartupLinks: number;
}

export interface ClientKPIs {
  totalOrders: number;
  totalAmountSpent: number;
  discountsUsed: number;
  totalSavings: number;
  favoriteStartup?: Startup;
  averageBasketValue: number;
  lastOrderDate?: string;
}

// Request/Response types
export interface CreateStartupRequest {
  name: string;
  description?: string;
  website?: string;
  founded_date?: string;
  industry?: string;
  stage?: string;
  location?: string;
  team_size?: number;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
  features?: string[];
  stock_quantity?: number;
}

export interface CreateStructureRequest {
  name: string;
  description?: string;
  website?: string;
  structure_type: StructureType;
  location?: string;
  established_year?: number;
  focus_areas?: string[];
}

export interface CreateInvitationRequest {
  startup_id: string;
  invitation_message?: string;
}

export interface RespondToInvitationRequest {
  status: "accepted" | "rejected";
  response_message?: string;
}

export interface CreateOrderRequest {
  product_id: string;
  quantity: number;
  discount_code?: string;
}

export interface CreateCommissionRequest {
  startup_id: string;
  percentage: number;
}

export interface CreateVipDiscountRequest {
  discount_code?: string;
  percentage_discount: number;
  max_uses?: number;
  valid_until?: string;
}

// Filter and search types
export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  startup_id?: string;
  search?: string;
}

export interface StartupFilters {
  industry?: string;
  stage?: string;
  location?: string;
  is_approved?: boolean;
  search?: string;
}

export interface StructureFilters {
  structure_type?: StructureType;
  location?: string;
  focus_areas?: string[];
  is_approved?: boolean;
  search?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  start_date?: string;
  end_date?: string;
  startup_id?: string;
  client_id?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Dashboard data aggregation types
export interface DashboardStats {
  period: "day" | "week" | "month" | "year";
  revenue: number;
  orders: number;
  users: number;
  growth: number;
}

export interface RevenueChart {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopPerformer {
  id: string;
  name: string;
  value: number;
  change: number;
}

// File upload types
export interface FileUploadResponse {
  url: string;
  path: string;
  fullPath: string;
}

// Search and pagination types
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Utility types
export type PartialUpdate<T> = Partial<
  Omit<T, "id" | "created_at" | "updated_at">
>;

export interface DateRange {
  start: string;
  end: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}
