import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => removeFromCart(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
          {items.length > 0 && (
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearButton}>Clear Cart</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.length > 0 ? (
          <View style={styles.content}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {items.map((item) => (
                <Card key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemContent}>
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemPrice}>TzS {item.price}</Text>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus
                            size={16}
                            color={item.quantity <= 1 ? "#CBD5E1" : "#64748B"}
                          />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </ScrollView>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  TzS {totalPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>FREE</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  TzS {totalPrice.toFixed(2)}
                </Text>
              </View>
              <Button
                title="Proceed to Checkout"
                onPress={handleCheckout}
                style={styles.checkoutButton}
                loading={isProcessing}
              />
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ShoppingBag size={64} color="#E2E8F0" />
            <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
            <Text style={styles.emptyStateText}>
              Add batteries to your cart to see them here
            </Text>
            <Button
              title="Browse Products"
              onPress={() => router.push("/browse")}
              style={styles.browseButton}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#1E293B",
  },
  clearButton: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#EF4444",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    paddingBottom: 16,
  },
  cartItem: {
    marginBottom: 12,
    padding: 12,
  },
  cartItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  itemPrice: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E40AF",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E293B",
    marginHorizontal: 12,
    width: 20,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  summaryContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  summaryValue: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
  },
  totalLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E293B",
  },
  totalValue: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#1E40AF",
  },
  checkoutButton: {
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    width: 200,
  },
});
