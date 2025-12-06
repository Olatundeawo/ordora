import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function OrdersDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();

  const URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const response = await fetch(`${URL}goods/producer/order/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setOrder(result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Order Details</Text>

      {/* --- ORDER ITEMS --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items Ordered</Text>

        {order?.items?.length > 0 ? (
          order.items.map((product, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.label}>Product:</Text>
              <Text style={styles.value}>{product.product_name}</Text>

              <Text style={styles.label}>Quantity:</Text>
              <Text style={styles.value}>{product.quality}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.reloadText}>No items found</Text>
        )}
      </View>

      {/* --- ORDER INFO --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Information</Text>

        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>{order?.id}</Text>

        <Text style={styles.label}>Order Date:</Text>
        <Text style={styles.value}>{formatDateTime(order?.created_at)}</Text>

        <Text style={styles.label}>Customer ID:</Text>
        <Text style={styles.value}>{order?.customer}</Text>

        <Text style={styles.label}>Amount Paid:</Text>
        <Text style={styles.value}>₦{order?.total_price}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { color: order?.status === "PAID" ? "green" : "red" }]}>
          {order?.status}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  productRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  value: {
    color: "#333",
    fontSize: 16,
    marginBottom: 8,
  },
  reloadText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});
