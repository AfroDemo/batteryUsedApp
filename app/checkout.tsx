import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { orders } from "@/lib/api";
import { useRouter } from "expo-router";
import { CheckCircle, CreditCard, Smartphone } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<
    "bank" | "mobile_money" | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug payment method changes
  useEffect(() => {
    console.log("Payment method changed:", paymentMethod);
  }, [paymentMethod]);

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: "bank" | "mobile_money") => {
    console.log("Selecting payment method:", method);
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      Alert.alert("Error", "Please fill in all shipping address fields");
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        batteries: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        shipping_address: {
          // Changed from shippingAddress to shipping_address
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
        payment_method: paymentMethod, // Changed from paymentMethod to payment_method
      };

      console.log("Order data:", JSON.stringify(orderData, null, 2));

      const response = await orders.create(orderData);

      Alert.alert(
        "Order Placed!",
        `Your order has been successfully placed.\n\nPayment Instructions:\n${response.payment_instructions.instructions}`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.push("/home");
            },
          },
        ]
      );
    } catch (err: any) {
      let errorMessage = "Failed to place order";
      if (err.response?.data?.errors) {
        // Handle validation errors
        errorMessage = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
      } else if (err.response?.data?.message) {
        // Handle other errors
        errorMessage = err.response.data.message;
      } else {
        errorMessage = err.message || errorMessage;
      }
      console.error("Order error:", err.response?.data || err);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  TzS {parseFloat(item.price).toFixed(2)} x {item.quantity} =
                  TzS {(parseFloat(item.price) * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>TzS {totalPrice.toFixed(2)}</Text>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>

            {/* Bank Transfer Option */}
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Select Bank Transfer payment method"
              accessibilityRole="button"
              style={[
                styles.paymentOption,
                paymentMethod === "bank" && styles.selectedOption,
              ]}
              onPress={() => handlePaymentMethodSelect("bank")}
              activeOpacity={0.6}
              testID="bank-payment-option"
            >
              <View style={styles.paymentIconContainer}>
                <CreditCard size={24} color="#1E293B" />
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentTitle}>Bank Transfer</Text>
                <Text style={styles.paymentInfo}>CRDB Bank</Text>
                <Text style={styles.paymentInfo}>Account: USEDBATTERY LTD</Text>
                <Text style={styles.paymentInfo}>Number: 123456787</Text>
              </View>
              {paymentMethod === "bank" && (
                <CheckCircle
                  size={24}
                  color="#1E40AF"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>

            {/* Mobile Money Option */}
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Select Mobile Money payment method"
              accessibilityRole="button"
              style={[
                styles.paymentOption,
                paymentMethod === "mobile_money" && styles.selectedOption,
              ]}
              onPress={() => handlePaymentMethodSelect("mobile_money")}
              activeOpacity={0.6}
              testID="mobile-money-payment-option"
            >
              <View style={styles.paymentIconContainer}>
                <Smartphone size={24} color="#1E293B" />
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentTitle}>Mobile Money</Text>
                <Text style={styles.paymentInfo}>M-PESA</Text>
                <Text style={styles.paymentInfo}>Account: USEDBATTERY LTD</Text>
                <Text style={styles.paymentInfo}>Number: 591234</Text>
              </View>
              {paymentMethod === "mobile_money" && (
                <CheckCircle
                  size={24}
                  color="#1E40AF"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Shipping Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street"
              value={shippingAddress.street}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, street: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={shippingAddress.city}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, city: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={shippingAddress.state}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, state: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              value={shippingAddress.zipCode}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, zipCode: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={shippingAddress.country}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, country: text })
              }
            />
          </View>

          {/* Current Selection Status */}
          <View style={styles.selectionStatus}>
            <Text style={styles.selectionText}>
              {paymentMethod
                ? `Selected: ${
                    paymentMethod === "bank" ? "Bank Transfer" : "Mobile Money"
                  }`
                : "No payment method selected"}
            </Text>
          </View>

          {/* Warning for no payment method selected */}
          {!paymentMethod && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                Please select a payment method to continue
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Place Order"
            onPress={handlePlaceOrder}
            style={styles.placeOrderButton}
            loading={isSubmitting}
            disabled={isSubmitting || !paymentMethod}
          />
        </View>
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
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#1E293B",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E293B",
    flex: 1,
  },
  itemDetails: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  totalLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E293B",
  },
  totalValue: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#1E40AF",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    minHeight: 100,
    zIndex: 1,
  },
  selectedOption: {
    borderColor: "#1E40AF",
    backgroundColor: "#EFF6FF",
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  paymentInfo: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  checkIcon: {
    marginLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  placeOrderButton: {
    width: "100%",
  },
  warningContainer: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  warningText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#92400E",
    textAlign: "center",
  },
  selectionStatus: {
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  selectionText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
  },
});
