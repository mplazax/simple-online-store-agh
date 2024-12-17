// src/services/authService.ts
import api from "./api";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/refresh-token", {
    refreshToken: token,
  });
  return response.data;
};
