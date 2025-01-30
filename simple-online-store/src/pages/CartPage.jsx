import React, { useState } from "react";
import { Container, Typography, List, Button, Alert } from "@mui/material";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import CartItem from "../components/CartItem";
import { useAuth } from "../context/AuthContext";

function CartPage() {
  const { cartItems, fetchCartItems } = useCart();
  const { token } = useAuth();
  const [orderStatus, setOrderStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const totalValue = cartItems.reduce((sum, item) => {
    return sum + (item.Product?.price || 0) * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      console.log("🚀 Sending order request...");
      const res = await api.post(
        "/orders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderStatus(res.data.message);
      fetchCartItems(); // Refresh cart after placing order
    } catch (error) {
      console.error("❌ Error placing order:", error);
      setOrderStatus("❌ Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Your Cart</Typography>

      {cartItems.length === 0 ? (
        <Typography sx={{ mt: 2 }}>Your cart is empty.</Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ${totalValue.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>

          {orderStatus && (
            <Alert
              sx={{ mt: 2 }}
              severity={orderStatus.includes("❌") ? "error" : "success"}
            >
              {orderStatus}
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default CartPage;
