import { Slot } from "expo-router";
import AuthProvider from "./context/auth";
import  CartProvider  from "./context/Cart";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Slot />
      </CartProvider>
    </AuthProvider>
  );
}
