import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { ProductCard } from '@/components/ui/ProductCard';
import { BATTERIES } from '@/constants/mockData';
import { useFavorites } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/Button';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  
  // Get the products that are favorited
  const favoriteProducts = BATTERIES
    .filter(product => favorites.includes(product.id))
    .map(product => ({
      ...product,
      isFavorite: true
    }));
  
  const handleFavoriteToggle = (productId: string) => {
    toggleFavorite(productId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Favorites</Text>
          {favoriteProducts.length > 0 && (
            <TouchableOpacity onPress={clearFavorites}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {favoriteProducts.length > 0 ? (
            <View style={styles.productsContainer}>
              {favoriteProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Heart size={64} color="#E2E8F0" />
              <Text style={styles.emptyStateTitle}>No favorites yet</Text>
              <Text style={styles.emptyStateText}>
                Add items to your favorites to see them here
              </Text>
              <Button 
                title="Browse Products" 
                onPress={() => router.push('/browse')}
                style={styles.browseButton}
              />
            </View>
          )}
        </ScrollView>
      </View>
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
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1E293B',
  },
  clearButton: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#EF4444',
  },
  scrollContent: {
    flexGrow: 1,
  },
  productsContainer: {
    gap: 16,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    width: 200,
  },
});