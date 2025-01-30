import React, { useEffect, useState } from "react";
import { Container, Typography, List, ListItem } from "@mui/material";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function OrderHistoryPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <Typography variant="h6">Order #{order.id}</Typography>
            <Typography>Status: {order.status}</Typography>
            <Typography>Total: ${order.total.toFixed(2)}</Typography>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Items:
            </Typography>
            <List>
              {order.OrderItems.map((item) => (
                <ListItem key={item.id}>
                  {item.Product.name} - {item.quantity}x @ $
                  {item.price.toFixed(2)}
                </ListItem>
              ))}
            </List>
          </div>
        ))
      )}
    </Container>
  );
}

export default OrderHistoryPage;
