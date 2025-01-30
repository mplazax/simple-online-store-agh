// frontend/src/services/auth.js

import api from "./api";

/**
 * Login request
 */
export async function loginRequest(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { token, user }
}

/**
 * Register request
 */
export async function registerRequest(email, password) {
  const res = await api.post("/auth/register", { email, password });
  return res.data; // { id, email, role }
}

/**
 * Get authenticated user's profile
 */
export async function getUserProfile() {
  const res = await api.get("/auth/me");
  return res.data; // { id, email, role }
}
