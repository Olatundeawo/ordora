import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiFetch } from "../../context/utils/api";

export default function GoodsList() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGoods = async () => {
    try {
      const res = await apiFetch(`goods/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) throw new Error("Network error");
  
      const json = await res.json();
  
   
      const sortedData = json.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
  
      setData(sortedData);
    } catch (error) {
      console.log("Error:", error);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchGoods();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGoods();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          numColumns={2}  
          columnWrapperStyle={{ justifyContent: "space-between" }}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push(`/Customer/ProduceDetails?id=${item.id}`)
              }
            >
              {/* PRODUCT IMAGE */}
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.name}
                </Text>

                <Text style={styles.price} numberOfLines={1}>
                  ₦{item.price}
                </Text>

                <Text style={styles.quantity}>Qty: {item.quality}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Goods available yet.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 14,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    backgroundColor: "#eee",
  },

  placeholder: {
    height: 140,
    backgroundColor: "#EAECEF",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#777",
    fontSize: 14,
  },

  cardContent: {
    padding: 10,
  },

  title: {
    fontWeight: "600",
    fontSize: 15,
    color: "#333",
  },
  price: {
    fontSize: 16,
    color: "#0A84FF",
    fontWeight: "700",
    marginTop: 4,
  },
  quantity: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});
