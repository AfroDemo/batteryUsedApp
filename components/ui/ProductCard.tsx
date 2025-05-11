import { Battery } from "@/constants/types";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Card } from "./Card";

interface ProductCardProps {
  product: Battery;
  onFavoriteToggle?: (id: string) => void;
}

export function ProductCard({ product, onFavoriteToggle }: ProductCardProps) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const heartScale = useSharedValue(1);
  const [isFavoriteState, setIsFavoriteState] = React.useState(
    isFavorite(product.id)
  );

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  const handleFavoritePress = async () => {
    heartScale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1, { duration: 150 }, () => {
        runOnJS(toggleFavoriteState)();
      })
    );
  };

  const toggleFavoriteState = async () => {
    try {
      await toggleFavorite(product.id);
      setIsFavoriteState(!isFavoriteState);
      if (onFavoriteToggle) {
        onFavoriteToggle(product.id);
      }
    } catch (err) {
      // Error is handled in FavoritesProvider via Alert
    }
  };

  const getBatteryHealthColor = () => {
    if (product.capacity_percentage >= 85) return "#22C55E";
    if (product.capacity_percentage >= 70) return "#FACC15";
    return "#EF4444";
  };

  const getDiscountPercentage = () => {
    if (!product.original_price) return null;
    const originalPrice = parseFloat(product.original_price.replace(/,/g, ""));
    const price = parseFloat(product.price.replace(/,/g, ""));
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return Math.round(discount);
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <Card
      onPress={() => router.push(`/product/${product.id}`)}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image_url }} style={styles.image} />
        {discountPercentage && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercentage}%</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <Animated.View style={animatedHeartStyle}>
            <Heart
              size={22}
              color={isFavoriteState ? "#F43F5E" : "#94A3B8"}
              fill={isFavoriteState ? "#F43F5E" : "transparent"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.compatibility}>
          <Text style={styles.compatibilityText} numberOfLines={1}>
            For: {product.compatibility}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.original_price && (
              <Text style={styles.originalPrice}>
                ${product.original_price}
              </Text>
            )}
          </View>

          <View style={styles.batteryHealth}>
            <View
              style={[
                styles.batteryIndicator,
                { backgroundColor: getBatteryHealthColor() },
              ]}
            />
            <Text style={styles.batteryText}>
              {product.capacity_percentage}%
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

// Styles (unchanged)
const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    backgroundColor: "#F8FAFC",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: "white",
    fontFamily: "Inter-Bold",
    fontSize: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 12,
  },
  brand: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  name: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 8,
    height: 44,
  },
  compatibility: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  compatibilityText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#475569",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#1E40AF",
  },
  originalPrice: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#94A3B8",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  batteryHealth: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  batteryText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#64748B",
  },
});
