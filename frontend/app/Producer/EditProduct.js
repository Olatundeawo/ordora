import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProduct() {
  const URL = process.env.EXPO_PUBLIC_BASE_URL
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await AsyncStorage.getItem('access');
        const res = await fetch(`${URL}goods/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setForm({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          quality: data.quality.toString(),
        });
      } catch (e) {
        console.error(e);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleChange = (field, value) =>
    setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('access');
      const res = await fetch(
        `${URL}goods/${id}/update/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        alert('Product updated successfully!');
        router.back();
      } else {
        alert('Failed to update product');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Edit Product</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          placeholderTextColor="#8A8F99"
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Product description"
          placeholderTextColor="#8A8F99"
          value={form.description}
          multiline
          onChangeText={(text) => handleChange('description', text)}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="#8A8F99"
          keyboardType="numeric"
          value={form.price}
          onChangeText={(text) => handleChange('price', text)}
        />

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          placeholderTextColor="#8A8F99"
          keyboardType="numeric"
          value={form.quality}
          onChangeText={(text) => handleChange('quality', text)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // fintech clean background
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B1D21',
    marginVertical: 10,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4F57',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#ECEFF3',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#1B1D21',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: '#007AFF',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
