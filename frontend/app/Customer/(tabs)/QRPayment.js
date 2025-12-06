import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRPaymentList() {
  const [payments, setPayments] = useState([]);
  const URL = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await fetch(`${URL}goods/customers/payments/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      setPayments(result);
      console.log(result);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not fetch QR payments.");
    }
  };

 

  const renderPayment = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.qrContainer}>
        {item?.qr_code ? (
          <QRCode value={item?.qr_code} size={180} />
        ) : (
          <Text style={styles.noQrText}>No QR Code Generated</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Reference:</Text>
        <Text style={styles.value}>{item.reference}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>₦{item.amount}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, item.status === "paid" && styles.paid]}>
          {item.status}
        </Text>

        <Text style={styles.label}>Created:</Text>
        <Text style={styles.value}>{formatDateTime(item.created_at)}</Text>
        
      </View>
    </View>
  );

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

  return (
    <View style={styles.screen}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPayment}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingVertical: 10,
  },
  noQrText: {
    color: "#999",
    fontSize: 14,
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  label: {
    color: "#777",
    fontSize: 13,
    marginTop: 8,
  },
  value: {
    color: "#222",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 5,
  },
  paid: {
    color: "green",
  },
});
