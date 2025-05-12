import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { orders } from "@/lib/api"; // Import orders API
import { useRouter } from "expo-router";
import { ChevronRight, LogOut } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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

export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]); // State for recent orders
  const [isLoadingOrders, setIsLoadingOrders] = useState(false); // Loading state
  const [ordersError, setOrdersError] = useState(null); // Error state
  const { user, logout } = useAuth();
  const router = useRouter();

  // Mock user data (replace with real user data from useAuth if available)
  const userData = {
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex.johnson@example.com",
    avatar:
      user?.avatar ||
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  };

  // Fetch recent orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      setOrdersError(null);
      try {
        const response = await orders.getAll();
        // Assuming response.data is an array of orders or response.data.data for paginated response
        const ordersData = response.data?.data || response.data || [];
        // Limit to 3 most recent orders
        setRecentOrders(ordersData.slice(0, 3));
      } catch (err) {
        setOrdersError("Failed to load recent orders");
        console.error("Orders fetch error:", err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        onPress: async () => {
          await logout();
          setIsLoggedIn(false);
          router.replace("/auth/login");
        },
        style: "destructive",
      },
    ]);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void,
    showArrow = true
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {showArrow && <ChevronRight size={20} color="#94A3B8" />}
    </TouchableOpacity>
  );

  // Render a single order item
  const renderOrderItem = (order) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderItem}
      // onPress={() => router.push(`/orders/${order.id}`)} // Navigate to order details (implement OrderDetailsScreen separately)
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
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>
          </View>
        </Card>

        {/* Recent Orders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {recentOrders.length > 0 && (
              <TouchableOpacity onPress={() => router.push("/orders")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          <Card style={styles.ordersCard}>
            {isLoadingOrders ? (
              <Text style={styles.loadingText}>Loading orders...</Text>
            ) : ordersError ? (
              <Text style={styles.errorText}>{ordersError}</Text>
            ) : recentOrders.length === 0 ? (
              <Text style={styles.noOrdersText}>No recent orders found</Text>
            ) : (
              recentOrders.map(renderOrderItem)
            )}
          </Card>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#1E293B",
  },
  profileCard: {
    marginBottom: 24,
    padding: 16,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#1E293B",
  },
  viewAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E40AF",
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
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    padding: 16,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
    padding: 16,
  },
  noOrdersText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#1E293B",
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 40,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#EF4444",
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  loginTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  loginText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: "#1E40AF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "white",
  },
  registerLink: {
    marginTop: 8,
  },
  registerText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  registerLinkText: {
    color: "#1E40AF",
    fontFamily: "Inter-Medium",
  },
});
