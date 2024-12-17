// src/pages/Home.tsx
import React from "react";
import ProductList from "../components/products/ProductList";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Witamy w naszym sklepie!</h1>
      <ProductList />
    </div>
  );
};

export default Home;
