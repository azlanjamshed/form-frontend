import api from "./api.js";

// Admin login
export async function loginAdmin(credentials) {
  const response = await api.post("/auth/login", credentials);

  return response.data;
}

// Get currently authenticated admin
export async function getCurrentAdmin() {
  const response = await api.get("/auth/me");

  return response.data;
}

// Admin logout
export async function logoutAdmin() {
  const response = await api.post("/auth/logout");

  return response.data;
}
