import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react-native';
import { useFavorites } from '@/context/FavoritesContext';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ui/ProductCard';
import api from '@/lib/api';
import { ApiError, Battery, Category, PaginatedResponse } from '@/constants/types';

export default function BrowseScreen() {
  const router = useRouter();
  const {
    query,
    category,
    brand,
    compatibility,
    min_price,
    max_price,
    min_capacity_percentage,
    is_featured,
    sort_by,
    sort_direction,
  } = useLocalSearchParams<{
    query?: string;
    category?: string;
    brand?: string;
    compatibility?: string;
    min_price?: string;
    max_price?: string;
    min_capacity_percentage?: string;
    is_featured?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
  }>();

  const { toggleFavorite, isFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [activeCategory, setActiveCategory] = useState<string | undefined>(category);
  const [products, setProducts] = useState<Battery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filterParams, setFilterParams] = useState({
    minPrice: min_price ? parseFloat(min_price) : undefined,
    maxPrice: max_price ? parseFloat(max_price) : undefined,
    minCapacity: min_capacity_percentage ? parseFloat(min_capacity_percentage) : undefined,
    sortBy: sort_by || 'created_at',
    sortDirection: sort_direction || 'desc',
    isFeatured: is_featured === 'true',
  });

  const fetchCategories = async () => {
    try {
      const data = await api.home.getHomeData();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = useCallback(
    async (pageNum: number = 1) => {
      try {
        setIsLoading(true);
        setError(null);
        const params: any = {
          query: searchQuery,
          category: activeCategory,
          brand,
          compatibility,
          min_price: filterParams.minPrice,
          max_price: filterParams.maxPrice,
          min_capacity_percentage: filterParams.minCapacity,
          is_featured: filterParams.isFeatured,
          sort_by: filterParams.sortBy,
          sort_direction: filterParams.sortDirection,
          page: pageNum,
          per_page: 20,
        };
        const response: PaginatedResponse<Battery> = await api.products.getAll(params);
        const newProducts = response.data.map((product) => ({
          ...product,
          isFavorite: isFavorite(product.id.toString()),
        }));
        setProducts(pageNum === 1 ? newProducts : [...products, ...newProducts]);
        setHasMore(!!response.next_page_url);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setIsLoading(false);
      }
    },
    [
      searchQuery,
      activeCategory,
      brand,
      compatibility,
      filterParams,
      isFavorite,
      products,
    ]
  );

  useEffect(() => {
    fetchCategories();
    setPage(1);
    fetchProducts(1);
  }, [searchQuery, activeCategory, filterParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = categoryId === activeCategory ? undefined : categoryId;
    setActiveCategory(newCategory);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
      fetchProducts(page + 1);
    }
  };

  const handleFavoriteToggle = (productId: string) => {
    toggleFavorite(productId);
    setProducts((prev) =>
      prev.map((product) =>
        product.id.toString() === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  const handleApplyFilters = () => {
    setIsFilterModalVisible(false);
    setPage(1);
    fetchProducts(1);
  };

  const renderItem = ({ item }: { item: Battery }) => (
    <ProductCard
      product={item}
      onFavoriteToggle={handleFavoriteToggle}
      isFavorite={item.isFavorite}
    />
  );

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error.message || 'An error occurred while fetching products'}
          </Text>
          <TouchableOpacity
            onPress={() => fetchProducts(1)}
            style={styles.retryButton}
            accessibilityLabel="Retry loading products"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
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
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.title}>Browse Batteries</Text>
        </View>

        <SearchBar
          placeholder="Search by phone model, brand..."
          onSearch={handleSearch}
          initialValue={searchQuery}
        />

        {/* Filter options */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}
            accessibilityLabel="Open filters"
            accessibilityRole="button"
          >
            <Filter size={16} color="#64748B" />
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id.toString() && styles.activeCategoryButton,
              ]}
              onPress={() => handleCategorySelect(category.id.toString())}
              accessibilityLabel={`Filter by ${category.name}`}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.id.toString() && styles.activeCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results count */}
        <Text style={styles.resultsText}>
          {products.length} {products.length === 1 ? 'result' : 'results'}
        </Text>

        {/* Product list */}
        {isLoading && page === 1 ? (
          <ActivityIndicator size="large" color="#1E40AF" style={styles.loadingContainer} />
        ) : products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              Try changing your search terms or filters
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.productsContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading && page > 1 ? (
                <ActivityIndicator size="small" color="#1E40AF" />
              ) : null
            }
          />
        )}

        {/* Filter Modal */}
        <Modal
          visible={isFilterModalVisible}
          animationType="slide"
          onRequestClose={() => setIsFilterModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <ArrowLeft size={24} color="#1E293B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Filters</Text>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Min Price"
                  keyboardType="numeric"
                  value={filterParams.minPrice?.toString() || ''}
                  onChangeText={(text) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      minPrice: text ? parseFloat(text) : undefined,
                    }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Max Price"
                  keyboardType="numeric"
                  value={filterParams.maxPrice?.toString() || ''}
                  onChangeText={(text) =>
                    setFilterParams((prev) => ({
                      ...prev,
                      maxPrice: text ? parseFloat(text) : undefined,
                    }))
                  }
                />
              </View>

              <Text style={styles.filterLabel}>Minimum Capacity (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="Min Capacity Percentage"
                keyboardType="numeric"
                value={filterParams.minCapacity?.toString() || ''}
                onChangeText={(text) =>
                  setFilterParams((prev) => ({
                    ...prev,
                    minCapacity: text ? parseFloat(text) : undefined,
                  }))
                }
              />

              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortOptions}>
                {['price', 'capacity_percentage', 'discount_percentage', 'created_at'].map(
                  (option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.sortButton,
                        filterParams.sortBy === option && styles.activeSortButton,
                      ]}
                      onPress={() =>
                        setFilterParams((prev) => ({ ...prev, sortBy: option }))
                      }
                    >
                      <Text
                        style={[
                          styles.sortText,
                          filterParams.sortBy === option && styles.activeSortText,
                        ]}
                      >
                        {option.replace('_', ' ').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              <Text style={styles.filterLabel}>Sort Direction</Text>
              <View style={styles.sortOptions}>
                {['asc', 'desc'].map((direction) => (
                  <TouchableOpacity
                    key={direction}
                    style={[
                      styles.sortButton,
                      filterParams.sortDirection === direction && styles.activeSortButton,
                    ]}
                    onPress={() =>
                      setFilterParams((prev) => ({ ...prev, sortDirection: direction }))
                    }
                  >
                    <Text
                      style={[
                        styles.sortText,
                        filterParams.sortDirection === direction && styles.activeSortText,
                      ]}
                    >
                      {direction.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Featured Products</Text>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filterParams.isFeatured && styles.activeFilterButton,
                ]}
                onPress={() =>
                  setFilterParams((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))
                }
              >
                <Text
                  style={[
                    styles.filterText,
                    filterParams.isFeatured && styles.activeFilterText,
                  ]}
                >
                  Show Featured Only
                </Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
              accessibilityLabel="Apply filters"
              accessibilityRole="button"
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
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
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
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
    gap: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    padding: 16,
  },
  filterLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
    marginTop: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  activeSortButton: {
    backgroundColor: '#1E40AF',
  },
  sortText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeSortText: {
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#1E40AF',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  applyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});