import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const URL = process.env.EXPO_PUBLIC_BASE_URL;
  
  const [order, setOrder] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const token = await AsyncStorage.getItem("access");
    const response = await fetch(`${URL}goods/customer/order/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    setOrder(result);
    console.log("Order details: ", result)
    setLoading(false);
  };

  const handleQrPayment = async () => {
    setPaying(true);
    const token = await AsyncStorage.getItem("access");

    const response = await fetch(`${URL}goods/payments/create-qr/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      
    });

    const result = await response.json();
    setQr(result);
    setPaying(false);
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>Order #{id}</Text>
      <Text>Status: {order.status}</Text>

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Items:</Text>
      {order.items.map((item, index) => (
        <Text key={index}>
          {item.product} — Qty {item.quality}
        </Text>
      ))}

      {qr ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>Scan QR to Pay</Text>
          <Image
            source={{ uri: qr.qr_image }}
            style={{ width: 200, height: 200, marginVertical: 20 }}
          />
          <Text>Reference: {qr.reference}</Text>
          <Text>Amount: {qr.amount}</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleQrPayment}
          style={{
            backgroundColor: "#007AFF",
            padding: 15,
            borderRadius: 10,
            marginTop: 30,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            {paying ? "Generating QR..." : "Generate QR"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
