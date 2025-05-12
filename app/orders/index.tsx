import { Card } from "@/components/ui/Card";
import { orders } from "@/lib/api";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
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

export default function OrdersScreen() {
  const router = useRouter();
  const [ordersList, setOrdersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Fetch orders (initial load and pagination)
  const fetchOrders = async (page = 1, append = false) => {
    if (page > lastPage && append) return; // Prevent fetching beyond last page
    setIsLoading(page === 1);
    setIsLoadingMore(page > 1);
    setError(null);
    try {
      const response = await orders.getAll({ params: { page, per_page: 10 } });
      const { data, current_page, last_page } = response;
      setOrdersList(append ? [...ordersList, ...data] : data);
      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Orders fetch error:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchOrders(1);
  }, []);

  // Load more orders when reaching the end
  const handleLoadMore = () => {
    if (!isLoadingMore && currentPage < lastPage) {
      fetchOrders(currentPage + 1, true);
    }
  };

  // Render a single order item
  const renderOrderItem = (order) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderItem}
      onPress={() => router.push(`/orders/${order.id}`)}
    >
      <View style={styles.orderDetails}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <Text style={styles.orderDate}>
          {new Date(order.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.orderTotal}>
          Total: TzS {parseFloat(order.total_amount).toFixed(2)}
        </Text>
        <Text
          style={[
            styles.orderStatus,
            { color: order.status === "pending" ? "#F59E0B" : "#10B981" },
          ]}
        >
          Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Text>
      </View>
      <ChevronRight size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Orders</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={({ nativeEvent }) => {
            const isCloseToBottom =
              nativeEvent.layoutMeasurement.height +
                nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height - 20;
            if (isCloseToBottom) handleLoadMore();
          }}
          scrollEventThrottle={400}
        >
          <Card style={styles.ordersCard}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E40AF" />
                <Text style={styles.loadingText}>Loading orders...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  onPress={() => fetchOrders(1)}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : ordersList.length === 0 ? (
              <Text style={styles.noOrdersText}>No orders found</Text>
            ) : (
              ordersList.map(renderOrderItem)
            )}
          </Card>
          {isLoadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#1E40AF" />
              <Text style={styles.loadingMoreText}>Loading more...</Text>
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
    paddingBottom: 16,
  },
  ordersCard: {
    padding: 0,
    overflow: "hidden",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 4,
  },
  orderDate: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  orderTotal: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#1E293B",
    marginBottom: 4,
  },
  orderStatus: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
  },
  errorContainer: {
    alignItems: "center",
    padding: 16,
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
  noOrdersText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    padding: 16,
  },
  loadingMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingMoreText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    marginLeft: 8,
  },
});
