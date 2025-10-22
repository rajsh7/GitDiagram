import axios from "axios";

// 🌐 Backend API base URL (Render)
const API_BASE = "https://gitdiagram-pk6l.onrender.com/api";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🪄 Automatically attach JWT token if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
