import { CartIcon } from "@/components/CartIcon";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { ApiError, Battery, Category } from "@/constants/types";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import api from "@/lib/api";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();
  const { itemCount } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Battery[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Battery[]>([]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim().length > 0) {
        router.push(`/browse?query=${encodeURIComponent(query)}`);
      }
    },
    [router]
  );

  const handleFavoriteToggle = useCallback(
    (productId: string) => {
      toggleFavorite(productId);
    },
    [toggleFavorite]
  );

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.home.getHomeData();
      setCategories(data.categories || []);
      setFeaturedProducts(data.featured_batteries || []);
      setDiscountedProducts(data.discounted_batteries?.data || []);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error.message || "An error occurred while fetching data"}
        </Text>
        <TouchableOpacity
          onPress={fetchHomeData}
          style={styles.retryButton}
          accessibilityLabel="Retry loading data"
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello there!</Text>
            <Text style={styles.title}>Find your battery</Text>
          </View>
          <CartIcon count={itemCount} />
        </View>

        <SearchBar onSearch={handleSearch} />

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Brands</Text>
          <TouchableOpacity
            onPress={() => router.push("/browse")}
            accessibilityLabel="View all brands"
            accessibilityRole="button"
          >
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>

        {categories.length === 0 ? (
          <Text style={styles.emptyStateText}>No brands available</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </ScrollView>
        )}

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity
            onPress={() => router.push("/browse?is_featured=true")}
            accessibilityLabel="View all featured products"
            accessibilityRole="button"
          >
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredProducts.length === 0 ? (
          <Text style={styles.emptyStateText}>
            No featured products available
          </Text>
        ) : (
          <View style={styles.productsContainer}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isFavorite(product.id.toString())}
              />
            ))}
          </View>
        )}
      </ScrollView>
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
  greeting: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#1E293B",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
  },
  seeAllButton: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E40AF",
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  productsContainer: {
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#1E40AF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
  emptyStateText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginVertical: 16,
  },
});
