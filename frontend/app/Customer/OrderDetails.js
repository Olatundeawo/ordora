import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
  Linking,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);
  const colorScheme = useColorScheme(); // for dark mode
  const URL = process.env.EXPO_PUBLIC_BASE_URL
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)

  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = await AsyncStorage.getItem("access");

        const res = await fetch(`${URL}goods/customer/order/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setOrder(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!order) return; // wait until order loads
  
    const fetchProduct = async () => {
      try {
        const token = await AsyncStorage.getItem("access");
  
        const response = await fetch(`${URL}goods/${order.product}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const result = await response.json();
        setProduct(result);
        setQty(result.quality ?? 1)
  
      } catch (e) {
        console.log("Product fetch error:", e);
      }
    };
  
    fetchProduct();
  }, [order]);


  // Animate fade-in & scale
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: isDarkMode ? "#121212" : "#F8F9FB" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: isDarkMode ? "#fff" : "#555" }}>Loading Order...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#888" }}>Order not found.</Text>
      </View>
    );
  }

  // Track order status
  const statusSteps = ["PENDING", "PAID", "COMPLETED"];
  const currentStep = statusSteps.indexOf(order.status) + 1;
  console.log('order quality: ', qty)

  

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#F8F9FB" },
      ]}
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        {/* Header */}
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#111" }]}>
          Order #{order.id}
        </Text>
        <Text style={[styles.date, { color: isDarkMode ? "#aaa" : "#888" }]}>
          {new Date(order.created_at).toDateString()}
        </Text>

        {/* Product Card */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? "#1E1E1E" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#333" }]}>
            Product
          </Text>
          {order.product_image && (
            <Image source={{ uri: order.product_image }} style={styles.productImage} />
          )}
          <View style={styles.row}>
            <Text style={[styles.label, { color: isDarkMode ? "#aaa" : "#777" }]}>Name:</Text>
            <Text style={[styles.value, { color: isDarkMode ? "#fff" : "#111" }]}>{product?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: isDarkMode ? "#aaa" : "#777" }]}>Price:</Text>
            <Text style={[styles.value, { color: "#007AFF" }]}>₦{order.total_price}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: isDarkMode ? "#aaa" : "#777" }]}>Quantity:</Text>
            <View style={styles. qtyContainer}>
            <TouchableOpacity
                style={styles.qtyBtnBox}
                onPress={() => setQty(Math.max(1, qty - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>

              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyDisplayText}>{qty}</Text>
              </View>

              <TouchableOpacity
                style={styles.qtyBtnBox}
                onPress={() => setQty(qty + 1)}
              >
    <Text style={styles.qtyBtnText}>+</Text>
  </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Order Status Tracker */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? "#1E1E1E" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#333" }]}>Order Status</Text>
          <View style={styles.progressBar}>
            {statusSteps.map((step, index) => (
              <View key={index} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressCircle,
                    {
                      backgroundColor:
                        index < currentStep ? "#007AFF" : isDarkMode ? "#555" : "#E0E0E0",
                    },
                  ]}
                />
                <Text style={{ color: isDarkMode ? "#fff" : "#111", fontSize: 12 }}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact / Support */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? "#1E1E1E" : "#fff" }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#333" }]}>
            Support / Contact Producer
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${order.producer_phone || "0800000000"}`)}
          >
            <Text style={styles.contactButtonText}>Call Producer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: "#34C759" }]}
            onPress={() => Linking.openURL(`mailto:${order.producer_email || "support@example.com"}`)}
          >
            <Text style={styles.contactButtonText}>Email Producer</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Button */}
        {order.status === "PENDING" && (
          <TouchableOpacity style={styles.paymentButton} onPress={() => alert("Redirect to payment flow")}>
            <Text style={styles.paymentButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
  },

  date: {
    color: "#888",
    marginBottom: 20,
  },

  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontSize: 15,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
  },

  productImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },

  progressBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressStep: {
    alignItems: "center",
    flex: 1,
  },

  progressCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 6,
  },

  contactButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    marginBottom: 10,
    alignItems: "center",
  },

  contactButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  paymentButton: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#FF9500",
    alignItems: "center",
    marginTop: 10,
  },

  paymentButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  
  qtyBtnBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  qtyBtnText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
  },
  
  qtyDisplay: {
    width: 60,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  
  qtyDisplayText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  
});
