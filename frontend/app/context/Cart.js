import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export default function CartProvider ({ children })  {
  const [cart, setCart] = useState([]);

  // Add a product to cart
  const addToCart = (product, qty) => {
    if (!product.id) {
      console.warn("Product is missing id:", product);
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(
        cart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty }]);
    }
  };
  
  // Remove a product from cart
  const removeFromCart = productId => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = productId => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
