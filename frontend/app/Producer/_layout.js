import { Stack, Redirect } from "expo-router";
import { useAuth } from "../context/auth";


export default function ProducerLayout() {
    const { user } = useAuth();

    if (!user) return <Redirect href="/(auth)/login" />;
  
    if (user.role !== "producer") {
      return <Redirect href="/Customer/(tabs)/Browse" />;
    }
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="AddProduct" options={{ title: "AddProduct"}} />
        <Stack.Screen name="OrdersDetails" options={{ title: "OrderDetails"}} />
        <Stack.Screen name="EditProduct" options={{ title: 'Edit Product'}} />
        
    </Stack>
  );
}
