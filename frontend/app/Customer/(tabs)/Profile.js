import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
export default function Profile() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('access');
      await AsyncStorage.removeItem('refresh');
      setUser(null); // Clear user from context
      router.replace('/Auth/login'); // Navigate to login
    } catch (e) {
      Alert.alert('Error', 'Failed to log out. Try again.');
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2226', // dark professional background
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  userInfo: {
    backgroundColor: '#2C2F34', // slightly lighter container
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0A3A8',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FF3B30', // red for logout
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
