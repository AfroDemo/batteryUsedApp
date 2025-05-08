// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin" | "support";
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  phone_number?: string;
  address?: string;
  avatar_url?: string;
  preferences?: {
    newsletter_subscription?: boolean;
    dark_mode?: boolean;
  };
}

export interface HomePageBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  type: 'primary' | 'secondary' | 'promotional';
}

export interface LoginData {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  expires_at?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// Battery-related Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  batteries_count: number;
}

export interface Battery {
  isFavorite: boolean;
  capacityPercentage: number;
  originalPrice: any;
  imageUrl: string | undefined;
  id: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  original_price?: string | null;
  discount_percentage: number;
  is_on_sale: boolean;
  is_featured: boolean;
  image_url: string;
  compatibility?: string | null;
  capacity: string;
  voltage: string;
  warranty: string;
  features: string[];
  capacity_percentage: number;
  category: Category;
  created_at: string;
}

export interface BatterySearchParams {
  query?: string;
  brand?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  min_capacity?: number;
  max_capacity?: number;
  is_on_sale?: boolean;
  sort_by?:
    | "price"
    | "created_at"
    | "capacity_percentage"
    | "discount_percentage";
  sort_direction?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

export interface HomePageData {
  featured_batteries: Battery[];
  discounted_batteries: Battery[];
  categories: Category[];
}

// Order-related Types
export interface OrderItem {
  id: number;
  battery_id: number;
  battery: Battery;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// Cart-related Types
export interface CartItem {
  battery_id: number;
  battery: Battery;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: string;
}

// Error Handling
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Password Management
export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Wishlist Types
export interface WishlistItem {
  id: number;
  battery_id: number;
  battery: Battery;
  added_at: string;
}

export interface Wishlist {
  items: WishlistItem[];
  total_items: number;
}

// Review Types
export interface BatteryReview {
  id: number;
  battery_id: number;
  user_id: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewSubmission {
  battery_id: number;
  rating: number;
  comment?: string;
}
