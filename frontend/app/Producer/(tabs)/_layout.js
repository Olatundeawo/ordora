import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";



export default function TabLayout() {
    return (
        <Tabs
        screenOptions={({ route }) => ({
          // Header styling
          headerStyle: {
            backgroundColor: '#ffffff',
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
  
          // Tab bar styling
          tabBarStyle: {
            backgroundColor: '#1F2226',
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
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#A0A3A8',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 4,
          },
  
          // Tab icons
          tabBarIcon: ({ color, size }) => {
            let iconName;
  
            if (route.name === "Dashboard") iconName = "grid-outline";
            else if (route.name === "Orders") iconName = "list";
            else if (route.name === "Products") iconName = "add-circle";
            else if (route.name === "Profile") iconName = "person";
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
            <Tabs.Screen name="Dashboard" options={{ title: "Dashboard", 
                tabBarIcon: ({color, focused }) => (
                    <Ionicons name={focused ? "list-sharp" : "list-outline"} color={color} size={24} />
                )}} />
            <Tabs.Screen name="Orders" options={{ title: "Orders"}} />
            <Tabs.Screen name="Products" options={{ title: "Products"}} />
            <Tabs.Screen name="Profile" options={{ title: "Profile"}} />
        </Tabs>
    )
}