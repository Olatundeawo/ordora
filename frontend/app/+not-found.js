import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtext}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("Auth/login")}>
        <Text style={styles.buttonText}>Go Home</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  code: {
    fontSize: 90,
    fontWeight: "800",
    color: "#111",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
    color: "#333",
  },
  subtext: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#0D6EFD",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
