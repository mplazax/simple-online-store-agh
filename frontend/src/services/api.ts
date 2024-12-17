// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Jeśli potrzebujesz obsługi ciasteczek
});

// Opcjonalnie: Dodaj interceptory do logowania lub obsługi błędów
api.interceptors.request.use(
  (config) => {
    // Możesz dodać token autoryzacyjny do nagłówków
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Obsługa błędów, np. przekierowanie do logowania przy błędzie 401
    if (error.response && error.response.status === 401) {
      // Możesz dodać logikę przekierowania lub odświeżania tokena
    }
    return Promise.reject(error);
  }
);

export default api;
