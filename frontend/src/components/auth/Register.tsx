// src/components/auth/Register.tsx
import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        userInfo
      );
      console.log("Registration successful:", response.data);
      setSuccess(true);
      setUserInfo({ name: "", email: "", password: "" });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Wystąpił błąd podczas rejestracji."
      );
    }
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      {error && <p className="error-message">{error}</p>}
      {success && (
        <p className="success-message">Rejestracja zakończona sukcesem!</p>
      )}
      <form onSubmit={handleSubmit} className="register-form">
        <label htmlFor="name">Imię:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Hasło:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userInfo.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
};

export default Register;
