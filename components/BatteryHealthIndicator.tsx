import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';

interface BatteryHealthIndicatorProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function BatteryHealthIndicator({ 
  percentage, 
  size = 'md',
  showLabel = true
}: BatteryHealthIndicatorProps) {
  const progress = useSharedValue(0);
  
  React.useEffect(() => {
    progress.value = withDelay(300, withTiming(percentage / 100, { 
      duration: 800,
      easing: Easing.bezier(0.16, 1, 0.3, 1) 
    }));
  }, [percentage, progress]);
  
  const animatedWidth = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });
  
  const getBarHeight = () => {
    switch (size) {
      case 'sm': return 8;
      case 'md': return 12;
      case 'lg': return 16;
      default: return 12;
    }
  };
  
  const getBarColor = () => {
    if (percentage >= 85) return '#22C55E'; // Green for good
    if (percentage >= 70) return '#FACC15'; // Yellow for okay
    return '#EF4444'; // Red for poor
  };
  
  const getLabelSize = () => {
    switch (size) {
      case 'sm': return 12;
      case 'md': return 14;
      case 'lg': return 16;
      default: return 14;
    }
  };
  
  const getHealthLabel = () => {
    if (percentage >= 85) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[
          styles.percentageLabel, 
          { fontSize: getLabelSize() }
        ]}>
          {percentage}%
        </Text>
        
        {showLabel && (
          <Text style={[
            styles.healthLabel,
            { fontSize: getLabelSize() - 2 }
          ]}>
            {getHealthLabel()}
          </Text>
        )}
      </View>
      
      <View 
        style={[
          styles.bar, 
          { height: getBarHeight() }
        ]}
      >
        <Animated.View 
          style={[
            styles.progress, 
            { backgroundColor: getBarColor() },
            animatedWidth
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  percentageLabel: {
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  healthLabel: {
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  bar: {
    width: '100%',
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 999,
  },
});