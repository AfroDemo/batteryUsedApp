import React from 'react';
import { 
  StyleSheet, 
  View, 
  ViewStyle, 
  TouchableOpacity,
  StyleProp
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function Card({
  children,
  style,
  onPress,
  elevation = 'sm',
  rounded = 'md'
}: CardProps) {
  const scale = useSharedValue(1);
  
  const handlePressIn = () => {
    if (onPress) {
      scale.value = withTiming(0.98, { duration: 100 });
    }
  };
  
  const handlePressOut = () => {
    if (onPress) {
      scale.value = withTiming(1, { duration: 200 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const getElevationStyle = (): ViewStyle => {
    switch (elevation) {
      case 'none':
        return {};
      case 'sm':
        return styles.shadowSm;
      case 'md':
        return styles.shadowMd;
      case 'lg':
        return styles.shadowLg;
      default:
        return styles.shadowSm;
    }
  };

  const getRoundedStyle = (): ViewStyle => {
    switch (rounded) {
      case 'none':
        return { borderRadius: 0 };
      case 'sm':
        return { borderRadius: 4 };
      case 'md':
        return { borderRadius: 8 };
      case 'lg':
        return { borderRadius: 12 };
      case 'full':
        return { borderRadius: 9999 };
      default:
        return { borderRadius: 8 };
    }
  };

  const Container = onPress ? Animated.View : View;
  const cardStyles = [
    styles.card,
    getElevationStyle(),
    getRoundedStyle(),
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={[animatedStyle]}>
        <TouchableOpacity
          style={cardStyles}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
});