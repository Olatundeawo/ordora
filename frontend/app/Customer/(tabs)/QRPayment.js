import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { apiFetch } from "../../context/utils/api";

export default function QRPaymentList() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [refreshing, setRefreshing] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = await AsyncStorage.getItem("access");
      const res = await apiFetch(`goods/customers/payments/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log("This is the result",result)
      
      setPayments(
        result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not fetch QR payments.");
    }
  };

  
  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments().finally(() => setRefreshing(false));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);

    Animated.timing(slideAnim, {
      toValue: tab === "pending" ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const filteredPayments = payments.filter((p) => p.status === activeTab);

  const handlePay = (qrCode) => {
    if (qrCode) {
      Linking.openURL(qrCode).catch(() =>
        Alert.alert("Error", "Cannot open QR code link.")
      );
    } else {
      Alert.alert("No QR", "QR code not available for this payment.");
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
          {item.status.toUpperCase()}
        </Text>

        {item.paid_at && (
          <>
            <Text style={styles.label}>Time paid:</Text>
            <Text style={styles.value}>{formatDateTime(item.paid_at)}</Text>
          </>
        )}

        <Text style={styles.label}>Created:</Text>
        <Text style={styles.value}>{formatDateTime(item.created_at)}</Text>

        {item.status === "pending" && item.qr_code && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => handlePay(item.qr_code)}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const slideBarLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  return (
    <View style={styles.screen}>
      {/* Top Sliding Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => switchTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => switchTab("paid")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "paid" && styles.activeTabText,
            ]}
          >
            Paid
          </Text>
        </TouchableOpacity>

        {/* Animated Slide Bar */}
        <Animated.View style={[styles.slideIndicator, { left: slideBarLeft }]} />
      </View>

      {/* Payment List */}
      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPayment}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {activeTab} payments</Text>
        }
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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

  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 15,
    borderRadius: 12,
    paddingVertical: 10,
    position: "relative",
    marginBottom: 10,
  },

  tabButton: {
    width: "50%",
    alignItems: "center",
    zIndex: 2,
  },

  tabText: {
    fontSize: 16,
    color: "#777",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#222",
  },

  slideIndicator: {
    position: "absolute",
    bottom: 0,
    width: "50%",
    height: 3,
    backgroundColor: "#4E73DF",
    borderRadius: 2,
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

  payButton: {
    marginTop: 12,
    backgroundColor: "#4E73DF",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  payButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 25,
    fontSize: 15,
  },
});
