import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { orders } from "@/lib/api";
import { useRouter } from "expo-router";
import { ChevronRight, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Order = {
  id: number;
  buyer: { name: string };
  total_amount: string;
  status: string;
  created_at: string;
};

export default function AdminOrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");

  // Fetch orders with pagination, search, and filter
  const fetchOrders = async (page = 1, append = false) => {
    if (page > lastPage && append) return;
    setIsLoading(page === 1);
    setIsLoadingMore(page > 1);
    setError(null);
    try {
      const params: any = { page, per_page: 10 };
      if (searchQuery) params.query = searchQuery;
      if (statusFilter !== "all") params.status = statusFilter;
      const response = await orders.getAll({ params });
      const { data, current_page, last_page } = response;
      setOrdersList(append ? [...ordersList, ...data] : data);
      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      console.error("Orders fetch error:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial fetch and refetch on search/filter change
  useEffect(() => {
    if (user?.role === "admin") {
      fetchOrders(1);
    }
  }, [user, searchQuery, statusFilter]);

  // Load more orders
  const handleLoadMore = () => {
    if (!isLoadingMore && currentPage < lastPage) {
      fetchOrders(currentPage + 1, true);
    }
  };

  // Render a single order item
  const renderOrderItem = (order: Order) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderItem}
      onPress={() => router.push(`/admin/orders/${order.id}`)}
    >
      <View style={styles.orderDetails}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <Text style={styles.orderBuyer}>Buyer: {order.buyer.name}</Text>
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

  if (user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Access denied. Admins only.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Orders</Text>
        </View>

        {/* Search and Filter */}
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by order ID or buyer"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.statusFilter}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === "all" && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter("all")}
            >
              <Text style={styles.filterButtonText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === "pending" && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter("pending")}
            >
              <Text style={styles.filterButtonText}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === "completed" && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter("completed")}
            >
              <Text style={styles.filterButtonText}>Completed</Text>
            </TouchableOpacity>
          </View>
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
  filterContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1E293B",
    paddingVertical: 12,
  },
  statusFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    marginHorizontal: 4,
  },
  filterButtonActive: {
    borderColor: "#1E40AF",
    backgroundColor: "#EFF6FF",
  },
  filterButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
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
  orderBuyer: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#64748B",
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
