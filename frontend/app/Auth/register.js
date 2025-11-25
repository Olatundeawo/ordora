import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/auth";

export default function Register() {
  const URL = process.env.EXPO_PUBLIC_BASE_URL
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.role || !form.name) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        `${URL}auth/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            password: form.password,
            role: form.role,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Registration Failed", errorData.message || "Error");
        return;
      }

      const result = await response.json();
      console.log('the result:', result)

      // Save tokens
      await AsyncStorage.setItem("access", JSON.stringify(result.access));
      await AsyncStorage.setItem("refresh", JSON.stringify(result.refresh));

      const userData = result.user; // Must include { email, role }
      setUser({ ...userData, token: result.access });

      Alert.alert("Success", "Account created successfully!");

      // Role-based redirect
      if (userData.role === "producer") {
        router.replace("/Producer/(tabs)/Dashboard");
      } else {
        router.replace("/Customer/(tabs)/Browse");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Unable to connect to the server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account ✨</Text>
      <Text style={styles.subtitle}>Register to get started</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fullname</Text>
        <TextInput
        placeholder="Enter your full name"
        placeholderTextColor="#999"
        keyboardType="normal"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>User Role</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.role}
            onValueChange={(value) => handleChange("role", value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a role" value="" />
            <Picker.Item label="Business" value="producer" />
            <Picker.Item label="Personal" value="customer" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text style={styles.link}>
          <Link href="Auth/login">Login</Link>
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
    color: "#666",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fafafa",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  picker: {
    color: "#000",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    marginTop: 22,
    color: "#555",
  },
  link: {
    color: "#007AFF",
    fontWeight: "700",
  },
});
