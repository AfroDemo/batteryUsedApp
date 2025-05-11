// src/api/index.ts
import {
  ApiError,
  LoginData,
  PasswordChangeData,
  RegisterData,
  UserProfile,
} from "@/constants/types";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://192.168.22.4:8001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (unchanged)
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject<ApiError>({
      message: "Request setup failed",
      status: 0,
    });
  }
);

// Response interceptor (unchanged)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const apiError: ApiError = {
      message: "An unexpected error occurred",
      status: 500,
    };

    if (error.response) {
      apiError.message = error.response.data?.message || error.message;
      apiError.status = error.response.status;
      apiError.errors = error.response.data?.errors;
    } else if (error.request) {
      apiError.message = "No response from server";
      apiError.status = 0;
    }

    return Promise.reject(apiError);
  }
);

// Auth endpoints (unchanged)
export const auth = {
  login: (data: LoginData) => api.post("/auth/login", data),
  register: (data: RegisterData) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  verifyToken: () => api.get("/auth/verify-token"),
  adminDashboard: () => api.get("/auth/admin/dashboard"),
};

// User endpoints (unchanged)
export const users = {
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data: Partial<UserProfile>) => api.put("/auth/profile", data),
  changePassword: (data: PasswordChangeData) =>
    api.put("/users/password", data),
  deleteAccount: () => api.delete("/users/account"),
};

// Products endpoints (unchanged)
export const products = {
  getAll: (params?: {
    query?: string;
    brand?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    min_capacity_percentage?: number;
    is_featured?: boolean;
    compatibility?: string;
    sort_by?:
      | "price"
      | "created_at"
      | "capacity_percentage"
      | "discount_percentage";
    sort_direction?: "asc" | "desc";
    page?: number;
    per_page?: number;
  }) => api.get("/search", { params }),
  getById: (id: string) => api.get(`/batteries/${id}`),
  create: (data: {
    name: string;
    brand: string;
    price: number;
    original_price?: number;
    compatibility?: string[];
    capacity_percentage?: number;
    capacity?: string;
    voltage?: string;
    warranty?: string;
    description?: string;
    features?: string[];
    image_url?: string;
    category_id?: number;
    is_featured?: boolean;
  }) => api.post("/batteries", data),
  update: (
    id: string,
    data: {
      name: string;
      brand: string;
      price: number;
      original_price?: number;
      compatibility?: string[];
      capacity_percentage?: number;
      capacity?: string;
      voltage?: string;
      warranty?: string;
      description?: string;
      features?: string[];
      image_url?: string;
      category_id?: number;
      is_featured?: boolean;
    }
  ) => api.put(`/batteries/${id}`, data),
  delete: (id: string) => api.delete(`/batteries/${id}`),
  getBrands: () => api.get("/brands"),
  getByBrand: (brand: string) => api.get(`/batteries/brand/${brand}`),
  getCompatible: (device: string) => api.get(`/batteries/compatible/${device}`),
};

// Cart endpoints (unchanged)
export const cart = {
  get: () => api.get("/cart"),
  addItem: (productId: string, quantity: number) =>
    api.post("/cart/items", { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    api.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId: string) => api.delete(`/cart/items/${productId}`),
  clear: () => api.delete("/cart"),
};

// Orders endpoints (unchanged)
export const orders = {
  create: (data: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }) => api.post("/orders", data),
  getAll: () => api.get("/orders"),
  getById: (id: string) => api.get(`/orders/${id}`),
};

// Home endpoint (unchanged)
export const home = {
  getHomeData: () => api.get("/home"),
};

// Favorites endpoints
export const favorite = {
  get: () => api.get("/favorites"),
  add: (productId: string) => api.post("/favorites", { productId }),
  remove: (productId: string) => api.delete(`/favorites/${productId}`),
  clear: () => api.delete("/favorites"),
};

export default {
  auth,
  users,
  products,
  cart,
  orders,
  home,
  favorite,
};
