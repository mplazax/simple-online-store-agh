import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);

  // Fetch Cart Items
  const fetchCartItems = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (error) {
      console.error("❌ Error fetching cart items:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Add to Cart
  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      console.error("❌ User is not authenticated.");
      return;
    }
    try {
      await api.post(
        "/cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCartItems();
      setNotification("✅ Item added to cart!");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      setNotification("❌ Failed to add item to cart.");
    }
  };

  // Remove from Cart
  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      setNotification("✅ Item removed from cart.");
    } catch (error) {
      console.error("❌ Error removing cart item:", error);
      setNotification("❌ Failed to remove item from cart.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItems,
        addToCart,
        removeFromCart,
        notification,
        setNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
