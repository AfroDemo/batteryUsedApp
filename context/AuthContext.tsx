import { AuthContextType, User } from "@/constants/types";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        setToken(storedToken);
        const response = await api.users.getProfile(); // Changed from auth to users
        setUser(response);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to load user profile", error);
      await clearToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.auth.login({ email, password }); // Match your API signature
      await saveToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      setError(error.message || "Login failed");
      throw error;
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
    setError(null);
    try {
      const response = await api.auth.register(data);
      await saveToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      setError(error.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.auth.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      await clearToken();
      router.replace("/auth/login");
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      token,
      error,
      loading,
      login,
      register,
      logout,
    }),
    [isAuthenticated, user, token, error, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
