export interface UserProfile {
  id: string;
  name: string;
  email: string;
  // Add other profile fields
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string>;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    // Add other user fields as needed
  };
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null; // Adjust type as needed
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}
