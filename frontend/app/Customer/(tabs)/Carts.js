import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../../context/Cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
const Success = require("../../../assets/Success.json")

export default function CartScreen() {
  const URL = process.env.EXPO_PUBLIC_BASE_URL
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access");

      const items = cart.map((item) => ({
        product: item.id,
        quantity: item.qty,
      }));

      const response = await fetch(
        `${URL}goods/create/order/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items }),
        }
      );

      if (!response.ok) {
        setLoading(false);
        alert("Order failed!");
        return;
      }

      // Smooth fintech success effect
      setLoading(false);
      setSuccessVisible(true);

      // Auto close animation + clear cart
      setTimeout(() => {
        setSuccessVisible(false);
        clearCart();
      }, 2200);
    } catch (error) {
      console.log("Checkout error:", error);
      setLoading(false);
      alert("Network error");
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
        <Text style={styles.emptySubText}>Add some products to see them here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            )}

            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                ₦{item.price} x {item.qty}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFromCart(item.id)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Checkout Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₦{total}</Text>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Spinner Modal */}
      <Modal transparent visible={loading}>
        <View style={styles.modalContainer}>
          <View style={styles.spinnerCard}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10, fontWeight: "600" }}>Processing...</Text>
          </View>
        </View>
      </Modal>

      {/* Success Animation Modal */}
      <Modal transparent visible={successVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <LottieView
            source={Success}
            autoPlay
            loop={false}
            style={{ width: 180, height: 180 }}
          />
          <Text style={styles.successText}>Order Successful!</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    padding: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
  },

  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  removeText: {
    color: "#fff",
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  checkoutBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  spinnerCard: {
    width: 140,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  successText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
