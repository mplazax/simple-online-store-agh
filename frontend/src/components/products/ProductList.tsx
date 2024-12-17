// src/components/products/ProductList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import "./ProductList.css";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Wystąpił błąd podczas pobierania produktów."
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Ładowanie produktów...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="product-list-container">
      <h2>Nasze Produkty</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <Link to={`/products/${product.id}`}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <strong>Cena:</strong> ${product.price.toFixed(2)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
