import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { Card } from './Card'
import { Battery } from '@/constants/types';

interface ProductCardProps {
  product: Battery;
  onFavoriteToggle?: (id: string) => void;
}

export function ProductCard({ product, onFavoriteToggle }: ProductCardProps) {
  const router = useRouter();
  const heartScale = useSharedValue(1);
  const [isFavorite, setIsFavorite] = React.useState(product.isFavorite || false);

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  const handleFavoritePress = () => {
    heartScale.value = withSequence(
      withTiming(1.3, { duration: 150 }),
      withTiming(1, { duration: 150 }, () => {
        runOnJS(toggleFavorite)();
      })
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onFavoriteToggle) {
      onFavoriteToggle(product.id);
    }
  };

  const getBatteryHealthColor = () => {
    if (product.capacityPercentage >= 85) return '#22C55E'; // Green for good
    if (product.capacityPercentage >= 70) return '#FACC15'; // Yellow for okay
    return '#EF4444'; // Red for poor
  };

  const getDiscountPercentage = () => {
    if (!product.originalPrice) return null;
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return Math.round(discount);
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <Card onPress={() => router.push(`/product/${product.id}`)} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
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
              color={isFavorite ? "#F43F5E" : "#94A3B8"} 
              fill={isFavorite ? "#F43F5E" : "transparent"} 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        <View style={styles.compatibility}>
          <Text style={styles.compatibilityText} numberOfLines={1}>
            For: {product.compatibility}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
            )}
          </View>
          
          <View style={styles.batteryHealth}>
            <View style={[
              styles.batteryIndicator, 
              { backgroundColor: getBatteryHealthColor() }
            ]} />
            <Text style={styles.batteryText}>{product.capacityPercentage}%</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#F8FAFC',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  brand: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
    height: 44, // Limit to 2 lines
  },
  compatibility: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  compatibilityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#475569',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1E40AF',
  },
  originalPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  batteryHealth: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  batteryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
  },
});