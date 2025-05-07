import { 
  AuthContextType, 
  AuthResponse, 
  User, 
  LoginData, 
  RegisterData 
} from "@/constants/types";
import api from "@/lib/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useMemo, 
  useState 
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
  }>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  const router = useRouter();

  const saveToken = async (newToken: string) => {
    await SecureStore.setItemAsync("token", newToken);
    setAuthState(prev => ({ ...prev, token: newToken }));
  };

  const clearToken = async () => {
    await SecureStore.deleteItemAsync("token");
    setAuthState(prev => ({ ...prev, token: null }));
  };

  const loadToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        const response = await api.users.getProfile();
        setAuthState(prev => ({
          ...prev,
          token: storedToken,
          user: response,
          isAuthenticated: true,
        }));
      }
    } catch (error: any) {
      console.error("Failed to load user profile", error);
      await clearToken();
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response: AuthResponse = await api.auth.login({ email, password });
      await saveToken(response.token);
      setAuthState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
      }));
      router.replace("/(tabs)/home");
    } catch (error: any) {
      const errorMessage = error.message || "Login failed";
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
      await saveToken(response.token);
      setAuthState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
      }));
      router.replace("/(tabs)/home");
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed";
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
      console.error("Logout failed:", error);
    } finally {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));
      await clearToken();
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
      {!authState.loading && children}
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