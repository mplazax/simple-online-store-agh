// src/components/auth/Login.tsx
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        credentials
      );
      // Zapisz tokeny lub inne dane do lokalnego magazynu
      console.log("Login successful:", response.data);
      // Możesz przekierować użytkownika lub zaktualizować stan aplikacji
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Wystąpił błąd podczas logowania."
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Logowanie</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Hasło:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
};

export default Login;
