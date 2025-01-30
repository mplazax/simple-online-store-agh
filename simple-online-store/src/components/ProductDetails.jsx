import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useCart } from "../context/CartContext";

function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, notification, setNotification } = useCart(); // ✅ Get notification from context

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product.id, parseInt(quantity, 10));
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 4, mt: 4 }}>
      {/* Product Image */}
      <Box>
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: "300px",
            height: "300px",
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#ffffff",
          }}
        />
      </Box>

      {/* Product Details */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4">{product.name}</Typography>
        <Typography sx={{ mt: 2 }}>{product.description}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Price: ${product.price}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Available Stock: {product.stock || 0}
        </Typography>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ mt: 2, width: "100px" }}
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </Box>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setNotification(null)}
        >
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductDetails;
