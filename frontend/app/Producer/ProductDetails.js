import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductDetails() {
  const URL = process.env.EXPO_PUBLIC_BASE_URL
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await AsyncStorage.getItem("access");
        const res = await fetch(`${URL}goods/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image || "https://via.placeholder.com/200" }}
        style={styles.image}
      />

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>₦{product.price}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{product.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Quantity</Text>
        <Text style={styles.value}>{product.quality}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Created At</Text>
        <Text style={styles.value}>{product.created_at}</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F7F8FA" },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 20,
    backgroundColor: "#EEE",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 20,
    color: "#1A1D1F",
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0A84FF",
    marginVertical: 10,
  },
  section: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#1A1D1F",
    fontWeight: "600",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
