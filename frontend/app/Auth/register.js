import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/auth";

export default function Register() {
  const URL = process.env.EXPO_PUBLIC_BASE_URL;
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false); 

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.role || !form.name) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`${URL}auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          password: form.password,
          role: form.role,
        }),
      });
  
      const result = await response.json();

      console.log("result", result)
      if (!response.ok) {
        Alert.alert(
          "Registration Failed",
          result?.non_field_errors?.[0] ||
          result?.email?.[0] ||
          "Something went wrong"
        );
        setLoading(false);
        return;
      }
  
      Alert.alert("Success", "Account created successfully!");
  
      router.replace("Auth/login");
      
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
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

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#999" }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.link}>
            <Link href="Auth/login">Login</Link>
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
