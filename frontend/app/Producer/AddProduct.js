import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { apiFetch } from "../context/utils/api";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quality: "",
  });

  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]); 
    }
  };

  
  const createProduct = async () => {
    if (!form.name || !form.description || !form.price || !form.quality) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const access = await AsyncStorage.getItem("access");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("quality", form.quality);

      
      if (image) {
        formData.append("image", {
          uri: image.uri,
          name: `goods_${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }

      const response = await apiFetch(`goods/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${access}`,
        },
        body: formData,
      });

      if (!response.ok) {
        Alert.alert("Creation Failed", `Status Code: ${response.status}`);
        setLoading(false);
        return;
      }

      Alert.alert("Success", "Product created successfully!");
      setForm({ name: "", description: "", price: "", quality: "" });
      setImage(null);

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not create product.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={form.price}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("price", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={form.quality}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("quality", text)}
      />

      
      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageBtnText}>Pick Product Image</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 150, height: 150, marginBottom: 10, borderRadius: 10 }}
        />
      )}

     
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={createProduct}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? "Submitting..." : "Create Product"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flex: 1 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 16 },
  submitBtn: { backgroundColor: "#007AFF", padding: 16, borderRadius: 10 },
  submitText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
  imageBtn: { backgroundColor: "#34C759", padding: 12, borderRadius: 10, marginBottom: 10 },
  imageBtnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
