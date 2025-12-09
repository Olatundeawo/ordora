import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { apiFetch } from "../../context/utils/api";

export default function Products() {
  const URL = process.env.EXPO_PUBLIC_BASE_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

 
  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('access');
      const res = await apiFetch(`goods/me/`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Unable to fetch products.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  
  const deleteProduct = async (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access');
              const res = await apiFetch(`goods/${id}/delete/`, {
                method: 'DELETE',
                headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!res.ok) throw new Error('Failed to delete product');

              setProducts(products.filter((item) => item.id !== id));
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Could not delete product.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/Producer/ProductDetails?id=${item.id}`)}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/60' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.quantity}>Qty: {item.quality}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/Producer/EditProduct?id=${item.id}`)}
        >
          <Feather name="edit-2" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProduct(item.id)}>
          <Feather name="trash-2" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Products</Text>

      {loading ? (
        <Text style={{ color: '#000', textAlign: 'center', marginTop: 20 }}>
          Loading...
        </Text>
      ) : products.length === 0 ? (
        <Text style={{ color: '#A0A3A8', textAlign: 'center', marginTop: 20 }}>
          No products added yet.
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/Producer/AddProduct')}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1D1F',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 14,
    marginRight: 15,
    backgroundColor: '#F0F0F0',
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#1A1D1F',
    fontSize: 17,
    fontWeight: '600',
  },
  price: {
    color: '#4D5561',
    marginTop: 6,
    fontSize: 15,
    fontWeight: '500',
  },
  quantity: {
    color: '#9AA0A6',
    marginTop: 3,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#E8F0FF',
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: '#FFE8E8',
    padding: 8,
    borderRadius: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
