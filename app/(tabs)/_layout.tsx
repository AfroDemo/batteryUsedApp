import { AuthGuard } from "@/components/AuthGuard";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { Tabs } from "expo-router";
import {
  Heart,
  Chrome as Home,
  Search,
  ShoppingBag,
  User,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <AuthGuard>
      <FavoritesProvider>
        <CartProvider>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: "#1E40AF",
              tabBarInactiveTintColor: "#64748B",
              tabBarLabelStyle: {
                fontFamily: "Inter-Medium",
                fontSize: 12,
                marginBottom: 4,
              },
              tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: "#E2E8F0",
                height: 60,
                paddingTop: 8,
              },
              headerShown: false,
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                  <Home size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="browse"
              options={{
                title: "Browse",
                tabBarIcon: ({ color, size }) => (
                  <Search size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="favorites"
              options={{
                title: "Favorites",
                tabBarIcon: ({ color, size }) => (
                  <Heart size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="cart"
              options={{
                title: "Cart",
                tabBarIcon: ({ color, size }) => (
                  <ShoppingBag size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <User size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </CartProvider>
      </FavoritesProvider>
    </AuthGuard>
  );
}
