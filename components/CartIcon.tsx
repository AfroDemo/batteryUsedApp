import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withSequence
} from 'react-native-reanimated';

interface CartIconProps {
  count?: number;
}

export function CartIcon({ count = 0 }: CartIconProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  
  // Set initial animation values
  React.useEffect(() => {
    if (count > 0) {
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [count, opacity]);
  
  // Animate when count changes
  React.useEffect(() => {
    if (count > 0) {
      scale.value = withSequence(
        withTiming(1.4, { duration: 200 }),
        withSpring(1)
      );
    }
  }, [count, scale]);
  
  const badgeStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/cart')}
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      <ShoppingCart color="#1E293B" size={24} />
      
      {count > 0 && (
        <Animated.View style={[styles.badge, badgeStyles]}>
          <Text style={styles.badgeText}>
            {count > 99 ? '99+' : count}
          </Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
});