import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  import.meta.env.VITE_API_URL?.trim() ||
  "http://localhost:5000"
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});