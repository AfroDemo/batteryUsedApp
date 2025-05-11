import { Category } from "@/constants/types";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";

interface CategoryCardProps {
  category: Category;
  variant?: "horizontal" | "vertical";
}

export function CategoryCard({
  category,
  variant = "vertical",
}: CategoryCardProps) {
  const router = useRouter();

  const isHorizontal = variant === "horizontal";

  return (
    <Card
      style={[
        styles.card,
        isHorizontal ? styles.horizontalCard : styles.verticalCard,
      ]}
      onPress={() => router.push(`/browse?category=${category.id}`)}
      elevation="sm"
      accessibilityLabel={`View ${category.name} batteries`}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.container,
          isHorizontal ? styles.horizontalContainer : styles.verticalContainer,
        ]}
      >
        <View
          style={[
            styles.imageContainer,
            isHorizontal
              ? styles.horizontalImageContainer
              : styles.verticalImageContainer,
          ]}
        >
          {category.image_url ? (
            <Image source={{ uri: category.image_url }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>

        <View
          style={[
            styles.content,
            isHorizontal ? styles.horizontalContent : styles.verticalContent,
          ]}
        >
          <Text style={styles.name} numberOfLines={isHorizontal ? 1 : 2}>
            {category.name}
          </Text>
          <Text style={styles.count}>
            {category.batteries_count}{" "}
            {category.batteries_count === 1 ? "Battery" : "Batteries"}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  verticalCard: {
    width: 120,
    height: 160,
    marginRight: 12,
  },
  horizontalCard: {
    width: "100%",
    height: 80,
    marginBottom: 12,
  },
  container: {
    flex: 1,
  },
  verticalContainer: {
    flexDirection: "column",
  },
  horizontalContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  verticalImageContainer: {
    height: 100,
    width: "100%",
  },
  horizontalImageContainer: {
    width: 80,
    height: "100%",
  },
  image: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  placeholderImage: {
    width: "80%",
    height: "80%",
    backgroundColor: "#E2E8F0",
  },
  content: {
    justifyContent: "center",
  },
  verticalContent: {
    flex: 1,
    padding: 8,
    alignItems: "center",
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#1E293B",
    textAlign: "center",
  },
  count: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    textAlign: "center",
  },
});
