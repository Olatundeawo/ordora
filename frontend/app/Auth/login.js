import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../context/auth";

export default function Login() {
  const URL = process.env.EXPO_PUBLIC_BASE_URL
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    
    try {

      const response = await fetch(
       `${URL}auth/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      if (!response.ok) {
        Alert.alert("Login Failed", `Status Code: ${response.status}`);
        return;
      }

      const result = await response.json();

      // Save tokens
      await AsyncStorage.setItem("access", result.access);
      await AsyncStorage.setItem("refresh", result.refresh);

      // Extract role
      const userData = result.user; 
      console.log("USER ROLE:", userData.role);

      // Save user globally
      setUser({
        ...userData,
        token: result.access,
      });
      
      Alert.alert("Success", "Login successful!");

      
      if (userData.role === "producer") {
        router.replace("/Producer/(tabs)/Dashboard");
      } else {
        router.replace("/Customer/(tabs)/Browse");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Network Error", "Unable to connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Text style={styles.link}>
          <Link href="Auth/register">Sign Up</Link>
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
