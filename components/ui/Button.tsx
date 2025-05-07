import React from 'react';
import { 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const scale = useSharedValue(1);
  
  // Animation for button press
  const handlePressIn = () => {
    scale.value = withTiming(0.95, { 
      duration: 100,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { 
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Determine button styles based on variant
  const getButtonStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determine text styles based on variant
  const getTextStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  // Determine button size styles
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.smallButton;
      case 'md':
        return styles.mediumButton;
      case 'lg':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Determine text size styles
  const getTextSizeStyles = (): TextStyle => {
    switch (size) {
      case 'sm':
        return styles.smallText;
      case 'md':
        return styles.mediumText;
      case 'lg':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          getButtonStyles(),
          getSizeStyles(),
          disabled && styles.disabledButton,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? 'white' : '#1E40AF'} />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <Text
              style={[
                styles.text,
                getTextStyles(),
                getTextSizeStyles(),
                disabled && styles.disabledText,
                textStyle,
                icon && (iconPosition === 'left' ? { marginLeft: 8 } : { marginRight: 8 }),
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1E40AF', // Deep blue
  },
  secondaryButton: {
    backgroundColor: '#E0F2FE', // Light blue
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#1E40AF',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  text: {
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#1E40AF',
  },
  outlineText: {
    color: '#1E40AF',
  },
  ghostText: {
    color: '#1E40AF',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    borderColor: '#D1D5DB',
  },
  disabledText: {
    color: '#6B7280',
  },
});