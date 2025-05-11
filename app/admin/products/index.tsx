import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
} from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/SearchBar';
import { BATTERIES } from '../../../constants/mockData';

export default function ManageProducts() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(BATTERIES);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = BATTERIES.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
    } else {
      setProducts(BATTERIES);
    }
  };

  const handleDelete = (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement delete logic here
            setProducts(products.filter((p) => p.id !== productId));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          placeholder="Search products..."
          onSearch={handleSearch}
        />
        <Button
          title="Add Product"
          onPress={() => router.push('/admin/products/new')}
          icon={<Plus size={20} color="white" />}
          style={styles.addButton}
        />
      </View>

      <ScrollView style={styles.productList}>
        {products.map((product) => (
          <Card key={product.id} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productBrand}>{product.brand}</Text>
              <View style={styles.productMeta}>
                <Text style={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </Text>
                <View
                  style={[
                    styles.stockIndicator,
                    { backgroundColor: '#22C55E' },
                  ]}
                />
                <Text style={styles.stockText}>In Stock</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  router.push(`/admin/products/${product.id}`)
                }
              >
                <Pencil size={20} color="#1E40AF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(product.id)}
              >
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  addButton: {
    marginTop: 16,
  },
  productList: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  productBrand: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1E40AF',
    marginRight: 12,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  stockText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
});