import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Dashboard() {
  const [quantity, setQuantity] = useState(0);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const URL = process.env.EXPO_PUBLIC_BASE_URL;

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('access');
      const res = await fetch(`${URL}goods/me/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setQuantity(Array.isArray(data) ? data.length : 0);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await fetch(`${URL}goods/producer/order/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      // Ensure result is array
      const list = Array.isArray(result) ? result : result?.results || [];

      const paidOrders = list.filter((item) => item.status === "PAID");

      setOrders(paidOrders);

      const total = paidOrders.reduce((sum, order) => {
        return sum + Number(order.total_price || 0);
      }, 0);

      setTotal(total);

    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const lastFiveOrders = orders.slice(-5).reverse();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      {/* TOP CARDS */}
      <View style={styles.statsContainer}>
        
        <View style={[styles.statCard, { borderLeftColor: "#3B82F6" }]}>
          <Text style={styles.statNumber}>{quantity}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: "#22C55E" }]}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Paid Orders</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: "#FACC15" }]}>
          <Text style={styles.statNumber}>₦{total.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>

      </View>

      <Text style={styles.subHeader}>Recent Orders</Text>

      {/* HEADINGS */}
      <View style={styles.orderHeaderRow}>
        <Text style={[styles.orderHeaderText, { flex: 1 }]}>Order ID</Text>
        <Text style={[styles.orderHeaderText, { flex: 1 }]}>Date</Text>
        <Text style={[styles.orderHeaderText, { flex: 1 }]}>Amount</Text>
        <Text style={[styles.orderHeaderText, { flex: 1 }]}>Status</Text>
      </View>

      {/* ORDER LIST */}
      {lastFiveOrders.map((order) => (
        <View style={styles.orderRow} key={order.id}>
          <Text style={[styles.orderValue, { flex: 1 }]}>#{order.id}</Text>
          <Text style={[styles.orderValue, { flex: 1 }]}>
            {order.created_at?.slice(0, 10) || "--"}
          </Text>
          <Text style={[styles.orderValue, { flex: 1 }]}>
            ₦{Number(order.total_price).toLocaleString()}
          </Text>
          <Text style={[styles.orderStatus]}>
            {order.status}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0D0F11',
  },

  header: {
    fontSize: 29,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 25,
  },

  // ===== CARDS =====
  statsContainer: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 25,
  },

  statCard: {
    backgroundColor: '#1A1D21',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 3,
  },

  statNumber: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '800',
  },

  statLabel: {
    color: '#B0B3B8',
    fontSize: 13,
    marginTop: 4,
  },

  // ===== RECENT ORDERS =====
  subHeader: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  orderHeaderRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },

  orderHeaderText: {
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 13,
  },

  orderRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  orderValue: {
    color: "#E5E7EB",
    fontSize: 14,
  },

  orderStatus: {
    flex: 1,
    color: "#22C55E",
    fontWeight: "700",
  },
});
