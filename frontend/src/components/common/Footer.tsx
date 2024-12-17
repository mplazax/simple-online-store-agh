// src/components/common/Footer.tsx
import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Shop. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
