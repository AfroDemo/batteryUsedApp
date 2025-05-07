import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { User, ShoppingBag, Heart, MapPin, CreditCard, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);const { user, logout } = useAuth();
  const router = useRouter();
  
  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = async() => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: () => setIsLoggedIn(false),
          style: "destructive"
        }
      ]
    );

    await logout();
    router.replace('/auth/login'); // Already handled in AuthContext
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        {isLoggedIn ? (
          <>
            <Card style={styles.profileCard}>
              <View style={styles.profileContent}>
                <Image 
                  source={{ uri: userData.avatar }} 
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userData.name}</Text>
                  <Text style={styles.userEmail}>{userData.email}</Text>
                </View>
              </View>
            </Card>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              <Card style={styles.menuCard}>
                {renderMenuItem(
                  <User size={20} color="#1E40AF" style={styles.menuIcon} />,
                  "Personal Information",
                  () => {}
                )}
                {renderMenuItem(
                  <ShoppingBag size={20} color="#1E40AF" style={styles.menuIcon} />,
                  "My Orders",
                  () => {}
                )}
                {renderMenuItem(
                  <Heart size={20} color="#1E40AF" style={styles.menuIcon} />,
                  "My Favorites",
                  () => {}
                )}
                {renderMenuItem(
                  <MapPin size={20} color="#1E40AF" style={styles.menuIcon} />,
                  "Shipping Addresses",
                  () => {}
                )}
                {renderMenuItem(
                  <CreditCard size={20} color="#1E40AF" style={styles.menuIcon} />,
                  "Payment Methods",
                  () => {}
                )}
              </Card>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <Card style={styles.menuCard}>
                <View style={styles.switchItem}>
                  <View style={styles.menuItemLeft}>
                    <Bell size={20} color="#1E40AF" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Notifications</Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                    trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                    thumbColor={notificationsEnabled ? '#1E40AF' : '#F1F5F9'}
                  />
                </View>
                {renderMenuItem(
                  <Shield size={20} color="#1E40AF" style={styles.menuIcon} />,
                  "Privacy & Security",
                  () => {}
                )}
                {renderMenuItem(
                  <HelpCircle size={20} color="#1E40AF" style={styles.menuIcon} />,
                  "Help & Support",
                  () => {}
                )}
              </Card>
            </View>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#EF4444" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.loginContainer}>
            <User size={64} color="#E2E8F0" />
            <Text style={styles.loginTitle}>Sign in to your account</Text>
            <Text style={styles.loginText}>
              Sign in to access your orders, favorites, and more
            </Text>
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.registerLink}>
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerLinkText}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1E293B',
  },
  profileCard: {
    marginBottom: 24,
    padding: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 40,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EF4444',
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  loginTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  registerLink: {
    marginTop: 8,
  },
  registerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  registerLinkText: {
    color: '#1E40AF',
    fontFamily: 'Inter-Medium',
  },
});