import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard, Product } from '@/components/ui/ProductCard';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { CartIcon } from '@/components/CartIcon';
import { BATTERIES, CATEGORIES } from '@/constants/mockData';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleFavorite, isFavorite } = useFavorites();
  const { itemCount } = useCart();
  
  // Featured products - just a subset of all products
  const featuredProducts = BATTERIES.slice(0, 4).map(product => ({
    ...product,
    isFavorite: isFavorite(product.id)
  }));
  
  // Discounted products - only those with an original price
  const discountedProducts = BATTERIES.filter(product => 
    product.originalPrice !== undefined
  ).map(product => ({
    ...product,
    isFavorite: isFavorite(product.id)
  }));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      router.push(`/browse?search=${query}`);
    }
  };

  const handleFavoriteToggle = (productId: string) => {
    toggleFavorite(productId);
  };

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
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/browse')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map(category => (
            <CategoryCard 
              key={category.id} 
              category={category}
            />
          ))}
        </ScrollView>
        
        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push('/browse')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.productsContainer}>
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </View>
        
        {/* Discounted Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Deals</Text>
          <TouchableOpacity onPress={() => router.push('/browse?deals=true')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.productsContainer}>
          {discountedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  seeAllButton: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E40AF',
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  productsContainer: {
    gap: 16,
  },
});