import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const { isAuthenticated, initialized, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized) {
      if (isAuthenticated) {
        router.replace(
          user?.role === "admin" ? "/admin/home" : "/(tabs)/home"
        );
      }
    }
  }, [isAuthenticated, initialized, user]);

  if (!initialized) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return null;
}
