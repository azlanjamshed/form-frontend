import api from "./api.js";

// Login (admin or collector)
export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

// Get currently authenticated user
export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

// Logout
export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}

// Backward-compatible admin functions
export const loginAdmin = loginUser;
export const getCurrentAdmin = getCurrentUser;
export const logoutAdmin = logoutUser;

