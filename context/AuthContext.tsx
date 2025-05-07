import {
  AuthContextType,
  AuthResponse,
  RegisterData,
  User,
} from "@/constants/types";
import api from "@/lib/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
    initialized: false,
  });

  const router = useRouter();

  const saveAuthData = async (token: string, user: User) => {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    setAuthState(prev => ({
      ...prev,
      token,
      user,
      isAuthenticated: true
    }));
  };

  const clearAuthData = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    setAuthState(prev => ({
      ...prev,
      token: null,
      user: null,
      isAuthenticated: false
    }));
  };

  const loadAuthData = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        SecureStore.getItemAsync("token"),
        SecureStore.getItemAsync("user"),
      ]);

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);
        // Verify token is still valid
        const isValid = await verifyToken(storedToken);
        
        if (isValid) {
          setAuthState({
            isAuthenticated: true,
            user,
            token: storedToken,
            loading: false,
            error: null,
            initialized: true,
          });
          return;
        }
      }
      
      // If no valid token/user found
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        loading: false,
        initialized: true,
      }));
    } catch (error) {
      console.error("Failed to load auth data:", error);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        loading: false,
        initialized: true,
      }));
    }
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      await api.auth.verifyToken(); // Assuming you have this endpoint
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response: AuthResponse = await api.auth.login({ email, password });
      
      if (!response?.token || !response?.user) {
        throw new Error("Invalid response from server");
      }

      await saveAuthData(response.token, response.user);
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: response.user,
        error: null,
      }));
      
      router.replace("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const register = async (data: RegisterData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response: AuthResponse = await api.auth.register(data);
      
      if (!response?.token || !response?.user) {
        throw new Error("Invalid response from server");
      }

      await saveAuthData(response.token, response.user);
      
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: response.user,
        error: null,
      }));
      
      router.replace("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (error?.response?.data?.errors) {
        const backendErrors = Object.values(error.response.data.errors).flat();
        errorMessage = backendErrors.join("\n");
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setAuthState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      await api.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await clearAuthData();
      router.replace("/auth/login");
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const value = useMemo(() => ({
    ...authState,
    login,
    register,
    logout,
  }), [authState]);

  return (
    <AuthContext.Provider value={value}>
      {authState.initialized ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};