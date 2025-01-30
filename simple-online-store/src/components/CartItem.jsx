import React from "react";
import { ListItem, ListItemText, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { removeFromCart } = useCart();

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <ListItem
      sx={{
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Product Image */}
      <img
        src={item.Product.image_url}
        alt={item.Product.name}
        style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 4 }}
      />

      {/* Product Info */}
      <ListItemText
        primary={item.Product.name}
        secondary={
          <>
            <Typography component="span">Qty: {item.quantity}</Typography>
            <Typography component="span" sx={{ ml: 2 }}>
              ${item.Product.price * item.quantity}
            </Typography>
          </>
        }
      />

      {/* Remove Button */}
      <IconButton edge="end" color="error" onClick={handleRemove}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}

export default CartItem;
