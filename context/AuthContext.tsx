import api from "@/lib/api";
import { useRouter } from "expo-router"; // Assuming your api.ts file is in the root
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null; // Adjust type as needed
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const saveToken = async (newToken: string) => {
    await SecureStore.setItemAsync("token", newToken);
    setToken(newToken);
  };

  const clearToken = async () => {
    await SecureStore.deleteItemAsync("token");
    setToken(null);
  };

  const loadToken = async () => {
    const storedToken = await SecureStore.getItemAsync("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const response = await api.auth.getProfile(); // You'll need to implement this endpoint
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to load user profile", error);
        await clearToken(); // Clear invalid token
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await api.auth.login(email, password);
      await saveToken(response.token);
      setUser(response.user); // Make sure your API returns user data
      setIsAuthenticated(true);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      setError(error.message || "Login failed");
      throw error; // Re-throw for form handling
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await api.auth.register(data);
      await saveToken(response.token); // Assuming your register response has a 'token' field
      setUser(response.user); // Assuming your register response has a 'user' field
      setIsAuthenticated(true);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Handle registration error
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.auth.logout(); // Call your API logout endpoint
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally handle logout error
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      await clearToken();
      router.replace("/auth/login");
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <></> : children}{" "}
      {/* Render children only after checking for stored token */}
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
