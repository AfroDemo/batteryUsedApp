import { BatteryHealthIndicator } from "@/components/BatteryHealthIndicator";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { products } from "@/lib/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const heartScale = useSharedValue(1);

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [productIsFavorite, setProductIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setError("Invalid product ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await products.getById(id);
        setProduct(response);
        setProductIsFavorite(isFavorite(id));
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id, isFavorite]);

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  const handleFavoritePress = () => {
    heartScale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1, { duration: 150 }, () => {
        runOnJS(toggleFavoriteState)();
      })
    );
  };

  const toggleFavoriteState = () => {
    if (product) {
      toggleFavorite(product.id);
      setProductIsFavorite(!productIsFavorite);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      router.push("/cart");
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Product not found"}</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFavoritePress}
            >
              <Animated.View style={animatedHeartStyle}>
                <Heart
                  size={24}
                  color={productIsFavorite ? "#F43F5E" : "#1E293B"}
                  fill={productIsFavorite ? "#F43F5E" : "transparent"}
                />
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image_url }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.productName}>{product.name}</Text>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                TzS {parseFloat(product.price).toFixed(2)}
              </Text>
              {product.original_price && (
                <Text style={styles.originalPrice}>
                  TzS {parseFloat(product.original_price).toFixed(2)}
                </Text>
              )}
            </View>

            <View style={styles.compatibilityContainer}>
              <Text style={styles.compatibilityLabel}>Compatible with:</Text>
              <Text style={styles.compatibilityValue}>
                {product.compatibility}
              </Text>
            </View>

            <View style={styles.healthContainer}>
              <Text style={styles.healthLabel}>Battery Health:</Text>
              <BatteryHealthIndicator
                percentage={product.capacity_percentage}
                size="lg"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Capacity</Text>
                <Text style={styles.specValue}>{product.capacity}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Voltage</Text>
                <Text style={styles.specValue}>{product.voltage}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Warranty</Text>
                <Text style={styles.specValue}>{product.warranty}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Features</Text>
              {JSON.parse(product.features).map(
                (feature: string, index: number) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus size={20} color={quantity <= 1 ? "#CBD5E1" : "#1E293B"} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={increaseQuantity}
            >
              <Plus size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          <Button
            title="Add to Cart"
            onPress={handleAddToCart}
            style={styles.addToCartButton}
            icon={<ShoppingBag size={20} color="white" />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
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
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    backgroundColor: "white",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  infoContainer: {
    paddingHorizontal: 16,
  },
  brand: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  productName: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#1E293B",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#1E40AF",
    marginRight: 8,
  },
  originalPrice: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  compatibilityContainer: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  compatibilityLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  compatibilityValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E293B",
  },
  healthContainer: {
    marginBottom: 24,
  },
  healthLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 12,
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  specLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#64748B",
  },
  specValue: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#1E293B",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1E40AF",
    marginRight: 8,
  },
  featureText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#475569",
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewAuthor: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#1E293B",
  },
  reviewDate: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#94A3B8",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewComment: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#475569",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E293B",
    width: 30,
    textAlign: "center",
  },
  addToCartButton: {
    flex: 1,
  },
});
