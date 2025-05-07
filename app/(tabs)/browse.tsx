import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react-native';
import { BATTERIES, CATEGORIES } from '@/constants/mockData';
import { useFavorites } from '@/context/FavoritesContext';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ui/ProductCard';

export default function BrowseScreen() {
  const { search, category, deals } = useLocalSearchParams<{ 
    search?: string;
    category?: string;
    deals?: string; 
  }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(search || '');
  const [activeCategory, setActiveCategory] = useState<string | undefined>(category);
  const [showDeals, setShowDeals] = useState(deals === 'true');
  const [filteredProducts, setFilteredProducts] = useState(BATTERIES);
  
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // Simulate loading data
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Filter products based on search, category, and deals
    let result = [...BATTERIES];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.compatibility.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeCategory) {
      // This is simplified - in a real app, you'd match by actual category IDs
      result = result.filter(product => {
        if (activeCategory === 'apple') return product.compatibility.toLowerCase().includes('iphone');
        if (activeCategory === 'samsung') return product.compatibility.toLowerCase().includes('samsung');
        if (activeCategory === 'google') return product.compatibility.toLowerCase().includes('pixel');
        if (activeCategory === 'oneplus') return product.compatibility.toLowerCase().includes('oneplus');
        return true;
      });
    }
    
    // Apply deals filter
    if (showDeals) {
      result = result.filter(product => product.originalPrice !== undefined);
    }
    
    // Add isFavorite property
    result = result.map(product => ({
      ...product,
      isFavorite: isFavorite(product.id)
    }));
    
    setFilteredProducts(result);
  }, [searchQuery, activeCategory, showDeals, isFavorite]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId === activeCategory ? undefined : categoryId);
  };
  
  const handleToggleDeals = () => {
    setShowDeals(!showDeals);
  };
  
  const handleFavoriteToggle = (productId: string) => {
    toggleFavorite(productId);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Browse Batteries</Text>
        </View>
        
        <SearchBar 
          placeholder="Search by phone model, brand..."
          onSearch={handleSearch}
        />
        
        {/* Filter options */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              showDeals && styles.activeFilterButton
            ]}
            onPress={handleToggleDeals}
          >
            <SlidersHorizontal size={16} color={showDeals ? "#FFFFFF" : "#64748B"} />
            <Text 
              style={[
                styles.filterText,
                showDeals && styles.activeFilterText
              ]}
            >
              Deals
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map(category => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.activeCategoryButton
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.activeCategoryText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Results count */}
        <Text style={styles.resultsText}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
        </Text>
        
        {/* Product list */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No results found</Text>
              <Text style={styles.emptyStateText}>
                Try changing your search terms or filters
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1E293B',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#1E40AF',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#1E40AF',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  resultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  productsContainer: {
    paddingBottom: 80,
  },
  emptyState: {
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