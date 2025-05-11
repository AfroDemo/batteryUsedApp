import api from "@/lib/api";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../../components/ui/Button";
import Checkbox from "expo-checkbox";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    compatibility: "",
    capacity_percentage: "",
    capacity: "",
    voltage: "",
    warranty: "",
    description: "",
    features: [""],
    image_url: "",
    is_featured: false,
  });
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brands
        const brandsData = await api.products.getBrands();
        setBrands(brandsData);

        // Fetch product
        const product = await api.products.getById(id);
        let parsedFeatures: string[] = [""];
        if (product.features) {
          try {
            parsedFeatures =
              typeof product.features === "string"
                ? JSON.parse(product.features)
                : product.features;
            if (!Array.isArray(parsedFeatures)) {
              parsedFeatures = [""];
            }
          } catch (e) {
            console.warn("Failed to parse features:", e);
            parsedFeatures = [""];
          }
        }

        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          price: product.price?.toString() || "",
          originalPrice: product.original_price?.toString() || "",
          compatibility: product.compatibility
            ? typeof product.compatibility === "string"
              ? product.compatibility
              : JSON.stringify(product.compatibility)
            : "",
          capacity_percentage: product.capacity_percentage?.toString() || "",
          capacity: product.capacity || "",
          voltage: product.voltage || "",
          warranty: product.warranty || "",
          description: product.description || "",
          features: parsedFeatures.length ? parsedFeatures : [""],
          image_url: product.image_url || "",
          is_featured: product.is_featured || false,
        });
      } catch (err: any) {
        setError("Failed to load product or brands");
        Alert.alert("Error", err.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.brand || !formData.price) {
        throw new Error("Name, brand, and price are required.");
      }

      const data = {
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        compatibility: formData.compatibility || undefined,
        capacity_percentage: formData.capacity_percentage
          ? parseFloat(formData.capacity_percentage)
          : undefined,
        capacity: formData.capacity || undefined,
        voltage: formData.voltage || undefined,
        warranty: formData.warranty || undefined,
        description: formData.description || undefined,
        features: formData.features.filter((f) => f.trim() !== "") || undefined,
        image_url: formData.image_url || undefined,
        category_id: 1, // Default; adjust with category picker
        is_featured: formData.is_featured,
      };

      await api.products.update(id, data);
      Alert.alert("Success", "Product updated successfully!");
      router.back();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update product";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
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
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Image URL</Text>
          <TextInput
            style={styles.input}
            value={formData.image_url}
            onChangeText={(text) =>
              setFormData({ ...formData, image_url: text })
            }
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            keyboardType="url"
          />
          {formData.image_url && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: formData.image_url }}
                style={styles.productImage}
                onError={() => setError("Invalid image URL")}
              />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => setFormData({ ...formData, image_url: "" })}
              >
                <X size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter product name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand</Text>
          <Picker
            selectedValue={formData.brand}
            onValueChange={(value) =>
              setFormData({ ...formData, brand: value })
            }
            style={styles.input}
          >
            <Picker.Item label="Select a brand" value="" />
            {brands.map((brand) => (
              <Picker.Item
                key={brand.id}
                label={brand.name}
                value={brand.name}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
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
            <Text style={styles.label}>Capacity Percentage</Text>
            <TextInput
              style={styles.input}
              value={formData.capacity_percentage}
              onChangeText={(text) =>
                setFormData({ ...formData, capacity_percentage: text })
              }
              placeholder="e.g., 85"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
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

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Is Featured</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={formData.is_featured}
              onValueChange={(value) =>
                setFormData({ ...formData, is_featured: value })
              }
              style={styles.checkbox}
              tintColors={{ true: "#1E40AF", false: "#64748B" }}
            />
            <Text style={styles.checkboxLabel}>Feature this product</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
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
          disabled={isLoading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#1E293B",
  },
  imageContainer: {
    position: "relative",
    width: 200,
    height: 200,
    marginTop: 8,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  removeImage: {
    position: "absolute",
    top: -8,
    right: 48,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  uploadButton: {
    width: 200,
    height: 100,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    marginTop: 8,
  },
  uploadText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
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
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#EF4444",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#1E293B",
  },
});
