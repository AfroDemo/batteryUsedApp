import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter } from "expo-router";
import {
  Package,
  Plus,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  ChevronRight,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Card } from "../../components/ui/Card";

type Stat = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: JSX.Element;
};

type Order = {
  id: number;
  buyer: { name: string };
  total_amount: string;
  status: string;
  created_at: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [stats, setStats] = useState<Stat[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    if (user?.role !== "admin") return;

    try {
      const data = await api.auth.adminDashboard();

      const newStats: Stat[] = [
        {
          title: "Total Products",
          value: data.total_batteries.toString(),
          change: "+12%", // TODO: Calculate dynamically from historical data
          trend: "up",
          icon: <Package size={24} color="#1E40AF" />,
        },
        {
          title: "Active Users",
          value: data.total_users.toString(),
          change: "+8%",
          trend: "up",
          icon: <Users size={24} color="#1E40AF" />,
        },
        {
          title: "Orders Today",
          value: data.total_orders.toString(),
          change: "-3%",
          trend: "down",
          icon: <ShoppingBag size={24} color="#1E40AF" />,
        },
        {
          title: "Revenue",
          value: `$${parseFloat(data.total_revenue).toFixed(2)}`, // Parse string to number
          change: "+18%",
          trend: "up",
          icon: <TrendingUp size={24} color="#1E40AF" />,
        },
      ];
      setStats(newStats);
      setRecentOrders(data.recent_orders || []); // Set recent orders
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const quickActions = [
    {
      title: "Add Product",
      icon: <Plus size={24} color="#1E40AF" />,
      onPress: () => router.push("/admin/products/new"),
    },
    {
      title: "Manage Products",
      icon: <Package size={24} color="#1E40AF" />,
      onPress: () => router.push("/admin/products"),
    },
    {
      title: "Settings",
      icon: <Settings size={24} color="#1E40AF" />,
      onPress: () => router.push("/admin/settings"),
    },
  ];

  // Render a single order item
  const renderOrderItem = (order: Order) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderItem}
      onPress={() => router.push(`/orders/${order.id}`)}
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, Admin!</Text>
        <Text style={styles.subtitle}>Here's what's happening today</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card
            key={index}
            style={[styles.statCard, { width: isSmallScreen ? "100%" : "48%" }]}
          >
            <View style={styles.statHeader}>
              {stat.icon}
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <View style={styles.statFooter}>
              <Text
                style={[
                  styles.statChange,
                  { color: stat.trend === "up" ? "#10B981" : "#EF4444" },
                ]}
              >
                {stat.change}
              </Text>
              <Text style={styles.statPeriod}>vs last week</Text>
            </View>
          </Card>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionCard,
              { width: isSmallScreen ? "100%" : "31%" },
            ]}
            onPress={action.onPress}
          >
            <Card style={styles.actionCardInner}>
              {action.icon}
              <Text style={styles.actionTitle}>{action.title}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recent Orders</Text>
      <Card style={styles.ordersCard}>
        {recentOrders.length === 0 ? (
          <Text style={styles.noOrdersText}>No recent orders found</Text>
        ) : (
          recentOrders.map(renderOrderItem)
        )}
      </Card>

      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={() => router.push("/admin/orders")}
      >
        <Text style={styles.viewAllText}>View All Orders</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#1E293B",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#64748B",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statCard: {
    padding: 16,
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#64748B",
    marginLeft: 8,
  },
  statValue: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#1E293B",
    marginBottom: 8,
  },
  statFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  statChange: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    marginRight: 4,
  },
  statPeriod: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  actionCard: {
    marginBottom: 16,
  },
  actionCardInner: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E293B",
    marginTop: 8,
    textAlign: "center",
  },
  ordersCard: {
    padding: 0,
    overflow: "hidden",
    marginBottom: 16,
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
  noOrdersText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    padding: 16,
  },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  viewAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E40AF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#1E293B",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 16,
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