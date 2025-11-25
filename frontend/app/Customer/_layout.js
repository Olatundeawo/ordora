import { Stack, Redirect } from "expo-router";
import { useAuth } from "../context/auth";



export default function CustomerLayout() {
    const { user } = useAuth();

    if (!user) return <Redirect href="/(auth)/login" />;

    if (user.role !== "customer") {
        return <Redirect href="/Producer/(tabs)/Dashboard" />;
    }
  return (
    <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="ProduceDetails" options={{ title: "Produce Details"}} />
        <Stack.Screen name="UseOrder" options={{ title: " Order Summary"}} />
        <Stack.Screen name="OrderDetails" options={{ title: "Oder Details"}} />
    </Stack>
  );
}
