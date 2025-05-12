import { Card } from "@/components/ui/Card";
import { orders } from "@/lib/api";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Order = {
  id: number;
  buyer: { name: string; email: string };
  total_amount: string;
  status: string;
  created_at: string;
  shipping_address: string;
  payment_method: string;
  items: Array<{
    battery_id: number;
    quantity: number;
    price: string;
    battery: { name: string };
  }>;
  payment_instructions?: {
    method: string;
    instructions: string;
    service?: string;
    pay_number?: string;
    bank_name?: string;
    account_number?: string;
    account_name?: string;
  };
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid order ID");
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await orders.getById(id);
        setOrder(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load order details");
        console.error("Order fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (!id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid order ID</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Loading order...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Order not found"}</Text>
          <TouchableOpacity
            onPress={() => fetchOrder()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  let shippingAddress;
  try {
    shippingAddress = JSON.parse(order.shipping_address);
  } catch (err) {
    shippingAddress = {};
    console.error("Invalid shipping address format:", err);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Order #{order.id}</Text>
          <Text style={styles.subtitle}>
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Order Status */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Text
            style={[
              styles.statusText,
              { color: order.status === "pending" ? "#F59E0B" : "#10B981" },
            ]}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </Card>

        {/* Buyer Information */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Buyer</Text>
          <Text style={styles.detailText}>Name: {order.buyer.name}</Text>
          <Text style={styles.detailText}>Email: {order.buyer.email}</Text>
        </Card>

        {/* Order Items */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.battery.name}</Text>
              <Text style={styles.itemDetails}>
                TzS {parseFloat(item.price).toFixed(2)} x {item.quantity} = TzS{" "}
                {(parseFloat(item.price) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              TzS {parseFloat(order.total_amount).toFixed(2)}
            </Text>
          </View>
        </Card>

        {/* Shipping Address */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.detailText}>
            Street: {shippingAddress.street || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            City: {shippingAddress.city || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            State: {shippingAddress.state || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Zip Code: {shippingAddress.zipCode || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Country: {shippingAddress.country || "N/A"}
          </Text>
        </Card>

        {/* Payment Method */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.detailText}>
            {order.payment_method === "mobile_money"
              ? "Mobile Money"
              : "Bank Transfer"}
          </Text>
          {order.payment_instructions && (
            <>
              <Text style={styles.detailText}>
                Instructions: {order.payment_instructions.instructions || "N/A"}
              </Text>
              {order.payment_instructions.method === "Mobile Money" ? (
                <>
                  <Text style={styles.detailText}>
                    Service: {order.payment_instructions.service || "N/A"}
                  </Text>
                  <Text style={styles.detailText}>
                    Pay Number: {order.payment_instructions.pay_number || "N/A"}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.detailText}>
                    Bank: {order.payment_instructions.bank_name || "N/A"}
                  </Text>
                  <Text style={styles.detailText}>
                    Account Number:{" "}
                    {order.payment_instructions.account_number || "N/A"}
                  </Text>
                </>
              )}
              <Text style={styles.detailText}>
                Account Name: {order.payment_instructions.account_name || "N/A"}
              </Text>
            </>
          )}
        </Card>
      </ScrollView>
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
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 12,
  },
  statusText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    marginBottom: 12,
  },
  detailText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 4,
  },
  itemRow: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#1E40AF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "white",
  },
});
