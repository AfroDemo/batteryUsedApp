import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

// Mock admin check - replace with your actual auth logic
const isAdmin = true;

export default function AdminLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check admin status
    if (!isAdmin) {
      router.replace("/auth/login");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1E40AF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "Inter-SemiBold",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: "Dashboard",
        }}
      />
      <Stack.Screen
        name="products/index"
        options={{
          title: "Manage Products",
        }}
      />
      <Stack.Screen
        name="products/new"
        options={{
          title: "Add Product",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="products/[id]"
        options={{
          title: "Edit Product",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
