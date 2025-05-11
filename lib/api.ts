import {
  ApiError,
  AuthResponse,
  HomePageData,
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

// Auth endpoints
export const auth = {
  login: (data: LoginData): Promise<AuthResponse> =>
    api.post("/auth/login", data),

  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post("/auth/register", data),

  logout: (): Promise<{ success: boolean }> => api.post("/auth/logout"),

  forgotPassword: (email: string): Promise<{ success: boolean }> =>
    api.post("/auth/forgot-password", { email }),

  verifyToken: (): Promise<{ valid: boolean }> => api.get("/auth/verify-token"),

  adminDashboard: (): Promise<{
    total_users: number;
    total_batteries: number;
    total_orders: number;
    total_revenue: number;
    recent_users: Array<{ id: string; name: string; email: string; role: string; created_at: string }>;
    recent_orders: Array<any>;
  }> => api.get("/auth/admin/dashboard"),
};

// User endpoints
export const users = {
  getProfile: (): Promise<UserProfile> => api.get("/users/profile"),

  updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> =>
    api.put("/users/profile", data),

  changePassword: (data: PasswordChangeData): Promise<{ success: boolean }> =>
    api.put("/users/password", data),

  deleteAccount: (): Promise<{ success: boolean }> =>
    api.delete("/users/account"),
};

// Products endpoints
export const products = {
  getAll: (params?: {
    search?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => api.get("/products", { params }),

  getById: (id: string) => api.get(`/products/${id}`),

  getFavorites: () => api.get("/products/favorites"),

  toggleFavorite: (productId: string) =>
    api.post(`/products/${productId}/favorite`),
};

// Cart endpoints
export const cart = {
  get: () => api.get("/cart"),

  addItem: (productId: string, quantity: number) =>
    api.post("/cart/items", { productId, quantity }),

  updateItem: (productId: string, quantity: number) =>
    api.put(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId: string) => api.delete(`/cart/items/${productId}`),

  clear: () => api.delete("/cart"),
};

// Orders endpoints
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

export const home = {
  getHomeData: (): Promise<HomePageData> => api.get("/home"),
};

export default {
  auth,
  users,
  products,
  cart,
  orders,
  home,
};