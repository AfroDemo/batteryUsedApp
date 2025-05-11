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

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [stats, setStats] = useState<Stat[]>([]);
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
          change: "+12%", // Placeholder; see notes for dynamic calculation
          trend: "up",
          icon: <Package size={24} color="#1E40AF" />,
        },
        {
          title: "Active Users",
          value: data.total_users.toString(),
          change: "+8%", // Placeholder
          trend: "up",
          icon: <Users size={24} color="#1E40AF" />,
        },
        {
          title: "Orders Today",
          value: data.total_orders.toString(), // Could filter for today on backend
          change: "-3%", // Placeholder
          trend: "down",
          icon: <ShoppingBag size={24} color="#1E40AF" />,
        },
        {
          title: "Revenue",
          value: `$${data.total_revenue.toFixed(2)}`,
          change: "+18%", // Placeholder
          trend: "up",
          icon: <TrendingUp size={24} color="#1E40AF" />,
        },
      ];
      setStats(newStats);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
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
    marginBottom: 16,
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
  },
});
