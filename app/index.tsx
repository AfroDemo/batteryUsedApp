import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  // Optional: Add a loading spinner instead of returning null
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return null;
}
