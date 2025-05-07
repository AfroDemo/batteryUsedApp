import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react-native";
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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Remove local isLoading state
  const [error, setError] = useState<string | null>(null);
  const { register, loading: isAuthLoading } = useAuth(); // Get register function and loading state

  const handleRegister = async () => {
    setError(null);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({ name, email, password });
      // router.replace("/(tabs)"); // Navigation handled in AuthContext
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

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
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#64748B" />
                ) : (
                  <Eye size={20} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isAuthLoading} // Use loading state from AuthContext
            style={styles.button}
            icon={<ArrowRight size={20} color="white" />}
            iconPosition="right"
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign in</Text>
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
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
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
  button: {
    marginTop: 8,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loginText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
  },
  loginLink: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#1E40AF",
  },
});
