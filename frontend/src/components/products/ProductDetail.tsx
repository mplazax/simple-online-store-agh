// src/components/products/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../../types";
import "./ProductDetail.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Wystąpił błąd podczas pobierania produktu."
        );
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Ładowanie produktu...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>Produkt nie został znaleziony.</p>;

  return (
    <div className="product-detail-container">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>
        <strong>Cena:</strong> ${product.price.toFixed(2)}
      </p>
      <p>
        <strong>Kategoria:</strong> {product.category}
      </p>
      <p>
        <strong>Dostępność:</strong>{" "}
        {product.quantity > 0 ? "Dostępny" : "Niedostępny"}
      </p>
      {/* Dodaj więcej szczegółów lub zdjęć, jeśli są dostępne */}
    </div>
  );
};

export default ProductDetail;
