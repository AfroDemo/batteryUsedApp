import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Battery } from "@/constants/types";
import { useFavorites } from "@/context/FavoritesContext";
import { products } from "@/lib/api";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Battery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorite products
  useEffect(() => {
    async function fetchFavoriteProducts() {
      try {
        setIsLoading(true);
        setError(null);
        if (favorites.length === 0) {
          setFavoriteProducts([]);
          return;
        }
        const productsData = await Promise.all(
          favorites.map((id) => products.getById(id))
        );
        setFavoriteProducts(productsData);
      } catch (err: any) {
        console.error("Failed to fetch favorite products:", err);
        setError(err.message || "Failed to load favorite products");
        Alert.alert("Error", err.message || "Failed to load favorite products");
      } finally {
        setIsLoading(false);
      }
    }
    fetchFavoriteProducts();
  }, [favorites]);

  const handleFavoriteToggle = async (productId: string) => {
    try {
      await toggleFavorite(productId);
    } catch (err: any) {
      // Error is handled in FavoritesProvider via Alert
    }
  };

  const handleClearFavorites = async () => {
    try {
      await clearFavorites();
    } catch (err: any) {
      // Error is handled in FavoritesProvider via Alert
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Error</Text>
          <Text style={styles.emptyStateText}>{error}</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.browseButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Favorites</Text>
          {favoriteProducts.length > 0 && (
            <TouchableOpacity onPress={handleClearFavorites}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {favoriteProducts.length > 0 ? (
            <View style={styles.productsContainer}>
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Heart size={64} color="#E2E8F0" />
              <Text style={styles.emptyStateTitle}>No favorites yet</Text>
              <Text style={styles.emptyStateText}>
                Add items to your favorites to see them here
              </Text>
              <Button
                title="Browse Products"
                onPress={() => router.push("/browse")}
                style={styles.browseButton}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#1E293B",
  },
  clearButton: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#EF4444",
  },
  scrollContent: {
    flexGrow: 1,
  },
  productsContainer: {
    gap: 16,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    width: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
