import React, { createContext, useState, useEffect, useContext } from "react";
import {
  loginRequest,
  registerRequest,
  getUserProfile,
} from "../services/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      loadUser();
    }
    // eslint-disable-next-line
  }, [token]);

  const isAuthenticated = !!token;

  const loadUser = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user profile:", error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginRequest(email, password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Login Error:", error);
      throw error; // Let the calling component handle the error
    }
  };

  const registerUser = async (email, password) => {
    try {
      const data = await registerRequest(email, password);
      // Optionally, log the user in after registration
      // await login(email, password);
      return data;
    } catch (error) {
      console.error("Registration Error:", error);
      throw error; // Let the calling component handle the error
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
