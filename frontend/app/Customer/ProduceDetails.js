import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/Cart";
import { apiFetch } from "../context/utils/api";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const URL = process.env.EXPO_PUBLIC_BASE_URL;

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const toastAnim = useRef(new Animated.Value(100)).current; // start hidden

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await AsyncStorage.getItem("access");
        const res = await apiFetch(`goods/${id}/`, {
          method: "GET",
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

  const showToast = (message) => {
    setToastMessage(message);
    Animated.timing(toastAnim, {
      toValue: 0, // slide up
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: 100, // slide down
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 2000); // show for 2 seconds
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    showToast(`${product.name} x${qty} added to cart`);
  };

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>₦{product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))}>
            <Text style={styles.qtyBtn}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyText}>{qty}</Text>

          <TouchableOpacity onPress={() => setQty(qty + 1)}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.orderButton} onPress={handleAddToCart}>
          <Text style={styles.orderText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast */}
      <Animated.View
        style={[
          styles.toast,
          { transform: [{ translateY: toastAnim }] },
        ]}
      >
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F7F8FA",
    flex: 1,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: "#EEE",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1C1C1E",
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#454545",
    marginBottom: 20,
    lineHeight: 20,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#E9ECEF",
    padding: 12,
    borderRadius: 12,
    width: 140,
    justifyContent: "space-between",
  },
  qtyBtn: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 10,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  orderButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  orderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  toast: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  toastText: {
    color: "#fff",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
