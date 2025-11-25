import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";

export default function AddProduct() {
  const URL = process.env.EXPO_PUBLIC_BASE_URL
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quality: "",
  });

//   const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // === Pick Image ===
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0]);
//     }
//   };

  // === Create Product ===
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

    //   if (image) {
    //     formData.append("image", {
    //       uri: image.uri,
    //       type: "image/jpeg",
    //       name: "product.jpg",
    //     });
    //   }

      const response = await fetch(
        `${URL}goods/create/`,
        {
          method: "POST",
          headers: {
            //   "Content-Type": "application/json",
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${access}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        Alert.alert(
          "Creation Failed",
          `Status Code: ${response.status}`
        );
        setLoading(false);
        return;
      }

      Alert.alert("Success", "Product created successfully!");
      setForm({ name: "", description: "", price: "", quality: "" });
    //   setImage(null);

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
        value={form.quantity}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("quality", text)}
      />

      {/* Image Picker */}
      {/* <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageBtnText}>
          {image ? "Change Image" : "Pick Image"}
        </Text>
      </TouchableOpacity> */}

      {/* {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: "100%", height: 200, marginBottom: 20 }}
        />
      )} */}

      {/* Submit Button */}
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
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
  },
//   imageBtn: {
//     backgroundColor: "#444",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   imageBtnText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "600",
//   },
  submitBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
