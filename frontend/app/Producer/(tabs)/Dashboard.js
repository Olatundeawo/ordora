import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function Dashboard() {
  // Dummy data for dashboard
  const [stats, setStats] = useState({
    totalProducts: 12,
    totalOrders: 34,
    recentOrders: [
      { id: 101, product: 'Product A', quantity: 2, status: 'Pending' },
      { id: 102, product: 'Product B', quantity: 1, status: 'Completed' },
      { id: 103, product: 'Product C', quantity: 5, status: 'Pending' },
      { id: 104, product: 'Product D', quantity: 3, status: 'Completed' },
      { id: 105, product: 'Product E', quantity: 1, status: 'Cancelled' },
    ],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Recent Orders</Text>
      <FlatList
        data={stats.recentOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderText}>
              #{item.id} - {item.product} ({item.quantity})
            </Text>
            <Text style={[styles.orderStatus, getStatusStyle(item.status)]}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Function to color status
const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending':
      return { color: '#FF9500' }; // orange
    case 'Completed':
      return { color: '#34C759' }; // green
    case 'Cancelled':
      return { color: '#FF3B30' }; // red
    default:
      return { color: '#fff' };
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1F2226' },
  header: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#2C2F34', padding: 20, borderRadius: 12, width: '48%', alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 14, fontWeight: '500', color: '#A0A3A8', marginTop: 5 },
  subHeader: { fontSize: 20, fontWeight: '600', color: '#fff', marginBottom: 10 },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2C2F34',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  orderText: { color: '#fff', fontSize: 16 },
  orderStatus: { fontSize: 16, fontWeight: '600' },
});
