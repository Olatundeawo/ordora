import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Tablayout() {
  return (
    <Tabs
    screenOptions={({ route }) => ({
      // Header style
      headerStyle: {
        backgroundColor: '#25292e', // Dark professional header
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
        height: 70,
        borderBottomWidth: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
      },
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,

      // Tab bar style
      tabBarStyle: {
        backgroundColor: '#e5e3d9', // light neutral background
        borderTopColor: 'transparent',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 5,
        height: 70,
        paddingBottom: 10,
        paddingTop: 5,
      },
      tabBarActiveTintColor: '#089000',   // Active tab color
      tabBarInactiveTintColor: '#8E8E93', // Inactive tab color
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
      },

      // Tab icons
      tabBarIcon: ({ color, size }) => {
        if (route.name === "Browse") return <Ionicons name="search-outline" size={size} color={color} />;
        if (route.name === "Orders") return <Ionicons name="list-outline" size={size} color={color} />;
        if (route.name === "QRPayment") return <Ionicons name="qr-code-outline" size={size} color={color} />;
        if (route.name === "Profile") return <Ionicons name="person-outline" size={size} color={color} />;
        if (route.name === "Carts") return <Ionicons name="cart-outline" size={size} color={color} />
      },
    })}
  >
        <Tabs.Screen name="Browse" options={{ title: "Browse"}} />
        <Tabs.Screen name="Orders" options={{ title: "Orders"}} />
        <Tabs.Screen name="QRPayment" options={{ title: "QRPayment"}} />
        <Tabs.Screen name="Carts" options={{ title: "Carts"}} />
        <Tabs.Screen name="Profile" options={{ title: "Profile"}} />
    </Tabs>
  )
}
