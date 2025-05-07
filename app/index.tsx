import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const { isAuthenticated, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized) {
      router.replace(isAuthenticated ? "/(tabs)/home" : "/auth/login");
    }
  }, [isAuthenticated, initialized]);

  if (!initialized) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return null;
}
