import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import { Button } from '../../../components/ui/Button';
import { BATTERIES } from '../../../constants/mockData';

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    compatibility: '',
    capacity: '',
    voltage: '',
    warranty: '',
    description: '',
    features: [''],
  });
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Simulate loading product data
    const timeout = setTimeout(() => {
      const product = BATTERIES.find((p) => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          brand: product.brand,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || '',
          compatibility: product.compatibility,
          capacity: product.capacity,
          voltage: product.voltage,
          warranty: product.warranty,
          description: product.description,
          features: product.features,
        });
        setImageUrl(product.imageUrl);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [id]);

  const handleSubmit = () => {
    // Implement product update logic here
    console.log('Updated form data:', formData);
    router.back();
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageSection}>
        {imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
            />
            <TouchableOpacity
              style={styles.removeImage}
              onPress={() => setImageUrl('')}
            >
              <X size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => {
              // Implement image upload logic
            }}
          >
            <Camera size={32} color="#64748B" />
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) =>
              setFormData({ ...formData, name: text })
            }
            placeholder="Enter product name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            value={formData.brand}
            onChangeText={(text) =>
              setFormData({ ...formData, brand: text })
            }
            placeholder="Enter brand name"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) =>
                setFormData({ ...formData, price: text })
              }
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Original Price</Text>
            <TextInput
              style={styles.input}
              value={formData.originalPrice}
              onChangeText={(text) =>
                setFormData({ ...formData, originalPrice: text })
              }
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Compatibility</Text>
          <TextInput
            style={styles.input}
            value={formData.compatibility}
            onChangeText={(text) =>
              setFormData({ ...formData, compatibility: text })
            }
            placeholder="Enter compatible devices"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Capacity</Text>
            <TextInput
              style={styles.input}
              value={formData.capacity}
              onChangeText={(text) =>
                setFormData({ ...formData, capacity: text })
              }
              placeholder="e.g., 3000mAh"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Voltage</Text>
            <TextInput
              style={styles.input}
              value={formData.voltage}
              onChangeText={(text) =>
                setFormData({ ...formData, voltage: text })
              }
              placeholder="e.g., 3.7V"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Warranty</Text>
          <TextInput
            style={styles.input}
            value={formData.warranty}
            onChangeText={(text) =>
              setFormData({ ...formData, warranty: text })
            }
            placeholder="e.g., 1 year"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            placeholder="Enter product description"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Features</Text>
          {formData.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <TextInput
                style={[styles.input, styles.featureInput]}
                value={feature}
                onChangeText={(text) => updateFeature(index, text)}
                placeholder="Enter feature"
              />
              <TouchableOpacity
                style={styles.removeFeature}
                onPress={() => removeFeature(index)}
              >
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
          <Button
            title="Add Feature"
            onPress={addFeature}
            variant="outline"
            style={styles.addFeatureButton}
          />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  imageContainer: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  uploadButton: {
    width: 200,
    height: 200,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureInput: {
    flex: 1,
    marginRight: 8,
  },
  removeFeature: {
    padding: 8,
  },
  addFeatureButton: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 24,
  },
});