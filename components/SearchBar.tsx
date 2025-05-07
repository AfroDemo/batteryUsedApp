import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ placeholder = 'Search for batteries...', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const animatedWidth = useSharedValue('100%');
  const opacity = useSharedValue(0);
  
  const handleFocus = () => {
    setIsFocused(true);
    opacity.value = withTiming(1, { duration: 200 });
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (query.length === 0) {
      opacity.value = withTiming(0, { duration: 200 });
    }
  };
  
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };
  
  const handleSearch = () => {
    onSearch(query);
    Keyboard.dismiss();
  };
  
  const handleSubmit = () => {
    onSearch(query);
    Keyboard.dismiss();
  };
  
  const clearButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, { width: animatedWidth }]}>
        <Search size={20} color="#64748B" style={styles.searchIcon} />
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          clearButtonMode="never"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {(query.length > 0 || isFocused) && (
          <Animated.View style={[styles.clearButton, clearButtonStyle]}>
            <TouchableOpacity onPress={handleClear} hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}>
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1E293B',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
});