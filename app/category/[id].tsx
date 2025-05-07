import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { BATTERIES, CATEGORIES } from '@/constants/mockData';
import { ProductCard } from '@/components/ui/ProductCard';
import { useFavorites } from '@/context/FavoritesContext';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // Simulate loading data
    const timeout = setTimeout(() => {
      if (id) {
        const foundCategory = CATEGORIES.find(c => c.id === id);
        if (foundCategory) {
          setCategory(foundCategory);
          
          // Filter products by category - this is simplified
          // In a real app, you'd match by actual category IDs
          let filteredProducts = BATTERIES;
          if (id === 'apple') {
            filteredProducts = BATTERIES.filter(product => 
              product.compatibility.toLowerCase().includes('iphone')
            );
          } else if (id === 'samsung') {
            filteredProducts = BATTERIES.filter(product => 
              product.compatibility.toLowerCase().includes('samsung')
            );
          } else if (id === 'google') {
            filteredProducts = BATTERIES.filter(product => 
              product.compatibility.toLowerCase().includes('pixel')
            );
          } else if (id === 'oneplus') {
            filteredProducts = BATTERIES.filter(product => 
              product.compatibility.toLowerCase().includes('oneplus')
            );
          }
          
          // Add isFavorite property
          const productsWithFavorites = filteredProducts.map(product => ({
            ...product,
            isFavorite: isFavorite(product.id)
          }));
          
          setProducts(productsWithFavorites);
        }
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [id, isFavorite]);

  const handleFavoriteToggle = (productId: string) => {
    toggleFavorite(productId);
    
    // Update the products state to reflect the favorite change
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            isFavorite: !product.isFavorite
          };
        }
        return product;
      })
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (!category) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.title}>{category.name}</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <Text style={styles.resultsText}>
          {products.length} {products.length === 1 ? 'result' : 'results'}
        </Text>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {products.length > 0 ? (
            <View style={styles.productsContainer}>
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No products found</Text>
              <Text style={styles.emptyStateText}>
                We couldn't find any products in this category
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E40AF',
  },
  resultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  productsContainer: {
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});