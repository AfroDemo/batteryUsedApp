import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "expo-router";
import { ArrowRight, Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Remove local isLoading state
  const [error, setError] = useState<string | null>(null);
  const { login, loading: isAuthLoading } = useAuth(); // Get login function and loading state from context

  const handleLogin = async () => {
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#64748B" />
                ) : (
                  <Eye size={20} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isAuthLoading} // Use the loading state from AuthContext
            style={styles.button}
            icon={<ArrowRight size={20} color="white" />}
            iconPosition="right"
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#64748B",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#1E293B",
  },
  eyeButton: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E40AF",
  },
  button: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  registerText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  registerLink: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E40AF",
  },
});
