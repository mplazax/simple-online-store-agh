// src/pages/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound: React.FC = () => {
  return (
    <div className="notfound-container">
      <h1>404 - Strona Nie Znaleziona</h1>
      <p>Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
      <Link to="/" className="home-link">
        Powrót na Stronę Główną
      </Link>
    </div>
  );
};

export default NotFound;
