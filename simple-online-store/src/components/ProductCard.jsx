import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {product.description?.slice(0, 60)}...
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/products/${product.id}`} size="small">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
