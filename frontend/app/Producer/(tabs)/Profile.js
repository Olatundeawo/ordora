import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/auth';

export default function Profile() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('access');
      await AsyncStorage.removeItem('refresh');
      setUser(null);
      router.replace('/Auth/login');
    } catch (e) {
      console.error(e);
    }
  };

  console.log("usre:", user)

  const formatDateTime = (iso) => {
    const date = new Date(iso);
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );
  };

  return (
    <ScrollView style={styles.container}>
     
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      
      {user && (
        <View style={styles.card}>
          <Image
            source={{ uri: user.profileImage || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Joined</Text>
              <Text style={styles.value}>{formatDateTime(user.date_joined)}</Text>
            </View>

            
          </View>

          
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={20} color="#007AFF" />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      
      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1E23', 
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1B1E23',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  card: {
    backgroundColor: '#2A2E35',
    margin: 20,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  role: {
    fontSize: 14,
    color: '#A0A3A8',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#3A3F46',
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#A0A3A8',
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#1F2226',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  editText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
