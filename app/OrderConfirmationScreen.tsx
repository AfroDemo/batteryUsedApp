import { Button } from "@/components/ui/Button";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function OrderConfirmationScreen() {
  const { instructions } = useLocalSearchParams();
  const paymentInstructions = JSON.parse(instructions as string);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Order Confirmed</Text>
        <Text style={styles.sectionTitle}>Payment Instructions</Text>
        <Text style={styles.instructions}>
          {paymentInstructions.instructions}
        </Text>
        <Text style={styles.info}>Method: {paymentInstructions.method}</Text>
        {paymentInstructions.bank_name && (
          <Text style={styles.info}>Bank: {paymentInstructions.bank_name}</Text>
        )}
        {paymentInstructions.service && (
          <Text style={styles.info}>
            Service: {paymentInstructions.service}
          </Text>
        )}
        <Text style={styles.info}>
          Account: {paymentInstructions.account_name}
        </Text>
        <Text style={styles.info}>
          Number:{" "}
          {paymentInstructions.account_number || paymentInstructions.pay_number}
        </Text>
        <Button
          title="Back to Home"
          onPress={() => router.push("/home")}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1, padding: 16 },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#1E293B",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#1E293B",
    marginBottom: 12,
  },
  instructions: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
  },
  info: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 8,
  },
  button: { marginTop: 16 },
});
