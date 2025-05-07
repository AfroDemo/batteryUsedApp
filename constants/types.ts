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