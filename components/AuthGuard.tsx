import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;

  return <>{children}</>;
};